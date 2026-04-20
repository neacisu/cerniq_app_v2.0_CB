# Runbook — Rotație secrete (OpenBao)

## Context (stacks-02)

- OpenBao pe orchestrator: port **8200** (UI/API), cluster **8201** — vezi [env-matrix-secrets.md](../enterprise/env-matrix-secrets.md) și matricea porturi în regulile stacks-05 din `.cursor/rules/`.
- Secretele aplicației v2 **nu** se commit în git; injectare runtime (CI: GitHub Secrets + OpenBao policy).

## Rotație (procedură generică)

1. **Inventar** — ce secret (JWT signing, webhook HMAC, string DB) și unde e folosit (apps/api, workers).
2. **Generare valoare nouă** — în OpenBao sau sursă aprobată.
3. **Deploy dual** — unde e posibil: acceptă ambele chei temporar, apoi depreciați vechea.
4. **Revocare** — invalidați token-uri vechi în OpenBao după confirmarea traficului pe chei noi.
5. **Audit** — înregistrare eveniment rotație în CMDB (fără valori în repo).

## Acces rețea

- Doar din rețea de încredere; forward `10.0.1.8:8200` → orchestrator documentat în stacks-04.
