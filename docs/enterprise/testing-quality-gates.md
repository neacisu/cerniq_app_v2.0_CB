# Piramidă teste și praguri CI

**Scop:** aliniere **stacks-01** (date de test validate, fără presupuneri), **stacks-02** (fără Testcontainers Postgres/Redis duplicate în proiect — preferă contract tests, mediu shared sau staging), **stacks-03** (job-uri CI compatibile memorie **lxc-ci-worker** ~8 GiB).

**Legături:** [compliance-stacks-01-05.md](../compliance-stacks-01-05.md), [orchestration-matrix.md](./orchestration-matrix.md), `.github/workflows/ci.yml`.

---

## Piramidă (țintă)

| Nivel | Rol în monorepo | Comenzi tipice |
|-------|-----------------|----------------|
| **Unit / integrare** | Jest (`apps/*`, `packages/*`), Python `unittest` (`tools/ci`, `tools/generators`) | `pnpm exec nx run-many -t test --all` |
| **Gates stacks** | Python `tools/ci/run_gates.py` — compose, Traefik, manifeste, OpenAPI, enterprise docs | `python3 tools/ci/run_gates.py` |
| **E2E UI** | Playwright (`web-e2e`) — smoke shell, Brain, API route handlers Next | `pnpm exec nx run web-e2e:e2e`; config `apps/web-e2e/playwright.config.ts` |
| **Build** | Next + Fastify + libs | `pnpm exec nx run-many -t build --projects=api,web,...` |

**Nu** introducem în CI **Testcontainers** pentru Postgres/Redis duplicate față de stacks-02 fără ADR; testele care folosesc **`ioredis-mock`** (ex. `LlmQuotaGuard`) rămân în memorie, fără daemon rețea.

---

## Praguri și memorie CI

- **Node heap:** `NODE_OPTIONS=--max-old-space-size=6144` în GitHub Actions pentru build/test (reduce OOM pe runner-uri mici).
- **Acoperire cod:** țintă incrementală — module noi critice (auth, tenant, cote) cu teste dedicate; prag global **nu** este impus automat până la baseline (Sonar/repozitoriu).
- **Format:** stil prin **ESLint** + `eslint-config-prettier`; formatare automată Prettier opțională prin ADR dacă se adoptă repo-wide.

---

## Dovezi audit

| Gate | Fișier |
|------|--------|
| Orchestrare gateway | `tools/ci/gates/orchestration_manifests.py` |
| Stream sinapse unic | `tools/ci/gates/synapse_matrix_unique_streams.py` |
| Pin UI | `tools/ci/gates/frontend_version_pins.py` |
| Fără placeholder critic (stacks-01) | `tools/ci/gates/no_critical_placeholders.py` |
| Compose fără datastore duplicate (stacks-02) | `tools/ci/gates/compose_no_duplicate_datastores.py` |
| Traefik / fără porturi haotice (stacks-02) | `tools/ci/gates/traefik_no_hazardous_compose_ports.py` |
| Smoke CI (subset gate-uri) | `tools/ci/test_gates_smoke.py` (`unittest`) |

---

## Blueprint §19 (UI)

Scenarii E2E smoke: navigare Brain, tray SSE, workbench flagship, `/api/telemetry` — vezi `apps/web-e2e/src/cerniq.spec.ts`. Teste **Redis live + Temporal** în CI necesită mediu cu servicii reale (staging) sau job dedicat — nu sunt înlocuitoare pentru `docker-compose` local cu datastore-uri duplicate.
Task-ul plan `e2e-validation` (tenant/import/cote LLM în flux integrat cu Redis+Temporal) rămâne **deschis** până la rulare aceste acceptanțe pe staging sau în pipeline cu servicii reale; smoke-ul CI acoperă doar UI și rute Next/contracte.
