import { Registry, Counter } from 'prom-client';

/** Registru unic pentru `/metrics` — evită dublarea seriilor. */
export const cerniqRegistry = new Registry();

export const httpRequests = new Counter({
  name: 'cerniq_http_requests_total',
  help: 'HTTP requests',
  labelNames: ['method', 'status'],
  registers: [cerniqRegistry],
});

/** Rezultat verificare cotă: ok | exceeded | error (Redis indisponibil etc.). */
export const llmQuotaChecks = new Counter({
  name: 'cerniq_llm_quota_checks_total',
  help: 'Verificări cotă LLM (health / proxy)',
  labelNames: ['result'],
  registers: [cerniqRegistry],
});
