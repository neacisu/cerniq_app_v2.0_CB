# RUM browser / telemetrie încărcare (echivalent OTel web)

**Scop:** metrici **încărcare** / **navigare** din browser, fără PII; export opțional JSON către un **ingest** compatibil **Vector** (stacks-02); legare la **Prometheus** / **Grafana** prin pipeline existent (collector care expune metrici din loguri sau OTLP — **nu** duplicare stack observability în monorepo).

**Implementare cod:** `apps/web/lib/otel-rum.ts`, apel din `apps/web/app/providers.tsx`.

---

## Variabile de mediu

| Variabilă | Rol |
|-----------|-----|
| `NEXT_PUBLIC_OTEL_RUM` | `1` = activează colectare + (opțional) trimitere |
| `NEXT_PUBLIC_RUM_INGEST_URL` | URL absolut **HTTPS** (sau același origin) pentru `sendBeacon` — setat de deploy (OpenBao / env Traefik), **fără** secret în repo |
| `NEXT_PUBLIC_GRAFANA_RUM_DASHBOARD_URL` | URL public (HTTPS) către dashboard Grafana pentru RUM — inclus în payload `ops.grafana_rum_dashboard_url` (fără secret; doar legătură operațională) |

Dacă `NEXT_PUBLIC_OTEL_RUM=1` dar lipsește ingest, în **development** se loghează doar în consolă (`console.debug`), fără date personale.

---

## Format payload (`cerniq.rum.web_v1`)

Structură JSON minimă (compatibilă agregare Vector → Loki / metrici derivate):

- `event`: literal `cerniq.rum.web_v1`
- `ts`: ISO 8601
- `path`: pathname curent (fără query — evită leak accidental parametri)
- `nav`: `domInteractive`, `domComplete`, `loadEventEnd` (ms, din `PerformanceNavigationTiming`)
- `vitals.lcp`: opțional — `largest-contentful-paint` (ms), dacă disponibil în browser
- `ops.grafana_rum_dashboard_url`: opțional — dacă este setat `NEXT_PUBLIC_GRAFANA_RUM_DASHBOARD_URL` în deploy

**Interzis:** email, user id, token, query string cu PII — vezi [logging-audit-policy.md](./logging-audit-policy.md).

---

## Prometheus / Grafana

- Metrici **server-side** rămân sursa principală (API, SSE) — vezi [observability-slo-alerts.md](./observability-slo-alerts.md).
- RUM: dashboard-uri **opționale** după ce ingest + pipeline (ex. rate încărcare pagină, LCP p75) sunt configurate în infrastructura existentă.

---

## Verificare

- Teste unitare: `apps/web/lib/otel-rum.spec.ts`
- Porți în producție: doar cu URL ingest validat de echipă infra + TLS.
