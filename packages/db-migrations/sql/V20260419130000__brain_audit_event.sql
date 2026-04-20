-- Evenimente audit append-only (brain_audit) — Postgres central stacks-05 H8.
-- Paritate cu modelul din docs/enterprise/data-domain-erd.md; rulare manuală după review DBA.

CREATE TABLE IF NOT EXISTS brain_audit.event (
  id          bigserial PRIMARY KEY,
  trace_id    text NOT NULL,
  event_type  text NOT NULL,
  payload     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_brain_audit_trace ON brain_audit.event (trace_id);

COMMENT ON TABLE brain_audit.event IS 'Audit append-only — fără PII în payload în fluxuri nefiltrate';
