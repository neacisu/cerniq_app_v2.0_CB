# Program ADR — Cerniq v2

**Scop:** guvernanță pentru decizii arhitecturale înregistrate ca ADR, cu trasabilitate la surse canonice (research backend/UI, blueprint suite, stacks-01…05) și ciclul de viață (status, revizuire).

**Autoritate:** regulile operaționale rămân în `.cursor/rules/stacks-0x-*.mdc` (monorepo `cerniq_app_v2_CB/.cursor/rules/`). ADR-urile **nu le înlocuiesc**; explică *de ce* o implementare sau o tensiune între surse este acceptată.

---

## 1. Surse canonice și tensiuni (mitigare obligatorie)

| Sursă | Rol | Când apare tensiune |
|-------|-----|---------------------|
| [deep-research-report_cerniq.md](../research/deep-research-report_cerniq.md) | Backend: Nx, Fastify, Redis, Temporal, etc. | Versiuni §6 vs engine real (ex. Postgres pe H8) |
| [deep-research-report_cerniq_ui.md](../research/deep-research-report_cerniq_ui.md) | UI research: Next, React, Tailwind, SSE | Versiuni text vs [blueprint](../research/Cerniq_CB_V2_UI_Blueprint_Implementation_Plan_Apr2026_v2_full_suite.md) |
| [Blueprint suite Apr 2026](../research/Cerniq_CB_V2_UI_Blueprint_Implementation_Plan_Apr2026_v2_full_suite.md) | Produs: capitole §22–23, fazare §28, baseline §3/§17 | Scope suite complet vs increment backend |
| stacks-01…05 | Infra auditată: Traefik, redis-shared, VIP, porturi | Orice propunere care duplică datastore sau inventează rețea |

**Mitigare:** fiecare tensiune rezolvată prin rând în [golden-thread-matrix.md](./golden-thread-matrix.md) / [backend-research-versions-matrix.md](./backend-research-versions-matrix.md) și, dacă e decizie de produs, prin **ADR** sau secțiune *Deferred / Excluded* cu criterii.

---

## 2. ADR obligatorii (mapare la repo)

| Temă plan | ADR | Conținut rezumat |
|-----------|-----|------------------|
| Nx + pnpm canonic; Turbo în text UI = doar ergonomie pnpm | [0001](../adr/0001-nx-pnpm-canonical.md) | Monorepo: Nx orchestrator; fără înlocuire cu Turbo |
| Next în Nx + baseline blueprint (Next 16 / React 19.2 / Tailwind 4.2 / Motion 12 / Storybook 10 vs `@nx/next`) | [0002](../adr/0002-next-in-nx-blueprint-baseline.md), [0009](../adr/0009-pinned-ui-versions-strategy.md) | App Router, pin versiuni vs plugin Nx |
| IAM | [0003](../adr/0003-iam-internal-postgres-jwt.md) | JWT/sesiuni, Postgres `auth_*`, Zitadel exclus |
| Temporal vs LangGraph; Streams / BullMQ | [0004](../adr/0004-orchestration-streams-bullmq-temporal.md), [0006](../adr/0006-langgraph-deferred.md), [0007](../adr/0007-langgraph-placement.md) | Roluri ne-suprapuse; LangGraph doar după ADR |
| Plajă **25xxx**, Cloudflare, Traefik | [0005](../adr/0005-edge-25xxx-cloudflare-traefik.md) | Edge public orchestrator `77.42.76.185` |
| Observabilitate (Vector / Tempo) | [0008](../adr/0008-observability-vector-tempo.md) | Fără Loki paralel fără excepție ADR |
| Research backend §6 vs CMDB / repo (versiuni) | [0010](../adr/0010-research-backend-section6-version-deltas.md) | Decizii D1–D16; trimitere [backend-research-versions-matrix.md](./backend-research-versions-matrix.md) |

**Suite capitole vs scope increment:** nu este ADR separat încă; se tratează prin [ui-blueprint-suite-inventory.md](./ui-blueprint-suite-inventory.md) și ADR *Deferred* per capitol când e cazul.

---

## 3. Template și index

- **Template:** [docs/adr/template.md](../adr/template.md) — câmpuri: Status, Context, Decision, Consequences, Compliance (stacks-0x).
- **Index numerotat:** [docs/adr/README.md](../adr/README.md).

Număr ADR: următorul liber `0011-...` (verificare în folder înainte de commit).

---

## 4. Status ADR și ciclul de viață

| Status | Semnificație |
|--------|----------------|
| Proposed | În review; nu schimbă implementarea obligatorie până la Accept |
| Accepted | Criteriu de proiectare pentru cod și doc |
| Deprecated | Înlocuit; păstrați fișierul cu trimitere la succesor |
| Superseded | Indicați ADR-ul nou în antet |

---

## 5. Când se revizuiește (declanșatori)

1. **Schimbare stacks-01…05** (IP, porturi, servicii shared) — verificați ADR-uri *Compliance* și [compliance-stacks-01-05.md](../compliance-stacks-01-05.md).
2. **Schimbare blueprint suite** (capitole, fazare, baseline UI) — [0002], [0009], inventar suite.
3. **Upgrade major** Nx / Next / Fastify — [0001], [0002], [0009].
4. **Edge v2** (DNS, TLS, routere Traefik) — [0005], runbook-uri Traefik/Cloudflare.

**Proces:** deschideți PR cu secțiune „ADR impact”; actualizați ADR existent sau adăugați ADR nou; nu lăsați contradicții nerezolvate între ADR și `.cursor/rules`.

---

## 6. Dovezi și gates

- CI: `python3 tools/ci/run_gates.py` include verificarea ancorelor doc enterprise (`enterprise_docs_gate.py`).
- Mapare reguli: [compliance-stacks-01-05.md](../compliance-stacks-01-05.md).
