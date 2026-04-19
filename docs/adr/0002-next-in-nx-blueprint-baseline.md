# ADR-0002: Next.js în Nx — baseline blueprint Apr 2026

## Status

Accepted

## Context

Raportul backend a menționat istoric un template Vite; raportul UI + blueprint impun Next App Router, React 19.2, Tailwind 4.2, Motion 12, Storybook 10.

## Decision

`apps/web` este aplicație **@nx/next** cu App Router. Versiunile țintă sunt reconciliate în [frontend-version-pin.md](../enterprise/frontend-version-pin.md). **Vite nu este shell principal** al produsului.

## Consequences

- Rute API Next pentru proxy SSE unde e cazul (`app/api/*`).
- SSR/standalone documentat în [deploy-topology-v2.md](../enterprise/deploy-topology-v2.md).

## Compliance

stacks-02 Traefik pentru față publică.
