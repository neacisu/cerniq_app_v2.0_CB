# Messaging: Redis Streams + BullMQ pe redis-shared

**Scop:** task `messaging-redis-bullmq-ops` — **Streams** (`XREADGROUP`) + **BullMQ** exclusiv pe **redis-shared** stacks-02; poziție rețea **10.0.1.10:6379** (VIP) sau **10.0.0.2:6379** (orchestrator direct); convenții **consumer group**, **DLQ**, **TTL**; **fără** Redis dedicat în compose proiect.

---

## Conectivitate (stacks-04/05)

| Sursă client | Redis URL tipic (CMDB) |
|--------------|-------------------------|
| LXC / VIP | `10.0.1.10:6379` |
| Orchestrator direct | `10.0.0.2:6379` |

Regula din matrice: alegeți string-ul corect pentru poziția clientului în rețea — vezi `.cursor/rules/stacks-05-port-matrix.md` (B1, L3–L4).

---

## Redis Streams (sinapse)

| Artefact | Locație |
|----------|---------|
| Consumer `XREADGROUP` / `XACK` | `packages/messaging/src/lib/redis-streams.ts` |
| Convenție grup | `SYNAPSE_MATRIX.csv` — `consumer_group`, `stream_key` |

**DLQ (evenimente neprocesabile):** stream dedicat sau politică `orchestration-matrix.md` — nu același pas în **BullMQ** și **Stream** fără ADR-0004.

---

## BullMQ

| Artefact | Locație |
|----------|---------|
| Cozi / worker (bibliotecă) | `packages/messaging/src/lib/bullmq-queue.ts` |
| **Proces worker de deploy** | `apps/bullmq-worker` — citește `REDIS_URL` (redis-shared), `BULLMQ_QUEUE_NAME`, `GET /metrics` pe `METRICS_HOST`/`METRICS_PORT` (stacks-02) |
| Prefix nume coadă | `cerniq:bullmq:` — evită coliziuni multi-tenant pe același Redis |
| DLQ logic | sufix `:dlq` pe numele cozii de bază |

**Env:** `REDIS_URL` obligatoriu pentru runtime BullMQ (URL orchestrator / VIP — vezi tabelul de conectivitate de mai sus).

---

## TTL / retenție

- Job-uri: `removeOnComplete` / `removeOnFail` setate în `defaultJobOptions` la nivel de `Queue` — vezi cod.
- Streams: retenție `MAXLEN` / politici în `redis-streams-retention-replay.md` (runbook).

---

## Interdicție

- **Nu** adăugați serviciu `redis` în `docker-compose` proiect pentru date aplicație — `compose_no_duplicate_datastores` gate.

---

## Verificare

- `pnpm exec nx run messaging:test`
- Gate: `orchestration_manifests.py` pe `packages/gateways/*/manifest.json`.
