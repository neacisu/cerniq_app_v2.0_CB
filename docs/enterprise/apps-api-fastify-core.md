# apps/api — bootstrap Fastify 5.x (nucleu enterprise)

**Scop:** documentație de referință pentru task **`impl-apps-api-fastify-core`**: structură pluginuri, serializare erori, health/ready/metrics, logging JSON compatibil stacks-02 (Vector), request id — fără expunere publică directă din compose aplicație (ingress prin Traefik în producție).

**Versiune framework:** Fastify **5.8.5** (rezolvat în `pnpm-lock.yaml`; interval `^5.8.5` în `package.json`).

---

## Intrare proces

| Fișier | Rol |
|--------|-----|
| [apps/api/src/main.ts](../../apps/api/src/main.ts) | `Fastify({ logger, genReqId })`, `listen` pe `HOST`/`PORT` (implicit `localhost:25010`). JSON structurat pe stdout pentru agenți tip Vector. |
| [apps/api/src/app/app.ts](../../apps/api/src/app/app.ts) | `register` AutoLoad `plugins/` și `routes/` (fără fișiere `*.spec.ts`). |

**Nu** există `ports:` pentru `api` în compose-ul monorepo — aliniat **`gate-pr-stacks-02-traefik-ingress-only`**; în dev, bind pe localhost evită expunere accidentală.

---

## Pluginuri (ordine încărcare: nume fișier)

| Plugin | Fișier | Funcție |
|--------|--------|---------|
| sensible | `05-sensible.ts` | Utilitare erori HTTP (@fastify/sensible) |
| request-meta | `10-request-meta.ts` | `X-Request-Id` intrare + ecou; antet W3C **`traceparent`** → `trace_id` în log (pino child); complementar export OTLP opțional (vezi Observabilitate) |
| error-envelope | `20-error-envelope.ts` | Răspuns JSON `{ error: { code, message, request_id } }`; 500 fără detalii client |
| tenant-context | `30-tenant-context.ts` | Context tenant (dacă activ) |
| jwt-auth | `35-jwt-auth.ts` | JWT pentru rute protejate |

**Dublură acceptată:** `genReqId` în `main.ts` și hook în `10-request-meta` asigură același id în loguri și în envelope (vezi [logging-audit-policy.md](./logging-audit-policy.md)).

---

## Rute operaționale

| Rută | Fișier | Rol |
|------|--------|-----|
| `GET /health` | `routes/health.ts` | Liveness — `{ status: 'ok' }` |
| `GET /ready` | `routes/ready.ts` | Readiness — extensibil DB/Redis fără a strica liveness |
| `GET /metrics` | `routes/metrics.ts` | Prometheus (`prom-client`), histogramă HTTP |
| `GET /` | `routes/root.ts` | Mesaj API / contract minim |

OpenAPI: [contracts-api-events.md](./contracts-api-events.md), [openapi/openapi.yaml](../../openapi/openapi.yaml).

---

## Observabilitate

- **Loguri:** stdout JSON Fastify/pino — câmpuri compatibile cu pipeline **Vector** pe orchestrator; fără PII — vezi [logging-audit-policy.md](./logging-audit-policy.md).
- **Corelare trace:** parsare antet **`traceparent`** (W3C) în [w3c-traceparent.ts](../../apps/api/src/lib/w3c-traceparent.ts); loguri cu `trace_id` când clientul/Traefik propagă context.
- **Trace OTLP (opțional):** [apps/api/src/otel-init.ts](../../apps/api/src/otel-init.ts) pornește `NodeSDK` + `HttpInstrumentation` + export **OTLP HTTP** când este setat `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` sau `OTEL_EXPORTER_OTLP_ENDPOINT` (URL complet către receiver Tempo/Collector stacks-02). Dezactivare: `OTEL_SDK_DISABLED=true`. Serviciu: `OTEL_SERVICE_NAME` (implicit `cerniq-api`). **Fără** aceste variabile, SDK-ul nu pornește — nu se duplică stack paralel.
- **Metrici:** `cerniqRegistry` + hook `onResponse` — vezi `apps/api/src/app/lib/cerniq-metrics.ts` (Prometheus scrape pe stack observability; aliniat `impl-otel-prometheus-api-instrumentation`).

---

## Teste automate (regresie nucleu)

| Zonă | Fișier test |
|------|-------------|
| App + `/health` + `/ready` | `apps/api/src/app/app.spec.ts` |
| Envelope erori | `apps/api/src/app/plugins/20-error-envelope.spec.ts` |
| Request id | `apps/api/src/app/plugins/10-request-meta.spec.ts` |
| Metrici | `apps/api/src/app/cerniq-metrics.spec.ts` |
| OpenAPI vs rute | `apps/api/src/app/contract-openapi-routes.spec.ts` |
| Parsare `traceparent` | `apps/api/src/lib/w3c-traceparent.spec.ts` |

Rulează: `pnpm exec nx run api:test` (sau `nx run-many -t test --projects=api`).
