# Infra Cerniq v2 — Faza 0 (stacks-02 / 03 / 04 / 05)

## Principii

- **Fără** `postgres`, `redis`, `mail` duplicate în `docker-compose` pentru acest proiect — integrare cu serviciile orchestratorului existente (Traefik, `redis-shared`, Postgres central, OpenBao, Vector/Tempo/Prometheus).
- Expunere HTTPS prin **Traefik** (etichete `traefik.*`), nu prin `ports` publice ad-hoc pe aplicații.
- Secretele provin din **OpenBao** / GitHub Actions, nu din fișiere `.env` în remote.

## Integrări țintă

| Necesitate | Integrare |
|------------|-----------|
| HTTP(S) ingress | Traefik pe orchestrator; hostnames `v2.cerniq.app`, `api.v2.cerniq.app`, etc. |
| Cache / cozi | `redis-shared` (BullMQ, Streams) — URL din CMDB |
| OLTP | Postgres central — host `lxc-postgres-main` (stacks-05 H8) |
| Secrete | OpenBao |
| Loguri | JSON stdout → Vector |
| Metrici / trace | Prometheus / Tempo existente — worker-ii de proces (`apps/temporal-worker`, `apps/bullmq-worker`) expun **`/metrics`** pentru scrape intern (bind implicit localhost; vezi `METRICS_HOST` / `METRICS_PORT`) |

## Plajă porturi aplicație (dev/orchestrator)

Conform planului: **25000** (web), **25010** (API), **25012** (admin). Worker-i: **25091** (Temporal worker metrics, implicit), **25092** (BullMQ worker metrics, implicit). Bind local doar în mediu de dezvoltare controlat; în producție upstream-ul HTTP public este rețeaua Traefik, iar scrape-ul Prometheus se face din rețeaua observability.

## Temporal / BullMQ / OTel

- **Temporal:** `TEMPORAL_ADDRESS` = cluster partajat (CMDB). Worker: `apps/temporal-worker` — resurse adecvate (stacks-03), nu `lxc-ci-worker` pentru sarcini grele.
- **BullMQ:** `REDIS_URL` = **redis-shared** (orchestrator `10.0.0.2:6379` sau VIP `10.0.1.10:6379` — vezi `docs/enterprise/messaging-redis-bullmq-ops.md`). Proces worker: `apps/bullmq-worker`.
- Client Temporal din `apps/api` folosește același endpoint de cluster (variabile de mediu).

## Fișiere

- Acest director documentează deciziile; **nu** include încă un `docker-compose` cu datastore-uri duplicate. Un compose minimal Traefik-only poate fi adăugat ulterior cu ADR + review.
