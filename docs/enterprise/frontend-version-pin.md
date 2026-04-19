# Pin versiuni frontend (blueprint Apr 2026)

## Țintă produs (blueprint §3 / §17)

| Pachet | Versiune țintă | Repo actual (verificare) |
|--------|------------------|--------------------------|
| next | 16.2.4 | `apps/web/package.json` ^16.2.4 |
| react / react-dom | 19.2.x | ^19.2.5 |
| tailwindcss | 4.2.2 | adăugat în web |
| motion | 12.38.0 | adăugat în web |
| @tanstack/react-query | 5.99.1 | adăugat |
| zustand | 5.0.10 | adăugat |
| storybook | 10.3.5 | configurare incrementală |

## @nx/next

Versiune workspace: `21.6.11` — compatibilă cu Next 16 în acest repo. La upgrade: rulează `pnpm exec nx sync` și teste CI.

## Reconciliere research UI (Next 14+)

Textul research UI este **superseded** de blueprint Next 16 + acest document. Lockfile `pnpm-lock.yaml` este autoritate.

## Procedură upgrade

1. Branch dedicat; actualizare `package.json` + lockfile.
2. `pnpm install`; `nx run-many -t build,test --projects=web,web-e2e`.
3. Actualizare ADR-0009 dacă există compromis.
