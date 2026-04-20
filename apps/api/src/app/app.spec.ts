import Fastify, { FastifyInstance } from 'fastify';
import { app } from './app';

describe('GET /', () => {
  let server: FastifyInstance;

  beforeEach(async () => {
    server = Fastify({ logger: false });
    await server.register(app);
    await server.ready();
  });

  afterEach(async () => {
    await server.close();
  });

  it('should respond with a message', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/'
    });

    expect(response.json()).toEqual({ message: 'Hello API' })
  });

  it('GET /health liveness', async () => {
    const res = await server.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
  });

  it('GET /ready readiness', async () => {
    const res = await server.inject({ method: 'GET', url: '/ready' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ready: true });
  });

  it('GET /health echoes X-Request-Id from client (plugin request-meta)', async () => {
    const rid = 'audit-req-7c21';
    const res = await server.inject({
      method: 'GET',
      url: '/health',
      headers: { 'x-request-id': rid },
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers['x-request-id']).toBe(rid);
  });
});
