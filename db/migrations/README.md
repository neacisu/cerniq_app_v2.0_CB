# Migrații Postgres

Fișiere versionate pentru **`postgres-main`** (central). Nu rulați împotriva unui Postgres local din compose-ul proiectului — vezi stacks-02.

Ordine:

1. `V001__brain_schemas.sql` — scheme `brain_*` + `business`, tabel minimal audit.

Instrumente recomandate: migrații manuale orchestrate sau Flyway/Liquibase — alegeți în ADR.
