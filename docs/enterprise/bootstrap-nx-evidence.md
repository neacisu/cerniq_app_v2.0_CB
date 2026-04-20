# Dovadă bootstrap Nx + pnpm (raport backend canonic)

**Scop:** monorepo conform [ADR 0001](../adr/0001-nx-pnpm-canonical.md) + blueprint §16; **fără Vite** ca shell UI; integrare stacks-01–03, 05.

## Artefacte verificabile în repo

| Cerință | Dovadă |
|---------|--------|
| Nx + pnpm | `nx.json`, `pnpm-workspace.yaml`, root `package.json` (`packageManager`) |
| `apps/api` Fastify | `apps/api/src/main.ts`, plugin-uri sub `apps/api/src/app/` |
| `apps/web` Next.js App Router `@nx/next` | `apps/web/next.config.js`, plugin Nx în `nx.json` |
| Route group `(shell)` | `apps/web/app/(shell)/` |
| Route Handlers `app/api/*` | `apps/web/app/api/live`, `telemetry`, `command` (+ contract [ui-api-routes-sse-telemetry.md](./ui-api-routes-sse-telemetry.md)) |
| Pachete `neurons` / `synapses` / `gateways` / `shared` | `packages/neurons/`, `packages/synapses/`, `packages/gateways/`, `packages/shared/` |
| Generatoare | `tools/generators/generate_from_matrix.py`, `packages/manifests/` |
| Prim exemplu neuron / sinapsă / gateway | `neuron-ping`, `synapse-ping`, `gateway-hello` |
| Fără stack UMD prototip | Prototipul rămâne doar referință UX — [ui-prototype-cognitivebrain-reference.md](./ui-prototype-cognitivebrain-reference.md) |

## Comenzi audit (stacks-01)

```bash
pnpm exec nx graph
pnpm exec nx run-many -t build --projects=api,web
python3 tools/ci/run_gates.py
```

## TanStack Router

**Nu** este adăugat în `apps/web` — **Next App Router** acoperă rutele (blueprint §7 opțional); orice introducere viitoare necesită ADR.
