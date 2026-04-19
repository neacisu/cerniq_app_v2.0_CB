# Integrări externe (webhooks, ERP)

## Inbound

- Semnătură HMAC (secret OpenBao).
- `Idempotency-Key` obligatoriu.
- Rate limit per sursă IP + tenant (redis-shared).

## Outbound

- Retry cu backoff; dead letter în `brain_audit` sau coadă dedicată.
- Rotație secret: playbook OpenBao.

## Contracte

- Schema payload versionată; breaking changes = versiune nouă path `/v2/webhooks/...`.

## Fără servicii duplicate stacks-02

- Nu introduce broker/mail/DB nou în compose proiect.
