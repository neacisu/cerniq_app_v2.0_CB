# Standarde Temporal

## Cluster

- Self-hosted conform CMDB (ex. referință hz.62 în research); adresă din OpenBao în runtime.

## Convenții

- **Namespace:** `cerniq-v2` (sau definit în deploy).
- **Task queues:** `gateway-{name}`, `workflow-default`.
- **Timeouts:** start-to-close explicite; fără infinit.
- **Versioning:** folosiți `patched` / versiuni workflow la schimbări breaking.

## Worker

- Rulează pe host cu **RAM adecvată** — nu pe `lxc-ci-worker` pentru workload greu.

## Teste

- Replay tests pentru workflow-uri critice în CI (selectiv, memorie limitată).

## Observabilitate

- Metrics OTel către același stack stacks-02.
