-- Placeholder schema auth_* pe Postgres central (stacks-02). Rulare manuală pe lxc-postgres-main după review DBA.
-- Aliniat ADR-0003: utilizatori, parole hash, sesiuni opționale; JWT emis de apps/api după login.

CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, email)
);

CREATE INDEX IF NOT EXISTS idx_auth_users_tenant ON auth.users (tenant_id);

COMMENT ON SCHEMA auth IS 'IAM proiect Cerniq v2 — fără Zitadel (stacks-02)';
