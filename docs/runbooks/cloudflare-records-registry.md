# Registru Cloudflare — șablon (ID-uri în CMDB, nu în git)

**Regulă stacks / plan:** **zone id** și **record id** pentru înregistrările DNS v2 se păstrează în **CMDB intern** sau secret manager — **nu** în repository (evitare leak și drift).

## Șablon tabel (copiere în CMDB)

| Hostname | Tip | Valoare țintă | Proxied | Zone ID (CF) | Record ID (CF) | Data actualizare | Owner |
|----------|-----|---------------|---------|--------------|----------------|------------------|-------|
| `v2.cerniq.app` | A | `77.42.76.185` | … | *(CMDB)* | *(CMDB)* | | |
| `api.v2.cerniq.app` | A / CNAME | origin | … | *(CMDB)* | *(CMDB)* | | |
| `admin.v2.cerniq.app` | A / CNAME | origin | … | *(CMDB)* | *(CMDB)* | | |

## Procedură creare

- Workflow MCP Cloudflare documentat în plan: **search** spec → **execute**; vezi [cloudflare-dns-records-checklist.md](../enterprise/cloudflare-dns-records-checklist.md) și [cloudflare-dns-tls-procedure.md](../enterprise/cloudflare-dns-tls-procedure.md).

## SSL/TLS

- Mod **Full (strict)** la Cloudflare cu certificat valid la origine (Traefik ACME sau Origin CA) — fără a dezactiva verificarea TLS fără ADR risc.
