# ADR-0001: Nx + pnpm canonic

## Status

Accepted

## Context

Raportul backend impune Nx; raportul UI menționează pnpm și Turbo ca ergonomie.

## Decision

Orchestrator monorepo: **Nx**. **pnpm** este package manager. **Turbo** nu înlocuiește Nx; orice referință Turbo din documentație UI se interpretează ca monorepo cu pnpm fără schimbare orchestrator.

## Consequences

- `nx affected`, graph și generators rămân sursa de adevăr.
- CI folosește `pnpm` + `nx`.

## Compliance

stacks-01 — fără presupuneri; dovada în `nx.json`, `package.json`.
