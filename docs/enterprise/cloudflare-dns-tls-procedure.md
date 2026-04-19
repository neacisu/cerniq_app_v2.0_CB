# Procedură Cloudflare DNS/TLS pentru v2

> Execută cu MCP **project-0-stacks-cloudflare-api** (search spec → execute) conform runbook stacks.

## DNS

Înregistrări țintă pentru zona `cerniq.app`:

| Nume | Tip | Conținut | Proxied |
|------|-----|----------|---------|
| `v2` | A sau AAAA | `77.42.76.185` sau IPv6 orchestrator | conform politicii |
| `api.v2` | A / CNAME | origin public sau CNAME către `v2` | … |
| `admin.v2` | A / CNAME | idem | … |

**Notă:** păstrează **zone id** și **record id** în CMDB după creare — nu în acest repo.

## SSL/TLS

- Mod recomandat: **Full (strict)** cu certificat valid la origine (Traefik ACME sau Cloudflare Origin CA).
- Universal SSL ON; TLS minim 1.2+ conform politicii.

## Post-config

- Verificare stacks-01: `curl -vI https://v2.cerniq.app` de pe rețea externă.
