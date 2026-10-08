# Deploy firme.cerniq.app (hz2.65)

Aceleași convenții ca `mcp-hetzner` din `/opt/traefik/dynamic`: serviciu pe host legat la gateway-ul `traefik_default`, rutat de Traefik cu certificat Cloudflare DNS-01.

1. Pe server: `/opt/firme-web/repo/firme-web/deploy/release.sh` (pull, test, build, copiere pe loc, reload nginx).
2. `deploy/nginx.conf` → `/opt/firme-web/nginx.conf`. **Hash-ul CSP** al scriptului inline din `index.html` trebuie recalculat dacă scriptul de temă se schimbă (sha256 în base64).
3. `docker compose -f deploy/docker-compose.yml up -d`.
4. `deploy/traefik-firme-web.yml` → `/opt/traefik/dynamic/firme-web.yml` (Traefik reîncarcă singur fișierele).
5. DNS Cloudflare: `A firme.cerniq.app → 2.29.8.65` (hz2.65). Aici rămâne DNS-only, ca restul înregistrărilor care folosesc DNS-01.

API-ul de citire (`/opt/firme-api`, `127.0.0.1:4186`) nu se modifică și rămâne neexpus direct; nginx îl expune doar pe `/api/` cu GET/HEAD și rate limit.
