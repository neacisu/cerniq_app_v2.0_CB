# Mentenanță documentație și ADR

La fiecare schimbare majoră de infrastructură sau blueprint:

1. Actualizează [compliance-stacks-01-05.md](../compliance-stacks-01-05.md).
2. Revizuiește ADR-urile din [docs/adr/](../adr/README.md).
3. Sincronizează [runbooks/README.md](../runbooks/README.md) (Traefik, Cloudflare record ids în CMDB, nu în repo).
4. Verifică [port-matrix-v2-25xxx.md](./port-matrix-v2-25xxx.md) și [deploy-topology-v2.md](./deploy-topology-v2.md).

Onboarding: `pnpm install`, `pnpm exec nx sync`, `docs/enterprise/local-dev-story.md`.
