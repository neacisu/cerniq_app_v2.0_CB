# Inventar suite UI — blueprint §21–§29, §22–§25, §28 vs §18

**Sursă canonică:** [Cerniq_CB_V2_UI_Blueprint_Implementation_Plan_Apr2026_v2_full_suite.md](../research/Cerniq_CB_V2_UI_Blueprint_Implementation_Plan_Apr2026_v2_full_suite.md).

**Produs (§21):** suite **CRM + sales + ops** centrată pe **CognitiveBrain** — Brain = motor; suite = suprafața zilnică.

**Fără contrazicere stacks:** ingress **Traefik**, fără datastore duplicat în compose, API/SSE conform [contracts-api-events.md](./contracts-api-events.md) și stacks-02.

---

## 1. Vocabular înghețat (§28 Phase 0 — extras din blueprint)

Din blueprint **§28 Phase 0**: gateway, neuron, synapse, **account**, **contact**, **opportunity**, **conversation**, **workflow**, **order**, **contract**, **incident**, **run**, **trace** (+ termeni deja folosiți în repo: tenant, workspace, batch, pipeline…).

Termenii canonici UI/API trebuie să coincidă cu OpenAPI și manifeste (`NEURON_MATRIX`, etc.).

---

## 2. Fazare — două linii (§18 Brain vs §28 suite)

| Linie | Secțiune blueprint | Faze | Focus |
|-------|---------------------|------|--------|
| **Brain-centric** | **§18** Phases 0–5 | 0 bootstrap → 5 atlas/polish | Shell, design system, Overview/Live, gateway/neuron/synapse, topology, traces, memory |
| **Suite completă** | **§28** Phases 0–5 | 0 fondare → 5 hardening enterprise | Taxonomie capitole, homes per capitol, workbench-uri flagship, ops, analytics, QA |

**Regulă:** nu începeți capitole business dense (§28 Faza 2+) înainte de **§28 Faza 0–1** (shell + design system + homes) — vezi plan `ui-blueprint-phased-milestones`.

---

## 3. Taxonomie capitole §22 → rută UI țintă → todo / epic

| §22 | Capitol (denumire blueprint) | Prefix rută țintă | Todo plan (mapare) | Status livrare |
|-----|------------------------------|-------------------|----------------------|----------------|
| 22.1 | Home and workspace | `/home/*` | `ui-chapter-home-workspace` | În curs / ADR |
| 22.2 | CognitiveBrain core | `/brain/*` | `ui-chapter-brain-core-pages`, `ui-api-routes-sse-telemetry` | În curs |
| 22.3 | Data ingest and enrichment | `/ingest/*` | `ui-chapter-ingest-enrichment`, `impl-import-domain-validation` | În curs / ADR |
| 22.4 | CRM and customer intelligence | `/customers/*` | `ui-chapter-crm-intelligence` | Pending epic |
| 22.5 | Unified Inbox and communications | `/inbox/*` | `ui-chapter-inbox-communications` | Pending epic |
| 22.6 | Sales pipeline and revenue execution | `/sales/*` | `ui-chapter-sales-revenue` | Pending epic |
| 22.7 | Workflow automation and orchestration | `/workflows/*` | `ui-chapter-workflows-automation`, Temporal | Pending epic |
| 22.8 | Operations and business execution | `/operations/*` | `ui-chapter-ops-execution` | Pending epic |
| 22.9 | Analytics, telemetry, and decision intelligence | `/analytics/*` | `ui-chapter-analytics-intelligence` | Pending epic |
| 22.10 | Administration, governance, and security | `/admin/*` | `ui-chapter-admin-security`, `auth-adr-impl` | În curs / ADR |

**Excludere:** pagină/capitol poate fi **ADR Deferred** cu criteriu măsurabil și dată țintă.

---

## 4. Inventar pagini §23 (rezumat către blueprint)

Secțiunile **23.1–23.10** din blueprint listează paginile pe capitol (Home workspace, Brain Overview/Live/Gateways/… , Ingest, CRM, Inbox, Sales, Workflows, Ops, Analytics, Admin). **Detaliul enumerărilor** rămâne în fișierul blueprint (sursă); acest inventar impune doar **trasabilitate**: fiecare pagină țintă are rând în backlog sau **ADR Excluded**.

---

## 5. Șabloane chapter §24

| §24 | Șablon | Folosire |
|-----|--------|----------|
| 24.1 | Data ingest | Imports, mapping, validation |
| 24.2 | Customer 360 | Account, contacts, opportunities |
| 24.3 | Unified Inbox | Thread, composer |
| 24.4 | Pipeline and opportunity | Deal room, forecast |
| 24.5 | Workflow and operations | Run queue, approvals |
| 24.6 | Executive analytics | KPI, drill-down |

---

## 6. Navigație două niveluri (§25)

- **Primar:** capitole (Home, Brain, Ingest, Customers, … Admin).
- **Secundar:** secțiuni locale per capitol; breadcrumbs semantice business vs Brain.

---

## 7. Legături monorepo

- Shell: `apps/web/app/(shell)/`, [frontend-version-pin.md](./frontend-version-pin.md).
- OpenAPI: `docs/openapi/openapi.yaml`.
- Golden thread: [golden-thread-matrix.md](./golden-thread-matrix.md).
