# Referință prototip CognitiveBrain (UX)

**Locație:** [Cerniq.app CognitiveBrain/](../research/Cerniq.app%20CognitiveBrain/).

## Ce se păstrează (pattern)

| Artefact | Rol în produs Next |
|----------|-------------------|
| `tokens.css` | Inspirație OKLCH, accent, motion, densitate → `apps/web` design tokens + Tailwind theme |
| `shell.jsx` | Rail, top bar ~72px, tri-pane (canvas / inspector / dock) → layout `(shell)/layout.tsx` |
| `overview.jsx`, `live.jsx`, `gateways.jsx` | Fluxuri operator: health, telemetrie live, gateway path → rute `/brain/*` |
| `components.jsx` | Organisme (cards, trays) → Storybook + componente React |

## Ce NU se portează mecanic

- **React 18 UMD + Babel în browser** din prototip — înlocuit cu **Next 16** build pipeline, RSC unde e cazul, client components pentru SSE/live.

## Legătură Nx

- `apps/web/app/(shell)/` — structură recomandată blueprint §16.
- `apps/web/app/api/live`, `telemetry`, `command` — Route Handlers.

## Storybook — „Cerniq Liquid Cognitive”

- Stories pentru shell, tray, neuron inspector — bazate pe tokenii din `tokens.css` ca referință vizuală, nu copy-paste orb.
