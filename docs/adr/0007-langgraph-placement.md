# ADR-0007: Plasare LangGraph (subordonat 0004)

## Status

Accepted (placeholder — runtime Deferred)

## Context

Orchestrare multi-motor trebuie evitată pentru același pas.

## Decision

**Dacă** LangGraph este adoptat: doar pentru subgraph-uri agentice explicite; **nu** duplică pașii Temporal sau cozi BullMQ. Worker pe host cu ≥ resurse recomandate (nu `lxc-ci-worker` 8 GiB pentru antrenamente grele).

## Consequences

Versiune SDK și cluster documentate la momentul activării.

## Compliance

stacks-03 alocare resurse.
