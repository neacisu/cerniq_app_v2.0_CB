# Plajă porturi Cerniq v2 — 25000–25099

**Scop:** task `port-matrix-v2-25xxx` — rezervare și documentare **25000–25099** pentru servicii v2 pe orchestrator; verificare **stacks-05** secțiunile **J** (convenții range) + **L** (directive agenți); evitare explicită a plajelor **19/26/29/39/49/64/65** pentru servicii noi v2 unde există deja convenții; mapare **serviciu → port → subdomeniu**; rută **internet → origine**.

---

## Verificare stacks-05 (audit)

- Secțiunea **J** (schema convenții): range **25xxx** nu intră în conflict cu **19xxx/29xxx** (VIP HAProxy staging/prod Cerniq legacy), **26xxx** (WAPP), **39xxx** (dev Neanelu), **49xxx** (LLM), **64xxx/65xxx** (app pe LXC).
- Secțiunea **L**: alocare port nou = respectare range + HAProxy pe **hz.247** dacă traficul din cluster trece prin **VIP `10.0.1.10`** — vezi [haproxy-vip-path-stacks-05.md](./haproxy-vip-path-stacks-05.md).

---

## Mapare țintă (orchestrator — upstream Traefik)

| Port | Rol proces | Hostname țintă (plan) |
|------|------------|-------------------------|
| **25000** | Web Next v2 (`apps/web`) | `v2.cerniq.app` |
| **25010** | API Fastify v2 + SSE același proces | `api.v2.cerniq.app` |
| **25012** | Admin UI v2 (dacă serviciu separat) | `admin.v2.cerniq.app` |
| **25080** | Health / monitoring dedicat (opțional) | path sub API sau host dedicat documentat în deploy |
| **25020–25099** | Rezervă extensii | — |

**Evită** folosirea pentru v2 a porturilor din plajele deja cartografiate pentru alte produse (vezi tabel **J** în `.cursor/rules/stacks-05-port-matrix.md`).

---

## Origine trafic

1. **Direct public:** Internet → **`77.42.76.185:443`** (Traefik orchestrator) → upstream `http://127.0.0.1:25xxx` (router Host).
2. **Prin VIP HAProxy (hz.247):** clienți în vSwitch → **VIP `10.0.1.10:443`** → backend **Traefik** pe orchestrator — apoi aceleași routere; vezi [haproxy-vip-path-stacks-05.md](./haproxy-vip-path-stacks-05.md).
3. **Cloudflare** (opțional) în față — mod SSL și DNS în runbook-uri Cloudflare.

---

## Diferă față de blueprint §16 sau topologie?

- Orice abatere de la arborele URL din blueprint se înscrie în **ADR** cu motiv (ex. prefix suplimentar); altfel rămâne [deploy-topology-v2.md](./deploy-topology-v2.md) + acest document.

---

## Verificare

- Contract ingress: [contracts-api-events.md](./contracts-api-events.md), [c4-deployment-views.md](./c4-deployment-views.md).
