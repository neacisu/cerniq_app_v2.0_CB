# SLO, observabilitate, alerte (fără stack paralel)

**Scop:** task `observability-slo-alerts` — ținte **SLO**, **Grafana** / **Prometheus**, **alerte**; conform [logging-audit-policy.md](./logging-audit-policy.md); **stacks-02** (**Vector** / **Tempo**); dashboard-uri cozi / latency / cote **LLM**; **fără** duplicare stack observabilitate în proiect.

---

## SLO (ținte inițiale)

| Serviciu | Indicator | Țintă |
|----------|-----------|-------|
| API | Latență p95 | &lt; 500ms pentru rute simple |
| API | Disponibilitate | 99.9% prod (țintă — măsurare în Prometheus) |
| SSE | Reconnect | &lt; 5s mediu (client + metrici edge) |

---

## Stack existent (stacks-02)

- **Metrics:** **Prometheus** (scraping — exporters pe orchestrator / rețea observability).
- **Traces:** **Tempo**; export **OTel** din `apps/api` — vezi [ADR 0008](../adr/0008-observability-vector-tempo.md).
- **Logs:** **Vector** — JSON structurat; **fără PII** în flux operațional — [logging-audit-policy.md](./logging-audit-policy.md).
- **Alerte:** **Alertmanager** din proiectul `observability` pe orchestrator — rutare conform politicii existente; **fără** instanță paralelă în monorepo.

---

## Dashboards (ținte)

- Cozi **Redis**, adâncime **BullMQ**, backlog **Temporal**, metrici **`cerniq_llm_*`**, erori **5xx** API — vezi [llm-quotas-priority.md](./llm-quotas-priority.md).

---

## Conformitate

- Audit persistat: tabel **`brain_audit.event`** — [data-model-erd-migrations.md](./data-model-erd-migrations.md).
- Nu introduceți stack Grafana/Prometheus nou în `docker-compose` proiect — folosiți cel din infrastructură partajată.

---

## Verificare

- Instrumentare cod: plugin-uri OTel Fastify unde e cazul; contract metrici nume în `packages/llm` / API.
