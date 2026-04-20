import { llmFetch, formatLlmVectorLogLine, llmUrlPathForLog } from './llm-fetch.js';

describe('llmFetch', () => {
  it('aruncă la timeout pe server inexistent (maxRetries implicit 0)', async () => {
    await expect(
      llmFetch('http://127.0.0.1:1/', { timeoutMs: 100 })
    ).rejects.toThrow();
  }, 15_000);

  it('reîncearcă la 503 și reușește la a doua încercare', async () => {
    let calls = 0;
    const orig = globalThis.fetch;
    globalThis.fetch = jest.fn(async () => {
      calls += 1;
      if (calls === 1) {
        return new Response(null, { status: 503 });
      }
      return new Response('ok', { status: 200 });
    }) as unknown as typeof fetch;
    try {
      const res = await llmFetch('http://example.test/path', {
        maxRetries: 2,
        timeoutMs: 5000,
      });
      expect(res.status).toBe(200);
      expect(calls).toBe(2);
    } finally {
      globalThis.fetch = orig;
    }
  });
});

describe('logging fără PII', () => {
  it('llmUrlPathForLog păstrează doar pathname', () => {
    expect(llmUrlPathForLog('https://api.example/v1/chat?token=secret')).toBe('/v1/chat');
  });

  it('formatLlmVectorLogLine este JSON cu câmpuri așteptate', () => {
    const line = formatLlmVectorLogLine({
      component: 'cerniq.llm.http',
      outcome: 'ok',
      duration_ms: 12,
      path: '/v1/x',
      http_status: 200,
      attempt: 1,
    });
    const o = JSON.parse(line) as Record<string, unknown>;
    expect(o.component).toBe('cerniq.llm.http');
    expect(o).not.toHaveProperty('body');
  });
});
