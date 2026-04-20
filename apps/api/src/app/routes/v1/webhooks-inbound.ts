import { createHmac, timingSafeEqual } from 'node:crypto';
import type { FastifyPluginAsync } from 'fastify';
import {
  bodySha256,
  getWebhookRedis,
  webhookIdempotencyOutcome,
  webhookRateLimitOk,
} from '../../../lib/webhook-inbound-redis.js';

/**
 * Fără `fastify-plugin`: AutoLoad aplică prefix `/v1`; `fp()` ridica rutele la root și
 * rupea URL-ul public `/v1/webhooks/inbound` (devenea `/webhooks/inbound`).
 */
const webhooksInbound: FastifyPluginAsync = async (fastify) => {
  fastify.post('/webhooks/inbound', async (request, reply) => {
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

    const redis = getWebhookRedis();
    if (redis) {
      const clientKey =
        (typeof request.headers['x-forwarded-for'] === 'string'
          ? request.headers['x-forwarded-for'].split(',')[0]?.trim()
          : null) ||
        request.socket?.remoteAddress ||
        'unknown';
      const rlOk = await webhookRateLimitOk(redis, clientKey);
      if (!rlOk) {
        return reply.status(429).send({
          error: {
            code: 'WEBHOOK_RATE_LIMIT',
            message: 'Too many webhook requests',
            request_id: request.requestId,
          },
        });
      }
      const hash = bodySha256(rawBody);
      const outcome = await webhookIdempotencyOutcome(redis, idem, hash);
      if (outcome === 'conflict') {
        return reply.status(409).send({
          error: {
            code: 'IDEMPOTENCY_CONFLICT',
            message: 'Idempotency-Key reused with different body',
            request_id: request.requestId,
          },
        });
      }
      if (outcome === 'replay') {
        return reply
          .status(202)
          .send({ accepted: true, idempotency_key: idem, replay: true });
      }
    }

    return reply.status(202).send({ accepted: true, idempotency_key: idem });
  });
};

export default webhooksInbound;
