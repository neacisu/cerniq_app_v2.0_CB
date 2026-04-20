# Topologie deploy v2 — închidere prod / staging / dev

**Scop:** tabel unic **Host → Traefik router → upstream (IP:port) → proces**, fără ambiguitate pentru **`v2.cerniq.app`**, **`api.v2.cerniq.app`**, **`admin.v2.cerniq.app`**. IP și porturi din audit **stacks-04 / stacks-05** (zero inventat).

## Subdomenii HTTPS (țintă produs)

| Hostname public | Rol | Port aplicație (țintă) |
|-----------------|-----|-------------------------|
| `v2.cerniq.app` | Web UI Next.js | `25000` (varianta A) sau `64000` (varianta B LXC) |
| `api.v2.cerniq.app` | API Fastify (+ SSE dacă același serviciu) | `25010` sau `64010` |
| `admin.v2.cerniq.app` | Admin UI | `25012` sau `64012` |

> Numele `api.v2` din plan = **`api.v2.cerniq.app`** (FQDN); nu există host separat `api.v2` fără zonă DNS.

---

## Varianta A — servicii pe orchestrator (plaja **25xxx**)

**Host edge:** orchestrator **`77.42.76.185`** (public), Traefik **:443** host network (stacks-02).

| Traefik router (rule) | Upstream proces | Adresă upstream |
|----------------------|-----------------|------------------|
| `Host(v2.cerniq.app)` | Web v2 | `http://127.0.0.1:25000` |
| `Host(api.v2.cerniq.app)` | API v2 | `http://127.0.0.1:25010` |
| `Host(admin.v2.cerniq.app)` | Admin v2 | `http://127.0.0.1:25012` |

Rețea Docker: servicii pe `traefik_default` / bridge conform labels; **fără** publish public haotic din compose aplicație (stacks-02).

---

## Varianta B — upstream la LXC Cerniq (**64xxx**)

Conform **stacks-05 B2 (staging)** și **B3 (prod)** — VIP **19xxx** / **29xxx** pe `10.0.1.10` mapează către containere pe **CT110** staging **`10.0.1.110`** și **CT109** prod **`10.0.1.109`**.

| Mediu | LXC | Porturi app (exemple mapate VIP) | Rol |
|-------|-----|----------------------------------|-----|
| Staging | `10.0.1.110` | `64000` web, `64010` API, `64012` admin, `64080` monitoring API | Cerniq staging |
| Prod | `10.0.1.109` | `64000` web, `64010` API, `64012` admin | Cerniq prod |

**Traefik** poate ruta `Host(v2.cerniq.app)` → `http://10.0.1.110:64000` (sau IP prod) dacă procesele v2 rulează pe LXC — **decizie deploy** înregistrată în CMDB (nu doar în repo).

**Conflict plaje:** `25xxx` este rezervată v2 pe orchestrator; **`64xxx`** este convenția app Cerniq pe LXC — alegeți **un singur** țintă upstream per mediu sau documentați split (ex. UI pe LXC, API pe orchestrator) prin ADR.

---

## Dev — **hz.164** (stacks-05 E, referință)

Flux **cerniq-dev** pe **`135.181.183.164` / `10.0.1.6`**: porturi publice tipice **`64000`**, **`64010`**, **`64012`**, **`64080`** (vezi matrice stacks-05 secțiunea E / audit hz.164). Conectare la servicii shared: [local-dev-story.md](./local-dev-story.md).

---

## Next.js: SSR vs export static

| Mod | Când | Notă |
|-----|------|------|
| **SSR / App Router / server actions** | Shell autentificat, date per-request, SSE proxy | **Ținta principală** CognitiveBrain + suite |
| **Export static `output: 'export'`** | Doar subsisteme fără cookie sesiune / fără date user | Nu este ținta pentru Brain live |

**Standalone** (`next build` + server Node): compatibil cu deploy în spatele Traefik; variabile env pentru API public `api.v2.cerniq.app`.

---

## Închidere ambiguități

- **Unde rulează v2 la go-live:** varianta **A** și/sau **B** trebuie aleasă per mediu și înregistrată (CMDB + eventual ADR dacă split neobișnuit).
- **DNS:** înregistrări către **`77.42.76.185`** (A) sau CNAME conform [cloudflare-dns-records-checklist.md](./cloudflare-dns-records-checklist.md).
