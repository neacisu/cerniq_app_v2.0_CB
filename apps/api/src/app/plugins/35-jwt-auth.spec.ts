import Fastify from 'fastify';
import jwt from 'jsonwebtoken';
import jwtAuth from './35-jwt-auth';

describe('plugin 35-jwt-auth', () => {
  const secret = 'k'.repeat(32);

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('setează request.auth pentru Bearer HS256 valid', async () => {
    process.env.JWT_SECRET = secret;
    const server = Fastify({ logger: false });
    await server.register(jwtAuth);
    server.get('/t', async (request) => ({ auth: request.auth }));
    const token = jwt.sign(
      { sub: 'user-1', tid: 'tenant-a' },
      secret,
      { algorithm: 'HS256' }
    );
    const res = await server.inject({
      method: 'GET',
      url: '/t',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({
      auth: { sub: 'user-1', tid: 'tenant-a' },
    });
    await server.close();
  });

  it('auth null când lipsește Bearer', async () => {
    process.env.JWT_SECRET = secret;
    const server = Fastify({ logger: false });
    await server.register(jwtAuth);
    server.get('/t', async (request) => ({ auth: request.auth }));
    const res = await server.inject({ method: 'GET', url: '/t' });
    expect(res.json()).toEqual({ auth: null });
    await server.close();
  });

  it('auth null când JWT_SECRET lipsește', async () => {
    const server = Fastify({ logger: false });
    await server.register(jwtAuth);
    server.get('/t', async (request) => ({ auth: request.auth }));
    const res = await server.inject({
      method: 'GET',
      url: '/t',
      headers: { authorization: 'Bearer x.y.z' },
    });
    expect(res.json()).toEqual({ auth: null });
    await server.close();
  });
});
