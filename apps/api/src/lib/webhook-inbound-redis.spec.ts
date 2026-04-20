import Redis from 'ioredis-mock';
import {
  webhookIdempotencyOutcome,
  webhookRateLimitOk,
} from './webhook-inbound-redis.js';

describe('webhook-inbound-redis', () => {
  it('idempotency: fresh apoi replay pentru același corp', async () => {
    const redis = new Redis();
    await expect(
      webhookIdempotencyOutcome(redis, 'idem-1', 'hash-a'),
    ).resolves.toBe('fresh');
    await expect(
      webhookIdempotencyOutcome(redis, 'idem-1', 'hash-a'),
    ).resolves.toBe('replay');
  });

  it('idempotency: conflict când aceeași cheie, corp diferit', async () => {
    const redis = new Redis();
    await expect(
      webhookIdempotencyOutcome(redis, 'idem-2', 'hash-x'),
    ).resolves.toBe('fresh');
    await expect(
      webhookIdempotencyOutcome(redis, 'idem-2', 'hash-y'),
    ).resolves.toBe('conflict');
  });

  it('rate limit: permite sub prag', async () => {
    const redis = new Redis();
    await expect(webhookRateLimitOk(redis, '10.0.0.1')).resolves.toBe(true);
  });
});
