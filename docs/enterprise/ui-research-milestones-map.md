# Mapare explicită: milestone-uri research UI (1–7) → AC → ui-ms01…07 → blueprint

**Sursă research:** [deep-research-report_cerniq_ui.md](../research/deep-research-report_cerniq_ui.md) — paragraful „Deliverables & Roadmap” (punctele 1–7) și *Acceptance Criteria* sub fiecare.

**Blueprint — fazare:** [ui-blueprint-phased-milestones.md](./ui-blueprint-phased-milestones.md) (**§18** = Brain-centric, **§28** = suite completă, **§19/§29** = criterii acceptanță citate acolo).

**Inventar suite / capitole:** [ui-blueprint-suite-inventory.md](./ui-blueprint-suite-inventory.md).

**Trasabilitate plan:** [golden-thread-matrix.md](./golden-thread-matrix.md) (ex. **GT-24**, **GT-27**, **GT-29**).

**Reconciliere versiuni UI (Next 14 text research vs repo):** [frontend-version-pin.md](./frontend-version-pin.md) — autoritate **Next 16** + `pnpm-lock.yaml`; textul „Next 14+” din research este **superseded**.

---

## Tabel principal

| # | Milestone research (titlu) | Criterii AC (din research, citat) | Todo monorepo | Blueprint §18 fază Brain | Blueprint §28 fază suite | Doc / epic principal |
|---|---------------------------|-----------------------------------|---------------|--------------------------|---------------------------|----------------------|
| 1 | Setup & Layout | „Can render Brain page layout with placeholders; mobile responsive.” | `ui-ms01-setup-layout-shell` | Faza **0** (shell, routing, tokens) | Faza **0** (fondare produs, nav §25) | [bootstrap-nx-evidence.md](./bootstrap-nx-evidence.md), [ui-chapter-shell-full-suite.md](./ui-chapter-shell-full-suite.md) |
| 2 | Core Components | „Clicking a neuron logs its ID; inspector shows node details.” | `ui-ms02-braincanvas-inspector-static` | Faza **1** (Overview + Live + canvas) | (convergență workbench) | [ui-prototype-cognitivebrain-reference.md](./ui-prototype-cognitivebrain-reference.md) |
| 3 | Styling & Theme | „Switching theme updates all token colors.” | `ui-ms03-theme-tailwind-motion` | Faza **4–5** (polish, motion — aliniat §19) | Faza **5** (hardening — parțial UI tokens) | [frontend-version-pin.md](./frontend-version-pin.md), [ui-design-system-tailwind-motion.md](./ui-design-system-tailwind-motion.md) |
| 4 | Real-time Data | „Streamed ‘heartbeat’ events update a timestamp in UI.” | `ui-ms04-sse-hook-backend` | Faza **1** (telemetrie vizibilă SSE) | Faza **2–3** (telemetrie live workbench) | [ui-api-routes-sse-telemetry.md](./ui-api-routes-sse-telemetry.md), `apps/web/lib/use-brain-sse.ts`, **GT-24** |
| 5 | Observability | „Dashboard shows page load histogram.” | `ui-ms05-otel-rum-dashboards` | Faza **2–3** (traces/gateway) | Faza **5** (SLO, audit) | [observability-slo-alerts.md](./observability-slo-alerts.md), `apps/web/lib/otel-rum.ts`, ADR-0008, **GT-29** |
| 6 | Full Feature | „Import UI can upload CSV with mapping modal, feed into state machine.” | `ui-ms06-pages-topology-neurons-imports` | Faza **2** (topologie, gateways) | Faza **2–3** (Imports / workbench flagship) | [business-tenancy-batch-import.md](./business-tenancy-batch-import.md), [ui-migration-legacy-map.md](./ui-migration-legacy-map.md) |
| 7 | Optimization & QA | Lighthouse / frame budget / ARIA (paragraf research) | `ui-ms07-perf-a11y-budgets` | Faza **4–5** (polish, A11y §19) | Faza **5** (hardening enterprise §29) | [frontend-version-pin.md](./frontend-version-pin.md) (jest-axe, Storybook), [ui-testing-storybook-playwright.md](./ui-testing-storybook-playwright.md) |

---

## Reconciliere research vs autoritate repo (fără presupuneri server)

| Subiect | Text research | Decizie repo / ADR |
|---------|---------------|-------------------|
| Next.js | „14.x” / „14 app” | **Next 16** — [frontend-version-pin.md](./frontend-version-pin.md), ADR-0002/0009 |
| Monorepo | „pnpm + Turborepo” | **pnpm + Nx** — [ADR-0001](../adr/0001-nx-pnpm-canonical.md) |
| Test runner UI | Vitest (mențiune) | **Jest** în monorepo actual; migrare = ADR + plan separat |
| OTel browser | metrici RUM | `otel-rum.ts` + env `NEXT_PUBLIC_*` — [ui-otel-rum-frontend.md](./ui-otel-rum-frontend.md); backend trace correlation: **W3C headers**, nu duplicare Collector în `apps/api` |

**DoD:** orice increment care atinge milestone-uri de mai sus actualizează [definition-of-done.md](./definition-of-done.md) și [compliance-stacks-01-05.md](../compliance-stacks-01-05.md) când atinge reguli stacks.
