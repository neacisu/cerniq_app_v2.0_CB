# Mentenanță documentație și ADR

La fiecare schimbare majoră de infrastructură sau blueprint:

1. Actualizează [compliance-stacks-01-05.md](../compliance-stacks-01-05.md).
2. Urmează [adr-program.md](./adr-program.md) (declanșatori de revizuire ADR).
3. Revizuiește ADR-urile din [docs/adr/](../adr/README.md).
4. Sincronizează [runbooks/README.md](../runbooks/README.md) și runbook-urile din același folder (Traefik, Cloudflare — **ID-uri în CMDB**, nu în repo).
5. Verifică [port-matrix-v2-25xxx.md](./port-matrix-v2-25xxx.md) și [deploy-topology-v2.md](./deploy-topology-v2.md).
6. Dacă atinge securitatea: [security-privacy.md](./security-privacy.md).

Onboarding: `pnpm install`, `pnpm exec nx sync`, `docs/enterprise/local-dev-story.md`.
