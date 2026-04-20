# Shell capitole — suite governance (Next App Router)

**Scop:** descrie implementarea curentă a shell-ului multi-capitol din **`apps/web`**, aliniată la blueprint (nav două niveluri §25, homes §28 Faza 1, gramatică shell §8–§9) și la `contracts-api-events.md` pentru context API/Trafic.

---

## Aplicație canonică

- **`apps/web`** — proiect **@nx/next** (`package.json` + tag-uri Nx `scope:web`). Nu este folosit numele `apps/cerniq-cb-v2-web`; un rename ar necesita **ADR** și actualizare CI/Traefik.

---

## Navigare primară (10 capitole governance)

Definiție unică: `apps/web/lib/chapters.ts` — array **`CHAPTERS`**: Home, Brain, Ingest, Customers, Inbox, Sales, Workflows, Operations, Analytics, Admin. Fiecare capitol are `id`, `label`, `href` (home implicit) și **`secondary`** (sub-nav).

---

## Navigare secundară (blueprint §25)

- Randată în **`AppShell`**: coloană rail stânga (vizibilă `md+`), linkuri din `chapter.secondary`.
- Rute dinamice: **`app/(shell)/[chapter]/[[...path]]/page.tsx`** — rezolvă `leaf` după `fullPath`; altfel `notFound()`.

---

## Homes per capitol (§28 Faza 1)

- Fiecare capitol își începe fluxul de la `href`-ul din `CHAPTERS` (ex. `/home/workspace`, `/brain/overview`).
- Index shell: `app/(shell)/page.tsx` redirecționează către `/home/workspace`.

---

## Breadcrumbs semantice (business vs Brain)

- În pagina capitol: antet cu **capitol** (link către `chapter.href`) + **titlu frunză** (`leaf.label`) — separare clară între domeniul business (capitol) și pagina curentă.
- Paginile Brain folosesc același mecanism; conținut specific (canvas, inspector) este condiționat de `chapter.id` și `fullPath`.

---

## Gramatică shell (§8–§9) — implementare

| Element blueprint | Implementare |
|-------------------|--------------|
| Top bar **72px** | `header` cu `h-[var(--spacing-topbar)]` și `--spacing-topbar` = **4.5rem** (= 72px la root 16px); duplicat semantic în `global.css` `@theme` |
| Rail (nav secundar) | `nav` stânga, lățime fixă (`w-52`), border dreapta |
| Workspace | `main#main-content` — zonă scroll principală |
| Utility dock (concept) | **Command palette** (Cmd+K) + acțiuni header (temă) |
| Telemetry tray | **`TelemetryTray`** fix bottom, conținut ex. `BrainStatusPanel` |

---

## Accesibilitate

- Skip link «Sari la conținut» către `#main-content`.
- Regiune tray: `aria-label` pe telemetry; nav-uri cu `aria-label` pentru primară și sub-nav.

---

## Integrare infrastructură (stacks-02)

- Frontend servit spre utilizatori prin **Traefik** (TLS, routing); fără expunere directă a portului aplicației — vezi `deploy-topology-v2.md` și regulile stacks-02.

---

## Verificare

- Orice capitol nou: actualizare `CHAPTERS` + rute `secondary` + teste de rută dacă e logică critică.
