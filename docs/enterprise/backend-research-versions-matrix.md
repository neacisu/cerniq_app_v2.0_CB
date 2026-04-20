# Mitigare versiuni — research backend §6 vs repo / stacks / CMDB

**Sursă research (țintă text, nu autoritate infra):** [deep-research-report_cerniq.md](../research/deep-research-report_cerniq.md) §6 — tabel „Core Versions (Apr 2026)”.

**Sursă infra (fără presupuneri):** [stacks-05-port-matrix.mdc](../../.cursor/rules/stacks-05-port-matrix.mdc) (audit live 2026-04-18): orchestrator **redis-shared**, **H8** `lxc-postgres-main` **PostgreSQL 16**, stack observability (`vector`, `tempo`), etc.

**Sursă repo:** `package.json`, `pnpm-lock.yaml`, `.github/workflows/ci.yml`.

**ADR pentru fiecare diferență materială:** [ADR-0010 — research §6 vs CMDB/repo](../adr/0010-research-backend-section6-version-deltas.md) (secțiuni **D1–D16**); trimiteri încrucișate la [ADR-0001](../adr/0001-nx-pnpm-canonical.md), [ADR-0006](../adr/0006-langgraph-deferred.md), [ADR-0007](../adr/0007-langgraph-placement.md), [ADR-0008](../adr/0008-observability-vector-tempo.md), [ADR-0004](../adr/0004-orchestration-streams-bullmq-temporal.md).

---

## Tabel mitigare (research §6 ↔ realitate ↔ ADR-0010)

| Componentă (§6) | Versiune research | Versiune reală (repo / CMDB) | ADR-0010 | Note |
|-----------------|-------------------|-------------------------------|----------|------|
| Node.js | 24.15.0 | CI **20** (`.github/workflows/ci.yml`) | **D1** | Upgrade = PR dedicat |
| pnpm | 10.27.0 | **pnpm@10.33.0** (`packageManager`) | **D2** | OK ≥ |
| Nx | 21.4.1 | **21.6.11** | **D3** | ADR-0001 |
| TypeScript | 5.3.x | **~5.9.3** | **D4** | OK |
| Turborepo CLI | 2.13.1 | **Nx** (nu Turbo orchestrator) | **D15** | ADR-0001 |
| Fastify | 5.6.2 | **5.8.5** (lockfile) | **D5** | OK ≥ |
| Redis (server) | 8.6.0 | **redis-shared** orchestrator | **D6** | stacks-05 A2/B1 |
| BullMQ | 5.58.5 | **^5.74.1** | **D7** | ADR-0004 |
| Temporal SDK | 1.13.0 | **1.16.0** (`@temporalio/client`) | **D8** | Verificare vs server Temporal |
| LangGraph.js | 0.4.9 | Absent runtime | **D9** | ADR-0006/0007 |
| vLLM | 1.2.0 | Infra hz.113 / matrice | **D16** | Nu în `apps/api` |
| PostgreSQL | 18.3 (text) | **PostgreSQL 16** pe H8 `10.0.1.107` | **D10** | stacks-05 §H8 prevalează |
| pgvector | 0.8.2 | Extensie server H8 | **D11** | Migrări / DBA |
| OpenTelemetry Collector | 0.143.0 (infra) | Stack `/opt/observability`; **fără** SDK duplicat în app | **D12** | ADR-0008 + `traceparent` în API |
| Prometheus / Grafana | 3.11 / 13 | Versiuni pe host observability | **D13** | `/metrics` în app |
| Loki | (texte vechi) | **Vector** canonic | **D14** | ADR-0008 |

---

## Comenzi audit (reproducibile)

```bash
python3 -c "import json;print(json.load(open('package.json'))['packageManager'])"
rg -n "^  fastify@" pnpm-lock.yaml | head -3
rg -n "@temporalio/client@" pnpm-lock.yaml | head -3
rg -n "node-version" .github/workflows/ci.yml
# Pe cluster Postgres H8 (operațional, nu în CI): SELECT version();
```

Orice bump major → actualizare acest tabel + revizuire **ADR-0010** dacă decizia se schimbă.
