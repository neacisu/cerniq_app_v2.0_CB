# Securitate și confidențialitate (enterprise)

## Model amenințări (rezumat)

| Zonă | Amenințare | Mitigare |
|------|------------|----------|
| Edge | DDoS, scan porturi | Cloudflare + Traefik |
| Auth | Furare sesiune | httpOnly, rotație refresh, rate limit login |
| API | Abuz LLM cost | Cote tenant — [llm-quotas-priority.md](./llm-quotas-priority.md) |
| Date | Exfiltrare tenant | Izolare RLS/API — [business-tenancy-batch-import.md](./business-tenancy-batch-import.md) |
| Loguri | PII în Vector | Redactare — [logging-audit-policy.md](./logging-audit-policy.md) |

## Clasificare date

- **Public**, **Intern**, **Confidențial**, **PII** — etichetare pe câmpuri în dicționarul din [data-domain-erd.md](./data-domain-erd.md).

## CSP (UI)

- Policy strictă pentru `script-src`, `connect-src` (API, SSE); aliniat raportului UI; fără `unsafe-inline` în producție dacă e posibil.

## LLM (stacks-04/05)

- Acces doar prin VIP `49xxx` și ACL-uri rețea; fără URL public necontrolat.

## Rate limiting

- Implementare cu **redis-shared** (stacks-02).

## Email

- Doar prin **Stalwart** (stacks-02); fără container mail nou în proiect.

## Matrice conformitate minimă

| Cerință | Dovadă |
|---------|--------|
| TLS la edge | Traefik + CF |
| Headers securitate | Traefik middleware |
| Dependabot | `.github/dependabot.yml` |
| SBOM | generare în CI (opțional `syft`) |
