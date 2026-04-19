# Mitigare versiuni — research backend §6 vs stacks

| Research (țintă text) | Stare stacks / CMDB | Acțiune |
|----------------------|---------------------|---------|
| Node 24.15 | CI `node 20` (GH); upgrade la 24 când stabil pe worker | ADR upgrade Node în CI + dev |
| pnpm 10.27 | Repo `pnpm@10.33.0` | OK |
| Nx 21.4 | Repo `21.6.11` | OK (≥) |
| TypeScript 5.3 | Repo `5.9.x` | OK |
| Fastify 5.6 | Repo `^5.8` | OK |
| Redis 8.6 client | redis-shared 8.6 stacks-02 | OK |
| BullMQ 5.x | De adăugat în cod | `impl-bullmq-producers-workers` |
| Temporal SDK 1.13 | Cluster hz.62 etc. | Verificare live la deploy worker |
| LangGraph | Deferred ADR-0006 | Fără runtime |
| OTel 0.143 | Versiune pachet la pin în API | `impl-otel-prometheus-api-instrumentation` |
| Prometheus/Grafana | Stack observability existent | Integrare |
| Postgres 18.3 + pgvector 0.8.2 | Engine pe `lxc-postgres-main` — verificare live H8 | `SELECT version();` audit |
| Loki | Nu — Vector | ADR-0008 |

Fiecare diferență majoră rămasă → ADR sau actualizare acest tabel după audit.
