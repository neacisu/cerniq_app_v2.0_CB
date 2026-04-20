# Runbook — Traefik: configurare și reload

## Locație (stacks-02)

- Config live pe orchestrator: **`/opt/traefik`** (exemplu repo: `infra/traefik/cerniq-v2.example.yml` — nu înlocuiește configurația aplicată fără review).

## Modificare sigură

1. **Backup** fișier dinamic actual pe server.
2. **Validare** sintaxă YAML / provider Docker (dacă e cazul).
3. **Reload** Traefik conform modului de instalare (SIGHUP sau restart container `traefik` — procedură internă echipă infra).
4. **Test** — `curl -I` cu `Host:` și `--resolve` către `127.0.0.1` pentru hostname-urile v2 (fără a publica secrete).

## Routere v2

- Hostnames: `v2.cerniq.app`, `api.v2.cerniq.app`, `admin.v2.cerniq.app` — upstream plajă **25xxx** pe orchestrator sau cale documentată în [deploy-topology-v2.md](../enterprise/deploy-topology-v2.md).
- **Config live (orchestrator):** `/opt/traefik/dynamic/cerniq.yml` — routere `cerniq-v2-web`, `cerniq-v2-api`, `cerniq-v2-admin` + servicii `127.0.0.1:25000` / `:25010` / `:25012`; TLS ACME `certResolver: cloudflare` cu SAN explicite pentru `api.v2.*`.
- **Verificare locală (fără DNS public):** `curl -k --resolve v2.cerniq.app:443:127.0.0.1 -o /dev/null -w '%{http_code}' https://v2.cerniq.app/` — așteptat **502** până la pornirea proceselor pe 25xxx; după deploy, **200** / redirect conform app.

## Rollback

- Restaurați fișierul din pasul 1; reload din nou.
