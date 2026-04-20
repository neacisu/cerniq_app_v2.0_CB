# Infra — fază 0 integrare servicii shared

**Scop:** task `infra-phase0` — integrare cu serviciile **stacks-02** (redis-shared, Postgres central, Traefik, OpenBao, stack **observability**: Vector / Tempo / Prometheus); **stacks-03** (Temporal / worker pe host desemnat, LXC **hz.223**); **stacks-04/05** (**VIP `10.0.1.10`**, reguli HAProxy noi doar cu schimbare documentată); **fără** datastore duplicate în compose; **smoke** pe căi reale (gate-uri).

---

## stacks-02 — servicii partajate

| Serviciu | Rol | Dovadă documentație |
|----------|-----|---------------------|
| **redis-shared** | Streams, BullMQ, rate limit | [messaging-redis-bullmq-ops.md](./messaging-redis-bullmq-ops.md), stacks-05 B1 |
| **Postgres central** | `brain_*`, `auth`, `business` | [data-domain-erd.md](./data-domain-erd.md), H8 |
| **Traefik** | Ingress TLS | [c4-deployment-views.md](./c4-deployment-views.md) |
| **OpenBao** | Secrete | runbook `openbao-secrets-rotation.md` |
| **Vector / Tempo / Prometheus** | Logs, traces, metrics | [ADR 0008](../adr/0008-observability-vector-tempo.md), `/opt/observability` (stacks-05 A3) |

**Interdicție:** nu adăugați `postgres`/`redis` în compose aplicație — `compose_no_duplicate_datastores` gate.

---

## stacks-03 — plasament workload

- **Worker Temporal** și procese grele: pe **host/LXC cu RAM adecvată**; **hz.223** găzduiește LXC-uri Cerniq + CI — vezi [c4-deployment-views.md](./c4-deployment-views.md).
- **lxc-ci-worker**: job-uri CI ușoare, nu workload principal Temporal producție.

---

## stacks-04 / 05 — VIP

- **HAProxy VIP `10.0.1.10`** (hz.247): Redis **6379**, Traefik **443** — tabel stacks-05 B1; reguli noi numai cu actualizare CMDB + runbook.

---

## Smoke (repo)

- Rulare locală: `python3 tools/ci/run_gates.py` — verifică consistență compose, OpenAPI, enterprise docs, orchestrare manifeste, **fără** a înlocui smoke pe rețea reală (acesta rămâne în runbook deploy).

---

## Verificare

- Topologie închisă: [deploy-topology-v2.md](./deploy-topology-v2.md).
