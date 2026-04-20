# Contract API: OpenAPI, erori, versioning, idempotency, rețea

**Scop:** task `api-contract-openapi` — contract **OpenAPI 3.1** sincron cu `apps/api`, envelope erori, antete (`X-Request-Id`, `Idempotency-Key`), ingress **Traefik**, aliniere porturi **64xxx** / VIP **19xxx/29xxx** (stacks-05).

---

## OpenAPI canonic

| Artefact | Locație |
|----------|---------|
| Specificație | `docs/openapi/openapi.yaml` |
| Paritate cod ↔ căi | `tools/ci/gates/openapi_paths_sync_gate.py` |

**Versiune API:** `info.version` în OpenAPI; prefix rută `/v1/*` pentru resurse versionate.

---

## Erori

- Schema **`ErrorEnvelope`** în OpenAPI (`components.schemas.ErrorEnvelope`) — aliniată plugin `20-error-envelope` în Fastify.

---

## Idempotency

- Header **`Idempotency-Key`** pe căi cu efecte repetabile (ex. `POST /v1/webhooks/inbound`) — vezi `contracts-api-events.md`.

---

## Ingress (stacks-02)

- **Traefik** pe orchestrator; TLS la edge; upstream către plaja serviciilor aplicației (ex. **25xxx** orchestrator sau **64xxx** pe LXC Cerniq — vezi `deploy-topology-v2.md`, secțiuni B2/B3 stacks-05).

---

## VIP HAProxy (stacks-05)

- Exemple mapare **19xxx** staging / **29xxx** prod către **64000/64010/64012** pe LXC — tabel în `.cursor/rules/stacks-05-port-matrix.md` (B2, B3); fără port inventat în cod fără CMDB.

---

## Verificare

- `pnpm exec nx run api:test` include `contract-openapi-routes.spec.ts` unde e cazul.
- Gate: `openapi_paths_sync_gate.py`.
