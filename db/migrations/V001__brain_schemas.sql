-- Cerniq v2 — scheme inițiale brain_* + business (Postgres central stacks-02/05).
-- Rulați pe instanța aprobată (ex. lxc-postgres-main); nu includeți credențiale în repo.

CREATE SCHEMA IF NOT EXISTS brain_core;
CREATE SCHEMA IF NOT EXISTS brain_audit;
CREATE SCHEMA IF NOT EXISTS business;

-- Exemplu tabel audit (detaliere în doc-enterprise-data-domain-er)
CREATE TABLE IF NOT EXISTS brain_audit.event (
  id          bigserial PRIMARY KEY,
  trace_id    text NOT NULL,
  event_type  text NOT NULL,
  payload     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_brain_audit_trace ON brain_audit.event (trace_id);

COMMENT ON SCHEMA brain_core IS 'Bounded context neuroni/gateway-uri cognitive';
COMMENT ON SCHEMA business IS 'Entități CRM/ops (tenant, batch, etc.)';
