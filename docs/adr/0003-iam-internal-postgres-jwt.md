# ADR-0003: IAM intern (Postgres + JWT/sesiuni)

## Status

Accepted

## Context

stacks-02: Zitadel deprecated; fiecare proiect își definește IAM.

## Decision

Autentificare și autorizare în `apps/api` cu tabele `auth.*` pe Postgres central; token JWT scurt + refresh opțional sau sesiune cookie httpOnly. Secrete semnătură din **OpenBao**.

## Consequences

- Fără dependență SaaS auth extern pentru nucleu.
- RBAC mapat la capitole blueprint — vezi `impl-rbac-suite-chapters` în cod și teste.

## Compliance

stacks-02 OpenBao; Traefik termină TLS.
