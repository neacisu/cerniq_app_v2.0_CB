# Runbook — Redis Streams: retenție și replay

## Context (stacks-02)

- **redis-shared** pe orchestrator: `10.0.0.2:6379` (direct); din LXC-uri Cerniq/Neanelu spre VIP: `10.0.1.10:6379` → proxy către orchestrator (stacks-04/05).
- Nu adăugați Redis dedicat în `docker-compose` proiect fără ADR excepție.

## Retenție

- Per stream sinapsă: politică **MAXLEN** / trimming documentată în [orchestration-matrix.md](../enterprise/orchestration-matrix.md) și în manifestul sinapsei.
- Obiectiv: evita creștere nelimitată memorie; păstrați suficient pentru debugging și audit operațional (nu PII în payload).

## Replay

1. **DLQ / stream moarte** — după remedierea consumatorului (`XREADGROUP`, ACK), retrimiteți evenimentele validate sau reprocessați din offset cunoscut.
2. **Idempotency** — handler-ele trebuie tolerate la duplicate (chei idempotency în API unde e cazul — vezi [contracts-api-events.md](../enterprise/contracts-api-events.md)).

## Monitorizare

- Lungime cozi, lag consumer group — Grafana/Prometheus (stacks-02 observability).
