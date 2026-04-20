# Generatoare din manifeste (CSV + JSON gateway)

**Scop:** task `generators` — artefacte generate din surse validate în repo (**stacks-01**), output compatibil bounded context **neurons / synapses / gateways**.

---

## Script canonic

| Script | Intrări | Ieșiri |
|--------|---------|--------|
| `tools/generators/generate_from_matrix.py` | `packages/manifests/NEURON_MATRIX.csv`, `SYNAPSE_MATRIX.csv` | `packages/neurons/*/src/generated/stub.ts`, `packages/synapses/*/src/generated/stub.ts` |
| (aceeași) | `packages/gateways/*/manifest.json` | `packages/gateways/*/src/generated/manifest-derived.ts` |

Rulare:

```bash
python3 tools/generators/generate_from_matrix.py
python3 tools/generators/generate_from_matrix.py --apply
```

**Notă Nx:** integrarea `@nx/devkit` poate înfășura acest script; sursa de adevăr rămâne Python pentru pipeline fără Node obligatoriu la generare (`tools/generators/README.md`).

---

## Reguli

- **Fără nume inventate:** id-uri din CSV / `name` din `manifest.json` trebuie să existe fizic sub `packages/neurons|synapses|gateways`.
- **Orchestrare:** câmp `orchestration` în `manifest.json` — validat de `tools/ci/gates/orchestration_manifests.py`.

---

## Verificare

- Teste stdlib: `tools/generators/test_generate_from_matrix.py`.
