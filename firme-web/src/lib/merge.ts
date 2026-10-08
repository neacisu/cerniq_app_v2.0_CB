import type { RezultatCautare, Sursa } from '../api/types';
import { cuiUtilizabil, pathFirma, pathInmatriculare } from './cui';

export interface FirmaRez { key: string; denumire: string; cui: string | null; cod: string | null; surse: Sursa[] }

/** Unește rezultatele ANAF și ONRC care aparțin aceluiași CUI într-un singur card. */
export function mergeRezultate(list: RezultatCautare[]): FirmaRez[] {
  const out = new Map<string, FirmaRez>();
  for (const r of list) {
    const cui = cuiUtilizabil(r.cui) ? r.cui : null;
    const key = cui ?? r.codInmatriculare ?? `${r.denumire}`;
    const cur = out.get(key);
    if (cur) {
      if (!cur.surse.includes(r.sursa)) cur.surse.push(r.sursa);
      cur.cod ??= r.codInmatriculare; cur.cui ??= cui;
    } else out.set(key, { key, denumire: r.denumire, cui, cod: r.codInmatriculare, surse: [r.sursa] });
  }
  return [...out.values()];
}
export function hrefFirma(f: { cui: string | null; cod: string | null }): string {
  if (f.cui) return pathFirma(f.cui);
  if (f.cod) return pathInmatriculare(f.cod);
  return '/';
}
