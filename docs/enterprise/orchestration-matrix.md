# Matrice orchestrare — ADR + motoare (obligatoriu)

**Scop:** un singur pas de business **nu** este dublat în două motoare (Stream + Temporal, etc.) fără **ADR excepție**. Aliniat **stacks-01** (dovadă în repo) și **[ADR 0004](../adr/0004-orchestration-streams-bullmq-temporal.md)**, **[ADR 0006](../adr/0006-langgraph-deferred.md)**, **[ADR 0007](../adr/0007-langgraph-placement.md)**.

## Matrice motor → responsabilitate

| Motor | Rol | Mecanism principal | Interzis fără ADR |
|-------|-----|---------------------|-------------------|
| **Redis Streams** | Eveniment sinapsă → neuron; fan-out; ordine per stream | **`XREADGROUP`** (consumer group), **`XACK`**, DLQ pe stream dedicat | Același pas „execute once delayed” ca job **BullMQ** cu aceeași semantică |
| **BullMQ** | Întârziere, **retry**, cozi **prioritizate**, job-uri programate scurte | Cozi Redis (`redis-shared`) | Workflow de zile / compensări multi-paș — acolo e **Temporal** |
| **Temporal** | Workflow **gateway** lung, **versiuni**, **saga / compensare** | Worker Temporal (cluster partajat; vezi `temporal-standards-ops.md`) | Duplicare aceluiași pas ca handler **Stream** pentru același efect final |
| **LangGraph** | Flux **agentic** | Doar unde **[ADR 0007](../adr/0007-langgraph-placement.md)** plasează explicit | Orice pas deja în Temporal sau doar în Stream |

## Redis Streams — `XREADGROUP` (dovadă cod)

Runtime-ul sinapse din monorepo folosește **`SynapseStreamConsumer`** — `packages/messaging/src/lib/redis-streams.ts` (`xreadgroup`, `xgroup`, ACK). Conexiune: **`REDIS_URL`** → **redis-shared** (stacks-02).

Manifeste stream: **`packages/manifests/SYNAPSE_MATRIX.csv`** — coloane `stream_key`, `consumer_group` (sursă pentru generatoare; fără nume inventate în afara CSV).

## BullMQ

- Cozi pentru retry amânat, priorități — pachet `bullmq` în monorepo (versiune în `package.json` rădăcină).
- **Nu** duplica același pas ca **Stream + BullMQ** simultan pentru același eveniment final (aceeași idempotency).

## Temporal

- Gateway-uri declară `orchestration: "temporal"` în `manifest.json` — vezi exemplu real mai jos.

## LangGraph

- **Deferred** implicit v1 — [ADR 0006](../adr/0006-langgraph-deferred.md). Fără plasare până la ADR dedicat.

---

## Anti-duplicare (checklist)

| Situație | Acțiune |
|----------|---------|
| Același eveniment în Stream și ca activitate Temporal identică | Un singur motor; altfel ADR |
| Retry scurt | BullMQ sau policy Temporal — nu ambele pentru același „tick” |
| Consumator Stream | Un singur consumer group per sinapsă; DLQ documentat |

**Enforcement:** `tools/ci/gates/orchestration_manifests.py` — câmp `orchestration` ∈ `stream` \| `bullmq` \| `temporal` \| `sync` \| `langgraph` pe fiecare `packages/gateways/*/manifest.json`. **`tools/ci/gates/synapse_matrix_unique_streams.py`** — `stream_key` unic în `SYNAPSE_MATRIX.csv` (fără fan-out duplicat).

---

## Exemple pe gateway-uri (≥2–3)

### 1. `gateway-hello` (dovadă repo)

- **Manifest:** `packages/gateways/gateway-hello/manifest.json` — `"orchestration": "temporal"`.
- **Rol:** exemplu workflow gateway — fără LangGraph în același manifest.

### 2. Flux Stream sinapsă → neuron (`synapse-ping` / `neuron-ping`)

- **SYNAPSE_MATRIX.csv:** `stream_key=brain:ping:events`, `consumer_group=cg-ping`.
- **NEURON_MATRIX.csv:** `neuron-ping` — bounded context asociat.
- **Pattern:** publicare eveniment pe stream → **XREADGROUP** în grup → procesare neuron → **XACK** (eșec → DLQ / retry policy).

### 3. Flux întârzieri / retry (BullMQ)

- **Pattern:** după validare API, job „reprocess row” peste **N minute** — coadă BullMQ; **nu** același pas ca activitate Temporal „sleep N minute” fără ADR.

---

## Dovezi stacks-01

- Fiecare gateway nou: `orchestration` valid în manifest + revizuire la adăugare motor nou.
- Fără presupuneri pe host Redis: connection string din env / CMDB, nu hardcodat în cod sursă.
