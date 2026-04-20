# Ciclu de viață date, clasificare și GDPR

**Scop:** date personale în **Postgres** / opțional **embeddings** (`brain_core`, **pgvector** după confirmare instanță — vezi [data-domain-erd.md](./data-domain-erd.md)); proceduri **ștergere** și **portabilitate**; **retenție** minimă; flux date în **prompt LLM**; **DPIA** când e cazul; **referință legală internă** (fără text juridic complet în repo).

**Aliniere:** stacks-02 (date în Postgres central); raport UI (fără PII în client); [logging-audit-policy.md](./logging-audit-policy.md).

---

## 1. Clasificare date

| Nivel | Stocare tipică | Note |
|-------|----------------|------|
| Date personale (PII) | `business.*`, `auth.*` | Minimizare câmpuri |
| Metadate tehnice | Loguri JSON → Vector | Fără PII — politică redactare |
| Embeddings | `brain_core.*` (vector) | Opțional; ștergere legată de obiectul sursă |
| Audit | `brain_audit` | Imutabilitate; retenție conform politicii |

---

## 2. Drepturi subiect (rezumat operațional)

| Drept | Acțiune în produs |
|-------|-------------------|
| **Ștergere („right to be forgotten”)** | Procedură pe `tenant_id` + identificator utilizator; propagare la înregistrări dependente; **re-embedding** sau ștergere vector dacă aplicațiile stochează legături |
| **Portabilitate** | Export structurat (JSON/CSV) pe cerere validată; fără export ad-hoc în loguri |
| **Rectificare** | Flux UI/API standard pe entitățile business |

**Înregistrare:** evenimente sensibile în **`brain_audit`** unde e cazul.

---

## 3. Retenție minimă

| Tip | Principiu |
|-----|-----------|
| Loguri operaționale | Săptămâni–luni; fără PII — [logging-audit-policy.md](./logging-audit-policy.md) |
| Audit business | Conform obligațiilor legale interne + produs |
| Date de marketing / opționale | Doar cu bază legală documentată intern |

---

## 4. Flux date în prompt LLM

1. **Minimizare** — doar fragmente necesare pentru task.
2. **Pseudonimizare** unde e fezabil înainte de apel la endpoint-uri **49xxx**.
3. **Fără** logare prompt complet în producție — vezi politica logging.

---

## 5. DPIA (Data Protection Impact Assessment)

- **Declanșare:** când volumul / sensibilitatea prelucrării depășește **pragul intern** (definit de legal/compliance — nu în repo).
- **Livrabil:** document **în afara** monorepo-ului sau în sistem intern aprobat; acest fișier doar cere procesul.

---

## 6. Referință legală internă

- Politici GDPR / contracte client: **CMDB / sharepoint intern** — nu link public în git.

---

## 7. Legături

- [business-tenancy-batch-import.md](./business-tenancy-batch-import.md), [security-privacy.md](./security-privacy.md), [ADR 0003](../adr/0003-iam-internal-postgres-jwt.md).
