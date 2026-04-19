# Generatoare manifest

- `generate_from_matrix.py` — citește `packages/manifests/*.csv` și poate emite fișiere `generated/stub.ts` sub pachetele existente.

Rulare:

```bash
# previzualizare
python3 tools/generators/generate_from_matrix.py

# scriere pe disc
python3 tools/generators/generate_from_matrix.py --apply
```

Integrare Nx dedicată poate fi adăugată ulterior (`@nx/devkit`); scriptul rămâne canonic pentru pipeline fără Node la generare.
