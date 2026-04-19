# Ciclu de viață date și GDPR (scurt)

## Date personale

- În Postgres (`business.*`, `auth.*`) și opțional embeddings în `brain_core` după confirmare pgvector.

## Drepturi

- **Ștergere:** procedură pe `tenant_id` + utilizator; propagare la embeddings dacă există.
- **Portabilitate:** export JSON agregat pe cerere.

## Retenție minimă

- Audit: conform politicii legale interne.
- Loguri operaționale: săptămâni–luni, fără PII.

## Flux în prompt LLM

- Minimizare: doar fragmente necesare; pseudonimizare unde e posibil.

## DPIA

- Declanșat dacă volum/sensibilitate depășește prag intern — document separat legal.
