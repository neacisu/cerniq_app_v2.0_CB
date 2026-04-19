# Cerniq App V2 CB

Monorepo **Nx + pnpm**: `apps/api` (Fastify), `apps/web` (Next.js App Router), pachete `packages/*`. Documentație research în `docs/research/`.

## Comenzi

| Comandă | Rol |
|--------|-----|
| `pnpm install` | Dependențe |
| `pnpm run build` | Build `api` + `web` |
| `pnpm run lint` | ESLint pe proiecte |
| `pnpm run test` | Jest (unit) |
| `pnpm run e2e` | Playwright (Chromium, `CI=1`) |
| `pnpm run gen:matrix` | Generează stub-uri din `packages/manifests/*.csv` |

## Generatoare manifest

Vezi `tools/generators/README.md` și `packages/manifests/`. Script canonic: **python3** `tools/generators/generate_from_matrix.py`.

## Migrații DB

SQL versionat în `db/migrations/` — aplicare pe Postgres central (stacks-02), nu din compose proiect.

## Infra (Faza 0)

`infra/README.md` — integrare Traefik, redis-shared, OpenBao, fără datastore-uri duplicate în compose.

## CI

Workflow GitHub Actions: `.github/workflows/ci.yml` (lint, build, test, e2e). Pe runner Ubuntu: `playwright install-deps chromium` este inclus.

**Nx Cloud** (opțional): `nx connect` + secret `NX_CLOUD_ACCESS_TOKEN` în GitHub.

## GitHub — remote și push

Repo-ul local are `main` și branch-ul `work/Bootstrap`. **Remote-ul GitHub** se adaugă după crearea repository-ului pe github.com:

```bash
git remote add origin https://github.com/<org>/<repo>.git
git checkout main
git push -u origin main
git checkout work/Bootstrap
git push -u origin work/Bootstrap
```

Lucrul curent se face pe **`work/Bootstrap`**; integrarea în `main` prin PR. **Nu** comitați secrete; folosiți `.env.example` ca șablon.
