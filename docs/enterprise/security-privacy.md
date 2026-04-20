# Securitate și confidențialitate (enterprise)

**Scop:** model de amenințări, clasificare date, politici de retenție și redactare în loguri (**Vector JSON**), CSP/UI, acces LLM (stacks-04/05), rate limiting (**redis-shared**), email (**Stalwart**), plus **matrice de conformitate** trasabilă la stacks.

**Surse:** regulile `.cursor/rules/stacks-01…05`; contracte [contracts-api-events.md](./contracts-api-events.md); audit UI [deep-research-report_cerniq_ui.md](../research/deep-research-report_cerniq_ui.md) (CSP, a11y).

---

## 1. Model amenințări (rezumat)

| Zonă | Amenințare | Mitigare |
|------|------------|----------|
| Edge | DDoS, scan porturi | Cloudflare + Traefik; fără publish haotic porturi app (stacks-02) |
| Auth | Furare sesiune / token | httpOnly cookie unde e cazul; rotație secret; rate limit login — [ADR 0003](../adr/0003-iam-internal-postgres-jwt.md) |
| API | Abuz cost LLM | Cote tenant — [llm-quotas-priority.md](./llm-quotas-priority.md); metrici Prometheus |
| Date multi-tenant | Exfiltrare între tenanți | Izolare RLS / scoping API — [business-tenancy-batch-import.md](./business-tenancy-batch-import.md) |
| Loguri operaționale | PII sau secrete în **Vector** | Redactare câmpuri — [logging-audit-policy.md](./logging-audit-policy.md); JSON structurat compatibil Vector |
| Webhooks | Replay / semnătură invalidă | Idempotency + HMAC — [external-integrations.md](./external-integrations.md) |

---

## 2. Clasificare date

| Nivel | Exemple | Tratare |
|-------|---------|---------|
| Public | Texte UI statice | Fără restricții speciale |
| Intern | ID-uri tehnice nepersonale | Loguri OK fără PII |
| Confidențial | Date business contractuale | Minim în loguri; acces roluri |
| **PII** | Nume, email, telefon clienți | **Interzis** în loguri aplicație brute; mascare în UI debug |

Dicționar câmpuri: [data-domain-erd.md](./data-domain-erd.md).

---

## 3. Retenție și loguri — Vector (JSON)

- **Vector** (stacks-02 observability) agregă stdout JSON — schema stabilă, fără câmpuri sensibile libere.
- **Redactare:** eliminare / substituire pentru `authorization`, cookie, body conținând PII — detaliu în [logging-audit-policy.md](./logging-audit-policy.md).
- **Separare:** audit business critic (`brain_audit` în PG unde e cazul) vs debug operațional — nu amestecați scopurile în același sink fără ADR.

---

## 4. CSP și suprafață UI (raport UI + blueprint)

- **Content-Security-Policy:** restricționare `script-src`, `connect-src` (API, SSE, origini OTel dacă e cazul); evitați `unsafe-inline` în producție unde bundler-ul permite nonce/hash.
- **Raport UI:** aliniere la recomandările din research UI; implementare în `apps/web` cu verificare manuală / Lighthouse pe rute publice.

---

## 5. Acces LLM (stacks-04 / stacks-05)

- Endpoint-uri **49xxx** pe VIP `10.0.1.10` — **ACL** rețea (doar orchestrator, LXC-uri desemnate); vezi regulile stacks-04 (secțiunea B9 VIP) și [llm-quotas-priority.md](./llm-quotas-priority.md).
- **Fără** URL public nefiltrat către inferență; clientul din monorepo folosește rute interne documentate.

---

## 6. Rate limiting (redis-shared)

- Implementare pe API: contorizare cu **redis-shared** (`10.0.0.2:6379` sau `10.0.1.10:6379` conform poziției clientului — stacks-04/05), nu Redis nou în compose proiect.

---

## 7. Email (Stalwart)

- Trimitere mail: doar prin **Stalwart** pe orchestrator (stacks-02); **fără** serviciu mail dedicat în `docker-compose` aplicație.

---

## 8. Matrice conformitate enterprise-grade (trasabilitate)

| Cerință stacks / plan | Artefact / dovadă |
|------------------------|-------------------|
| TLS la edge | Traefik :443; Cloudflare — [cloudflare-dns-tls-procedure.md](./cloudflare-dns-tls-procedure.md) |
| Headers securitate | Middleware Traefik (config live `/opt/traefik`) |
| Loguri JSON → Vector | [logging-audit-policy.md](./logging-audit-policy.md), [ADR 0008](../adr/0008-observability-vector-tempo.md) |
| Fără PII în loguri client | [contracts-api-events.md](./contracts-api-events.md); hook SSE/UI fără date personale în debug |
| Rate limit Redis | Acest doc §6 + implementare API |
| IAM propriu | [ADR 0003](../adr/0003-iam-internal-postgres-jwt.md) |
| Dependabot | `.github/dependabot.yml` |
| SBOM (opțional) | Pipeline CI — `syft` sau echivalent când e activat |

**Închidere gap:** orice rând **Gap** din [compliance-stacks-01-05.md](../compliance-stacks-01-05.md) trebuie rezolvat sau mutat în ADR *Excluded* cu owner.
