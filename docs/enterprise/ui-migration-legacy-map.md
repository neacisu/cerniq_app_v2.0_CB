# Mapare prototip CognitiveBrain → Next.js shell (fără migrare mecanică)

**Scop:** inventar **artefacte** din [Cerniq.app CognitiveBrain/](../research/Cerniq.app%20CognitiveBrain/) + corespondență către **rute** și **componente** din `apps/web`, aliniat [ui-blueprint-phased-milestones.md](./ui-blueprint-phased-milestones.md). Blueprint: **nu** portare directă UMD/HTML — doar **pattern-uri** (tri-pane, tokens, telemetrie).

**Legături:** [ui-prototype-cognitivebrain-reference.md](./ui-prototype-cognitivebrain-reference.md), [ui-chapter-shell-full-suite.md](./ui-chapter-shell-full-suite.md), `apps/web/lib/chapters.ts`.

---

## 1. Inventar sursă (prototip)

| Fișier / artefact | Rol în prototip |
|-------------------|-----------------|
| `tokens.css` | Tokeni OKLCH, motion, densitate |
| `shell.jsx` | Rail, top bar, zone workspace |
| `overview.jsx` | Health / overview Brain |
| `live.jsx` | Flux live / telemetrie |
| `gateways.jsx` | Gateway-uri |
| `components.jsx` | Carduri, liste, panouri |
| `Cerniq CB V2.html` | Shell exploratoriu (referință unică, nu sursă de build) |

---

## 2. Mapare prototip → rute Next (App Router)

Rute canonice din **`lib/chapters.ts`** (grup `(shell)/[chapter]/[[...path]]`).

| Prototip | Rută țintă `apps/web` | Componente / zone relevante |
|----------|----------------------|-----------------------------|
| `tokens.css` | Global — toate rutele | `app/global.css` (`@theme`, variabile `--color-cb-*`, `--spacing-topbar`) |
| `shell.jsx` | `/(shell)/*` | `components/shell/app-shell.tsx`, `CommandPalette`, `TelemetryTray` |
| `overview.jsx` | `/brain/overview` | `BrainCanvas`, workbench capitol Brain în `(shell)/[chapter]/[[...path]]/page.tsx` |
| `live.jsx` | `/brain/live` | `useBrainSse`, legături către `/api/live` |
| `gateways.jsx` | `/brain/gateways` | `brain-cross-links`, gateway → neuron → trace |
| `components.jsx` | Multiple (per capitol) | `components/brain/*`, `components/shell/*`, Storybook |
| `Cerniq CB V2.html` | — | Doar referință UX istorică; **fără** import în pipeline Next |

---

## 3. Aliniere fazare (milestones)

| Zonă prototip | Fază Brain §18 (A) | Fază suite §28 (B) | Todo repo (exemplu) |
|---------------|--------------------|--------------------|---------------------|
| Shell + tokens | 0–1 | 0–1 | `ui-chapter-shell-full-suite`, `ui-design-system-tailwind-motion` |
| Overview / live / gateways | 1–2 | 2–3 | `ui-api-routes-sse-telemetry`, `ui-organisms-brain-sse-toolbar` |
| Componente listă / card | 2+ | 2–3 | `ui-business-workbenches-flagship`, Storybook |

---

## 4. Reguli de migrare (enterprise)

- **Nu** copia JSX-ul prototipului: folosiți **aceleași rute** și **contracte** (`contracts-api-events.md`, OpenAPI backend).
- Orice divergență de URL față de blueprint → **ADR** + actualizare `chapters.ts`.
- Verificare: build `web` + teste Vitest/Playwright pe rutele Brain critice.

---

## 5. Verificare

- Acest document este **sursa de adevăr** pentru maparea legacy → shell; modificările de cod trebuie să rămână trasabile la tabelele de mai sus.
