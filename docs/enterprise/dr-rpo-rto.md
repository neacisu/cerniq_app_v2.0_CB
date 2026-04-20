# DR — ținte RPO / RTO și test restore

**Todo plan:** `doc-dr-rpo-rto`. **Sursă canonică** pentru continuitate: același conținut structurat ca secțiunea DR din operațiuni; [runbooks/postgres-backup-restore.md](../runbooks/postgres-backup-restore.md) pentru execuție backup/restore.

---

## 1. Ținte (prod / staging)

| Componentă | RPO țintă (pierdere date acceptabilă) | RTO țintă (timp remediere) | Notă |
|------------|--------------------------------------|----------------------------|------|
| **Postgres central** (`lxc-postgres-main`, `10.0.1.107:5432` — stacks-05 H8) | Definit de **politica backup DBA** (ex. punct-in-timp) | **Ore** (ordin) | Test restore documentat |
| **Redis** (cache / Streams / BullMQ pe **redis-shared**) | Secunde–minute (acceptabil pentru cache); Streams — replay parțial din surse | **Minute–ore** | Config persistentă în CMDB; replay evenimente vezi [orchestration-matrix.md](./orchestration-matrix.md) |
| **Temporal** | Depinde de backup cluster Temporal (ex. nod **hz.62** din audit stacks-03 — cluster self-hosted); workflow-uri **idempotente** | **Ore** | Nu presupunem SLA fără audit cluster real |

**Medii dev** (ex. hz.164): fără SLA DR complet — acceptat implicit; **ADR** dacă se pretinde altfel.

---

## 2. Test restore (obligație)

- **Frecvență țintă:** trimestrial pentru Postgres (sau conform politicii DBA).
- **Dovadă:** dată, durată, rezultat, persoană în **CMDB** — **nu** valori secrete în repo.

---

## 3. Excluderi explicite (ADR)

Dacă o componentă **nu** are încă ținte măsurabile (ex. Temporal fără procedură aprobată):

1. Înregistrați **ADR Excluded** sau **Deferred** cu motiv, dată revizuire, owner.
2. Nu marcați incrementul „enterprise complete” pentru DR până nu există țintă sau excludere documentată.

---

## 4. Legături

- [runbooks/postgres-backup-restore.md](../runbooks/postgres-backup-restore.md), [redis-streams-retention-replay.md](../runbooks/redis-streams-retention-replay.md), [orchestration-matrix.md](./orchestration-matrix.md).
