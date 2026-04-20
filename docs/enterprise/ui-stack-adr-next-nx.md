# Stack UI: Next în Nx — ADR tehnic și blueprint

**Scop:** task `ui-stack-adr-next-nx` — aliniere **ADR**, **blueprint** §3/§5/§14/§16 și implementare reală din **`apps/web`**.

---

## ADR și surse canonice

| Artefact | Rol |
|----------|-----|
| [ADR-0002](../adr/0002-next-in-nx-blueprint-baseline.md) | Next App Router în monorepo **@nx/next**; **Vite interzis** ca shell principal |
| [ADR-0009](../adr/0009-pinned-ui-versions-strategy.md) | Strategie pin versiuni dacă Nx întârzie o majoră Next |
| [frontend-version-pin.md](./frontend-version-pin.md) | Versiuni efective (Next 16.2.x, React 19.2.x, Tailwind 4.2.x, Motion 12.x, Storybook 10.x) |

---

## Arhitectură aplicație

- **App Router** — grup rute `(shell)/` pentru shell multi-capitol; **Route Handlers** `app/api/*` pentru SSE/proxy (blueprint §16).
- **RSC:** layout-uri și pagini server unde nu e nevoie de stare client; **client components** (`'use client'`) pentru SSE live, shell interactiv, tray, palette.
- **Cache Components:** adoptare incrementală unde suportă Next 16 — fără a forța cache pe rute cu SSE sau cookie sensibile fără analiză.
- **Telemetrie SSE:** `useBrainSse` + `GET /api/live` — vezi [ui-sse-optimistic-realtime.md](./ui-sse-optimistic-realtime.md).

---

## Testare (repo real)

- **Unit/integrare UI:** **Jest** (`apps/web/specs`, `lib/*.spec.ts`) — în monorepo **nu** este folosit **Vitest** pentru `web`; textul blueprint care menționează Vitest este **superseded** de [frontend-version-pin.md](./frontend-version-pin.md).
- **E2E:** **Playwright** — `apps/web-e2e`, preset Nx.
- **Storybook:** 10.x — `apps/web/.storybook`, scripturi în `apps/web/package.json`.

---

## Deploy și Traefik

- **SSR / Node standalone** vs static: decis la build Next; terminare TLS la **Traefik** — [deploy-topology-v2.md](./deploy-topology-v2.md), plajă **25xxx** [port-matrix-v2-25xxx.md](./port-matrix-v2-25xxx.md).

---

## «Cerniq Liquid Cognitive»

- Tokeni și shell: [ui-prototype-cognitivebrain-reference.md](./ui-prototype-cognitivebrain-reference.md), `app/global.css` `@theme`.

---

## Verificare

- Build: `pnpm exec nx run web:build`; gate `frontend_version_pins.py`.
