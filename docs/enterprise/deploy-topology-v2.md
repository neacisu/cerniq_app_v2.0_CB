# Topologie deploy v2 — închidere variante A/B

## Subdomenii (HTTPS)

| Host | Serviciu | Upstream țintă |
|------|----------|----------------|
| `v2.cerniq.app` | Web UI | Varianta A: `127.0.0.1:25000` pe orchestrator; B: LXC Cerniq `10.0.1.109/110:64000` |
| `api.v2.cerniq.app` | API | A: `:25010`; B: `64xxx` API pe LXC |
| `admin.v2.cerniq.app` | Admin | A: `:25012`; B: `64012` |

## Varianta A — servicii pe orchestrator (plaja 25xxx)

| Host fizic | Traefik router | Upstream |
|------------|----------------|----------|
| orchestrator `77.42.76.185` | `Host(v2.cerniq.app)` | `http://127.0.0.1:25000` |
| orchestrator | `Host(api.v2.cerniq.app)` | `http://127.0.0.1:25010` |
| orchestrator | `Host(admin.v2.cerniq.app)` | `http://127.0.0.1:25012` |

Rețea: containerele aplicație pe `traefik_default` sau host network conform stacks-02.

## Varianta B — upstream LXC Cerniq (64xxx)

Conform stacks-05 B2/B3: mapare VIP `19xxx`/`29xxx` către `10.0.1.110/109:64xxx`. Pentru **v2** explicit, Traefik poate ruta direct către IP LXC și port `64xxx` dacă procesele rulează acolo — documentat în CMDB, fără conflict cu plaja `25xxx` orchestrator.

## Next.js SSR vs static

- **SSR / standalone:** recomandat pentru shell autentificat și date live.
- **Export static:** doar pentru subsisteme fără cookie sesiune; nu este ținta principală pentru CognitiveBrain.

## Dev

- `hz.164` — flux cerniq-dev; conectare la servicii shared conform [local-dev-story.md](./local-dev-story.md).
