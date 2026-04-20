/**
 * Metrici Prometheus pentru cotă LLM — aliniat doc-llm-quotas-priority (observabilitate).
 */
import Fastify, { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import { app } from './app';

const SECRET = 'k'.repeat(32);
const TENANT = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

describe('cerniq_llm_quota_checks_total', () => {
  const origRedis = process.env.REDIS_URL;
  const origJwt = process.env.JWT_SECRET;

  afterEach(() => {
    if (origRedis === undefined) delete process.env.REDIS_URL;
    else process.env.REDIS_URL = origRedis;
    if (origJwt === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = origJwt;
  });

  async function build(): Promise<FastifyInstance> {
    delete process.env.REDIS_URL;
    process.env.JWT_SECRET = SECRET;
    const server = Fastify({ logger: false });
    await server.register(app);
    return server;
  }

  it('apare în /metrics după verificare cotă (cale degradare Redis)', async () => {
    const server = await build();
    const token = jwt.sign({ sub: 'user-1', tid: TENANT }, SECRET);
    await server.inject({
      method: 'GET',
      url: '/v1/llm/health',
      headers: {
        'x-tenant-id': TENANT,
        authorization: `Bearer ${token}`,
      },
    });
    const res = await server.inject({ method: 'GET', url: '/metrics' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatch(/cerniq_llm_quota_checks_total/);
    expect(res.body).toMatch(/result="error"/);
  });
});
