# Plasare LangGraph — închidere față de orchestrare (ADR)

**Scop:** task `langgraph-placement-adr` — documentație **subordonată** [orchestration-matrix.md](./orchestration-matrix.md) și ADR-urilor de plasare; **stacks-03** (resurse worker); clarificare **v1** vs viitor.

---

## ADR-uri aplicabile

| ADR | Rol |
|-----|-----|
| [ADR-0006](../adr/0006-langgraph-deferred.md) | LangGraph **Deferred** pentru **runtime v1** — nu este folosit până la decizie explicită. |
| [ADR-0007](../adr/0007-langgraph-placement.md) | Dacă se adoptă: plasare față de **Temporal** / **Streams** / **BullMQ**; worker pe host cu resurse (nu `lxc-ci-worker` pentru sarcini grele). |
| [ADR-0004](../adr/0004-orchestration-streams-bullmq-temporal.md) | Roluri motor — fără duplicare aceluiași pas în două motoare fără ADR excepție. |

---

## Status produs v1 (închidere „Excluded” runtime)

- **LangGraph nu este în runtime v1** — echivalent decizional cu **ADR-0006 (Deferred)**; nu există pachet runtime LangGraph în monorepo pentru gateway-uri în această fază.
- Orice **reconsiderare** necesită: actualizare **ADR-0007**, evaluare resurse **stacks-03**, și intrare în [golden-thread-matrix.md](./golden-thread-matrix.md) ca epic separat.

---

## Verificare

- Manifest gateway: `orchestration` ∈ `stream` \| `bullmq` \| `temporal` \| `sync` \| `langgraph` — validare **orchestration_manifests** în `tools/ci/gates/orchestration_manifests.py`.
- Exemplu curent: `gateway-hello` = **temporal**, nu LangGraph — vezi `packages/gateways/gateway-hello/manifest.json`.
