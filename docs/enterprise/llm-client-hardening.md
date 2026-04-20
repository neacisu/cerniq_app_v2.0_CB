# Client LLM rezilient: env, VIP, logging, fără PII

**Scop:** task `llm-client-hardening` — client HTTP **rezilient** în `packages/llm`, rutare prin env (**fără URL hardcodat prod**), aliniere **VIP 49000–49004** (stacks-05 B7), logging **JSON** compatibil **Vector** (stacks-02), **fără PII** în mesaje.

---

## Endpoint-uri (stacks-05 B7 — doar ca reper rețea)

| Clasă | VIP port | Serviciu (audit) |
|-------|----------|-------------------|
| 49000 | Open WebUI | |
| 49001 | vLLM reasoning | |
| 49002 | vLLM fast | |
| 49003 | Ollama embeddings | |
| 49004 | LLM Guardrails | |

**În cod:** variabile `LLM_GUARD_BASE_URL`, `LLM_FAST_BASE_URL`, `LLM_REASONING_BASE_URL`, `LLM_EMBEDDINGS_BASE_URL` — valori injectate din CMDB/OpenBao; **nu** concatenați hostname-uri inventate în sursă.

---

## Pachet `packages/llm`

| Fișier | Rol |
|--------|-----|
| `llm-router.ts` | `loadLlmConfigFromEnv`, `resolveEndpoint` |
| `llm-fetch.ts` | `llmFetch` — timeout, retry controlat pentru erori tranzitorii; helper log linie JSON fără conținut sensibil |
| `llm-router.spec.ts` / `llm-fetch.spec.ts` | Teste |

---

## Logging (Vector)

- Linii **JSON** pe stdout/stderr structurat: câmpuri `component`, `outcome`, `duration_ms`, `path` (doar pathname URL), `http_status` — **fără** body request/response, **fără** prompt utilizator.

---

## Verificare

- `pnpm exec nx run llm:test`
- Policy PII: `logging-audit-policy.md`.
