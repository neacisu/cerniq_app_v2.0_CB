# Manifeste NEURON / SYNAPSE

Fișiere CSV sursă pentru generatoarele din `tools/generators/`. Coloanele sunt minime; extindeți conform CMDB intern.

- `NEURON_MATRIX.csv` — neuroni bounded-context.
- `SYNAPSE_MATRIX.csv` — consumatori Redis Streams (XREADGROUP).

Rulați:

```bash
pnpm run gen:matrix
```

Artefactele generate sunt scrise sub `packages/` (dry-run implicit); folosiți `--apply` pentru a crea directoare (vezi script).
