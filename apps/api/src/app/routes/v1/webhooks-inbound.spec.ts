/**
 * Integrare Fastify pentru POST /v1/webhooks/inbound — HMAC + răspunsuri contract (fără Redis în aceste teste).
 * Calea Redis: `webhook-inbound-redis.spec.ts` + `packages/shared` outbound.
 */
import { createHmac } from 'node:crypto';
import Fastify from 'fastify';
import requestMeta from '../../plugins/10-request-meta.js';
import webhooksInbound from './webhooks-inbound.js';

function signBody(secret: string, raw: string): string {
  return createHmac('sha256', secret).update(raw).digest('hex');
}

describe('POST /v1/webhooks/inbound', () => {
  const secret = 'w'.repeat(32);
  const origSecret = process.env.WEBHOOK_INBOUND_SECRET;
  const origRedis = process.env.REDIS_URL;

  afterEach(() => {
    if (origSecret === undefined) delete process.env.WEBHOOK_INBOUND_SECRET;
    else process.env.WEBHOOK_INBOUND_SECRET = origSecret;
    if (origRedis === undefined) delete process.env.REDIS_URL;
    else process.env.REDIS_URL = origRedis;
  });

  async function buildServer() {
    delete process.env.REDIS_URL;
    process.env.WEBHOOK_INBOUND_SECRET = secret;
    const server = Fastify({ logger: false });
    await server.register(requestMeta);
    await server.register(webhooksInbound, { prefix: '/v1' });
    return server;
  }

  it('400 fără Idempotency-Key valid', async () => {
    const server = await buildServer();
    const res = await server.inject({
      method: 'POST',
      url: '/v1/webhooks/inbound',
      headers: { 'content-type': 'application/json' },
      payload: {},
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().error.code).toBe('IDEMPOTENCY_REQUIRED');
    await server.close();
  });

  it('401 semnătură invalidă', async () => {
    const server = await buildServer();
    const res = await server.inject({
      method: 'POST',
      url: '/v1/webhooks/inbound',
      headers: {
        'content-type': 'application/json',
        'idempotency-key': 'idem-key-123456',
        'x-cerniq-signature': 'deadbeef',
      },
      payload: { a: 1 },
    });
    expect(res.statusCode).toBe(401);
    expect(res.json().error.code).toBe('SIGNATURE_INVALID');
    await server.close();
  });

  it('202 acceptat cu HMAC valid (fără Redis — fără idempotency persistent)', async () => {
    const server = await buildServer();
    const payload = { event: 'test' };
    const raw = JSON.stringify(payload);
    const sig = signBody(secret, raw);
    const res = await server.inject({
      method: 'POST',
      url: '/v1/webhooks/inbound',
      headers: {
        'content-type': 'application/json',
        'idempotency-key': 'idem-key-123456',
        'x-cerniq-signature': sig,
      },
      payload,
    });
    expect(res.statusCode).toBe(202);
    expect(res.json()).toMatchObject({
      accepted: true,
      idempotency_key: 'idem-key-123456',
    });
    await server.close();
  });
});
