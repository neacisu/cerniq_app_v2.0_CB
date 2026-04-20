# Runbook — Change, deploy, rollback

## Principii (stacks-02)

- **Fără** expunere publică haotică: aplicații v2 prin **Traefik** (labels), nu `ports:` largi pe internet pentru servicii app.
- Artefacte build pe worker cu resurse suficiente; evitați job-uri memorie grea pe `lxc-ci-worker` (8 GiB) fără split (stacks-03).

## Change (cod)

1. Branch din `main` / `work/Bootstrap` conform politicii repo.
2. PR cu gates: `python3 tools/ci/run_gates.py`, lint/typecheck/test/build proiecte atinse.
3. Review: checklist [definition-of-done.md](../enterprise/definition-of-done.md), fără încălcări stacks fără ADR.

## Deploy

1. **Staging** (recomandat): același tip de artefact ca producție; verificare health/readiness.
2. **Producție:** conform [deploy-topology-v2.md](../enterprise/deploy-topology-v2.md) — orchestrator `77.42.76.185`, upstream plajă **25xxx** sau cale LXC **64xxx** după închiderea topologiei.
3. **Migrații DB:** rulate cu script versionat; pentru rollback DB, doar cu pași revers documentați (fără `DROP` fără backup).

## Rollback

1. Reveniți la versiunea containerului/procesului anterior (imagine/tag sau commit).
2. Dacă migrația DB a eșuat: restaurare din backup sau script down — coordonare DBA; vezi [postgres-backup-restore.md](./postgres-backup-restore.md).
3. Invalidați cache CDN (Cloudflare) dacă asset-uri statice au cauzat incidentul.

## Verificare post-deploy

- `curl` health endpoints interne (fără publica IP-uri noi în repo).
- Metrici: erori 5xx, latency, conectivitate Redis/Postgres conform env.
