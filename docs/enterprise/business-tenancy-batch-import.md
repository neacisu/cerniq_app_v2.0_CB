# Tenancy, Batch, import CSV — domeniu business

**Scop:** model **tenant / org / workspace**; strategie **izolare date** (RLS vs schema vs scoping API) cu **ADR** dacă se abate de la implicit; entitate **Batch** (UI BatchSelector); **validare import CSV** peste mapare câmpuri; **NEURON_MATRIX** → capabilități + RBAC — **fără nume inventate**; dovezi din **manifeste** și CMDB.

---

## Model tenant / org / workspace

| Concept | Semnificație |
|---------|--------------|
| **Tenant** | Boundary principal de date (organizație plătitoare / contract) |
| **Org** | Opțional: sinonim sau strat administrativ peste workspace — definit în schema DB la implementare |
| **Workspace** | Subdiviziune (echipă, brand) opțională sub tenant |
| **Utilizator** | Apartenență la tenant prin membership (`auth_*` — vezi [ADR 0003](../adr/0003-iam-internal-postgres-jwt.md)) |

---

## Izolare date (ADR obligatoriu la schimbare strategie)

| Strategie | Când | Notă |
|-----------|------|------|
| **RLS pe Postgres** (`tenant_id`) | Implicit recomandat monorepo | Validare dublă în API pentru căi critice |
| **Schema per tenant** | Doar cu ADR (operare migrații complexe) | — |
| **Scoping doar în API** (fără RLS) | Doar cu ADR + teste crossing-tenant | Risc mai mare erori aplicație |

---

## Batch (UI **BatchSelector**)

Entitate țintă (model logic, supus ERD):

| Câmp | Rol |
|------|-----|
| `id` | UUID |
| `tenant_id` | Obligatoriu |
| `source` | ex. `csv` |
| `mapping_id` | Referință mapare coloane |
| `state` | `pending` \| `processing` \| `quarantine` \| `done` \| `failed` |
| `stats` | Contoare rânduri ok / erori |

---

## Import CSV

1. **Mapare tehnică** coloane sursă → câmpuri țintă (config versionată).
2. **Validare business** în `apps/api` — reguli domeniu (ex. format telefon, cod fiscal) conform specificației produsului; erori structurate pentru UI.
3. **Quarantine** — rânduri respinse stocate pentru corecție manuală; fără pierdere tăcută.

---

## NEURON_MATRIX → capabilități + RBAC

- **Fișier sursă:** `packages/manifests/NEURON_MATRIX.csv` — coloane reale: `id`, `name`, `description`, `package_suffix` (extindeți prin CMDB, nu inventați rânduri fictive).
- **Stare curentă repo:** exemplu `neuron-ping` — inventarul crește cu `pnpm run gen:matrix` și generatoarele din `tools/generators/`.
- **RBAC:** mapare **capabilități neuron** → permisiuni API și capitole UI (blueprint §22–23) — detaliu în implementare `impl-rbac-suite-chapters`; numele rolurilor trebuie să tragă din același inventar, nu din liste ad-hoc.

## SYNAPSE_MATRIX (legătură stream)

- `packages/manifests/SYNAPSE_MATRIX.csv` — definește `stream_key` / `consumer_group` pentru sinapse; aliniat la [orchestration-matrix.md](./orchestration-matrix.md).

---

## Dovezi stacks-01

- **Zero presupuneri** pe nume de tenant sau ID din CMDB în cod doc — doar structură și căi fișiere reale din repo.
