# Integrări externe — webhooks, ERP, parteneri

**Scop:** contracte **versionate**, secrete **OpenBao**, **Idempotency-Key**, **semnătură** (HMAC), **rate limit** pe **redis-shared**; **fără** servicii noi duplicate stacks-02 (broker/mail/DB în compose proiect).

**Dovezi API:** rută înregistrată `POST` — `apps/api/src/app/routes/v1/webhooks-inbound.ts` (prefix plugin `/v1` → URL publică `/v1/webhooks/inbound` conform montării Fastify). Contract OpenAPI: [contracts-api-events.md](./contracts-api-events.md) + `docs/openapi/openapi.yaml`.

---

## 1. Inbound (partener → Cerniq)

| Cerință | Implementare țintă |
|---------|---------------------|
| **Autentificare** | HMAC-SHA256 (sau schema aprobată) pe corp; secret în **OpenBao**, injectat env |
| **Idempotency** | Header **`Idempotency-Key`** obligatoriu pentru mutații; deduplicare în **redis-shared** sau Postgres |
| **Rate limit** | Per sursă IP + `tenant_id` — contoare Redis (stacks-02) |
| **Schema** | Versiune în path sau header; breaking change → `/v2/...` |

## 2. Outbound (Cerniq → partener)

- **Retry** cu backoff exponențial; limită încercări.
- **Dead letter:** eveniment în `brain_audit` sau coadă dedicată BullMQ — vezi [orchestration-matrix.md](./orchestration-matrix.md).
- **Rotație secret:** [runbooks/openbao-secrets-rotation.md](../runbooks/openbao-secrets-rotation.md).
- **Implementare bibliotecă:** `packages/shared/src/lib/webhook-outbound.ts` — `deliverCerniqWebhook(targetUrl, body, { secret, idempotencyKey })` trimite `POST` cu `Content-Type: application/json`, **`Idempotency-Key`**, **`X-Cerniq-Signature`** (HMAC-SHA256 hex același algoritm ca inbound). URL-ul țintă vine din env / CMDB, **nu** din cod.

## 3. Contracte și versiuni

- Payload **JSON** schema versionată în repo (`docs/openapi` sau JSON Schema dedicat).
- **Breaking changes:** nou path major; deprecare anunțată în release notes interne.

## 4. Fără duplicate stacks-02

- **Nu** adăugați Redis/Mail/Postgres în `docker-compose` aplicație pentru integrări — folosiți **redis-shared**, **Stalwart**, **Postgres central** — gate CI `compose_no_duplicate_datastores`.

## 5. Legături

- [env-matrix-secrets.md](./env-matrix-secrets.md), [security-privacy.md](./security-privacy.md), [logging-audit-policy.md](./logging-audit-policy.md).
