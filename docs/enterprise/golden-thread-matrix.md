# Golden thread — cerințe canonice → stacks-01…05 → artefacte → todo plan

**Todo plan:** `doc-enterprise-stacks-golden-thread`  
**Scop:** o singură matrice de trasabilitate în `docs/enterprise/`, astfel încât fiecare cerință **aplicabilă** din sursele de mai jos să aibă:

- referință **stacks** (reguli materiale în `cerniq_app_v2_CB/.cursor/rules/stacks-0x-*.mdc`);
- legătură la **ID-uri** din [compliance-stacks-01-05.md](../compliance-stacks-01-05.md) (sau „—” dacă acoperirea e doar prin aggregare GT);
- **todo id** din planul unificat (YAML frontmatter `/root/.cursor/plans/rezumat_raport_cerniq_v2_*.plan.md`) sau motiv de excludere prin **ADR**;
- **artefact** verificabil în repo, gate CI sau procedură de audit (fără IP/host inventat; conform [stacks-01](../../.cursor/rules/stacks-01-general-setup.mdc)).

## Surse canonice (lector obligatoriu)

| Rol | Fișier |
|-----|--------|
| Backend / monorepo / mesaje / infra research | [deep-research-report_cerniq.md](../research/deep-research-report_cerniq.md) |
| Frontend research (componente, SSE, a11y, milestone-uri) | [deep-research-report_cerniq_ui.md](../research/deep-research-report_cerniq_ui.md) |
| Produs + IA + suite capitole + fazare + baseline UI Apr 2026 | [Cerniq_CB_V2_UI_Blueprint_Implementation_Plan_Apr2026_v2_full_suite.md](../research/Cerniq_CB_V2_UI_Blueprint_Implementation_Plan_Apr2026_v2_full_suite.md) |
| Prototip UX (tokens, shell tri-pane) — **nu** sursă de versiuni stack | [Cerniq.app CognitiveBrain](../research/Cerniq.app%20CognitiveBrain/), [ui-prototype-cognitivebrain-reference.md](./ui-prototype-cognitivebrain-reference.md) |
| Conformitate reguli stacks (dovadă operațională) | [compliance-stacks-01-05.md](../compliance-stacks-01-05.md) |
| Mitigare versiuni research backend §6 vs CMDB | [backend-research-versions-matrix.md](./backend-research-versions-matrix.md) |
| Milestone-uri UI research → `ui-ms01`…`07` | [ui-research-milestones-map.md](./ui-research-milestones-map.md) |
| Inventar suite blueprint §22–§28 | [ui-blueprint-suite-inventory.md](./ui-blueprint-suite-inventory.md) |
| Matrice motor orchestrare (Streams / BullMQ / Temporal) | [orchestration-matrix.md](./orchestration-matrix.md), [ADR 0004](../adr/0004-orchestration-streams-bullmq-temporal.md) |

## Proces (PR / release)

1. Orice schimbare care atinge o cerință din tabel → actualizează rândul (status, artefact) sau ADR + acest fișier.  
2. Înainte de merge: `python3 tools/ci/run_gates.py` (include gate `golden_thread_matrix_gate.py`).  
3. **Aliniere obligatorie:** fiecare rând GT se încadrează în spiritul [cerniq-todo-enterprise-gates.mdc](../../.cursor/rules/cerniq-todo-enterprise-gates.mdc) (fără „done” fals).  
4. tensiuni **research** (ex. Next 14 în text UI vs Next 16 în blueprint) → [frontend-version-pin.md](./frontend-version-pin.md), [ADR 0002](../adr/0002-next-in-nx-blueprint-baseline.md), [ADR 0009](../adr/0009-pinned-ui-versions-strategy.md).

### Legătură tensiuni „Turbo / Vite” din text research

- **Turbo ca orchestrator monorepo:** exclus; canonic **Nx** — [ADR 0001](../adr/0001-nx-pnpm-canonical.md), `doc-enterprise-stacks-golden-thread` + `bootstrap-nx`.  
- **`@nrwl/react:application web --template=vite` din raport backend §4:** superseded pentru **UI principal** — [ADR 0002](../adr/0002-next-in-nx-blueprint-baseline.md); `apps/web` = Next App Router.

---

## Matrice principală

**Coloane:** **Compliance** = ID din `compliance-stacks-01-05.md` unde există mapare directă; **Plan todo** = id din planul Cursor; **Status:** OK (dovadă în repo/gate), În curs, Gap, ADR (excludere sau amânare documentată).

| ID | Sursă (secțiune / temă) | Cerință (rezumat) | stacks | Compliance | Plan todo | Artefact dovadă / audit | Status |
|----|-------------------------|-------------------|--------|------------|-----------|-------------------------|--------|
| GT-01 | Backend §1–2 | Monorepo **Nx + pnpm**; scalare pachete atomice | 01 | S01-A | `bootstrap-nx` | `nx.json`, `pnpm-workspace.yaml`, [ADR 0001](../adr/0001-nx-pnpm-canonical.md) | OK |
| GT-02 | Backend §3–4; Blueprint §16 | `apps/api` Fastify; layout pachete neurons/synapses/gateways/shared | 01, 05 | S01-A | `bootstrap-nx`, `impl-package-artifacts-neuron-synapse-gateway` | `apps/api`, `packages/*`, [bootstrap-nx-evidence.md](./bootstrap-nx-evidence.md) | OK |
| GT-03 | UI research; Blueprint §3 | **Next.js App Router** shell principal; nu Vite ca aplicație UI | 01 | — | `bootstrap-nx`, `ui-stack-adr-next-nx` | [ui-stack-adr-next-nx.md](./ui-stack-adr-next-nx.md), `apps/web`, [ADR 0002](../adr/0002-next-in-nx-blueprint-baseline.md) | OK doc |
| GT-04 | Backend §3 (diagramă) — „web (React)” | Interpretare livrabil: **Next**, nu SPA Vite, pentru convergență cu blueprint | 01 | — | `doc-frontend-version-pin` | [frontend-version-pin.md](./frontend-version-pin.md) | OK doc |
| GT-05 | stacks-02 + Backend §3 | Fără **postgres/redis/mail** duplicate în compose aplicație | 02 | S02-A | `gate-pr-stacks-02-no-duplicate-datastores`, `local-dev-story`, `infra-phase0` | `tools/ci/gates/compose_no_duplicate_datastores.py`, [local-dev-story.md](./local-dev-story.md), [infra-phase0.md](./infra-phase0.md) | OK gate + doc |
| GT-06 | stacks-02 | Ingress **Traefik**; fără expunere haotică porturi publice în compose | 02 | S02-B | `gate-pr-stacks-02-traefik-ingress-only`, `traefik-v2-routers-orchestrator` | `tools/ci/gates/traefik_no_hazardous_compose_ports.py`, [traefik-v2-reference.md](./traefik-v2-reference.md) | OK repo |
| GT-07 | Backend §2–3 | **redis-shared** pentru Streams + BullMQ; fără Redis paralel de proiect | 02, 04, 05 | S02-C | `messaging-redis-bullmq-ops`, `impl-redis-streams-xreadgroup-runtime` | `packages/messaging`, [messaging-redis-bullmq-ops.md](./messaging-redis-bullmq-ops.md), [orchestration-matrix.md](./orchestration-matrix.md) | Complet (doc+hardening cod) |
| GT-08 | Backend §2; stacks-05 H8 | **PostgreSQL central**; scheme `brain_*` + business; migrații versionate | 02, 05 | S02-D, S05-A | `data-model-erd-migrations` | `packages/db-migrations`, [data-model-erd-migrations.md](./data-model-erd-migrations.md), [data-domain-erd.md](./data-domain-erd.md) | Complet (migrații+doc) |
| GT-09 | stacks-02 | Secrete **OpenBao** / GH Secrets; nu secrete în remote | 02 | S02-E | `env-matrix-secrets`, `ci-nx-affected-secrets-guard` | [env-matrix-secrets.md](./env-matrix-secrets.md), `apps/api/.env.example` | OK doc |
| GT-10 | Backend §2; ADR-0008 | Observabilitate: log **JSON** → **Vector**; trace **Tempo**; fără Loki paralel nejustificat | 02 | S02-F | `observability-slo-alerts`, `impl-otel-prometheus-api-instrumentation` | [observability-slo-alerts.md](./observability-slo-alerts.md), [ADR 0008](../adr/0008-observability-vector-tempo.md), [logging-audit-policy.md](./logging-audit-policy.md) | Complet (doc SLO+stack) |
| GT-11 | Backend §2; stacks-02 | **IAM proiect**; Zitadel exclus | 02 | S02-G | `auth-adr-impl` | [auth-iam-implementation.md](./auth-iam-implementation.md), [ADR 0003](../adr/0003-iam-internal-postgres-jwt.md), `apps/api/src/app/plugins/35-jwt-auth.ts` | Complet (ADR+plugin+teste) |
| GT-12 | stacks-02 | Email numai **Stalwart** shared dacă e nevoie | 02 | S02-H | `docs-adrs-runbooks`, `security-baseline` | [security-baseline.md](./security-baseline.md); fără mailer în compose app | OK doc |
| GT-13 | Backend §2 | **LLM router** către 4 clase endpoint; trasee din CMDB / VIP stacks | 04, 05 | S05-C | `llm-client-hardening`, `impl-llm-router-package-four-endpoints` | [llm-client-hardening.md](./llm-client-hardening.md), `packages/llm`, [llm-quotas-priority.md](./llm-quotas-priority.md) | Complet (router+fetch+teste; cote → todo `impl-llm-quotas-enforcement`) |
| GT-14 | stacks-03 | Workload pe host-uri reale; **Temporal worker** nu pe worker CI „greu” | 03 | S03-A, S03-B | `temporal-standards-ops`, `impl-temporal-worker-gateways` | [temporal-standards-ops.md](./temporal-standards-ops.md), `apps/temporal-worker/src/workflows.spec.ts`, `.github/workflows/ci.yml` | Complet (doc+test logică workflow) |
| GT-15 | stacks-04/05 | Topologie auditată: orchestrator, VIP Redis, MTU/MSS unde e cazul | 04, 05 | S04-A, S04-B | `doc-network-stacks-04-mtu-vip`, `deploy-topology-v2` | [network-stacks-04-mtu-vip.md](./network-stacks-04-mtu-vip.md), [deploy-topology-v2.md](./deploy-topology-v2.md) | OK doc |
| GT-16 | Plan §25xxx | Plajă **25000–25099** v2 fără conflict cu J/L stacks-05 | 05 | S05-B | `port-matrix-v2-25xxx`, `doc-deploy-topology-v2-closure` | [port-matrix-v2-25xxx.md](./port-matrix-v2-25xxx.md), [ADR 0005](../adr/0005-edge-25xxx-cloudflare-traefik.md) | OK doc |
| GT-17 | Backend §4 | **Generatoare** Nx din manifeste NEURON/SYNAPSE | 01 | S01-A | `generators` | [generators-manifests.md](./generators-manifests.md), `tools/generators`, `packages/manifests` | Complet (CSV+gateway JSON) |
| GT-18 | Backend §4 | **CI/CD** Nx affected; cache pnpm; fără leak secrete în artefacte | 02, 03 | S03-B | `ci-pipeline-complete` | `.github/workflows/ci.yml` | În curs |
| GT-19 | Backend §6 | Tabel versiuni research vs **CMDB live** — fără presupunere engine | 01, 05 | S01-A, S05-A | `doc-backend-research-versions-matrix` | [backend-research-versions-matrix.md](./backend-research-versions-matrix.md) | OK doc |
| GT-20 | Backend §7 | **LangGraph**: amânare v1 runtime | 01, 03 | — | `langgraph-placement-adr`, `doc-orchestration-matrix-adr` | [langgraph-placement-adr.md](./langgraph-placement-adr.md), [ADR 0006](../adr/0006-langgraph-deferred.md), [ADR 0007](../adr/0007-langgraph-placement.md) | Complet (ADR+doc închidere v1) |
| GT-21 | Blueprint §22–§24; §28 | **Suite capitole** + inventar pagini + mapare epic/API sau ADR Deferred | 01 | S01-A | `doc-ui-blueprint-suite-inventory`, `ui-chapter-*` | [ui-blueprint-suite-inventory.md](./ui-blueprint-suite-inventory.md), `apps/web/lib/chapters.ts` | În curs |
| GT-22 | Blueprint §8–§9; §25 | **Shell** (top bar, rail, telemetry tray), nav două niveluri | 01, 02 | — | `ui-chapter-shell-full-suite` | `apps/web/components/shell/*`, [ui-blueprint-phased-milestones.md](./ui-blueprint-phased-milestones.md) | În curs |
| GT-23 | Blueprint §16 | Route Handlers `live` / `telemetry` / `command` (sau echivalent) | 02 | — | `ui-api-routes-sse-telemetry`, `impl-api-rest-sse-handlers-contract` | `apps/web/app/api/*`, contracte în [contracts-api-events.md](./contracts-api-events.md) | În curs |
| GT-24 | UI research; Blueprint §14 | **SSE** real; optimistic UI; fără PII în log client | 01, 02 | — | `ui-sse-optimistic-realtime`, `ui-ms04-sse-hook-backend` | [ui-sse-optimistic-realtime.md](./ui-sse-optimistic-realtime.md), `apps/web/lib/use-brain-sse.ts`, `apps/api` routes SSE | Complet (hook+teste) |
| GT-25 | UI research; Blueprint §17 | **Tailwind v4**, **Motion**, **TanStack Query**, **Zustand**, **Storybook**, **axe** (Jest + addon-a11y) | 01 | — | `ui-packages-tanstack-zustand-storybook`, `ui-design-system-tailwind-motion` | [ui-design-system-tailwind-motion.md](./ui-design-system-tailwind-motion.md), `apps/web/package.json`, `.storybook/`, `jest-axe`, `frontend_version_pins.py` | OK doc |
| GT-26 | UI research (Vitest în text) | Tensiune: research **Vitest**; repo poate folosi **Jest** (Next/Nx) — urmărit în pin versiuni | 01 | — | `ui-testing-storybook-playwright`, `doc-frontend-version-pin` | [ui-testing-storybook-playwright.md](./ui-testing-storybook-playwright.md), `apps/web/jest.config.ts`, [frontend-version-pin.md](./frontend-version-pin.md) | OK doc |
| GT-27 | UI research §milestones | Mapare **M1–M7** → `ui-ms01`…`ui-ms07` | 01 | — | `doc-ui-research-milestones-map`, `ui-ms01`…`ui-ms07` | [ui-research-milestones-map.md](./ui-research-milestones-map.md) | OK doc |
| GT-28 | UI research + Blueprint | **WCAG 2.2**, CSP, focus management | 01, 02 | — | `ui-keyboard-a11y-landmarks`, `security-privacy` | [security-privacy.md](./security-privacy.md) | În curs |
| GT-29 | UI research | **OTel RUM** → Prometheus/Grafana stack existent | 02 | S02-F | `ui-otel-rum-frontend`, `ui-ms05-otel-rum-dashboards` | `apps/web/lib/otel-rum.ts`, [ADR 0008](../adr/0008-observability-vector-tempo.md) | În curs |
| GT-30 | Prototip CognitiveBrain | **Doar** pattern UX/tokens/tri-pane; fără versiuni/stack din UMD | 01 | S01-A | `ui-prototype-cognitivebrain-reference` | [ui-prototype-cognitivebrain-reference.md](./ui-prototype-cognitivebrain-reference.md) | OK doc |
| GT-31 | Backend + Blueprint | **OpenAPI** + erori + idempotency; aliniat ingress | 02 | — | `api-contract-openapi` | [api-contract-openapi.md](./api-contract-openapi.md), `docs/openapi/openapi.yaml`, [contracts-api-events.md](./contracts-api-events.md) | Complet (spec+gate) |
| GT-32 | Backend §4 | **Webhooks** HMAC + idempotency | 02 | — | `impl-webhooks-hmac-idempotency`, `doc-external-integrations` | `apps/api/src/app/routes/v1/webhooks-inbound.ts`, [external-integrations.md](./external-integrations.md) | În curs |
| GT-33 | Blueprint + runtime | **RBAC** capitole + teste negative | 01 | S01-B | `impl-rbac-suite-chapters`, `e2e-validation` | `apps/api/src/lib/rbac-chapters.spec.ts` | În curs |
| GT-34 | Plan edge | **Cloudflare** DNS/TLS procedură + dovezi operator | 02 | — | `cf-mcp-dns-records-v2`, `cf-mcp-ssl-tls-edge` | [cloudflare-dns-tls-procedure.md](./cloudflare-dns-tls-procedure.md) | Doar doc / operator |
| GT-35 | Plan edge | **Traefik** routere v2 + TLS origine + binding upstream după topologie | 02, 05 | S02-B | `traefik-v2-*`, `doc-deploy-topology-v2-closure` | [traefik-v2-reference.md](./traefik-v2-reference.md), [deploy-topology-v2.md](./deploy-topology-v2.md) | În curs / operator |

---

## Gate-uri CI asociate (dovadă automată)

| Gate | Rând GT vizat |
|------|----------------|
| `compose_no_duplicate_datastores.py` | GT-05 |
| `traefik_no_hazardous_compose_ports.py` | GT-06 |
| `no_critical_placeholders.py` | GT-33 (spirit), S01-B |
| `orchestration_manifests.py` | GT-07 (manifeste gateway) |
| `golden_thread_matrix_gate.py` | integritate acest document |

---

## Istoric

| Data | Modificare |
|------|------------|
| 2026-04-19 | Extindere matrice: surse triple, coloane Compliance + Plan todo, tensiuni research explicite, gate dedicat |
