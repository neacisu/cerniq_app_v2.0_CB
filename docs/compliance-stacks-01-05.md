# Matrice conformitate stacks-01 … stacks-05 + enforcement Cerniq

**Scop:** mapare **exhaustivă** (pe fișiere și secțiuni materiale) din `.cursor/rules/stacks-0x-*.mdc` + `cerniq-todo-enterprise-gates.mdc` → cerință operațională → artefact dovadă în repo → **comandă audit** (reproducibilă) → **trimitere CMDB / matrice porturi** unde e cazul → status. Actualizare obligatorie la schimbare infrastructură sau reguli.

**Sursă canonică reguli (acest monorepo):** `cerniq_app_v2_CB/.cursor/rules/`.

**Notă tensiune documente:** unde **stacks-02** menționează generic „Postgres 17”, **sursa de adevăr pentru engine pe `lxc-postgres-main`** este **stacks-05 §H8** (PostgreSQL **16** la audit 2026-04-18) — nu se inventează versiuni pe host.

**Audit rapid (repo):** din rădăcina `cerniq_app_v2_CB/`:

```bash
python3 tools/ci/run_gates.py
```

**Legături DoD / PR:** [definition-of-done.md](enterprise/definition-of-done.md); gate-uri plan → scripturi în secțiunea următoare.

---

## Mapare gate-uri PR (id plan → script CI)

| ID plan | Script | Verificare |
|---------|--------|------------|
| `gate-pr-stacks-01-no-critical-placeholders` | `tools/ci/gates/no_critical_placeholders.py` | Fără stub/TODO în suprafață API (`apps/api/src/app/routes`, `plugins`) și pachete critice |
| `gate-pr-stacks-02-no-duplicate-datastores` | `tools/ci/gates/compose_no_duplicate_datastores.py` | Fără `postgres` / `redis` / `mail` noi în compose proiect |
| `gate-pr-stacks-02-traefik-ingress-only` | `tools/ci/gates/traefik_no_hazardous_compose_ports.py` | Fără publish haotic pentru față publică |

---

## Index pe fișier reguli (acoperire secțiuni)

| Fișier | Secțiuni / zone mapate în matricea de mai jos |
|--------|-----------------------------------------------|
| [stacks-01-general-setup.mdc](../.cursor/rules/stacks-01-general-setup.mdc) | §1–§6 (CORE DIRECTIVES … Open-Source) |
| [stacks-02-shared-services.mdc](../.cursor/rules/stacks-02-shared-services.mdc) | Servicii 1–7 (Traefik … Observabilitate) |
| [stacks-03-infrastructure.mdc](../.cursor/rules/stacks-03-infrastructure.mdc) | Pool bare-metal, DB master, AI, CI worker, Cerniq LXC |
| [stacks-04-network-topology.mdc](../.cursor/rules/stacks-04-network-topology.mdc) | Orchestrator, mesh hz.*, LXC, directive H. |
| [stacks-05-port-matrix.mdc](../.cursor/rules/stacks-05-port-matrix.mdc) | A–I + H8 postgres; **CMDB live porturi** |
| [cerniq-todo-enterprise-gates.mdc](../.cursor/rules/cerniq-todo-enterprise-gates.mdc) | Autoritate reguli, interdicții, `run_gates` + nx |

---

## Matrice detaliată: regulă → cerință → dovadă → audit → CMDB/stacks → status

| ID | stacks | Ref. reguli (secțiune) | Cerință operațională | Artefact dovadă (path / doc) | Comandă audit (din rădăcina repo) | Captură CMDB / stacks |
|----|--------|------------------------|------------------------|------------------------------|-----------------------------------|-------------------------|
| S00-TODO | cerniq-todo | întreg | Toate todo-urile respectă DoD; fără „completed” fals | [cerniq-todo-enterprise-gates.mdc](../.cursor/rules/cerniq-todo-enterprise-gates.mdc), [definition-of-done.md](enterprise/definition-of-done.md) | `python3 tools/ci/run_gates.py` + `pnpm exec nx run-many -t lint,typecheck,test --all` (conform regulii) | — |
| S01-§1 | 01 | stacks-01 §1 | Fără halucinații; validare fișier înainte de cod | Review PR + acest document | `rg -n "TODO\\|FIXME" apps/api/src/app/routes apps/api/src/app/plugins` (manual: fără TODO critic) | — |
| S01-§2 | 01 | stacks-01 §2 | Edge cases și erori tratate pe căi API | Plugin `20-error-envelope.ts`, teste | `pnpm exec nx run api:test` | — |
| S01-§3 | 01 | stacks-01 §3 | Fără MVP/ciuntit pe fluxuri expuse | Gate placeholders + JWT `/v1/me` | `python3 tools/ci/gates/no_critical_placeholders.py` | — |
| S01-§5 | 01 | stacks-01 §4–§5 | Toolchain actuală (Apr 2026) | `package.json`, ADR 0001/0002/0009 | `python3 -c "import json;d=json.load(open('package.json'));print(d.get('packageManager'), d['dependencies'].get('next'))"` | — |
| S01-§6 | 01 | stacks-01 §6 | Preferă self-hosted / servicii orchestrator | Doc deploy + fără datastore duplicat | `python3 tools/ci/gates/compose_no_duplicate_datastores.py` | stacks-05 A (orchestrator) |
| S02-1 | 02 | stacks-02 §1 Traefik | Ingress Traefik; fără publish haotic | Gate Traefik + exemplu labels | `python3 tools/ci/gates/traefik_no_hazardous_compose_ports.py` | stacks-05 A1 `80/443` Traefik |
| S02-2 | 02 | stacks-02 §2 IAM | IAM propriu; Zitadel deprecated | ADR 0003, `35-jwt-auth.ts` | `rg -n "35-jwt-auth" apps/api/src/app/plugins` | — |
| S02-3 | 02 | stacks-02 §3 OpenBao | Secrete via OpenBao / inject | [env-matrix-secrets.md](enterprise/env-matrix-secrets.md) | `test -f apps/api/.env.example && rg -n "OpenBao|VAULT" docs/enterprise/env-matrix-secrets.md` | stacks-05 orchestrator `8200/8201` |
| S02-4 | 02 | stacks-02 §4 Redis | **redis-shared** 8.x; cozi/cache | `packages/messaging`, BullMQ | `rg -n "REDIS_URL|redis-shared" docs/enterprise packages/messaging` | stacks-05 A2 `6379` → redis-shared |
| S02-5 | 02 | stacks-02 §5 Postgres | DB central; nu Postgres proiect | `packages/db-migrations`, ERD | `ls packages/db-migrations/sql 2>/dev/null; python3 tools/ci/gates/compose_no_duplicate_datastores.py` | **stacks-05 §H8** `10.0.1.107:5432` **PostgreSQL 16** |
| S02-6 | 02 | stacks-02 §6 Stalwart | Mail doar prin Stalwart | Fără mailer în compose | `python3 tools/ci/gates/compose_no_duplicate_datastores.py` | stacks-05 A1 porturi SMTP/IMAP stalwart |
| S02-7 | 02 | stacks-02 §7 Observabilitate | JSON → **Vector**; trace → **Tempo**; metrici | ADR 0008, `apps-api-fastify-core.md`, `/metrics` | `rg -n "traceparent|trace_id" apps/api/src; pnpm exec nx run api:test` | stacks-05 A5 `vector`, `tempo` |
| S03-HW | 03 | stacks-03 §1 Heavyweight | Workload mare → hz.113/hz.164 etc. | [deploy-topology-v2.md](enterprise/deploy-topology-v2.md) | Review la task deploy worker | CMDB: [stacks-03](../.cursor/rules/stacks-03-infrastructure.mdc) §1 |
| S03-DB | 03 | stacks-03 §2 | `lxc-postgres-main` = master | [data-domain-erd.md](enterprise/data-domain-erd.md) | `rg -n "10.0.1.107|postgres-main" docs/enterprise/data-domain-erd.md` | stacks-05 H8 |
| S03-AI | 03 | stacks-03 §3 | LLM guard subțire; fără modele uriașe pe guard | [llm-quotas-priority.md](enterprise/llm-quotas-priority.md) | `rg -n "49004|LLM_GUARD" packages/llm docs/enterprise` | stacks-03 §3 `lxc-llm-guard` |
| S03-CI | 03 | stacks-03 §4 | `lxc-ci-worker` **8 GiB** — CI memorie limitată | `.github/workflows/ci.yml` `NODE_OPTIONS` | `rg -n "NODE_OPTIONS|node-version" .github/workflows/ci.yml` | stacks-03 §4 |
| S03-CQ | 03 | stacks-03 §5 | Cerniq prod/staging LXC — nu atinge alte containere | Doc topologie | `rg -n "lxc-prod-cerniq|lxc-staging-cerniq" docs/enterprise/deploy-topology-v2.md` | stacks-04 C6–C7 |
| S04-ORCH | 04 | stacks-04 §A | Orchestrator `77.42.76.185` / `10.0.0.2` | [c4-deployment-views.md](enterprise/c4-deployment-views.md) | `rg -n "77.42.76.185|10.0.0.2" docs/enterprise/c4-deployment-views.md` | stacks-04 §A |
| S04-VIP | 04 | stacks-04 §B9 / stacks-05 B | VIP `10.0.1.10` Traefik/Redis/LLM ACL | [port-matrix-v2-25xxx.md](enterprise/port-matrix-v2-25xxx.md), [network-stacks-04-mtu-vip.md](enterprise/network-stacks-04-mtu-vip.md) | `rg -n "10.0.1.10" docs/enterprise/port-matrix-v2-25xxx.md` | stacks-05 B1; stacks-04 B9 |
| S04-MTU | 04 | stacks-04 H (directive) | MTU vSwitch / MSS | [network-stacks-04-mtu-vip.md](enterprise/network-stacks-04-mtu-vip.md), runbook MTU | `rg -n "MTU|1360|1450" docs/enterprise/network-stacks-04-mtu-vip.md docs/runbooks/mtu-mss-stacks-04.md` | stacks-04 final H |
| S05-PG | 05 | stacks-05 §H8 | Postgres **16** pe H8 | ERD + matrice | `rg -n "PostgreSQL 16|10.0.1.107" .cursor/rules/stacks-05-port-matrix.mdc` | **§H8** |
| S05-PL | 05 | stacks-05 + doc v2 | Plaje **25xxx** / VIP Cerniq | [port-matrix-v2-25xxx.md](enterprise/port-matrix-v2-25xxx.md) | `rg -n "25xxx|25010" docs/enterprise/port-matrix-v2-25xxx.md docs/enterprise/deploy-topology-v2.md` | stacks-05 B2–B3 |
| S05-LLM | 05 | stacks-05 LLM VIP | **49xxx** guardrails / inferență | [llm-quotas-priority.md](enterprise/llm-quotas-priority.md) | `rg -n "49xxx|49004" docs/enterprise/llm-quotas-priority.md` | stacks-04 B9 ACL |
| S00-ADR | 01 | stacks-01 + program | Program ADR + tensiuni research | [adr-program.md](enterprise/adr-program.md), **ADR-0010** | `ls docs/adr/0010*.md` | — |
| S00-RB | 02 | stacks-02 runbooks | Runbook-uri operaționale | [runbooks/README.md](../runbooks/README.md) | `test -f docs/runbooks/incident-response.md` | — |
| S00-GT | 01 | golden thread | Trasabilitate cerințe | [golden-thread-matrix.md](enterprise/golden-thread-matrix.md) | `python3 tools/ci/gates/golden_thread_matrix_gate.py` | — |

**Status:** **OK** = dovadă + gate verde sau document la zi; **În curs** = implementare rămasă; **Gap** = lipsă până la ADR sau livrare.

**Legătură:** [golden-thread-matrix.md](enterprise/golden-thread-matrix.md). **Mitigare versiuni research §6:** [backend-research-versions-matrix.md](enterprise/backend-research-versions-matrix.md), [ADR-0010](../adr/0010-research-backend-section6-version-deltas.md).

---

## Plan unificat — batch `224–244` (impl-* + ui-ms01 / ui-ms02)

**Dovadă agregată:** [plan-batch-224-244-evidence.md](enterprise/plan-batch-224-244-evidence.md) — mapare ID todo → path → comandă audit; aliniat `cerniq-todo-enterprise-gates.mdc` (fără „completed” fără cod + teste + gate verde).

---

## Plan unificat — batch `269–292` (capitole suite UI)

**Dovadă agregată:** [plan-batch-269-292-evidence.md](enterprise/plan-batch-269-292-evidence.md) — Home/Brain panouri, `suite-chapter-copy`, nav `NEXT_PUBLIC_CERNIQ_DEV_CHAPTERS`, teste `suite-chapter-copy.spec.ts` / `chapter-permissions.spec.ts`.
