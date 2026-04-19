# Matrice conformitate stacks-01 … stacks-05

**Scop:** fiecare regulă materială din `.cursor/rules/stacks-0x-*.mdc` (workspace `/opt/stacks/.cursor/rules/`) are cerință operațională, artefact de dovadă în `cerniq_app_v2_CB` sau procedură de audit, și status.

**Audit rapid (repo):** `python3 tools/ci/run_gates.py` din rădăcina monorepo (include verificarea integrității [golden-thread-matrix.md](enterprise/golden-thread-matrix.md) prin `golden_thread_matrix_gate.py`).

| ID | stacks | Cerință (rezumat) | Artefact / comandă audit | Status |
|----|--------|-------------------|--------------------------|--------|
| S01-A | 01 | Zero presupuneri; mapare înainte de cod | `docs/enterprise/*`, `docs/compliance-stacks-01-05.md` (acest fișier); fără IP inventat în doc-uri | OK doc — revizuire continuă |
| S01-B | 01 | Enterprise-grade; fără mock în căi critice API | Gate `tools/ci/gates/no_critical_placeholders.py`; suprafață `apps/api/src/app/routes`, `plugins` | OK gate |
| S01-C | 01 | Fără MVP „jumătate” pe căi IAM/tenant | `35-jwt-auth.ts` + `/v1/me` cu JWT HS256 sau dev flag explicit | În curs DB `auth_*` |
| S02-A | 02 | Fără `postgres`/`redis`/`mail` în compose proiect | Gate `compose_no_duplicate_datastores.py` | OK repo |
| S02-B | 02 | Ingress Traefik; fără publish haotic 80/443 | Gate `traefik_no_hazardous_compose_ports.py`; `infra/traefik/cerniq-v2.example.yml` | OK repo — deploy live în `/opt/traefik` = separat |
| S02-C | 02 | Redis `redis-shared` pentru cozi/cache | `packages/messaging`, `docs/enterprise/orchestration-matrix.md` | În curs integrare runtime |
| S02-D | 02 | PostgreSQL central (nu instanță proiect) | `packages/db-migrations`, `docs/enterprise/data-domain-erd.md` | În curs migrații aplicate pe H8 |
| S02-E | 02 | OpenBao pentru secrete | `docs/enterprise/env-matrix-secrets.md`, `apps/api/.env.example` (fără secrete reale) | Doc + exemplu |
| S02-F | 02 | Observabilitate: log JSON → Vector; traces → Tempo | `docs/enterprise/logging-audit-policy.md`, [ADR 0008](./adr/0008-observability-vector-tempo.md); API `pino`/Fastify JSON | În curs export OTel |
| S02-G | 02 | Zitadel ignorat; IAM propriu | [ADR 0003](./adr/0003-iam-internal-postgres-jwt.md), plugin JWT | În curs tabele PG |
| S02-H | 02 | Email doar Stalwart dacă e nevoie | ADR / lipsă mailer în compose | OK doc |
| S03-A | 03 | Alocare workload pe host-uri reale (hz.*, LXC) | `docs/enterprise/deploy-topology-v2.md`, `temporal-standards-ops.md` | Doc |
| S03-B | 03 | `lxc-ci-worker` 8 GiB — CI eficient | `.github/workflows/ci.yml` (ubuntu-latest, nx affected) | OK |
| S04-A | 04 | Orchestrator `77.42.76.185` / `10.0.0.2`, MTU vSwitch 1450 | `docs/enterprise/network-stacks-04-mtu-vip.md` | Doc |
| S04-B | 04 | VIP Redis `10.0.1.10:6379` → DNAT orchestrator | stacks-05 B1 citat în doc rețea | Doc |
| S05-A | 05 | Postgres `lxc-postgres-main` — IP din audit (H8) | `data-domain-erd.md` | Doc |
| S05-B | 05 | Plaje porturi 19/26/29/39/49/64/65 + **25xxx** rezervat v2 | `docs/enterprise/port-matrix-v2-25xxx.md` | Doc |
| S05-C | 05 | LLM 49xxx, ACL | `packages/llm`, `llm-quotas-priority.md` | În curs |

**Reguli de închidere:** status **OK** = dovadă în repo sau gate verde; **În curs** = ADR sau implementare rămasă; **Gap** = lipsă — nu se marchează „complet” în DoD până nu devine OK sau ADR Excluded.

**Legătură plan:** [golden-thread-matrix.md](enterprise/golden-thread-matrix.md).
