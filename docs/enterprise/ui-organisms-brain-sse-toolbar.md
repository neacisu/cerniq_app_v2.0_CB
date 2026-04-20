# Organisme UI — Brain, SSE, toolbar, workbench

**Scop:** task `ui-organisms-brain-sse-toolbar` — mapare componente reale la blueprint §12/§14/§27; pattern **tri-pane**; contracte **TypeScript**; **ARIA** / WCAG 2.2 țintă; **TelemetryTray** jos; Storybook unde există stories.

---

## Componente (dovadă căi)

| Nume blueprint (exemplu) | Fișier repo | Rol |
|--------------------------|-------------|-----|
| GatewayPathCanvas / canvas | `components/brain/brain-canvas.tsx` | Noduri demo gateway/neuron/sinapsă |
| Neuron inspector | `components/brain/neuron-inspector.tsx` | Panou detaliu neuron |
| TelemetryTray | `components/shell/telemetry-tray.tsx` | Tray jos, toggle |
| Brain cross-links | `components/shell/brain-cross-links.tsx` | Legături trace/gateway |
| Brain status | `components/brain-status-panel.tsx` | Conținut tray telemetrie |
| Command palette | `components/shell/command-palette.tsx` | Cmd+K |
| Flagship workbench | `components/workbench/flagship-workbench.tsx` | Demo workbench suite |

**Extindere suite §27** (AccountCard, …): se adaugă incremental sub `components/` + capitole; acest document fixează **pattern-ul** și locația.

---

## Tri-pane

- Zonă principală (canvas / conținut) + **inspector** lateral unde e cazul + **telemetrie** în tray — exemplu pagină Brain overview: `app/(shell)/[chapter]/[[...path]]/page.tsx`.

---

## SSE

- Hook **`useBrainSse`** — [ui-sse-optimistic-realtime.md](./ui-sse-optimistic-realtime.md).

---

## ARIA / WCAG 2.2

- Skip link și `aria-label` pe nav în `app-shell.tsx`; tray `role="region"` + `aria-label` în `telemetry-tray.tsx`. Audit continuu: **jest-axe** / Storybook **a11y** addon.

---

## Storybook

- `brain-canvas.stories.tsx`, `flagship-workbench.stories.tsx` — extindeți pentru organisme noi.

---

## Virtualizare graf

- Pentru grafuri mari: adoptare ulterioară (ex. bibliotecă dedicată) — criteriu performanță blueprint; canvas curent este demo.

---

## Verificare

- `pnpm exec nx run web:test`; Storybook build în CI (`.github/workflows/ci.yml`).
