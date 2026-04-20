import { Redis } from 'ioredis';

const KEY = (tenantId: string, period: string) => `cerniq:llm:quota:${tenantId}:${period}`;

export type LlmQuotaGuardOptions = Readonly<{
  /** Client Redis injectat (ex. `ioredis-mock` în teste) — evită rețea reală. */
  redis?: Redis;
}>;

export class LlmQuotaGuard {
  private readonly redis: Redis;
  private readonly maxTokens: number;

  constructor(
    maxTokensPerPeriod: number,
    connectionUrl?: string,
    options?: LlmQuotaGuardOptions,
  ) {
    if (options?.redis) {
      this.redis = options.redis;
    } else {
      const url = connectionUrl ?? process.env.REDIS_URL;
      if (!url) throw new Error('REDIS_URL required for LlmQuotaGuard');
      this.redis = new Redis(url, { maxRetriesPerRequest: null });
    }
    this.maxTokens = maxTokensPerPeriod;
  }

  /** Returnează false dacă cota e depășită (increment atomic). */
  async consume(tenantId: string, period: string, tokens: number): Promise<boolean> {
    const k = KEY(tenantId, period);
    const n = await this.redis.incrby(k, tokens);
    if (n === tokens) {
      await this.redis.expire(k, 86400 * 32);
    }
    if (n > this.maxTokens) {
      await this.redis.decrby(k, tokens);
      return false;
    }
    return true;
  }

  async disconnect(): Promise<void> {
    await this.redis.quit();
  }
}
