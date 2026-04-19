# Matrice orchestrare — motor → responsabilitate

| Motor | Rol | Exemplu | Interzis fără ADR |
|-------|-----|---------|-------------------|
| **Redis Streams** | Evenimente sinapsă→neuron, fan-out, ordine parțială | `synapse-ping` publică pe `stream:neuron:ping:events` | Același pas ca job BullMQ cu aceeași semantica „execute once delayed” |
| **BullMQ** | Întârziere, retry, priorități, cron ușor | Reîncercare export CSV peste 5m | Workflow compensare multi-zile |
| **Temporal** | Workflow gateway, versiuni, saga | `gateway-hello` orchestrare pași lungi | Duplicare pas identic într-un consumer Stream |
| **LangGraph** | Flux agentic (Deferred v1) | — | Orice pas deja în Temporal |

## Exemple gateway (2–3)

1. **Gateway ingest CSV:** validare sincronă API → publică eveniment Stream → neuron procesare; eșec retry prin BullMQ; orchestrare batch multi-fișier Temporal.
2. **Gateway notificare:** Temporal pentru saga (email via Stalwart + audit); fără Stream paralel pentru același mesaj final.
3. **Gateway health sync:** neuroni sincroni + metrici Prometheus; fără LangGraph.

## Dovezi stacks-01

Fiecare gateway nou are în manifest câmp `orchestration: stream|bullmq|temporal|sync` validat de generator/CI.
