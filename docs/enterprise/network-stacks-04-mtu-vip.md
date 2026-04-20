# Rețea stacks-04 — MTU/MSS, DNAT și căi Redis / orchestrator

**Scop:** task `doc-network-stacks-04-mtu-vip` — conectivitate **client → Redis VIP / orchestrator** fără presupuneri; inclus în **runbook** [mtu-mss-stacks-04.md](../runbooks/mtu-mss-stacks-04.md) și în [local-dev-story.md](./local-dev-story.md).

**Sursă audit:** `stacks-04-network-topology.mdc` (orchestrator, hz.247 VIP, reguli DNAT/SNAT/MSS).

---

## Orchestrator (`77.42.76.185` / `10.0.0.2`)

| Parametru | Valoare (dovadă stacks-04) |
|-----------|----------------------------|
| vSwitch | `10.0.0.2/32` pe `enp7s0`, rută `10.0.0.0/16`, **MTU 1450** |
| **redis-shared (DNAT)** | `10.0.0.2:6379` → `172.17.0.2:6379` (container bridge) |
| **Postgres CMDB (DNAT)** | `127.0.0.1:5433` → `172.21.0.2:5432` |
| **SNAT Docker → vSwitch** | Trafic din `172.18.0.0/16`, `172.19.0.0/16` către `10.0.0.0/8` iese cu sursă **`10.0.0.2`** pe `enp7s0` |

**Implicație pentru aplicații:** un client aflat pe **rețea internă** poate folosi `10.0.0.2:6379` când ACL-ul și ruta îl permit. Un client **în spatele VIP hz.247** folosește **`10.0.1.10:6379`** (vezi [haproxy-vip-path-stacks-05.md](./haproxy-vip-path-stacks-05.md)).

---

## VIP `10.0.1.10` (hz.247 — secțiunea B9)

- IP **secundar** pe `hz.247`; punct de terminare **Traefik :443** și **Redis :6379** pentru clienți din vSwitch, cu **ACL chirurgical** (allow-list pe surse și porturi — stacks-04 B9).
- **Nu** presupuneți acces de la orice IP la toate porturile VIP; verificați matricea INPUT înainte de debug.

---

## MTU și TCP MSS

| Loc | Detaliu |
|-----|---------|
| vSwitch orchestrator | MTU **1450** pe calea către `10.0.0.0/16` |
| hz.247 → orchestrator :443 | **Mangle TCPMSS** (ex. set MSS **1360** + clamp-to-pmtu) pentru fluxuri selectate (Cerniq / Neanelu → orchestrator) — remediu PMTU black hole |

**Simptom:** TLS „înghețat”, timeout la payload mare, OK la ping mic — vezi [mtu-mss-stacks-04.md](../runbooks/mtu-mss-stacks-04.md).

---

## Poziția clientului (decizie conexiune Redis)

| Poziție client | Cale tipică Redis | Note |
|----------------|-------------------|------|
| Container pe orchestrator / bridge | `127.0.0.1` sau serviciu Docker intern | Nu VIP |
| vSwitch autorizat (ex. LXC Cerniq) | `10.0.1.10:6379` sau rută documentată | ACL B9 |
| Stație dev VPN / vSwitch | Conform CMDB; adesea `10.0.0.2:6379` sau tunnel | Verificare firewall |

---

## Verificare (fără secrete în log)

- Gates: `tools/ci/run_gates.py` (compose, Traefik, documentație).
- Audit text: `rg -n "MTU|1360|1450|10.0.0.2|10.0.1.10" docs/enterprise/network-stacks-04-mtu-vip.md docs/runbooks/mtu-mss-stacks-04.md`.

---

## Legături

- [messaging-redis-bullmq-ops.md](./messaging-redis-bullmq-ops.md) — convenții stream / cozi.
- [local-dev-story.md](./local-dev-story.md) — flux dev fără datastore duplicate.
- [haproxy-vip-path-stacks-05.md](./haproxy-vip-path-stacks-05.md) — unde intră VIP în fața Traefik v2.
