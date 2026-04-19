# Mapare legacy / prototip → Next (fără migrare 1:1)

| Prototip CognitiveBrain | Țintă Next (monorepo) | Notă |
|-------------------------|----------------------|------|
| `tokens.css` | `apps/web/app/global.css` + Tailwind `@theme` | Pattern OKLCH, nu copy-paste orb |
| `shell.jsx` | `apps/web/components/shell/app-shell.tsx` | Rail + topbar + tray |
| `overview.jsx` | `/brain/overview` | BrainCanvas + inspector |
| `live.jsx` | `/brain/live` | SSE `/api/live` |
| `gateways.jsx` | `/brain/gateways` | Listă gateway |
| `components.jsx` | `components/brain/*`, Storybook | Organisme atomice |

**Nu se portează:** UMD React 18 + Babel în browser — înlocuit cu build Next 16.

Milestone-uri: vezi [ui-blueprint-phased-milestones.md](./ui-blueprint-phased-milestones.md).
