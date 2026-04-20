# Runbook — PostgreSQL central (backup / restore)

## Context (stacks-05 H8)

- **Instanță țintă aplicații Cerniq v2:** `lxc-postgres-main` — `10.0.1.107:5432`, PostgreSQL 16 (audit CMDB).
- Conexiuni aplicație: prin politica DBA (PgBouncer / Traefik TCP unde e cazul); detalii în [data-domain-erd.md](../enterprise/data-domain-erd.md).

## Backup

- **Politică:** definită de DBA pe host-ul Postgres (pgBackRest, WAL, snapshot storage) — **nu** în acest repo.
- **Frecvență:** RPO țintă în [dr-rpo-rto.md](../enterprise/dr-rpo-rto.md).
- **Verificare:** monitorizare job backup reușit (alertă dacă lipsește o rulare).

## Restore (operațional)

1. **Coordonare DBA** — mediu izolat (staging) pentru test înainte de producție.
2. **Înregistrare** — dată, durată, persoană, rezultat în **CMDB** (nu PII în git).
3. **Test trimestrial** — menționat în DR; eșec test = gap de conformitate până la remediere.

## Ce nu face acest runbook

- Nu conține parole, căi de backup interne sau IP-uri suplimentare neauditabile — completați din CMDB la execuție.
