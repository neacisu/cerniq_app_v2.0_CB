# Runbook-uri Cerniq v2 — index

Operare aliniată **stacks-02** (Traefik, redis-shared, Postgres central, OpenBao, Vector) și **stacks-04/05** (rețea, VIP, plaje porturi). **ID-uri Cloudflare** (zone / record): în **CMDB**, nu în git — vezi [cloudflare-records-registry.md](./cloudflare-records-registry.md).

| Runbook | Conținut |
|---------|----------|
| [incident-response.md](./incident-response.md) | SEV 1–3, escaladare, postmortem |
| [change-deploy-rollback.md](./change-deploy-rollback.md) | PR, deploy, rollback, migrații |
| [postgres-backup-restore.md](./postgres-backup-restore.md) | Postgres central `lxc-postgres-main` — legat de DR |
| [redis-streams-retention-replay.md](./redis-streams-retention-replay.md) | Retenție stream, replay, DLQ |
| [openbao-secrets-rotation.md](./openbao-secrets-rotation.md) | Rotație secrete OpenBao |
| [mtu-mss-stacks-04.md](./mtu-mss-stacks-04.md) | Diagnostic MTU/MSS, trimitere la rețea auditată |
| [traefik-reload.md](./traefik-reload.md) | Config `/opt/traefik`, reload, test curl |
| [cloudflare-records-registry.md](./cloudflare-records-registry.md) | șablon registru DNS + reminder CMDB |

## Secțiuni scurte (rezumat istoric)

### Incident (SEV)

| SEV | Criteriu | Escaladare |
|-----|----------|------------|
| 1 | Pierdere date, securitate, down total prod | On-call → tech lead → IM |
| 2 | Degradare majoră API/UI | On-call |
| 3 | Bug limitat, workaround există | Ticket + urmărire |

Detaliu: [incident-response.md](./incident-response.md).

### Contacte

- **Nu** includem date de contact personale sau telefoane în repo — **CMDB** intern.

### Legături enterprise

- Topologie: [deploy-topology-v2.md](../enterprise/deploy-topology-v2.md)
- DR: [dr-rpo-rto.md](../enterprise/dr-rpo-rto.md), [disaster-recovery.md](../enterprise/disaster-recovery.md) (rezumat)
- Rețea: [network-stacks-04-mtu-vip.md](../enterprise/network-stacks-04-mtu-vip.md)
- Program ADR: [adr-program.md](../enterprise/adr-program.md)
- Piramidă teste / CI: [testing-quality-gates.md](../enterprise/testing-quality-gates.md)
- Fazare livrare UI: [ui-blueprint-phased-milestones.md](../enterprise/ui-blueprint-phased-milestones.md)
- Porturi v2 (25xxx): [port-matrix-v2-25xxx.md](../enterprise/port-matrix-v2-25xxx.md)

### Mentenanță continuă (docs / ADR / runbook-uri)

La schimbări majore de infrastructură (stacks-01…05), blueprint suite sau edge (Cloudflare, Traefik): actualizați **matricea** [compliance-stacks-01-05.md](../compliance-stacks-01-05.md), ADR-urile afectate și runbook-urile de mai sus; verificați [testing-quality-gates.md](../enterprise/testing-quality-gates.md) pentru comenzi de audit CI.
