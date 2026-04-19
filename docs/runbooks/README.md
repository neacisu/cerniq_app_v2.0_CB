# Runbook-uri Cerniq v2

## Incident (SEV)

| SEV | Criteriu | Escaladare |
|-----|----------|------------|
| 1 | Pierdere date, securitate, down total prod | On-call → tech lead → IM |
| 2 | Degradare majoră API/UI | On-call |
| 3 | Bug limitat, workaround există | Ticket + urmărire |

**Pași:** identificare blast radius → status page intern → rollback dacă deploy recent → postmortem pentru SEV1–2.

## Change / deploy / rollback

1. Merge pe `main` după gates CI (`gate-pr-stacks-*`).
2. Build artefacte pe worker cu memorie suficientă (evită job greu pe `lxc-ci-worker` fără split).
3. Deploy pe orchestrator / LXC conform [deploy-topology-v2.md](../enterprise/deploy-topology-v2.md).
4. Rollback: versiune anterioară container/proces + migrații DB doar cu script revers documentat.

## Postgres central

- Backup: conform politicii DBA pe `lxc-postgres-main`.
- Restore: testat trimestrial; înregistrare în [disaster-recovery.md](../enterprise/disaster-recovery.md).

## Redis Streams

- Retenție: `MAXLEN` / trimming policy per stream; documentat per sinapsă.
- Replay: din DLQ stream după remediere consumator.

## OpenBao

- Rotație secrete: playbook separat (tokens API, signing keys webhooks).
- Acces: doar din rețea de încredere.

## MTU / MSS (stacks-04)

- vSwitch orchestrator: MTU `1450`; tune MSS pentru TCP dacă apar blackhole — vezi [network-stacks-04-mtu-vip.md](../enterprise/network-stacks-04-mtu-vip.md).

## Traefik

- Config: `/opt/traefik` pe orchestrator.
- Reload: după validare fișier dinamic; test `curl -I --resolve v2.cerniq.app:443:127.0.0.1 https://v2.cerniq.app`.

## Cloudflare

- La crearea înregistrărilor DNS v2: păstrează **zone id** și **record id** în CMDB intern (nu în repo).
- SSL: Full (strict) recomandat cu certificat valid la origine (Traefik ACME sau Origin CA).

## Contacte

- Definite în CMDB; acest repo nu conține PII contact.
