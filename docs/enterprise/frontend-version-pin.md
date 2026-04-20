# Pin versiuni frontend — baseline blueprint Apr 2026

**Scop:** versiuni **țintă blueprint** (§3 / §17) reconciliate cu **`@nx/next`** și monorepo real; **sursa de adevăr pentru CI** = `package.json` + **`pnpm-lock.yaml`** (`pnpm install --frozen-lockfile`).

**ADR:** [0009-pinned-ui-versions-strategy.md](../adr/0009-pinned-ui-versions-strategy.md) — strategie dacă pluginul Nx întârzie o majoră Next.

---

## Tabel reconciliere (audit repo — actualizați la fiecare bump)

| Pachet | Țintă blueprint (Apr 2026) | Valoare în repo (exemplu) | Observație |
|--------|----------------------------|---------------------------|------------|
| `next` | 16.2.4 | `^16.2.4` (root + `apps/web`) | Aliniat |
| `react` / `react-dom` | 19.2.x | `^19.2.5` | Aliniat |
| `tailwindcss` | 4.2.2 | `^4.2.2` în `apps/web` | Aliniat |
| `@tailwindcss/postcss` | (bundle Tailwind v4) | `^4.2.2` | OK |
| `motion` | 12.38.0 | `^12.38.0` | Aliniat |
| `@tanstack/react-query` | 5.99.1 | `5.99.1` exact în `apps/web` | Aliniat; gate `frontend_version_pins.py` |
| `zustand` | 5.0.10 | `5.0.10` exact în `apps/web` | Aliniat; gate `frontend_version_pins.py` |
| `axe-core` | (transitiv a11y) | `4.11.3` explicit în `apps/web` | CI: Jest `jest-axe` + Storybook addon-a11y |
| `storybook` / `@storybook/nextjs` | 10.3.5 | `^10.3.5` în `apps/web` | Aliniat |
| `typescript` | (research backend ~5.3; monorepo) | `~5.9.3` devDependency root | Versiune workspace; nu contrazice blueprint UI |

## Nx / `@nx/next`

- **Workspace:** `nx` **21.6.11**, `@nx/next` **21.6.11** (root `package.json`).
- **Compatibilitate:** build `web` + CI trebuie să rămână verzi după orice upgrade Nx/Next.

## Tensiune „Next 14” (research UI) vs blueprint **Next 16**

- Textul vechi din research UI (Next 14+) este **superseded** de blueprint Next **16** + acest document + **ADR 0009**.
- Lockfile și `apps/web` sunt autoritatea pentru ce rulează în CI.

## Procedură upgrade

1. Branch dedicat; editați `package.json` (`apps/web` și/sau root) + `pnpm install` → lockfile nou.
2. `pnpm exec nx sync`; `pnpm exec nx run-many -t lint,typecheck,test,build --projects=web` (+ `api` dacă atins).
3. Dacă există compromis de versiune față de blueprint: secțiune nouă în **ADR 0009** sau ADR succesor.

## Turbo vs Nx

- **Nx** este orchestratorul monorepo — vezi [ADR 0001](../adr/0001-nx-pnpm-canonical.md). **Turbo** din texte vechi UI = doar ergonomie pnpm, nu înlocuitor Nx.
