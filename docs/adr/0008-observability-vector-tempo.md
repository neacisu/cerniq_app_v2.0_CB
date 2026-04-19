# ADR-0008: Observabilitate — Vector + Tempo (fără Loki paralel)

## Status

Accepted

## Context

Raportul backend menționează Loki; stacks-02 folosește Vector ca log shipper și Tempo pentru trace.

## Decision

Loguri aplicație: **JSON** către stdout, agregate de **Vector**. Trace: **OTel** → **Tempo**. **Loki** nu se introduce în proiect fără ADR excepție.

## Consequences

Formatare log compatibilă cu pipeline-ul existent pe orchestrator.

## Compliance

stacks-02 observability stack.
