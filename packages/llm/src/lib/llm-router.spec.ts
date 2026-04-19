import { loadLlmConfigDevFallback, resolveEndpoint } from './llm-router.js';

describe('llm-router', () => {
  it('resolveEndpoint returns base per class', () => {
    const cfg = loadLlmConfigDevFallback();
    expect(resolveEndpoint(cfg, 'guard')).toMatch(/^http/);
  });
});
