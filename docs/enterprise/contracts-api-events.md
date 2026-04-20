# Contracte API, SSE și evenimente

**Scop:** contract „înainte de cod” pentru consumatori interni (`apps/web`) și externi (integrări), aliniat la **stacks-02** (Traefik, servicii shared, fără expunere haotică de porturi) și la implementarea din `apps/api`.

**Sursă canonică OpenAPI:** [`docs/openapi/openapi.yaml`](../openapi/openapi.yaml) — **OpenAPI 3.1.0**, `info.version` **1.0.0** (versiune document contract; evoluție: bump semver la schimbări breaking).

**Server URL de documentare:** `https://api.v2.cerniq.app` — fără prefix `/v1` în `servers.url`; căile versionate sunt absolute sub rădăcină (`/v1/...`).

---

## Versiune și prefix REST

- Prefix API public: **`/v1`** pentru resurse versionate.
- **`Accept`:** `application/json` unde e cazul; răspunsuri JSON: `Content-Type: application/json; charset=utf-8`.
- Endpointuri fără versionare în contractul curent: **`/health`** (liveness), **`/ready`** (readiness), **`/metrics`** (Prometheus).

---

## Aliniere stacks-02 — Traefik și ingress

- **Ingress:** aplicația nu se bazează pe publish direct de porturi publice din compose-ul proiectului; față spre internet trece prin **Traefik** pe orchestrator (stacks-02; IP public **`77.42.76.185`**, `443` — stacks-05 A1).
- **Routere:** selecție tipică `Host(...)` pentru `v2.cerniq.app`, `api.v2.cerniq.app`, `admin.v2.cerniq.app` (nume din plan; configurarea efectivă în `/opt/traefik` = dovadă operațională separată).
- **Headers de margine (convenție):** Traefik propagă de obicei **`X-Forwarded-For`**, **`X-Forwarded-Proto`**, **`X-Forwarded-Host`**, **`X-Real-Ip`** — folosite pentru audit și construire URL; nu înlocuiesc autentificarea.

---

## Trace și corelare

| Mecanism | Rol |
|----------|-----|
| **`X-Request-Id`** | Corelare request în loguri și telemetrie; generat la edge sau în API dacă lipsește (plugin request-id). |
| **`traceparent` / `tracestate`** (W3C) | Opțional de la client; altfel generat la intrare pentru OTel. |
| **`request_id` în envelope erori** | Aliniat la id-ul de cerere Fastify (`requestId`), serializat ca **`request_id`** în JSON (underscore). |

---

## ID-uri încrucișate business ↔ Brain (blueprint §25)

Schema OpenAPI: **`components.schemas.BrainCrossEntityRefs`** — `trace_id`, `gateway_id`, `neuron_id`, `synapse_id`, `workflow_run_id` (opțional), `tenant_id`.

**Convenție query string (UI `apps/web`):**

| Parametru | Semnificație |
|-----------|--------------|
| `trace` | `trace_id` — explorer `/brain/traces` |
| `gateway` | `gateway_id` — catalog / context gateway |
| `neuron` | `neuron_id` — overview / inspector |
| `synapse` | `synapse_id` — extensie sinapsă |
| `cerniq_focus` | Mod UI pe overview; valoare **`neuron_explanation`** = panou explicație neuron (deep-link din Analytics, CRM, Sales) |

Implementare: `apps/web/lib/brain-cross-entity.ts`, componentă `BrainCrossLinks`.

---

## Envelope erori (JSON)

Schema referință în OpenAPI: `components.schemas.ErrorEnvelope`. Formă minimă compatibilă cu handler-ele actuale:

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "Mesaj sigur pentru client",
    "request_id": "uuid-sau-id-cerere"
  }
}
```

**Coduri HTTP (reper):** `400` validare / antete lipsă, `401` neautentificat / semnătură invalidă, `403` interzis / tenant, `404` lipsă, `409` conflict idempotency, `429` cotă / rate limit, `503` dependență neconfigurată, `5xx` intern.

---

## Idempotency

- **Header:** `Idempotency-Key` — pe căile care creează efecte repetabile (ex. **POST** webhook).
- **Validare runtime (implementare actuală):** lungime minimă **8** caractere; format **UUID** recomandat în documentație, nu impus strict de toate handler-ele.
- **Țintă producție:** stocare rezultat în **Redis `redis-shared`** (stacks-02) cu TTL (ex. 24h) și replay idempotent — descris ca obligație de produs; implementare parțială trebuie urmărită în todo-uri `impl-webhooks-*` / messaging.

---

## SSE — telemetrie Brain

- **Endpoint API:** `GET /v1/cognitive/stream`.
- **`Content-Type`:** `text/event-stream; charset=utf-8`; `Cache-Control: no-cache, no-transform`; `Connection: keep-alive`.
- **Evenimente emise în implementarea curentă** (referință cod): `event: telemetry` cu payload JSON conținând cel puțin `type` (ex. `connected`, `tick`), `request_id` / `seq` / `ts` după caz — vezi `apps/api/src/app/routes/v1/cognitive-stream.ts`.
- **Client:** `EventSource` cu reconectare și backoff; serverul poate trimite comentarii heartbeat (`: ping`) — politică de interval de definit la hardening.

---

## Consumatori

| Tip | Acces | Note |
|-----|-------|------|
| **Intern** | `apps/web` prin Traefik | Sesiune cookie httpOnly și/sau **Bearer JWT**; header tenant conform `X-Tenant-Id` unde e cerut de rută. |
| **Extern** | Doar prin TLS + controale edge | API keys / secrete din **OpenBao** (stacks-02); rate limiting cu **Redis**; fără expunere directă a portului procesului aplicație pe internet. |

---

## Mapare fișiere utile

| Artefact | Locație |
|----------|---------|
| OpenAPI | `docs/openapi/openapi.yaml` |
| Rute API | `apps/api/src/app/routes/**/*.ts` |
| SSE | `apps/api/src/app/routes/v1/cognitive-stream.ts` |

**Verificare automată:** gate `tools/ci/gates/openapi_paths_sync_gate.py` (paritate căi OpenAPI ↔ înregistrări rute în cod).

---

**Dovadă reguli:** stacks-01 (fără presupuneri fără dovadă), stacks-02 (Traefik, Redis, Postgres central, OpenBao), stacks-04/05 pentru rețea și porturi când documentezi deploy.
