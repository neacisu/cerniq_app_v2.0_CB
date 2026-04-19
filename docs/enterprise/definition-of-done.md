# Definition of Done (DoD) — Cerniq v2

Un increment este **acceptat** când:

1. **Task 0** — repo GitHub, `main` sincron, branch `work/Bootstrap` (sau flux echivalent aprobat).
2. **Trasabilitate** — fără cerințe ne-mapate din rapoarte + blueprint fără excludere ADR; vezi [golden-thread-matrix.md](./golden-thread-matrix.md) și [ui-blueprint-suite-inventory.md](./ui-blueprint-suite-inventory.md).
3. **Conformitate stacks** — [compliance-stacks-01-05.md](../compliance-stacks-01-05.md) actualizat pentru regulile atinse.
4. **Gates PR** — `gate-pr-stacks-02-no-duplicate-datastores`, `gate-pr-stacks-02-traefik-ingress-only`, `gate-pr-stacks-01-no-critical-placeholders` trec în CI unde aplicabil.
5. **Fără încălcări stacks fără ADR** — orice excepție înregistrată.

**„Complet” produs doc:** artefactele `doc-orchestration-matrix-adr` … `doc-v1-continuity-bridge` și inventarul suite UI sunt verzi sau excluse explicit prin ADR.

**Notă:** DoD este verificat la PR/release de reviewer + pipeline.

## Edge public (înainte de trafic producție pe v2.*)

| Pas | Artefact repo | Operațiune live (nu în repo) |
|-----|---------------|--------------------------------|
| DNS v2 | [cloudflare-dns-records-checklist.md](./cloudflare-dns-records-checklist.md) | Înregistrări în zonă `cerniq.app` |
| SSL/TLS edge | [cloudflare-dns-tls-procedure.md](./cloudflare-dns-tls-procedure.md) | Mod Full strict + cert origine |
| Traefik | [traefik-v2-reference.md](./traefik-v2-reference.md), `infra/traefik/cerniq-v2.example.yml` | Merge în `/opt/traefik` pe orchestrator |
| RUM / OTel browser | [observability-slo-alerts.md](./observability-slo-alerts.md) | Instrumentare UI + Grafana |

Până la închiderea pașilor edge, incrementul poate fi **acceptat pe branch** cu DoD de cod + doc + gates; **go-live public** cere și rândurile de mai sus închise sau ADR „Deferred“.
