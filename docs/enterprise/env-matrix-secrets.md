# Medii, CMDB și secrete (stacks-01 / stacks-02 / stacks-04 / stacks-05)

**Scop:** mapare **dev / staging / prod** la referințe reale din topologie auditată — **fără valori secrete** în repo; injectare runtime (OpenBao, systemd, GitHub Secrets).

**Legături:** [deploy-topology-v2.md](./deploy-topology-v2.md), [compliance-stacks-01-05.md](../../compliance-stacks-01-05.md), reguli `.cursor/rules/stacks-04-network-topology.mdc` și `stacks-05-port-matrix.mdc`.

---

## Matrice medii (host / date / mesaje)

| Mediu | Host ref. (CMDB) | PostgreSQL (central stacks-05 H8) | Redis shared | Traefik / edge |
|-------|------------------|-----------------------------------|----------------|----------------|
| **dev** | hz.164 `10.0.1.6`, stație developer | `10.0.1.107:5432` pe `lxc-postgres-main` (sau tunnel / PgBouncer conform runbook) | Din rețea client: `10.0.0.2:6379` (orchestrator) sau `10.0.1.10:6379` (VIP hz.247) — vezi stacks-04/05 | Traefik orchestrator `77.42.76.185:443` |
| **staging** | LXC `lxc-staging-cerniq` `10.0.1.110` | Același Postgres central (bază/schema staging) | VIP `10.0.1.10:6379` din rețea vSwitch autorizată | HAProxy VIP → staging Cerniq `19xxx` (stacks-05 B2) |
| **prod** | LXC `lxc-prod-cerniq` `10.0.1.109` | Același Postgres central (bază/schema prod) | Idem Redis VIP unde ACL permite | HAProxy VIP → prod Cerniq `29xxx` (stacks-05 B3) |

**Plajă v2 nouă (plan):** `25000`–`25099` pe orchestrator pentru `v2.cerniq.app` / `api.v2` — vezi [deploy-topology-v2.md](./deploy-topology-v2.md) și todo `port-matrix-v2-25xxx`.

---

## Variabile (nume canonice — fără valori în git)

| Variabilă | Rol |
|-----------|-----|
| `DATABASE_URL` | Postgres central (user/parolă doar OpenBao / secret manager) |
| `REDIS_URL` | `redis-shared` — nu instanță nouă în compose proiect (stacks-02) |
| `JWT_SECRET` / `JWT_SECRET_REF` | Chei semnare; prod doar OpenBao |
| `CERNIQ_API_INTERNAL_URL` | Web Next → API intern (Traefik / rețea docker) |
| `TEMPORAL_ADDRESS` | Cluster Temporal partajat |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Observabilitate stacks-02 (Tempo) — vezi paragraful OTLP de mai jos |
| `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` | Opțional: URL **complet** pentru trace HTTP (ex. `…/v1/traces`) dacă diferențiat de endpoint generic |
| `LLM_GUARD_BASE_URL` | Guard VIP stacks-05 49004 — fără URL inventat |

### OTLP pe orchestrator (dovadă din stack observability)

Pe mașina orchestrator, proiectul **`/opt/observability/docker-compose.yml`** definește serviciul **`otel-collector`** cu mapare host:

- `127.0.0.1:4318:4318`

Configurația receiver OTLP HTTP este pe port **4318** (`otel/otel-collector.yml`: `http: endpoint: 0.0.0.0:4318`), iar pipeline-ul de trace exportă către **Tempo**.

Pentru **`apps/api`** rulat pe **același host** ca docker-ul observability, URL-ul canonic pentru trace OTLP/HTTP este:

`http://127.0.0.1:4318/v1/traces`

Setați de exemplu:

`OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://127.0.0.1:4318/v1/traces`

(dacă procesul API nu e pe orchestrator sau nu vede `127.0.0.1:4318`, folosiți adresa rețea/Traefik conform CMDB — **fără** a presupune alt IP în repo.)

---

## Fișiere exemplu în repo

- Root: [`.env.example`](../../.env.example) — comentarii + placeholder-uri ne-secrete.
- API: [`apps/api/.env.example`](../../apps/api/.env.example) — dev local; **nu** copiați în producție fără OpenBao.
- Web: [`apps/web/.env.example`](../../apps/web/.env.example) — variabile `NEXT_PUBLIC_*` / proxy.

## CI (GitHub Actions)

- Secrete în **GitHub Secrets** / environment; `NX_CLOUD_ACCESS_TOKEN` opțional.
- **Nu** logați valori; verificare suplimentară: todo `ci-nx-affected-secrets-guard`.

## Injectare

- **Runtime:** variabile de mediu de la orchestrator / container / systemd — nu imagini cu `.env` încorporat cu secrete.
- **OpenBao:** orchestrator `8200` / cluster `8201` (stacks-05 A1) — rotație în [runbook openbao](../runbooks/openbao-secrets-rotation.md).
