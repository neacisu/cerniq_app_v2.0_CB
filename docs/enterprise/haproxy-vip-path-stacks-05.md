# HAProxy VIP (hz.247) — cale către v2

## Context

VIP `10.0.1.10` pe **hz.247**; config extras în stacks-05 din `/etc/haproxy/haproxy.cfg`.

## Trafic v2

- **Dacă** clienții interni folosesc VIP: `443` pe VIP → backend `10.0.0.2:443` (Traefik pe orchestrator).
- Routerele Traefik termină `Host(v2.cerniq.app)` etc. către upstream `25xxx` sau `64xxx` conform [deploy-topology-v2.md](./deploy-topology-v2.md).

## Health checks

- Aliniază cu backend-uri reale; nu introduce porturi din plăile conflictuale **J** (19xxx staging Cerniq vechi) fără ADR — plaja **25xxx** este rezervată v2.

## Fără conflict J+L

- Secțiunile J (VIP map) și L din stacks-05 definesc reguli existente; **25xxx** pe orchestrator este separată de VIP-urile `19xxx`/`29xxx` către LXC Cerniq legacy.
