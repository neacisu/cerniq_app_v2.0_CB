# Continuitate v1 → v2 (bridge opțional)

**Scop:** **greenfield v2** (monorepo actual); opțiune **bridge** către date/procese **v1** doar cu **scope explicit** și **fără presupuneri** despre schema v1 fără audit (stacks-01).

---

## 1. Stance implicit

- **v2** este construită ca aplicație nouă — vezi plan unificat și blueprint.
- **Bridge v1** nu este obligatoriu; se pornește doar dacă există **decizie business** + **resurse** mapare.

---

## 2. Dacă se cere bridge — scope

| Zonă | Întrebări de închis înainte de execuție |
|------|----------------------------------------|
| **Export v1** | Ce entități (conturi, contacte, istoric)? Format (CSV, JSON, API read-only)? |
| **Import v2** | Mapare la scheme `business.*` — validare în staging |
| **Păstrare ID-uri** | Da/Nu; implicații pentru referințe externe |

---

## 3. Criterii go / no-go

| Criteriu | Go | No-go |
|----------|-----|--------|
| Mapare câmpuri | ≥95% câmpuri critice mapate | Lipsește cheie business |
| Calitate date v1 | Eșantion validat | Duplicate masive / corupție |
| Test migrare | Rulare reușită pe staging + semn-off | Eșec repetat fără remediere |
| Timp | Window aprobat | — |

---

## 4. Ordine migrare (recomandare)

1. **Read-only** export v1 → depozit securizat.
2. **Import** entități de referință (tenant, utilizatori) apoi date tranzacționale.
3. **Reconciliere** ID-uri și verificări integritate.
4. **Cut-over** planificat; rollback documentat.

---

## 5. Out of scope

- Dacă bridge-ul **nu** se aprobă: **ADR Excluded** sau **Deferred** cu motiv (ex. calitate date, cost, timp), criterii și dată revizuire.

---

## 6. stacks-01

- **Zero presupuneri** despre structura DB v1 sau hosturi fără extras din **CMDB** / audit.

---

## 7. Legături

- [business-tenancy-batch-import.md](./business-tenancy-batch-import.md), [data-domain-erd.md](./data-domain-erd.md), [adr-program.md](./adr-program.md).
