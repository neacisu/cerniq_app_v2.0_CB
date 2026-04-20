# ADR-0010: Diferențe față de research backend §6 (Core Versions) — mitigare față de CMDB / repo

## Status

Accepted

## Context

[deep-research-report_cerniq.md](../research/deep-research-report_cerniq.md) §6 listează versiuni „țintă text” (Apr 2026). **Autoritatea pentru infrastructură** rămâne **stacks-01…05** (audit CMDB / matrice porturi) și **pin-urile reale** din monorepo (`package.json`, `pnpm-lock.yaml`, CI). Acest ADR înregistrează **câte o decizie** pentru fiecare tensiune față de §6, astfel încât [backend-research-versions-matrix.md](../enterprise/backend-research-versions-matrix.md) să aibă trimitere explicită aici (nu presupuneri).

## Decision (câte o intrare per linie relevantă din §6)

### D1 — Node.js (research 24.15.0 vs CI)

- **Situație:** Research propune Node 24.x; GitHub Actions folosește **Node 20** (`.github/workflows/ci.yml`).
- **Decizie:** Păstrăm **Node 20 în CI** până la upgrade planificat (compatibilitate Nx/Next/tooling); research §6 nu suprascrie pipeline-ul fără PR dedicat.
- **Dovadă audit:** `rg -n "node-version" .github/workflows/ci.yml`

### D2 — pnpm (research 10.27 vs repo)

- **Situație:** `packageManager` în root = **pnpm@10.33.0** (≥ 10.27).
- **Decizie:** **OK** — interval compatibil; `pnpm install --frozen-lockfile` în CI.

### D3 — Nx (research 21.4.1 vs repo)

- **Situație:** Repo **21.6.11**.
- **Decizie:** **OK** (≥); vezi [ADR-0001](./0001-nx-pnpm-canonical.md).

### D4 — TypeScript (research 5.3.x vs repo)

- **Situație:** Workspace **~5.9.3**.
- **Decizie:** **OK** — pin monorepo; research superseded.

### D5 — Fastify (research 5.6.x vs lockfile)

- **Situație:** Lockfile rezolvă **5.8.5**.
- **Decizie:** **OK** (≥).

### D6 — Redis server (research 8.6 vs stacks)

- **Situație:** **redis-shared** pe orchestrator; matrice [stacks-05](../../.cursor/rules/stacks-05-port-matrix.mdc) A2/B1.
- **Decizie:** Conectare doar prin URL din env / runbook; **fără** Redis în compose aplicație — [ADR implicit stacks-02](../compliance-stacks-01-05.md) + gate compose.

### D7 — BullMQ (research 5.58.x vs repo)

- **Situație:** Dependență **^5.74.1**.
- **Decizie:** **OK**; cozi pe **redis-shared** — [ADR-0004](./0004-orchestration-streams-bullmq-temporal.md).

### D8 — Temporal SDK (research 1.13 vs repo 1.16)

- **Situație:** `@temporalio/client` **1.16.0** în lockfile; cluster self-hosted (hz.62 etc.).
- **Decizie:** Acceptăm SDK mai nou; la deploy worker verificare compatibilitate cu serverul Temporal — [temporal-standards-ops.md](../enterprise/temporal-standards-ops.md).

### D9 — LangGraph (research 0.4.9 vs absent din app)

- **Situație:** Nu este dependență runtime în monorepo v2.
- **Decizie:** **Deferred** — [ADR-0006](./0006-langgraph-deferred.md), [ADR-0007](./0007-langgraph-placement.md).

### D10 — PostgreSQL engine (research 18.3 vs CMDB H8)

- **Situație:** Research menționează 18.x; **lxc-postgres-main** în [stacks-05 §H8](../../.cursor/rules/stacks-05-port-matrix.mdc) = **PostgreSQL 16**.
- **Decizie:** **CMDB/stacks-05 prevalează**; migrații / `SELECT version();` pe cluster real — nu presupunem 18 pe H8.

### D11 — pgvector (research 0.8.2)

- **Situație:** Extensie pe server; nu în client npm.
- **Decizie:** Versiunea efectivă se validează la migrări DBA; tabelul din matrix rămâne sincron cu `packages/db-migrations` când există.

### D12 — OpenTelemetry Collector (research 0.143 infra)

- **Situație:** Stack **observability** pe orchestrator (`/opt/observability`); **fără** duplicare Collector în procesul Node app — corelație **W3C `traceparent` + log JSON** — [ADR-0008](./0008-observability-vector-tempo.md), [apps-api-fastify-core.md](../enterprise/apps-api-fastify-core.md).

### D13 — Prometheus / Grafana (research versiuni)

- **Situație:** Versiunile exacte ale stack-ului de monitoring sunt pe mașina observability, nu în `package.json`.
- **Decizie:** API expune **`/metrics`** (prom-client); dashboard-uri = operațiune/runbook, nu pin în research §6.

### D14 — Loki (mencțiuni vechi în texte)

- **Situație:** Research amintea Loki; politica repo = **Vector**, nu Loki paralel.
- **Decizie:** [ADR-0008](./0008-observability-vector-tempo.md) — fără Loki ca agregator principal fără excepție ADR.

### D15 — Turborepo CLI (research 2.13.1)

- **Situație:** Monorepo folosește **Nx**, nu Turbo ca orchestrator.
- **Decizie:** [ADR-0001](./0001-nx-pnpm-canonical.md).

### D16 — vLLM (research 1.2.0)

- **Situație:** Inferență LLM pe host-uri dedicate (ex. hz.113); nu este versiune în `apps/api`.
- **Decizie:** Trimiteri la [stacks-05](../../.cursor/rules/stacks-05-port-matrix.mdc) / runbook LLM; fără pin în acest monorepo decât pentru client guard.

## Consequences

Orice schimbare majoră de versiune în §6 (research) sau bump în repo actualizează **backend-research-versions-matrix.md** și, dacă e decizie nouă, secțiune nouă sau revizuire în acest ADR.

## Compliance

stacks-01 (fără presupuneri), stacks-05 (CMDB), [adr-program.md](../enterprise/adr-program.md).
