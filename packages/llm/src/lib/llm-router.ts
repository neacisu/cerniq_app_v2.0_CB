/**
 * Rutare către cele 4 clase de endpoint LLM (stacks-05 VIP 49000–49004).
 * URL-urile provin exclusiv din variabile de mediu / OpenBao — fără string hardcodat prod.
 */

export type LlmEndpointClass = 'guard' | 'fast' | 'reasoning' | 'embeddings';

export interface LlmRouterConfig {
  readonly guardBaseUrl: string;
  readonly fastBaseUrl: string;
  readonly reasoningBaseUrl: string;
  readonly embeddingsBaseUrl: string;
}

export function loadLlmConfigFromEnv(): LlmRouterConfig {
  const req = (k: string) => {
    const v = process.env[k];
    if (!v) throw new Error(`Missing env ${k} for LLM router`);
    return v.replace(/\/$/, '');
  };
  return {
    guardBaseUrl: req('LLM_GUARD_BASE_URL'),
    fastBaseUrl: req('LLM_FAST_BASE_URL'),
    reasoningBaseUrl: req('LLM_REASONING_BASE_URL'),
    embeddingsBaseUrl: req('LLM_EMBEDDINGS_BASE_URL'),
  };
}

/** Varianta pentru test/dev fără rețea reală — nu folosiți în producție. */
export function loadLlmConfigDevFallback(): LlmRouterConfig {
  const base = process.env.LLM_DEV_MOCK_BASE ?? 'http://127.0.0.1:49000';
  const b = base.replace(/\/$/, '');
  return {
    guardBaseUrl: b,
    fastBaseUrl: b,
    reasoningBaseUrl: b,
    embeddingsBaseUrl: b,
  };
}

export function resolveEndpoint(cfg: LlmRouterConfig, cls: LlmEndpointClass): string {
  switch (cls) {
    case 'guard':
      return cfg.guardBaseUrl;
    case 'fast':
      return cfg.fastBaseUrl;
    case 'reasoning':
      return cfg.reasoningBaseUrl;
    case 'embeddings':
      return cfg.embeddingsBaseUrl;
    default: {
      const _x: never = cls;
      return _x;
    }
  }
}
