# IAM propriu: ADR, cod, Postgres, OpenBao, Traefik

**Scop:** task `auth-adr-impl` — implementare aliniată **ADR-0003**, **stacks-02** (Zitadel ignorat), JWT/sesiuni, secrete **OpenBao**, tabele **`auth.*`** pe Postgres central, trafic web prin **Traefik**.

---

## ADR

- **[ADR-0003](../adr/0003-iam-internal-postgres-jwt.md)** — Accepted: IAM intern, JWT HS256, fără SaaS auth extern pentru nucleu.

---

## Cod (dovadă repo)

| Artefact | Locație |
|----------|---------|
| Verificare JWT pe fiecare request | `apps/api/src/app/plugins/35-jwt-auth.ts` (`Authorization: Bearer`, `JWT_SECRET` ≥ 32 caractere) |
| Profil `/v1/me` | `apps/api/src/app/routes/v1/me.ts` |
| OpenAPI | `/v1/me` în `docs/openapi/openapi.yaml` |

---

## Postgres central

- Migrație: `packages/db-migrations/sql/V20260419120000__auth_identity_placeholder.sql` — **`auth.users`** (`tenant_id`, `email`, `password_hash`, unic `(tenant_id, email)`).
- Host: `10.0.1.107:5432` — vezi `data-domain-erd.md` / stacks-05 H8.

---

## Secrete

- **`JWT_SECRET`** — injectat din **OpenBao** / CI secrets (stacks-02), nu valori statice în repo.

---

## Traefik

- API public: HTTPS la edge; **fără** expunere directă a portului procesului aplicație pe internet — vezi `contracts-api-events.md` și `deploy-topology-v2.md`.

---

## Verificare

- Teste: `apps/api/src/app/plugins/35-jwt-auth.spec.ts`.
- Login/register complet și RBAC pe capitole → todo-uri `impl-*` dedicate; acest document fixează stratul JWT + schema `auth.users`.
