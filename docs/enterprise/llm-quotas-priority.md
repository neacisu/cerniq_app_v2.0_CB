# Guvernanță LLM — cote, priorități, degradare, metrici

**Scop:** fără consum **nelimitat** în producție; cote **per tenant** / utilizator; urmărire **tokeni** și **latentă**; **priorități** de coadă; **degradare controlată**; integrare **Prometheus** — aliniat **stacks-04/05** (VIP LLM, ACL) și codul **`packages/llm`**.

**Dovezi repo:** rutare env — `packages/llm/src/lib/llm-router.ts` (`LLM_GUARD_BASE_URL`, `LLM_FAST_BASE_URL`, `LLM_REASONING_BASE_URL`, `LLM_EMBEDDINGS_BASE_URL`); clase `guard` \| `fast` \| `reasoning` \| `embeddings` mapate la **VIP 49000–49004** în infrastructură (stacks-05 B7), nu URL hardcodat în prod.

---

## 1. Endpoint-uri și rețea (stacks-05 / stacks-04)

| Clasă (cod) | Rol | Poziție audit |
|-------------|-----|----------------|
| `guard` | Filtrare / policy | VIP **49004** (guardrails) — ACL strict |
| `fast` | Latență mică | **49002** (vLLM fast, hz.113) |
| `reasoning` | Raționament | **49001** (vLLM reasoning) |
| `embeddings` | Vectori | **49003** (Ollama embed, hz.62) |

Acces doar din surse permise de **ACL** (orchestrator, LXC desemnate) — vezi regulile stacks-04 (VIP `10.0.1.10`).

---

## 2. Cote (tenant / utilizator)

| Dimensiune | Exemplu politică |
|------------|------------------|
| Tokeni / perioadă (lună) | Plafon per `tenant_id`; opțional sub-plafon per `user_id` |
| Concurență | Număr maxim cereri paralele per tenant |
| Burst | Scurt — evitați „nelimitat” chiar și pe spike |

**Persistență:** contoare în **redis-shared** (rate / sliding window); agregări și reconciliere în **Postgres** pentru raportare internă (fără PII în metrici brute).

---

## 3. Prioritate coadă

- Cozi sau **score** în coadă: tier contractual (ex. enterprise > standard > dev) — implementare în worker/API, nu în LLM direct.
- **Fără** să ocoliți cotele prin apel direct VIP din client neautorizat.

---

## 4. Degradare controlată

| Situație | Răspuns |
|----------|---------|
| Depășire cotă | **429** + corp envelope erori (OpenAPI) |
| Sarcină permisă dar presiune | Model **fast** în loc de **reasoning** (dacă contractul permite) |
| Semnal client | Header opțional `X-Cerniq-Degraded: 1` (dacă adoptat în contract) |

---

## 5. Metrici Prometheus (ținte instrumentare)

**Implementat (API):** `cerniq_llm_quota_checks_total` cu label `result` ∈ `ok` \| `exceeded` \| `error` — incrementat la `GET /v1/llm/health` (`apps/api/src/app/lib/cerniq-metrics.ts`). Alerte recomandate: rată ridicată `exceeded` sau `error` față de baseline.

Nume **țintă** suplimentare (wire în `impl-otel-prometheus-api-instrumentation` / worker):

- `cerniq_llm_tokens_total` (labels: tenant, class, outcome)
- `cerniq_llm_latency_seconds` (histogramă)
- `cerniq_llm_quota_violations_total` (poate fi derivat din `result="exceeded"`)

Export către stack existent **Prometheus** pe orchestrator (stacks-02) — fără server metrici paralel nejustificat.

---

## 6. Producție — interdicții

- **`LLM_UNLIMITED`** sau echivalent: **interzis** când `NODE_ENV=production`.
- Loguri: fără prompt cu PII — vezi [logging-audit-policy.md](./logging-audit-policy.md).

---

## 7. Legături

- [security-privacy.md](./security-privacy.md), [contracts-api-events.md](./contracts-api-events.md), [ADR 0005](../adr/0005-edge-25xxx-cloudflare-traefik.md) (edge).
