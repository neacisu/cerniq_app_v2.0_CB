# SLO, observabilitate, alerte

## SLO (ținte inițiale)

| Serviciu | Indicator | Țintă |
|----------|-----------|-------|
| API | Latență p95 | &lt; 500ms pentru rute simple |
| API | Disponibilitate | 99.9% prod |
| SSE | Reconnect | &lt; 5s mediu |

## Stack

- **Metrics:** Prometheus existent pe orchestrator.
- **Traces:** Tempo; export OTel din `apps/api`.
- **Logs:** Vector — JSON structurat.

## Dashboards

- Cozi Redis, BullMQ depth, Temporal backlog, `cerniq_llm_*`, erori 5xx.

## Alerte

- Rutare prin Alertmanager existent; fără stack paralel.

## Conformitate

- [logging-audit-policy.md](./logging-audit-policy.md) pentru conținut log.
