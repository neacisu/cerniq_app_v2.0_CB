# Security baseline — TLS, rate limit, audit, dependențe

**Scop:** task `security-baseline` — **TLS** la edge (**Traefik**), **headers** de securitate, **rate limiting** cu **redis-shared** (stacks-02); acces **LLM** conform **ACL** stacks-04/05; audit **`brain_audit`**; email doar via **Stalwart** stacks-02 dacă e nevoie (**fără** mailer nou în proiect); **Dependabot** + reper **SBOM**.

---

## TLS și edge

- Terminare **TLS** la **Traefik** (orchestrator **443**) — vezi [c4-deployment-views.md](./c4-deployment-views.md), [deploy-topology-v2.md](./deploy-topology-v2.md).
- **Cloudflare** opțional în față — mod SSL **Full (strict)** documentat în plan (todo-uri `cf-mcp-*`).

---

## Headers și politici

- **CSP** / headers UI — [security-privacy.md](./security-privacy.md).
- **API:** envelope erori — OpenAPI `ErrorEnvelope`; request **`X-Request-Id`** — [contracts-api-events.md](./contracts-api-events.md).

---

## Rate limiting

- **redis-shared** pentru contorizare / sliding window la edge sau în API — vezi [security-privacy.md](./security-privacy.md) (rate limit); **fără** Redis dedicat proiect.

---

## LLM — ACL (stacks-04 / 05)

- Endpoint-uri **VIP 49xxx** — acces doar din rețele desemnate; rutare prin env **`LLM_*_BASE_URL`** — [llm-client-hardening.md](./llm-client-hardening.md), [llm-quotas-priority.md](./llm-quotas-priority.md).

---

## Audit

- Evenimente append-only **`brain_audit.event`** — migrații [data-model-erd-migrations.md](./data-model-erd-migrations.md); nu stoca PII în payload fără control — [logging-audit-policy.md](./logging-audit-policy.md).

---

## Email

- Trimitere notificări prin **Stalwart** (stacks-02) — **fără** container SMTP nou în compose aplicație.

---

## Dependențe și SBOM

- **Dependabot:** fișier **`dependabot.yml`** sub `.github/` — actualizări **npm** și **github-actions**.
- **SBOM:** generare recomandată în pipeline release (ex. CycloneDX / `pnpm` audit export) — fără fișier SBOM generat static în repo dacă nu există proces aprobat; urmărire vulnerabilități prin Dependabot + review PR.

---

## Verificare

- Gates CI: `frontend_version_pins`, `lockfile`, `no_critical_placeholders`.
- Policy completă: [security-privacy.md](./security-privacy.md).
