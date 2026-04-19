# DR — RPO / RTO (ținte)

| Componentă | RPO țintă | RTO țintă | Notă |
|------------|-----------|-----------|------|
| Postgres central (`lxc-postgres-main`) | definit de backup DBA | ore | Test restore documentat trimestrial |
| Redis (cache/streams) | acceptabil pierderi secunde–minute | minute | Config + replay parțial din surse externe |
| Temporal | conform cluster hz.62 | ore | Workflow-uri idempotente |

## Excluderi

- Medii dev: fără SLA DR complet — ADR implicit.

## Test restore

- Înregistrare dată, durată, persoană responsabilă în CMDB (nu în repo).
