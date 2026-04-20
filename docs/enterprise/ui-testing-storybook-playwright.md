# Testare UI — Jest, Playwright, Storybook, axe

**Scop:** task `ui-testing-storybook-playwright` — piramidă teste pentru `apps/web`; **Storybook 10**; **Playwright** E2E; **axe** (Jest + addon Storybook); aliniere blueprint §3/§17; observație **Vitest** vs **Jest**.

---

## Unit / integrare

- **Jest** + Testing Library — `apps/web/specs/**/*.tsx`, `apps/web/lib/**/*.spec.ts`.
- **Nu** folosim **Vitest** pentru pachetul `web` în starea curentă a repo-ului — blueprint care menționează Vitest este reconciliat prin [frontend-version-pin.md](./frontend-version-pin.md) și [ui-stack-adr-next-nx.md](./ui-stack-adr-next-nx.md).

---

## Storybook

- Versiune **10.3.x** — `apps/web/package.json`; config `.storybook/main.ts`, `preview.tsx`.
- **@storybook/addon-a11y** — parametru a11y; build Storybook în CI (`.github/workflows/ci.yml`).

---

## Playwright (E2E)

- Proiect **`web-e2e`** — `apps/web-e2e/playwright.config.ts`, `webServer` pornește `nx run web:start`.
- Browser: Chromium în CI; multi-browser opțional local.

---

## Axe (accesibilitate)

- **jest-axe** + **axe-core** în teste componentă unde e cazul.
- Storybook **a11y** pentru feedback vizual în dezvoltare.

---

## Praguri bundle / Lighthouse

- Fișier țintă (documentare + tracking): `apps/web/perf-budgets.json` — praguri orientative LCP/CLS/TBT aliniate blueprint §19; **CI** rulează Jest + Playwright + Storybook — Lighthouse complet rămâne job opțional pe mediu cu browser dedicat sau ADR.

---

## NEURON_MATRIX / codegen

- Meniuri sau codegen din **`packages/manifests/NEURON_MATRIX.csv`** — când UI consumă manifeste, folosiți [generators-manifests.md](./generators-manifests.md).

---

## Verificare

- `pnpm exec nx run-many -t test --projects=web`; `pnpm exec nx run web-e2e:e2e`; `pnpm --filter web build-storybook`.
