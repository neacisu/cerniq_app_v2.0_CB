-- Placeholder schema boundaries pentru Cerniq v2.
-- Rulează manual pe Postgres central după aprobare DBA (stacks-01).
CREATE SCHEMA IF NOT EXISTS brain_core;
CREATE SCHEMA IF NOT EXISTS brain_audit;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS business;

COMMENT ON SCHEMA brain_core IS 'Neuroni, gateway, topologie';
COMMENT ON SCHEMA brain_audit IS 'Audit append-only';
COMMENT ON SCHEMA auth IS 'IAM proiect';
COMMENT ON SCHEMA business IS 'CRM suite tenant-scoped';
