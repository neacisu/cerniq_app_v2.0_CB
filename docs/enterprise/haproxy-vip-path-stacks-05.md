# HAProxy VIP (hz.247) — cale către traficul v2 și plaja 25xxx

**Scop:** task `doc-haproxy-vip-path-stacks-05` — documentare **stacks-05 L**: unde traficul **v2** trece prin **VIP `10.0.1.10`** pe **hz.247**; reguli, **health** upstream, mapare la **25xxx**; **fără conflict** plaje **J** (19xxx staging / 29xxx prod legacy Cerniq) + **L** (directive porturi).

**Sursă audit:** `stacks-04-network-topology.mdc` B9 (ACL VIP), `stacks-05-port-matrix.mdc` J/L, [port-matrix-v2-25xxx.md](./port-matrix-v2-25xxx.md).

---

## Fluxuri principale

### 1. Internet → orchestrator (cale tipică v2 public)

`Internet` → (opțional Cloudflare) → **`77.42.76.185:443`** (Traefik pe orchestrator) → router `Host(v2.cerniq.app | api.v2… | admin.v2…)` → upstream **`http://127.0.0.1:25xxx`** (plaja rezervată v2).

**Observație:** această cale **nu** trece obligatoriu prin HAProxy VIP; este calea **directă** documentată în [deploy-topology-v2.md](./deploy-topology-v2.md).

### 2. Client intern (vSwitch) → VIP → Traefik orchestrator

Pentru clienți poziționați în **vSwitch** care trebuie să termine TLS pe **VIP**:

- **`10.0.1.10:443`** (VIP pe hz.247) → backend **Traefik** pe **`10.0.0.2:443`** (orchestrator).

După terminarea TLS la Traefik, **aceleași routere** `Host(...)` aplică ca la fluxul public, deci serviciile v2 rămân pe **25xxx** local orchestrator ([port-matrix-v2-25xxx.md](./port-matrix-v2-25xxx.md): `25000` web, `25010` API, `25012` admin).

### 3. Redis VIP

- **`10.0.1.10:6379`** — Redis prin VIP, cu **ACL strict** (surse permise enumerate în stacks-04 B9); alternativă documentată: **`10.0.0.2:6379`** de pe orchestrator (DNAT redis-shared).

---

## Health checks și upstream

- **Health** pentru backend-uri v2 = responsabilitatea **procesului** pe `25xxx` (ex. `/health` / `/ready` în `apps/api`) + config Traefik (nu introduceți în repo path-uri operaționale fără dovada `/opt/traefik`).
- **HAProxy** pe hz.247: orice **nou** backend către 25xxx trebuie aliniat cu **CMDB** și cu testele de conectivitate din rețea (fără presupuneri de firewall).

---

## Fără conflict plaje J + L (stacks-05)

| Plajă / rol | Folosință | Raport cu v2 |
|-------------|-----------|----------------|
| **19xxx** | VIP HAProxy → staging Cerniq **legacy** (LXC) | **Nu** folosiți pentru servicii noi v2 pe orchestrator |
| **29xxx** | VIP → prod Cerniq **legacy** (LXC) | Idem |
| **25xxx** | Rezervată **v2** pe orchestrator (Traefik → 25000/25010/25012…) | **Canonic** pentru greenfield v2 |
| **26xxx** | WAPP (ex. Evolution) | Separată |
| **49xxx** | LLM VIP | Separată; ACL distinct |

Orice încercare de mapare **25xxx** peste **19xxx/29xxx** necesită **ADR** + revizuire `port-matrix-v2-25xxx.md`.

---

## Verificare

- `rg -n "25000|25010|10.0.1.10|10.0.0.2" docs/enterprise/haproxy-vip-path-stacks-05.md docs/enterprise/port-matrix-v2-25xxx.md`
- Matrice conformitate: [compliance-stacks-01-05.md](../compliance-stacks-01-05.md) (S04-VIP, S05-PL).

---

## Legături

- [network-stacks-04-mtu-vip.md](./network-stacks-04-mtu-vip.md) — MTU/MSS pe calea către orchestrator.
- [traefik-reload.md](../runbooks/traefik-reload.md) — procedură reload și hostname-uri v2.
