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
| Metrici / trace | Prometheus / Tempo existente |

## Plajă porturi aplicație (dev/orchestrator)

Conform planului: **25000** (web), **25010** (API), **25012** (admin). Bind local doar în mediu de dezvoltare controlat; în producție upstream-ul este rețeaua Traefik.

## Temporal / OTel

Worker-ii Temporal rulează pe host cu resurse adecvate (stacks-03); nu pe `lxc-ci-worker` pentru sarcini grele. Clientul Temporal din `apps/api` folosește endpoint-ul clusterului partajat (variabile de mediu).

## Fișiere

- Acest director documentează deciziile; **nu** include încă un `docker-compose` cu datastore-uri duplicate. Un compose minimal Traefik-only poate fi adăugat ulterior cu ADR + review.
