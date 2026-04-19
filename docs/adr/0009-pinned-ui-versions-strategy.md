# ADR-0009: Strategie versiuni UI pinuite vs @nx/next

## Status

Accepted

## Context

Blueprint fixează versiuni (Next 16.2.4, React 19.2.x, Tailwind 4.2.2, Motion 12.38, TanStack Query 5.99.1, Zustand 5.0.10, Storybook 10.3.5). Pluginul @nx/next poate întârzia suportul unei majore Next.

## Decision

1. **Țintă:** aliniere la blueprint cât timp build și CI trec.
2. **Dacă Nx blochează Next major:** opțiuni documentate — (a) așteptare release plugin; (b) pin intermediar Next-1 cu înregistrare în acest ADR; (c) override documentat cu teste complete.
3. Lockfile `pnpm-lock.yaml` este sursa de adevăr în CI (`--frozen-lockfile`).

## Consequences

Tensiunea „Next 14 în text research UI” este închisă prin [frontend-version-pin.md](../enterprise/frontend-version-pin.md).

## Compliance

stacks-01 verificare la upgrade.
