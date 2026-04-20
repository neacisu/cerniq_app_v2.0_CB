import {
  loadLlmConfigFromEnv,
  loadLlmConfigDevFallback,
  resolveEndpoint,
} from './llm-router.js';

describe('llm-router', () => {
  const orig = {
    LLM_GUARD_BASE_URL: process.env.LLM_GUARD_BASE_URL,
    LLM_FAST_BASE_URL: process.env.LLM_FAST_BASE_URL,
    LLM_REASONING_BASE_URL: process.env.LLM_REASONING_BASE_URL,
    LLM_EMBEDDINGS_BASE_URL: process.env.LLM_EMBEDDINGS_BASE_URL,
  };

  afterEach(() => {
    for (const [k, v] of Object.entries(orig)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  });

  it('resolveEndpoint — cele 4 clase mapate la URL distincte (env)', () => {
    process.env.LLM_GUARD_BASE_URL = 'http://h/guard';
    process.env.LLM_FAST_BASE_URL = 'http://h/fast';
    process.env.LLM_REASONING_BASE_URL = 'http://h/reason';
    process.env.LLM_EMBEDDINGS_BASE_URL = 'http://h/embed';
    const cfg = loadLlmConfigFromEnv();
    expect(resolveEndpoint(cfg, 'guard')).toBe('http://h/guard');
    expect(resolveEndpoint(cfg, 'fast')).toBe('http://h/fast');
    expect(resolveEndpoint(cfg, 'reasoning')).toBe('http://h/reason');
    expect(resolveEndpoint(cfg, 'embeddings')).toBe('http://h/embed');
  });

  it('resolveEndpoint — dev fallback unic (stacks-05 VIP 49xxx documentat în cod)', () => {
    const cfg = loadLlmConfigDevFallback();
    expect(resolveEndpoint(cfg, 'guard')).toMatch(/^http/);
    expect(resolveEndpoint(cfg, 'fast')).toBe(resolveEndpoint(cfg, 'guard'));
  });
});
