import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useStored } from '../lib/storage';

export interface FirmaRef { cui: string | null; cod: string | null; denumire: string }
export interface Favorit extends FirmaRef { adaugat: number; nota: string }
export interface IstoricItem extends FirmaRef { vizitat: number }
export interface CautareSalvata { q: string; la: number }

export const firmaKey = (f: { cui: string | null; cod: string | null }): string => f.cui ?? f.cod ?? '';
export const MAX_COMPARE = 4;

interface Ctx {
  favorite: Favorit[]; istoric: IstoricItem[]; compare: FirmaRef[]; cautari: CautareSalvata[];
  isFavorit: (k: string) => boolean;
  toggleFavorit: (f: FirmaRef) => boolean;
  setNota: (k: string, nota: string) => void;
  removeFavorit: (k: string) => void;
  importFavorite: (items: Favorit[]) => number;
  addIstoric: (f: FirmaRef) => void;
  clearIstoric: () => void;
  removeIstoric: (k: string) => void;
  inCompare: (k: string) => boolean;
  toggleCompare: (f: FirmaRef) => 'adaugat' | 'scos' | 'plin';
  removeCompare: (k: string) => void;
  clearCompare: () => void;
  addCautare: (q: string) => void;
  clearCautari: () => void;
  clearAll: () => void;
}
const LibCtx = createContext<Ctx | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [favorite, setFav] = useStored<Favorit[]>('firme.favorite', []);
  const [istoric, setIst] = useStored<IstoricItem[]>('firme.istoric', []);
  const [compare, setCmp] = useStored<FirmaRef[]>('firme.compare', []);
  const [cautari, setCaut] = useStored<CautareSalvata[]>('firme.cautari', []);

  const isFavorit = useCallback((k: string) => favorite.some((f) => firmaKey(f) === k), [favorite]);
  const toggleFavorit = useCallback((f: FirmaRef) => {
    const k = firmaKey(f); let added = false;
    setFav((p) => { if (p.some((x) => firmaKey(x) === k)) return p.filter((x) => firmaKey(x) !== k); added = true; return [{ ...f, adaugat: Date.now(), nota: '' }, ...p]; });
    return added;
  }, [setFav]);
  const setNota = useCallback((k: string, nota: string) => setFav((p) => p.map((x) => (firmaKey(x) === k ? { ...x, nota } : x))), [setFav]);
  const removeFavorit = useCallback((k: string) => setFav((p) => p.filter((x) => firmaKey(x) !== k)), [setFav]);
  const importFavorite = useCallback((items: Favorit[]) => {
    let n = 0;
    setFav((p) => {
      const have = new Set(p.map(firmaKey)); const out = [...p];
      for (const it of items) { const k = firmaKey(it); if (k && !have.has(k) && typeof it.denumire === 'string') { have.add(k); out.push({ cui: it.cui ?? null, cod: it.cod ?? null, denumire: it.denumire, adaugat: it.adaugat ?? Date.now(), nota: it.nota ?? '' }); n++; } }
      return out;
    });
    return n;
  }, [setFav]);

  const addIstoric = useCallback((f: FirmaRef) => {
    const k = firmaKey(f); if (!k) return;
    setIst((p) => [{ ...f, vizitat: Date.now() }, ...p.filter((x) => firmaKey(x) !== k)].slice(0, 50));
  }, [setIst]);
  const clearIstoric = useCallback(() => setIst([]), [setIst]);
  const removeIstoric = useCallback((k: string) => setIst((p) => p.filter((x) => firmaKey(x) !== k)), [setIst]);

  const inCompare = useCallback((k: string) => compare.some((f) => firmaKey(f) === k), [compare]);
  const toggleCompare = useCallback((f: FirmaRef): 'adaugat' | 'scos' | 'plin' => {
    const k = firmaKey(f);
    if (compare.some((x) => firmaKey(x) === k)) { setCmp((p) => p.filter((x) => firmaKey(x) !== k)); return 'scos'; }
    if (compare.length >= MAX_COMPARE) return 'plin';
    setCmp((p) => [...p, f]); return 'adaugat';
  }, [compare, setCmp]);
  const removeCompare = useCallback((k: string) => setCmp((p) => p.filter((x) => firmaKey(x) !== k)), [setCmp]);
  const clearCompare = useCallback(() => setCmp([]), [setCmp]);

  const addCautare = useCallback((q: string) => {
    const t = q.trim(); if (!t) return;
    setCaut((p) => [{ q: t, la: Date.now() }, ...p.filter((x) => x.q.toLowerCase() !== t.toLowerCase())].slice(0, 12));
  }, [setCaut]);
  const clearCautari = useCallback(() => setCaut([]), [setCaut]);
  const clearAll = useCallback(() => { setFav([]); setIst([]); setCmp([]); setCaut([]); }, [setFav, setIst, setCmp, setCaut]);

  const value = useMemo(() => ({ favorite, istoric, compare, cautari, isFavorit, toggleFavorit, setNota, removeFavorit, importFavorite, addIstoric, clearIstoric, removeIstoric, inCompare, toggleCompare, removeCompare, clearCompare, addCautare, clearCautari, clearAll }),
    [favorite, istoric, compare, cautari, isFavorit, toggleFavorit, setNota, removeFavorit, importFavorite, addIstoric, clearIstoric, removeIstoric, inCompare, toggleCompare, removeCompare, clearCompare, addCautare, clearCautari, clearAll]);
  return <LibCtx.Provider value={value}>{children}</LibCtx.Provider>;
}
export function useLibrary(): Ctx {
  const c = useContext(LibCtx);
  if (!c) throw new Error('useLibrary în afara LibraryProvider');
  return c;
}
