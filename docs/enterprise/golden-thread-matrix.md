# Golden thread — cerințe → stacks → artefacte

Matrice de trasabilitate: fiecare cerință aplicabilă din sursele canonice este mapată la reguli `.cursor/rules/stacks-0x` și la un artefact de dovadă în repo sau procedură de audit.

| ID | Cerință (sursă) | stacks | Artefact dovadă / audit |
|----|-----------------|--------|-------------------------|
| GT-01 | Monorepo Nx + pnpm, fără Turbo ca orchestrator ([deep-research-report_cerniq.md](../research/deep-research-report_cerniq.md)) | 01 | `package.json` (`packageManager`), `nx.json`, [ADR 0001](../adr/0001-nx-pnpm-canonical.md) |
| GT-02 | UI Next App Router, nu Vite shell ([raport UI](../research/deep-research-report_cerniq_ui.md), [blueprint](../research/Cerniq_CB_V2_UI_Blueprint_Implementation_Plan_Apr2026_v2_full_suite.md)) | 01 | `apps/web/`, [ADR 0002](../adr/0002-next-in-nx-blueprint-baseline.md) |
| GT-03 | Fără postgres/redis/mail duplicate în compose proiect ([stacks-02](../../../.cursor/rules/stacks-02-shared-services.mdc)) | 02 | `rg "postgres:|redis:" --glob "*.yml"` în rădăcina repo → fără match; gate CI `tools/ci/gates/compose_no_duplicate_datastores.py` |
| GT-04 | Ingress Traefik, nu publish haotic porturi publice | 02 | Runbook Traefik; gate `traefik_ingress`; deploy doc [deploy-topology-v2.md](./deploy-topology-v2.md) |
| GT-05 | Postgres central `lxc-postgres-main`; scheme `brain_*` + business | 02, 05 H8 | [data-domain-erd.md](./data-domain-erd.md), migrații `packages/db-migrations/` |
| GT-06 | redis-shared pentru Streams/BullMQ | 02, 04, 05 | [orchestration-matrix.md](./orchestration-matrix.md), cod `packages/synapses/*` |
| GT-07 | Secrete OpenBao; observabilitate Vector/Tempo/Prometheus | 02 | [logging-audit-policy.md](./logging-audit-policy.md), [security-privacy.md](./security-privacy.md) |
| GT-08 | Alocare workload (Temporal worker nu pe lxc-ci-worker greu) | 03 | [temporal-standards-ops.md](./temporal-standards-ops.md) |
| GT-09 | VIP `10.0.1.10`, orchestrator `77.42.76.185` / `10.0.0.2`, MTU vSwitch | 04, 05 | [network-stacks-04-mtu-vip.md](./network-stacks-04-mtu-vip.md), [c4-deployment-views.md](./c4-deployment-views.md) |
| GT-10 | Plajă v2 `25xxx` fără conflict J/L | 05 | [port-matrix-v2-25xxx.md](./port-matrix-v2-25xxx.md) |
| GT-11 | LLM `49xxx` VIP, ACL | 04, 05 | [llm-quotas-priority.md](./llm-quotas-priority.md), `packages/llm` |
| GT-12 | Suite UI capitole §22–23 [blueprint](../research/Cerniq_CB_V2_UI_Blueprint_Implementation_Plan_Apr2026_v2_full_suite.md) | 01 | [ui-blueprint-suite-inventory.md](./ui-blueprint-suite-inventory.md) |
| GT-13 | Prototip CognitiveBrain = referință UX, nu stack | 01 | [ui-prototype-cognitivebrain-reference.md](./ui-prototype-cognitivebrain-reference.md) |

| GT-14 | IAM proiect (JWT HS256, `tid` vs tenant), fără Zitadel ([ADR 0003](../adr/0003-iam-internal-postgres-jwt.md)) | 02 | `apps/api/src/app/plugins/35-jwt-auth.ts`, `routes/v1/me.ts`, `apps/api/.env.example` |

**Proces:** la fiecare PR, verifică rândurile afectate împotriva [compliance-stacks-01-05.md](../compliance-stacks-01-05.md) și a gate-urilor CI (`python3 tools/ci/run_gates.py`).
