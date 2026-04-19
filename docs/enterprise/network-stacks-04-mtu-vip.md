# Rețea stacks-04 — MTU/MSS și căi Redis

## Orchestrator

- Public: `77.42.76.185/32`
- vSwitch: `10.0.0.2/32`, rută `10.0.0.0/16`, **MTU 1450** pe `enp7s0` (stacks-04).
- **redis-shared:** DNAT `10.0.0.2:6379` → `172.17.0.2:6379`.

## MSS / blackhole

Dacă apar conexiuni care se închid fără răspuns pe căi MTU reduse, diagnosticați cu `ping -M do -s` și ajustați MSS pe tunnel sau path (documentați în incident).

## VIP

- **10.0.1.10** pe `hz.247` (HAProxy) — proxy către Traefik `443` și Redis `6379` (stacks-05 B1).

## Dev hz.164

- Folosiți rutele și firewall-ul auditate pentru acces la servicii interne; nu presupuneți porturi fără CMDB.
