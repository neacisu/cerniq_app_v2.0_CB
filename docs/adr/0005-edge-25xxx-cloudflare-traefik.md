# ADR-0005: Edge v2 — 25xxx, Cloudflare, Traefik

## Status

Accepted

## Context

Plaja `25xxx` nu intră în conflict cu matricea auditată stacks-05 (19/26/29/39/49/64/65).

## Decision

- Servicii v2 expuse local pe `25000` (web), `25010` (api), `25012` (admin) — vezi [port-matrix-v2-25xxx.md](../enterprise/port-matrix-v2-25xxx.md).
- Internet: opțional Cloudflare → origin `77.42.76.185:443` Traefik → routere `Host()`.

## Consequences

DNS și SSL documentate în runbook + task-uri `cf-mcp-*` executate cu MCP Cloudflare când e cazul.

## Compliance

stacks-04/05; fără IP inventat.
