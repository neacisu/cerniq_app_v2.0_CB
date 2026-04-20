# Sitemap, layout-uri, rute

**Scop:** task `ui-pages-sitemap-layouts` — hartă URL-uri **Brain** + **capitole suite**, nav două niveluri §25, layout **responsive** (§10/§26), integrare API prin **Traefik**; abateri față de blueprint → **ADR**.

---

## Sursă canonică rute

- **Capitole și sub-rute:** `apps/web/lib/chapters.ts` — array **`CHAPTERS`** (Home, Brain, Ingest, … Admin).
- **Layout shell:** `app/(shell)/layout.tsx` → `AppShell`.
- **Pagini dinamice:** `app/(shell)/[chapter]/[[...path]]/page.tsx` — orice combinație `chapter` + `secondary` din `CHAPTERS`; altfel `notFound()`.

---

## Brain (blueprint §7 — prefix `/brain`)

| Rută secundară (exemplu) | Implementare |
|-------------------------|--------------|
| `/brain/overview` | workbench Brain + canvas/inspector condiționat în page |
| `/brain/topology` | `TopologyPanel` — hartă gateway/neuron/sinapsă + legături trace |
| `/ingest/imports` | `ImportsPanel` + workbench flagship unde e cazul |
| `/brain/live` … `/brain/incident` | definite în `chapters.ts`; conținut per leaf |
| `/analytics/*` | `AnalyticsChapterWorkbench` — șablon §24.6 (KPI, drill-down, `BrainCrossLinks`) |
| `/admin/*` | `AdminGovernanceWorkbench` + `FlagshipWorkbench` (dovezi Brain); trasabilitate IAM/retenție |

**Contract deep-link:** `apps/web/lib/brain-cross-entity.ts` + schema OpenAPI `BrainCrossEntityRefs`.

---

## Suite capitole (blueprint §23)

- Prefixe: `/home`, `/ingest`, `/customers`, `/inbox`, `/sales`, `/workflows`, `/operations`, `/analytics`, `/admin` — fiecare cu `secondary` în `chapters.ts`.

---

## Nav două niveluri (§25)

- Primar: header `AppShell`; secundar: rail stânga cu linkuri din `chapter.secondary`.

---

## Layout responsive (§10 / §26)

- Shell: flex + breakpoint `md:` pentru rail; **`@container`** pe zone workbench unde e cazul (`max-w-6xl`, grid).
- **Container queries:** clase Tailwind `@container` / `@lg:` pe pagini workbench.

---

## OpenAPI și Traefik

- API public: contract `docs/openapi/openapi.yaml`; acces browser la date prin **aceeași origine** sau URL API configurat — terminare TLS **Traefik** — [deploy-topology-v2.md](./deploy-topology-v2.md).

---

## ADR dacă URL diferă de §16

- Orice prefix suplimentar (ex. `/app/v2`) necesită **ADR** + actualizare `chapters.ts` + redirect-uri.

---

## Verificare

- E2E smoke: `apps/web-e2e` — navigare capitole critice.
