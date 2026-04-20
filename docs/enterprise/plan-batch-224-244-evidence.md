# Dovadă livrare — plan YAML `224–244` (impl-* + ui-ms01 / ui-ms02)

**Scop:** trasabilitate **stacks-01** (fără „completed” fără dovadă): fiecare todo din frontmatter are artefact în repo și comandă de audit reprodusă din rădăcina `cerniq_app_v2_CB/`.

**Nu înseamnă:** acoperire 100% linii de cod pe întreg monorepo-ul (nu e prag în `run_gates.py`); înseamnă implementare + teste relevante + contracte unde există OpenAPI.

| ID plan | Artefact principal | Teste / audit |
|---------|-------------------|---------------|
| `impl-llm-router-package-four-endpoints` | `packages/llm/src/lib/llm-router.ts`, `llm-fetch.ts`, `llm-router.spec.ts` | `pnpm exec nx run @cerniq/llm:test` |
| `impl-otel-prometheus-api-instrumentation` | `apps/api/src/otel-init.ts`, `apps/api/src/main.ts`, `apps/api/src/app/routes/metrics.ts`, `apps/api/src/app/lib/cerniq-metrics.ts`, `apps/api/src/otel-init.spec.ts` | `pnpm exec nx run api:test`; metrici Prometheus: `GET /metrics` (inject în `contract-openapi-routes.spec.ts`) |
| `impl-api-rest-sse-handlers-contract` | `docs/openapi/openapi.yaml`, `apps/api/src/app/routes/v1/cognitive*.ts`, `apps/web/app/api/live/route.ts`, `apps/web/app/api/telemetry/route.ts`, `apps/api/src/app/contract-openapi-routes.spec.ts` | `python3 tools/ci/run_gates.py` (gate `openapi_paths_sync_gate`); `pnpm exec nx run api:test` |
| `impl-webhooks-hmac-idempotency` | `apps/api/.../webhooks-inbound.ts`, `apps/api/.../webhooks-inbound.spec.ts`, `apps/api/src/lib/webhook-inbound-redis.ts`, `packages/shared/src/lib/webhook-outbound.ts` | `pnpm exec nx run api:test`; `pnpm exec nx run @cerniq/shared:test`; doc: [external-integrations.md](./external-integrations.md) |
| `impl-rbac-suite-chapters` | `apps/api/src/lib/rbac-chapters.ts`, `apps/api/src/app/plugins/35-jwt-auth.ts`, `apps/api/src/app/routes/v1/me.ts`, `me.spec.ts`, `rbac-chapters.spec.ts` | `pnpm exec nx run api:test` — teste negative JWT/tenant în `me.spec.ts`; **e2e** complet stack: todo plan `e2e-validation` + [testing-quality-gates.md](./testing-quality-gates.md) |
| `ui-ms01-setup-layout-shell` | `apps/web/components/shell/app-shell.tsx`, `apps/web/app/(shell)/layout.tsx`, `lib/chapters.ts` | `pnpm exec nx run web:test`; smoke Playwright: `apps/web-e2e/src/cerniq.spec.ts` |
| `ui-ms02-braincanvas-inspector-static` | `apps/web/components/brain/brain-canvas.tsx`, `neuron-inspector.tsx`, `brain-overview-panel.tsx`, `specs/brain-overview-panel.spec.tsx` | `pnpm exec nx run web:test --testPathPatterns=brain-overview` |

**Gate minim (regulă `cerniq-todo-enterprise-gates`):** `python3 tools/ci/run_gates.py` + `pnpm exec nx run-many -t lint,typecheck,test --projects=api,web,@cerniq/llm,@cerniq/shared` (sau echivalent `run-many --all` la PR).
