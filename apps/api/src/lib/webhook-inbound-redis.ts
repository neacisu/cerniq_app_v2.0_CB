import { createHash } from 'node:crypto';
import Redis from 'ioredis';

const IDEM_PREFIX = 'cerniq:webhook:idem:';
const RL_PREFIX = 'cerniq:webhook:rl:';

const RL_MAX_PER_WINDOW = 120;
const RL_WINDOW_SEC = 60;
const IDEM_TTL_SEC = 86400 * 7;

let redisSingleton: Redis | undefined;

/** Client Redis partajat (redis-shared stacks-02) — o singură conexiune per proces. */
export function getWebhookRedis(): Redis | null {
  const url = process.env.REDIS_URL?.trim();
  if (!url) {
    return null;
  }
  if (!redisSingleton) {
    redisSingleton = new Redis(url, { maxRetriesPerRequest: null });
  }
  return redisSingleton;
}

export function bodySha256(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

export type IdempotencyOutcome = 'fresh' | 'replay' | 'conflict';

export async function webhookIdempotencyOutcome(
  redis: Redis,
  idemKey: string,
  bodyHash: string,
): Promise<IdempotencyOutcome> {
  const k = `${IDEM_PREFIX}${idemKey}`;
  const existing = await redis.get(k);
  if (existing === bodyHash) {
    return 'replay';
  }
  if (existing !== null && existing !== undefined && existing !== bodyHash) {
    return 'conflict';
  }
  await redis.set(k, bodyHash, 'EX', IDEM_TTL_SEC);
  return 'fresh';
}

/** @returns true dacă sub prag; false dacă rate limit depășit. */
export async function webhookRateLimitOk(
  redis: Redis,
  clientKey: string,
): Promise<boolean> {
  const k = `${RL_PREFIX}${clientKey}`;
  const n = await redis.incr(k);
  if (n === 1) {
    await redis.expire(k, RL_WINDOW_SEC);
  }
  return n <= RL_MAX_PER_WINDOW;
}
