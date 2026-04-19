# ADR-0004: Orchestrare — Streams, BullMQ, Temporal

## Status

Accepted

## Context

Necesitate de evenimente, întârzieri și workflow-uri lungi fără duplicare logică.

## Decision

- **Redis Streams + consumer groups (`XREADGROUP`)**: transport eveniment sinapsă → neuron; ACK, DLQ stream, retry.
- **BullMQ**: job-uri amânate, retry, cozi prioritizate; **nu** același pas business ca un pas deja modelat ca workflow Temporal fără ADR.
- **Temporal**: workflow-uri gateway lungi, versiuni, compensări/saga.

Aceeași etapă de business **nu** rulează în paralel identic pe două motoare fără ADR excepție.

## Consequences

- Gateway-urile declară în manifest motorul dominant.
- Enforcement în cod + checklist — `tools/ci/gates/orchestration_lint.py`.

## Compliance

stacks-02 redis-shared; stacks-03 worker pe host cu RAM adecvată.
