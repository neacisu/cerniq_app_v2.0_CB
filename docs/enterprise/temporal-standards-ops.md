# Standarde Temporal — operațiuni și dezvoltare

**Scop:** task `temporal-standards-ops` — convenții **namespace**, **cozi**, **timeouts**, **versioning**, **teste replay**; **stacks-03** (worker pe host cu RAM adecvată — **nu** workload memorie grea pe **`lxc-ci-worker` 8 GiB**); **observabilitate** metrics/traces către stack-ul existent (**stacks-02**).

---

## Cluster

- Adresă cluster din **CMDB / OpenBao** — variabilă **`TEMPORAL_ADDRESS`** (ex. `host:7233`), **fără** string hardcodat prod în sursă.
- Referință DR / backup: [dr-rpo-rto.md](./dr-rpo-rto.md) (Temporal menționat în context cluster).

---

## Convenții (dovadă cod)

| Parametru | Valoare / sursă |
|-----------|-----------------|
| **Namespace** | `TEMPORAL_NAMESPACE` — implicit **`default`** în worker dacă lipsește env; pentru medii dedicate folosiți namespace explicit (ex. `cerniq-v2`) aprobat în deploy. |
| **Task queue** | `TEMPORAL_TASK_QUEUE` — implicit **`cerniq-gateway-default`** în `apps/temporal-worker/src/main.ts`. |
| **Workflow-uri** | `apps/temporal-worker/src/workflows.ts` — cod izolat workflow (fără import Node în fișier workflow). |
| **Timeouts** | La introducere activități: **start-to-close** explicite; fără așteptări infinite — vezi [ADR 0004](../adr/0004-orchestration-streams-bullmq-temporal.md). |
| **Versioning** | Schimbări breaking: `patched` / versiuni workflow în SDK Temporal — documentație oficială Temporal; nu modificați istoric fără procedură. |

---

## Worker — plasament (stacks-03)

- Procesul worker (**`pnpm`** / `node dist/main.js` din `apps/temporal-worker`) trebuie rulat pe **host cu resurse adecvate**.
- **`lxc-ci-worker`** (**8 GiB** — vezi reguli stacks-03): **nu** pentru antrenamente grele sau workeri cu footprint mare; CI rămâne pentru **teste ușoare** (logică workflow, build).

---

## Teste

- **Logică workflow:** `apps/temporal-worker/src/workflows.spec.ts` — verifică comportamentul funcțiilor exportate fără server Temporal.
- **Replay istoric:** pentru modificări breaking, folosiți **replay** din istoric exportat (Temporal CLI / UI) conform documentației Temporal; în **CI** se evită server Temporal complet — teste **replay** opționale pe mașină cu resurse, nu obligatoriu pe fiecare PR (memorie `lxc-ci-worker`).

---

## Observabilitate (stacks-02)

- **Worker Temporal:** `apps/temporal-worker` expune **`GET /metrics`** (Prometheus, `prom-client`) pe `METRICS_HOST` / `METRICS_PORT` (implicit `127.0.0.1:25091`; pe host intern setați bind-ul potrivit pentru scrape din rețeaua observability). Dezactivare: `METRICS_DISABLED=1`.
- **Metrics / traces aplicație API:** export **OTel** din `apps/api` și integrare cu **Prometheus / Tempo** din stack-ul **observability** existent pe orchestrator — vezi [ADR 0008](../adr/0008-observability-vector-tempo.md), [logging-audit-policy.md](./logging-audit-policy.md).
- **Fără** stack paralel de observabilitate în compose proiect.

---

## Legături

- Matrice orchestrare: [orchestration-matrix.md](./orchestration-matrix.md).
- CI: `.github/workflows/ci.yml` — nu pornește automat cluster Temporal; gate-uri Python rămân aplicabile.
