# Politică logging și audit

**Scop:** matrice clară **Vector (operațional JSON)** vs **`brain_audit` (Postgres)** vs **interzis în log**; redactare PII/secrete; **retenție**; **`trace_id` / request id**; diferență **audit business** vs **debug** — aliniat **stacks-02** (Vector) și raportul UI (fără PII în client).

**ADR:** [0008 — Vector + Tempo](../adr/0008-observability-vector-tempo.md) — **fără Loki** paralel ca agregator principal fără excepție ADR.

---

## Matrice canale

| Canal | Conținut permis | Destinație | Nu conține |
|-------|-----------------|------------|------------|
| **stdout / stderr JSON** (API, workeri) | Nivel, mesaj, `reqId`, `trace`/`trace_id`, durate, coduri eroare fără corp sensibil | **Vector** → stack observability | Parole, token JWT complet, corp PII |
| **`brain_audit` (PG)** | Evenimente business imutabile: cine, ce, când, `tenant_id`, tip acțiune | PostgreSQL central (`lxc-postgres-main`) | Date care nu sunt modelate ca audit |
| **Interzis în orice log operațional** | — | — | Parole, `Authorization` complet, cookie sesiune, CSV cu PII în clar, prompt LLM cu PII |

## Redactare (câmpuri sensibile)

- Trunchiere / hash pentru: `email`, `phone`, `authorization`, `cookie`, `password`, token-uri.
- **LLM:** nu loga prompturi cu date personale; flag `debug_llm` doar în mediu izolat, fără rețea de producție.

## `trace_id` și request id

- **Intrare:** header `X-Request-Id` (sau echivalent) propagat de Traefik — vezi [contracts-api-events.md](./contracts-api-events.md).
- **API:** Fastify `genReqId` + log structurat — `apps/api/src/main.ts`.
- **SSE:** același identificator în evenimente telemetrie unde e contractat.

## Retenție

| Tip | Politică |
|-----|----------|
| Loguri operaționale (Vector) | Retenție definită în politica observability (Grafana ca vizualizare); **shipper** log = **Vector** — ADR 0008 |
| `brain_audit` | Ani multipli; arhivare / ștergere conform [compliance-data-lifecycle.md](./compliance-data-lifecycle.md) și GDPR |

## Audit business vs debug

| Tip | Scop | Exemplu |
|-----|------|---------|
| **Audit** | Conformitate: login reușit/eșuat, export date, schimbare rol, acces admin | Rând `brain_audit` + actor |
| **Debug** | Diagnostic tehnic (latency, stack trace fără date user) | Doar medii ne-prod sau nivel filtrat |

## UI / client

- Fără PII în `console.log` în build producție; telemetrie RUM opțională fără date identificabile — vezi raport UI + `apps/web/lib/otel-rum.ts`.
