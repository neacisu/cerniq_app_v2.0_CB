# Politică logging și audit

## Canale

| Canal | Conținut | Destinație |
|-------|----------|------------|
| **stdout JSON** | Operațional: request_id, trace_id, nivel, mesaj fără PII | Vector → stack observability |
| **brain_audit (PG)** | Evenimente business imutabile: cine, ce, când, tenant | Postgres `brain_audit` |
| **Interzis** | Parole, token-uri complete, payload PII în clar în log | — |

## Redactare

- Câmpuri: `email`, `phone`, `authorization`, `cookie`, `password` — truncate/hash înainte de log.
- LLM: nu loga prompturi cu PII; flag `debug_llm` doar în mediu izolat.

## Retenție

- Operațional: conform politicii Vector/Grafana Loki dacă e cazul (aici **nu** Loki standard — vezi ADR-0008).
- Audit: ani multipli; ștergere conform [compliance-data-lifecycle.md](./compliance-data-lifecycle.md).

## trace_id

- Propagare din header sau generat la intrare; inclus în fiecare linie JSON și în SSE.

## Diferență audit vs debug

- **Audit:** obligatoriu pentru acțiuni compliance (login, export date, schimbare rol).
- **Debug:** detalii tehnice, filtrate pe mediu, niciodată cu date personale complete.
