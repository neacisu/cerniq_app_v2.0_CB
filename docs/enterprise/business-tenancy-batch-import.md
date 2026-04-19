# Tenancy, Batch, import CSV

## Model

- **Tenant:** organizație plătitoare / boundary de date.
- **Workspace:** subdiviziune opțională (echipă, brand).
- **Utilizator:** aparține unuia sau mai multor tenant prin `auth.membership`.

## Izolare date (ADR)

Strategie implicită: **RLS pe Postgres** pe `tenant_id` + validare în API. Alternative (schema per tenant) necesită ADR separat.

## Batch (UI BatchSelector)

- Entitate `business.batch`: `id`, `tenant_id`, `source` (csv), `mapping_id`, `state` (pending|processing|quarantine|done|failed), `stats`.

## Import CSV

1. Mapare tehnică coloane → câmpuri.
2. **Validare business** în `apps/api` — reguli domeniu (format telefon, cod fiscal, etc.).
3. Erori returnate structurat pentru UI; rânduri în **quarantine**.

## NEURON_MATRIX → RBAC

- Capabilities din `packages/manifests/NEURON_MATRIX.csv` mapate la permisiuni API și capitole UI; fără nume inventate — coloanele reale din CSV.
