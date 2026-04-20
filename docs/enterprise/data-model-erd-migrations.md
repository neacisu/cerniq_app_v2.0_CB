# Implementare: ERD, migrații PostgreSQL central, vizualizare

**Scop:** închide livrarea task `data-model-erd-migrations`: artefacte **versionate** în repo, aliniate **stacks-05 H8** (Postgres principal), fără `pgvector` implicit și cu vizualizare **CloudBeaver** unde e cazul.

---

## Postgres central (dovadă audit)

| Parametru | Valoare |
|-----------|---------|
| LXC | `lxc-postgres-main` |
| IP | `10.0.1.107` |
| Port | `5432` |
| Engine | PostgreSQL **16** (stacks-05 H8) |

Conectare practică (PgBouncer / Traefik TCP / CMDB) — vezi `data-domain-erd.md`; **nu** introduceți containere Postgres dedicate proiectului fără ADR (stacks-02).

---

## Migrații în repo (sursă canonică)

**Director:** `packages/db-migrations/sql/`.

| Fișier | Conținut |
|--------|----------|
| `V20260419000000__init_brain_business_placeholder.sql` | Scheme `brain_core`, `brain_audit`, `auth`, `business` |
| `V20260419120000__auth_identity_placeholder.sql` | `auth.users` (ADR-0003) |
| `V20260419130000__brain_audit_event.sql` | `brain_audit.event` append-only |

**Pointer:** `db/migrations/README.md` — fără duplicate SQL în `db/migrations/`.

---

## pgvector / extensii

- Activare **`vector`** numai după verificare live pe instanță: `SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';` (stacks-01).
- Migrații dependente de vector → sub control DBA + ADR, nu implicit în bootstrap.

---

## CloudBeaver (stacks-02)

- UI **8978** pe orchestrator — vezi stacks-05 / `c4-deployment-views.md`; folosit pentru explorare scheme după migrare, fără a înlocui controlul de acces CMDB.

---

## Verificare

- Model conceptual: `data-domain-erd.md` (ERD Mermaid).
- **Nu** rulați migrații împotriva unei baze inventate; mediul țintă este Postgres central aprobat.
