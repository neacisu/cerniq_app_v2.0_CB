import Fastify, { FastifyInstance } from 'fastify';
import { app } from './app';

/**
 * Paritate minimă OpenAPI ↔ rute înregistrate: fiecare path public documentat răspunde
 * (fără 404). Codurile specifice (403 tenant, 400 webhook) dovedesc că ruta există.
 */
describe('Contract OpenAPI paths (inject)', () => {
  let server: FastifyInstance;

  beforeEach(async () => {
    server = Fastify();
    await server.register(app);
  });

  it('GET /health → 200', async () => {
    const res = await server.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /ready → 200', async () => {
    const res = await server.inject({ method: 'GET', url: '/ready' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /metrics → 200', async () => {
    const res = await server.inject({ method: 'GET', url: '/metrics' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /v1/me → nu 404 (403 fără tenant)', async () => {
    const res = await server.inject({ method: 'GET', url: '/v1/me' });
    expect(res.statusCode).not.toBe(404);
  });

  it('GET /v1/cognitive/hello → 200', async () => {
    const res = await server.inject({ method: 'GET', url: '/v1/cognitive/hello' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /v1/cognitive/stream → 200 SSE', async () => {
    const res = await server.inject({ method: 'GET', url: '/v1/cognitive/stream' });
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/event-stream/);
  });

  it('GET /v1/llm/health → nu 404 (400 fără tenant)', async () => {
    const res = await server.inject({ method: 'GET', url: '/v1/llm/health' });
    expect(res.statusCode).not.toBe(404);
  });

  it('POST /v1/webhooks/inbound → nu 404 (400 fără antete)', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/webhooks/inbound',
      headers: { 'content-type': 'application/json' },
      payload: {},
    });
    expect(res.statusCode).not.toBe(404);
  });
});
