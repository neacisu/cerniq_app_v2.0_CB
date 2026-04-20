# Runbook — Incident și severitate (SEV)

## Clasificare SEV

| SEV | Criterii (exemple) | Timp răspuns țintă |
|-----|---------------------|---------------------|
| **1** | Pierdere date confirmată; compromitere securitate; indisponibilitate totală producție pentru clienți | Imediat |
| **2** | Degradare majoră API/UI; erori >5% trafic; pierdere parțială funcționalitate critică | &lt; 30 min echipă on-call |
| **3** | Incident limitat; workaround documentat; impact minor | Best effort în SLA intern |

## Escaladare

1. **Detectare** — alertă Grafana/Prometheus, raport utilizator, gate CI roșu pe `main`.
2. **On-call prim** — validează blast radius (ce servicii: API, UI, Redis, Postgres, Traefik).
3. **Escaladare** — SEV1–2: tech lead + responsabil IM (Incident Manager) dacă politica organizației cere; SEV3: ticket urmărit.
4. **Comunicare** — canal intern status (fără PII); pentru SEV1–2, mesaj scurt stakeholder conform procedurii interne.

## Pași operaționali

1. **Înghețați** schimbările noi pe calea critică (opțional hold deploy).
2. **Remediați** — rollback ultim deploy bun (vezi [change-deploy-rollback.md](./change-deploy-rollback.md)) sau fix forward cu testare minimă.
3. **Post-incident** — pentru SEV1–2: postmortem (timeline, cauză rădăcină, acțiuni preventive); legați de ADR dacă decizia arhitecturală a contribuit.

## Legături stacks

- Edge: [Traefik reload](./traefik-reload.md), [network-stacks-04 MTU](../enterprise/network-stacks-04-mtu-vip.md) dacă simptomele sunt timeout/TCP.
- Date: [Postgres backup/restore](./postgres-backup-restore.md), [Redis streams](./redis-streams-retention-replay.md).
