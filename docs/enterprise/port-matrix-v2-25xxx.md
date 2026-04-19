# Plajă porturi Cerniq v2 — 25000–25099

**Verificare stacks-05:** plaja `25xxx` **nu** apare în matricea J/L existentă — rezervată pentru backend-uri v2 adresate de Traefik pe orchestrator.

## Mapare propusă

| Port | Rol | Subdomeniu |
|------|-----|------------|
| 25000 | Web UI v2 | `v2.cerniq.app` |
| 25010 | API Fastify v2 (+ SSE același proces) | `api.v2.cerniq.app` |
| 25012 | Admin UI v2 | `admin.v2.cerniq.app` |
| 25080 | Health/monitoring opțional | path sub API sau `status.v2` |
| 25020–25099 | Rezervă | — |

## Evită

- `19xxx`, `26xxx`, `29xxx`, `39xxx`, `49xxx`, `64xxx`, `65xxx` pentru servicii noi v2 pe orchestrator (convenții existente).

## Origine

- Internet → Cloudflare (opțional) → `77.42.76.185:443` Traefik → `http://127.0.0.1:25xxx`.
- Din vSwitch prin VIP: vezi [haproxy-vip-path-stacks-05.md](./haproxy-vip-path-stacks-05.md).
