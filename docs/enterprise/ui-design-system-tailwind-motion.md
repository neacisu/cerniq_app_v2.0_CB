# Design system — tokeni Tailwind, Motion, straturi

**Scop:** task `ui-design-system-tailwind-motion` — token-first **OKLCH**, straturi blueprint §12/§13, **Motion** cu **prefers-reduced-motion**, mapare la prototip `tokens.css` ca inspirație; tooling **ESLint/Prettier**; **stacks-01** (fără presupuneri fără dovadă în repo).

---

## Tokeni (sursă repo)

- **`apps/web/app/global.css`** — tokeni **OKLCH** pe `:root` / `.dark` + mapare `@theme inline` (`bg-cb-surface`, `text-cb-ink`, `border-cb-border`, …); `--spacing-topbar`; script `cerniq-theme-boot` în `layout.tsx` pentru flash minim la încărcare.
- **Prototip** [tokens.css din research](../research/Cerniq.app%20CognitiveBrain/tokens.css) — inspirație spațieri/motion; **nu** copiere integrală în prod fără mapare conștientă.

---

## Straturi (blueprint §12 — model conceptual)

| Strat | Implementare curentă în `apps/web` |
|-------|-----------------------------------|
| Foundations | `global.css`, tema zinc + tokeni `@theme` |
| Controls | butoane nav, `ThemeToggle`, comenzi shell |
| Data / entities | carduri workbench, canvas Brain |
| Surfaces | `AppShell`, `TelemetryTray`, panouri |

---

## Motion

- Pachet **`motion`** (versiune în [frontend-version-pin.md](./frontend-version-pin.md)) — folosit în shell (ex. `motion.header` pentru tranziții ușoare).
- **prefers-reduced-motion:** reguli în `global.css` (durate minime) — aliniere blueprint §11.

---

## Temă light/dark

- `ThemeToggle` + clase Tailwind; egalitate vizuală între moduri — rafinare continuă în Storybook.

---

## ESLint / Prettier

- **ESLint** monorepo — config root / `apps/web`; **Prettier** prin `eslint-config-prettier` unde e cazul ([testing-quality-gates.md](./testing-quality-gates.md)).
- **Husky:** **nu** este prezent în repo la data curentă; hook-uri pre-commit pot fi propuse prin ADR dacă e nevoie.

---

## Verificare

- `pnpm exec nx run web:lint`; Storybook pentru review vizual.
