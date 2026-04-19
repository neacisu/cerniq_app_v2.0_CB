# Checklist DNS Cloudflare v2 (execuție operator)

Rulare prin MCP **stacks-cloudflare-api** (search spec → execute), zona `cerniq.app`.

| Înregistrare | Tip | Valoare țintă | Proxied |
|--------------|-----|----------------|---------|
| `v2` | A | `77.42.76.185` | conform politicii |
| `api.v2` | A sau CNAME | origin public | … |
| `admin.v2` | A sau CNAME | origin public | … |

După creare: înregistrați **zone id** și **record id** în CMDB intern (nu în git).

SSL: Full (strict) — vezi [cloudflare-dns-tls-procedure.md](./cloudflare-dns-tls-procedure.md).
