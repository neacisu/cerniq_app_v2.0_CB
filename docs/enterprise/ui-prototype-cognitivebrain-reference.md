# Referință prototip CognitiveBrain → producție Next (Nx)

**Sursă:** [Cerniq.app CognitiveBrain/](../research/Cerniq.app%20CognitiveBrain/) (artefacte HTML/JS exploratorii).

**Scop:** fixează ce pattern-uri UX se **păstrează** în monorepo-ul Nx (`apps/web`), ce rămâne **referință vizuală** pentru Storybook și tokeni **«Cerniq Liquid Cognitive»**, și ce **nu** se portează mecanic din prototip.

**Mapare extinsă (inventar + milestones):** [ui-migration-legacy-map.md](./ui-migration-legacy-map.md).

---

## Mapare fișiere prototip → implementare

| Prototip | Conținut relevant | În `apps/web` (Next 16 App Router) |
|----------|-------------------|-------------------------------------|
| `tokens.css` | OKLCH, accent, `--dur-*`, `--ease-*`, densitate 4pt, fonturi display/body/mono | `app/global.css`: `@theme` cu `--color-cb-surface`, `--color-cb-ink`, `--color-cb-accent` (OKLCH), `--spacing-topbar: 4.5rem`; `prefers-reduced-motion` pentru motion safe |
| `shell.jsx` | Rail, top bar înaltă, zone workspace, tray | `components/shell/app-shell.tsx`: header nav primară, rail secundar, `main`, `TelemetryTray`, `CommandPalette` (Cmd+K) |
| `overview.jsx` / `live.jsx` / `gateways.jsx` | Flux operator: health, live SSE, gateway | Rute `/brain/overview`, `/brain/live`, `/brain/gateways` din `lib/chapters.ts`; workbench Brain în `(shell)/[chapter]/[[...path]]/page.tsx` pentru `overview` |
| `components.jsx` | Cards, panouri, liste | Componente React (`components/brain/*`, `components/shell/*`) + **Storybook** (vezi mai jos) |

---

## Ce se păstrează (pattern enterprise)

- **Tri-pane (conceptual):** zonă principală (canvas / listă) + **inspector** lateral (ex. `NeuronInspector` lângă `BrainCanvas` pe `/brain/overview`) + **telemetrie** în **telemetry tray** fixă jos (`TelemetryTray` + `BrainStatusPanel`).
- **Telemetrie live:** client SSE către `GET /api/live` (Route Handler), aliniat cu contractul API pentru stream-ul cognitiv (vezi `contracts-api-events.md`).
- **Shell unic:** aceeași **gramatică** pentru toate capitolele (nav primară + sub-nav per capitol), nu pagini izolate fără shell.

---

## Ce NU se portează mecanic

- **React 18 UMD + Babel în browser** din prototip — înlocuit cu pipeline **Next.js** (build, RSC unde e cazul), **client components** explicite (`'use client'`) pentru interacțiuni (SSE, palette, tray).
- **Copy-paste orb al CSS-ului** din `tokens.css` — se mapează intenționat spre Tailwind v4 `@theme` și clase utilitare; fonturile externe din prototip pot fi adoptate incremental în Storybook, nu obligatoriu în prima iteratie SSR.

---

## Legătură Nx și căi canonice

- Aplicația web: **`apps/web`** (pachet `name: "web"`). Nu există `apps/cerniq-cb-v2-web` în repo; orice rename viitor → **ADR** separat; până atunci sursa canonică rămâne `apps/web`.
- Layout shell: `app/(shell)/layout.tsx` → `AppShell`.
- API Next (blueprint §16): `app/api/live`, `app/api/telemetry`, `app/api/command`.

---

## Storybook — «Cerniq Liquid Cognitive»

- Config: `apps/web/.storybook/main.ts`, `preview.tsx` importă `app/global.css` pentru aliniere tokeni.
- Stories recomandate: shell (header + rail redus), `TelemetryTray`, neuron inspector — folosesc aceleași variabile CSS/tema ca aplicația, nu HTML-ul static al prototipului.

---

## Verificare

- Documentul este referință pentru audit UI vs prototip; modificările de cod trebuie să rămână trasabile la fișierele de mai sus și la `ui-chapter-shell-full-suite.md` / `ui-api-routes-sse-telemetry.md`.
