# ADR-0006: LangGraph — implicit Deferred pentru v1 runtime

## Status

Accepted

## Context

Raportul backend menționează LangGraph; planul cere plasare explicită.

## Decision

LangGraph **nu** este folosit în runtime până la ADR de plasare care justifică fluxul agentic și resursele (stacks-03). Fluxurile existente folosesc neuroni sincroni + Streams + Temporal.

## Consequences

Dacă se introduce: ADR [0007](./0007-langgraph-placement.md) actualizat + resurse host desemnate.

## Compliance

stacks-01 fără presupuneri.
