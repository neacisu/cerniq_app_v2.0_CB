import Fastify, { FastifyInstance } from 'fastify';
import requestMeta from './10-request-meta';

const UUID_V4_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('plugin 10-request-meta', () => {
  let server: FastifyInstance;

  beforeEach(async () => {
    server = Fastify();
    await server.register(requestMeta);
    server.get('/probe', async (request) => ({ requestId: request.requestId }));
    await server.ready();
  });

  afterEach(async () => {
    await server.close();
  });

  it('propagates a non-empty x-request-id and echoes it on the response', async () => {
    const rid = 'edge-trace-9f3a';
    const res = await server.inject({
      method: 'GET',
      url: '/probe',
      headers: { 'x-request-id': rid },
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers['x-request-id']).toBe(rid);
    expect(res.json()).toEqual({ requestId: rid });
  });

  it('generates a UUID when x-request-id is absent', async () => {
    const res = await server.inject({ method: 'GET', url: '/probe' });
    const header = res.headers['x-request-id'] as string;

    expect(res.statusCode).toBe(200);
    expect(header).toBeDefined();
    expect(UUID_V4_RE.test(header)).toBe(true);
    expect(res.json()).toEqual({ requestId: header });
  });

  it('generates a new id when x-request-id is empty or whitespace-only', async () => {
    for (const bad of ['', '   ', '\t']) {
      const res = await server.inject({
        method: 'GET',
        url: '/probe',
        headers: { 'x-request-id': bad },
      });
      const header = res.headers['x-request-id'] as string;

      expect(res.statusCode).toBe(200);
      expect(UUID_V4_RE.test(header)).toBe(true);
    }
  });

  it('uses the first non-empty value when x-request-id is repeated (proxy / HTTP2 coalescing)', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/probe',
      headers: { 'x-request-id': ['upstream-abc', 'downstream-xyz'] },
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers['x-request-id']).toBe('upstream-abc');
    expect(res.json()).toEqual({ requestId: 'upstream-abc' });
  });
});
