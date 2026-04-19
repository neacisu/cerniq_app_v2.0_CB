# Inventar suite UI — blueprint §22–§25, §28 vs §18

**Sursă:** [Cerniq_CB_V2_UI_Blueprint_Implementation_Plan_Apr2026_v2_full_suite.md](../research/Cerniq_CB_V2_UI_Blueprint_Implementation_Plan_Apr2026_v2_full_suite.md). **Produs:** suite CRM+sales+ops centrată pe Brain (§21).

## Vocabular înghețat (§28)

gateway, neuron, synapse, trace, tenant, workspace, batch, account, contact, opportunity, workflow, inbox, pipeline — termeni canonici UI/API.

## Fazare

| Linie | Faze | Focus |
|-------|------|-------|
| **Brain §18** | 0–5 | bootstrap shell → atlas/polish cognitive |
| **Suite §28** | 0–5 | fondare produs → hardening enterprise |

Implementare: **nu** începe capitole business dense înainte de suite §28 Faza 0–1 (shell + design system minim).

## Capitol → pagini țintă → epic backend/API

| §22 | Domeniu | Rute UI țintă (prefix) | API / epic |
|-----|---------|------------------------|------------|
| 22.1 | Home & workspace | `/home/*` | notificări, saved views, `GET /v1/me/work` |
| 22.2 | CognitiveBrain | `/brain/*` | cognitive status, stream, topology, traces — OpenAPI + SSE |
| 22.3 | Ingest | `/ingest/*` | batch, mapping, validation, quarantine |
| 22.4 | CRM | `/customers/*` | accounts, contacts, Customer 360, segments |
| 22.5 | Inbox | `/inbox/*` | conversații, composer, SLA |
| 22.6 | Sales | `/sales/*` | pipeline, opportunities, forecast |
| 22.7 | Workflows | `/workflows/*` | catalog, builder, runs, DLQ — Temporal |
| 22.8 | Operations | `/operations/*` | orders, billing, logistics — legături incidents Brain |
| 22.9 | Analytics | `/analytics/*` | dashboards, drill-down trace |
| 22.10 | Admin | `/admin/*` | users, roles, tenant, policies, LLM routing |

## §23 — mapare pagini (rezumat)

- **23.1:** Workspace Home, My Work, Saved Views, Notifications.
- **23.2:** Overview, Live, Gateways, Gateway detail, Neuron, Synapse, Topology, Traces, Memory, Settings, Incident.
- **23.3:** Imports, Connectors, Mapping, Validation, Quarantine, Audit.
- **23.4:** Accounts, Contacts, Customer 360, Graph, Segments.
- **23.5:** Inbox, Thread, Composer, SLA.
- **23.6:** Pipeline, Opportunity, Deal room, Forecast.
- **23.7:** Catalog, Builder, Run queue, DLQ, Approvals.
- **23.8:** Orders, Contracts, Billing, Logistics, Churn, Referrals.
- **23.9:** Executive, Operational, Drill-down.
- **23.10:** Users, Roles, Tenant, Policies, Model routing, Audit log, Retention.

Fiecare rând: **implementat** în cod sau **ADR Deferred** cu criteriu și dată țintă.

## Șabloane §24

Mapare la componente: ingest §24.1, Customer 360 §24.2, Inbox §24.3, Pipeline §24.4, Workflow §24.5, Analytics §24.6.

## Nav două niveluri (§25)

Primar: capitole din tabelul §22. Secundar: sub-nav per capitol din §23; breadcrumbs semantice (business vs Brain).

## Fără contrazicere stacks

- Ingress Traefik; fără datastore local; SSE/API prin același edge policy ca [contracts-api-events.md](./contracts-api-events.md).
