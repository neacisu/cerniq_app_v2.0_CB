# Route Handlers Next — live, telemetry, command

**Scop:** documentează rutele **`apps/web/app/api/*`** aliniate la blueprint §14–§16, la **`contracts-api-events.md`** (SSE, antete) și la **OpenAPI** backend; trafic extern prin **Traefik** (stacks-02).

---

## Căi canonice (App Router)

| Rută Next | Fișier | Rol |
|-----------|--------|-----|
| `GET /api/live` | `app/api/live/route.ts` | **SSE-first** telemetrie Brain: proxy opțional sau stream local |
| `GET /api/telemetry` | `app/api/telemetry/route.ts` | Stub/status configurație (extensibil OTel/Prometheus) |
| `POST /api/command` | `app/api/command/route.ts` | Stub comandă UI → backend (auth + proxy în fază următoare) |

---

## `GET /api/live` — SSE

- **`dynamic = 'force-dynamic'`**, **`runtime = 'nodejs'`**.
- Dacă **`CERNIQ_API_INTERNAL_URL`** este setat (fără slash final în concatenare): `fetch(`${apiBase}/v1/cognitive/stream`)` cu `Accept: text/event-stream`; la răspuns OK cu body, răspunsul este pasat clientului cu antete SSE.
- Altfel: stream local **ReadableStream** cu evenimente JSON minimale (`connected`, `tick`) — dezvoltare fără API upstream.

**Antete răspuns (aliniat contract):**

- `Content-Type: text/event-stream; charset=utf-8`
- `Cache-Control: no-cache, no-transform`
- `Connection: keep-alive`

**Paritate contract:** backend canonic pentru stream este **`GET /v1/cognitive/stream`** — vezi `contracts-api-events.md` (secțiunea SSE) și `openapi/openapi.yaml`.

---

## `GET /api/telemetry`

- Răspuns JSON cu stare simbolică a dependențelor vizibile din env (ex. Redis, Temporal) — **nu** înlocuiește metrics Prometheus; servește health UI / debugging.

---

## `POST /api/command`

- Acceptă JSON; răspuns stub `{ ok, received, trace_hint }` — clientul trebuie să propagă **`X-Request-Id`** către API Fastify conform `contracts-api-events.md`.

---

## Traefik și securitate

- **`apps/web`** este servit în spatele **Traefik**; nu documentăm IP-uri aici — sursa de adevăr rămâne topologia auditată și `deploy-topology-v2.md`.
- Apeluri către API intern doar din rețea de încredere / URL intern (`CERNIQ_API_INTERNAL_URL`).

---

## Verificare automată

- Teste Jest: `apps/web/specs/api-routes-next.spec.ts` (handler-e importate direct).
- Paritate OpenAPI căi API: `tools/ci/gates/openapi_paths_sync_gate.py` (pentru `apps/api`).
