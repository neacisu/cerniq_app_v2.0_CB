# Tracking livrare UI — fazare Brain (§18) + fazare suite (§28)

**Scop:** reconciliere roadmap `ui-*` cu blueprint; criterii acceptanță §19 (Brain) și §29 (suite); nu se începe capitol business fără shell + design system minim (§28 Faza 0–1) — vezi [ui-chapter-shell-full-suite.md](./ui-chapter-shell-full-suite.md).

**Legături:** [golden-thread-matrix.md](./golden-thread-matrix.md), [ui-blueprint-suite-inventory.md](./ui-blueprint-suite-inventory.md), ADR [0009](../adr/0009-pinned-ui-versions-strategy.md).

---

## (A) Faze Brain-centric — §18

| Fază | Conținut țintă | Criterii §19 (rezumat) | Todo repo (exemplu) |
|------|----------------|------------------------|---------------------|
| 0 | Bootstrap shell, routing, tokens minim | Build `web` verde, nav Brain | `ui-chapter-shell-full-suite`, `bootstrap-nx` |
| 1 | Overview + Live + canvas de bază | Telemetrie vizibilă (SSE path) | `ui-api-routes-sse-telemetry`, `ui-ms02-braincanvas-inspector-static` |
| 2 | Gateways, topologie, traces | Legături gateway→neuron→sinapsă | `ui-organisms-brain-sse-toolbar` |
| 3 | Memory, settings, incident | Fără PII în client logs | `ui-chapter-brain-core-pages` |
| 4–5 | Polish, atlas, performanță | A11y, motion tokens | `ui-ms07-perf-a11y-budgets` |

---

## (B) Faze suite complet — §28

| Fază | Conținut țintă | Criterii §29 (rezumat) | Todo repo (exemplu) |
|------|----------------|------------------------|---------------------|
| 0 | Fondare produs, IA capitole | Nav două niveluri §25 | `doc-ui-blueprint-suite-inventory` |
| 1 | Homes capitole + CRM de bază | Workbench-uri stub | `ui-chapter-crm-intelligence` |
| 2–3 | **Workbench flagship**: Imports, Customer 360, Unified Inbox, Opportunity, Workflow Run + dovezi Brain | Legături gateway, trace, neuron, telemetrie live | `ui-business-workbenches-flagship` |
| 4 | Integrări, cote, RBAC capitol | API + teste negative | `impl-rbac-suite-chapters` |
| 5 | Hardening enterprise | SLO, audit, DR runbook | `security-baseline`, `docs-adrs-runbooks` |

---

## Pachete UI §17 — referință

Implementare și verificare pin: [frontend-version-pin.md](./frontend-version-pin.md), gate `tools/ci/gates/frontend_version_pins.py`, todo **`ui-packages-tanstack-zustand-storybook`**.

- **Brain-centric** și **suite** împărtășesc același shell Next App Router; fazele sunt **în paralel controlat** după dependențele din tabelul de mai sus.
