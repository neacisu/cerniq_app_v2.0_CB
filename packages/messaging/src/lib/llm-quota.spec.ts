import { LlmQuotaGuard } from './llm-quota.js';

describe('LlmQuotaGuard', () => {
  it('throws fără REDIS_URL', () => {
    const prev = process.env.REDIS_URL;
    delete process.env.REDIS_URL;
    expect(() => new LlmQuotaGuard(100)).toThrow(/REDIS_URL/);
    process.env.REDIS_URL = prev;
  });
});
