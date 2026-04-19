import { createHmac, timingSafeEqual } from 'node:crypto';
import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.post('/v1/webhooks/inbound', async (request, reply) => {
    const idem = request.headers['idempotency-key'];
    if (typeof idem !== 'string' || idem.length < 8) {
      return reply.status(400).send({
        error: {
          code: 'IDEMPOTENCY_REQUIRED',
          message: 'Idempotency-Key header required',
          request_id: request.requestId,
        },
      });
    }
    const sig = request.headers['x-cerniq-signature'];
    const secret = process.env.WEBHOOK_INBOUND_SECRET ?? '';
    if (!secret) {
      request.log.warn('WEBHOOK_INBOUND_SECRET missing — rejecting');
      return reply.status(503).send({
        error: {
          code: 'WEBHOOK_MISCONFIGURED',
          message: 'Webhook secret not configured',
          request_id: request.requestId,
        },
      });
    }
    const rawBody =
      typeof request.body === 'string'
        ? request.body
        : JSON.stringify(request.body ?? {});
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    const ok =
      typeof sig === 'string' &&
      sig.length === expected.length &&
      timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    if (!ok) {
      return reply.status(401).send({
        error: {
          code: 'SIGNATURE_INVALID',
          message: 'Invalid signature',
          request_id: request.requestId,
        },
      });
    }
    return reply.status(202).send({ accepted: true, idempotency_key: idem });
  });
};

export default fp(plugin, { name: 'webhooks-inbound' });
