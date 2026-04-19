# Medii și secrete

| Mediu | Host ref. | Postgres | Redis | Note |
|-------|-----------|----------|-------|------|
| dev | hz.164 / stație | connection string CMDB | `10.0.0.2:6379` sau VIP | fără secrete în repo |
| staging | LXC staging hz.223 | via PgBouncer | VIP sau direct | |
| prod | LXC prod hz.223 | via PgBouncer | VIP | |

## Variabile (exemple nume, fără valori)

- `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET_REF` (path OpenBao), `OTEL_EXPORTER_OTLP_ENDPOINT`, `TEMPORAL_ADDRESS`, `LLM_GUARD_BASE_URL`…

## CI

- GitHub Secrets pentru tokens; **nu** printa în log — verificare `ci-nx-affected-secrets-guard`.

## Injectare

- Runtime: env de la orchestrator / systemd / container; nu fișiere `.env` în imagine publică.
