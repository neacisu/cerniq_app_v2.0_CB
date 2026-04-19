import { llmFetch } from './llm-fetch.js';

describe('llmFetch', () => {
  it('aruncă la timeout pe server inexistent', async () => {
    await expect(
      llmFetch('http://127.0.0.1:1/', { timeoutMs: 100 })
    ).rejects.toThrow();
  }, 10_000);
});
