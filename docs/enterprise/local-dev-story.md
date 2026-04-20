# Poveste dezvoltare locală / dev (stacks-02 + 04/05 + 03)

**Scop:** task `local-dev-story` — fără datastore-uri duplicate în compose proiect; conectare la **Postgres central** și **redis-shared**; conștientizare **MTU/VIP**; **Traefik** / **OpenBao**; **pnpm/nx**; **Temporal** doar ca **client** către cluster partajat; referință reală **hz.164** (**cerniq-dev**).

---

## stacks-02 — interdicții compose

- **Nu** rula `postgres`, `redis`, `mail` în `docker-compose` proiect pentru date aplicație — vezi gate `tools/ci/gates/compose_no_duplicate_datastores.py`.
- Conectare la **PostgreSQL central** (`lxc-postgres-main`, **`10.0.1.107:5432`** — stacks-05 H8) și **redis-shared** prin rețea aprobată (VPN / vSwitch / tunnel din CMDB).
- Secrete: **OpenBao** (orchestrator **8200/8201** — stacks-05) sau fișiere locale ignorate de git (**fără** commit secrete).

---

## Tooling monorepo

- `pnpm install`, `pnpm exec nx serve api`, `pnpm exec nx dev web`.
- **Temporal:** doar **client** / worker rulat manual către **cluster partajat** — `TEMPORAL_ADDRESS` din env; **nu** porniți cluster Temporal nou în repo pentru dev uzual — vezi [temporal-standards-ops.md](./temporal-standards-ops.md).

---

## Traefik

- Integrare servicii: etichete pe rețea **`traefik_default`** când aplicația rulează lângă Traefik; dev **localhost** direct este acceptat fără Traefik — vezi [deploy-topology-v2.md](./deploy-topology-v2.md).

---

## stacks-04 / 05 — conectivitate

- **MTU vSwitch `1450`** și **MSS clamp (ex. 1360)** pe căi selectate orchestrator ↔ hz.247 — vezi [network-stacks-04-mtu-vip.md](./network-stacks-04-mtu-vip.md) și runbook [mtu-mss-stacks-04.md](../runbooks/mtu-mss-stacks-04.md).
- **DNAT redis-shared:** `10.0.0.2:6379` → container bridge (orchestrator) — nu confundați cu VIP până nu verificați poziția în rețea.
- **VIP Redis `10.0.1.10:6379`** (HAProxy **hz.247**) sau **direct orchestrator `10.0.0.2:6379`** — alegeți conform poziției clientului și ACL; vezi [messaging-redis-bullmq-ops.md](./messaging-redis-bullmq-ops.md) și [haproxy-vip-path-stacks-05.md](./haproxy-vip-path-stacks-05.md).
- **Trafic v2 (25xxx)** prin Traefik: cale publică directă pe orchestrator vs. cale internă prin VIP `10.0.1.10:443` — tabel în [haproxy-vip-path-stacks-05.md](./haproxy-vip-path-stacks-05.md).

---

## Referință reală hz.164 (cerniq-dev)

- Host dev **hz.164** — stacks-04 B6; plajă porturi **64000** (web), **64010** (api), **64012** (admin) pe containere **cerniq-dev-*** — vezi `.cursor/rules/stacks-05-port-matrix.md` secțiunea E (dovadă audit), **fără** a presupune că aceste servicii rulează pe mașina de dezvoltare curentă fără verificare.

---

## Verificare

- Gates: `tools/ci/run_gates.py` (inclusiv compose / Traefik hazard).
