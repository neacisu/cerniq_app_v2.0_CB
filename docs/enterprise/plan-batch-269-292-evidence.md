# Dovadă: batch plan `ui-chapter-*` (269–292)

**Data:** 2026-04-19  
**Scop:** capitole suite UI — șablon §24, rute din `lib/chapters.ts`, panouri Brain/Home specializate, nav filtrabilă per `chapter:*` (dev).

## Artefacte

| ID plan | Dovadă în repo |
|--------|----------------|
| `ui-chapter-home-workspace` | `components/home/*`, `ChapterPageBody` pentru `/home/*` |
| `ui-chapter-brain-core-pages` | `components/brain/brain-sse-toolbar.tsx`, `brain-*-panel.tsx`, `ChapterPageBody` pentru `/brain/*` |
| `ui-chapter-ingest-enrichment` | `ImportsPanel` + `SUITE_CHAPTER_COPY` pentru ingest non-imports |
| `ui-chapter-crm-intelligence` | `SUITE_CHAPTER_COPY` pentru `/customers/*` |
| `ui-chapter-inbox-communications` | `SUITE_CHAPTER_COPY` pentru `/inbox/*` |
| `ui-chapter-sales-revenue` | `SUITE_CHAPTER_COPY` pentru `/sales/*` |
| `ui-chapter-workflows-automation` | `SUITE_CHAPTER_COPY` pentru `/workflows/*` (Temporal menționat în copy, fără URL inventat) |
| `ui-chapter-ops-execution` | `SUITE_CHAPTER_COPY` pentru `/operations/*` + `brain-incident-panel` → `/operations/orders` |

## Comenzi audit

```bash
cd cerniq_app_v2_CB && pnpm exec nx run web:test
pnpm exec nx run web:typecheck
python3 tools/ci/run_gates.py
```

## Notă

- **„Acoperire 100%”** pe tot monorepo-ul nu este prag CI; există teste țintite (`suite-chapter-copy.spec.ts`, `chapter-permissions.spec.ts`, `chapter-page-body.spec.tsx`).
- **Autoritate RBAC:** UI filtrează nav prin `NEXT_PUBLIC_CERNIQ_DEV_CHAPTERS`; validarea finală rămâne API + JWT (`rbac-chapters`).
