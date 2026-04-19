# Architecture Decision Records (ADR)

Format: `NNNN-titlu-slug.md`. Status: Proposed | Accepted | Deprecated | Superseded.

## Index

| ADR | Titlu | Status |
|-----|-------|--------|
| [0001](./0001-nx-pnpm-canonical.md) | Nx + pnpm canonic; Turbo doar ergonomie pnpm în text UI | Accepted |
| [0002](./0002-next-in-nx-blueprint-baseline.md) | Next 16 App Router în Nx, baseline blueprint Apr 2026 | Accepted |
| [0003](./0003-iam-internal-postgres-jwt.md) | IAM intern, JWT/sesiuni, Zitadel exclus | Accepted |
| [0004](./0004-orchestration-streams-bullmq-temporal.md) | Roluri Redis Streams / BullMQ / Temporal | Accepted |
| [0005](./0005-edge-25xxx-cloudflare-traefik.md) | Edge v2: plajă 25xxx, Cloudflare, Traefik | Accepted |
| [0006](./0006-langgraph-deferred.md) | LangGraph plasat doar după ADR dedicat; implicit Deferred v1 | Accepted |
| [0007](./0007-langgraph-placement.md) | Plasare LangGraph vs Temporal (subordonat 0004) | Accepted |
| [0008](./0008-observability-vector-tempo.md) | Vector + Tempo; fără Loki paralel | Accepted |
| [0009](./0009-pinned-ui-versions-strategy.md) | Strategie pin UI vs @nx/next | Accepted |

**Revizuire:** la schimbare stacks-01…05 sau blueprint suite, actualizează ADR afectat + [compliance-stacks-01-05.md](../compliance-stacks-01-05.md).
