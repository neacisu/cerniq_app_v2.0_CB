# Runbook — Diagnostic MTU / MSS (stacks-04)

## Context auditat

- **Orchestrator:** rută vSwitch `10.0.0.0/16` via `10.0.0.1`, **MTU 1450** pe `enp7s0` (stacks-04).
- **HAProxy hz.247:** reguli **TCP MSS** pentru trafic selectat către orchestrator (ex. clamp la 1360) — vezi [network-stacks-04-mtu-vip.md](../enterprise/network-stacks-04-mtu-vip.md).

## Simptome

- Conexiuni TLS care se blochează la transfer mare, timeout intermitent, „PMTU black hole”.
- Funcționează ping mic, eșuează payload mare.

## Pași de diagnostic

1. **Măsurați path MTU** — `tracepath` / `ping -M do` între client și `77.42.76.185:443` (doar din rețele permise).
2. **Verificați MSS** — dacă folosiți VPN sau vSwitch, confirmați că endpoint-ul aplicației nu forțează MSS mai mare decât permite calea.
3. **Corelați cu Traefik** — după eliminarea altor cauze, consultați [traefik-reload.md](./traefik-reload.md) doar dacă configurația TLS/upstream a fost schimbată greșit.

## Remediere tipică

- Ajustare MSS la nivel firewall/HAProxy (deja prezent pe infrastructură pentru unele fluxuri) — **modificare doar de operator** pe echipamentul auditat, nu în repo aplicație.
