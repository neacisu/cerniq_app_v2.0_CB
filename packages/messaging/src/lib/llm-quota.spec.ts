import Redis from 'ioredis-mock';
import { LlmQuotaGuard } from './llm-quota.js';

describe('LlmQuotaGuard', () => {
  it('throws fără REDIS_URL și fără client injectat', () => {
    const prev = process.env.REDIS_URL;
    delete process.env.REDIS_URL;
    expect(() => new LlmQuotaGuard(100)).toThrow(/REDIS_URL/);
    process.env.REDIS_URL = prev;
  });

  it('acceptă consum în limite (redis injectat)', async () => {
    const redis = new Redis();
    const guard = new LlmQuotaGuard(100, undefined, { redis });
    await expect(guard.consume('tenant-a', 'day', 50)).resolves.toBe(true);
    await expect(guard.consume('tenant-a', 'day', 50)).resolves.toBe(true);
    await guard.disconnect();
  });

  it('refuză când depășire după increment (429 semantic)', async () => {
    const redis = new Redis();
    const guard = new LlmQuotaGuard(10, undefined, { redis });
    await expect(guard.consume('tenant-b', 'day', 10)).resolves.toBe(true);
    await expect(guard.consume('tenant-b', 'day', 1)).resolves.toBe(false);
    await guard.disconnect();
  });

  it('izolează contoare per tenant', async () => {
    const redis = new Redis();
    const guard = new LlmQuotaGuard(5, undefined, { redis });
    await expect(guard.consume('tenant-x', 'day', 5)).resolves.toBe(true);
    await expect(guard.consume('tenant-y', 'day', 1)).resolves.toBe(true);
    await guard.disconnect();
  });
});
