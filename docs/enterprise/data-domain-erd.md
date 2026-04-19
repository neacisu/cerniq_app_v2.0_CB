# Domeniu date — ERD țintă și convenții

## Postgres central

- **Instanță:** `lxc-postgres-main` — `10.0.1.107:5432` (conform stacks-05 H8). Conectare practică prin PgBouncer/Traefik TCP după CMDB.
- **Extensii:** `pgvector` doar după verificare live pe instanță (`SELECT extversion FROM pg_extension WHERE extname='vector';`) — stacks-01.

## Scheme

| Schema | Rol |
|--------|-----|
| `brain_core` | Neuroni, gateway-uri, topologie, trace-uri persistate |
| `brain_audit` | Evenimente audit imutabile (append-only) |
| `auth` | `auth_*` utilizatori, sesiuni, roluri (IAM proiect) |
| `business` | CRM, inbox, sales, workflows — entități tenant |

## Entități esențiale (țintă)

- **tenant** — rădăcină izolare; `id`, `slug`, `status`.
- **workspace** — sub-tenant opțional; FK `tenant_id`.
- **batch** — import CSV; `id`, `tenant_id`, `mapping_id`, `state`.
- **account**, **contact**, **opportunity** — suite CRM (detaliere în migrații viitoare).
- **gateway_run**, **neuron_invocation**, **synapse_delivery** — legătură operațională Brain.

## Mapare manifeste

- `packages/manifests/NEURON_MATRIX.csv`, `SYNAPSE_MATRIX.csv` — sursă pentru cod generat; câmpuri `neuron_id`, `capabilities` mapate la RBAC și la tabele `brain_core`.

## Migrații

- Director: `packages/db-migrations/sql/` — naming `V{timestamp}__{nume}.sql`.
- Rulează numai împotriva Postgres central aprobat; nu migrații locale împotriva containerului proiect.

## Dicționar (câmpuri comune)

| Câmp | Tip | Notă |
|------|-----|------|
| `tenant_id` | uuid | Obligatoriu pe rânduri business |
| `trace_id` | text | Corelat OTel + SSE |
| `created_at` | timestamptz | UTC |
| `idempotency_key` | text | unic per tenant + scope |
