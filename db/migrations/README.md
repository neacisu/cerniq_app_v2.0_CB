# Migrații SQL — sursă canonică

Fișierele versionate pentru **Cerniq v2** trăiesc în **`packages/db-migrations/sql/`** (convenție Flyway `V*__*.sql`).

Directorul `db/migrations/` din rădăcină este păstrat doar ca pointer istoric; **nu** adăugați migrații duplicate aici — vezi `data-domain-erd.md` și `data-model-erd-migrations.md`.
