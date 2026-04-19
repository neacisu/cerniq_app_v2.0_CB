# Cerniq App V2 CB

Monorepo Nx (în lucru pe branch `work/Bootstrap`). Documentație research în `docs/research/`.

## GitHub — remote și push

Repo-ul local are `main` și branch-ul `work/Bootstrap`. **Remote-ul GitHub** se adaugă manual după crearea repository-ului pe github.com:

```bash
git remote add origin https://github.com/<org>/<repo>.git
git checkout main
git push -u origin main
git checkout work/Bootstrap
git push -u origin work/Bootstrap
```

Lucrul curent se face pe **`work/Bootstrap`**; integrarea în `main` prin PR.
