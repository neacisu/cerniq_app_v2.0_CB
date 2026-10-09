import { keepPreviousData, useQuery, useQueries, type UseQueryResult } from '@tanstack/react-query';
import { api, ApiError } from './client';
import type { BilantToti, CuiResponse, InmatriculareResponse, ParamGrup, AnafRezumat, FiltreDosare } from './types';

const DAY = 24 * 60 * 60 * 1000;
export const retry = (n: number, e: unknown) => !(e instanceof ApiError && e.status >= 400 && e.status < 500) && n < 2;

export const useCautare = (q: string, limit: number, enabled = true) =>
  useQuery({ queryKey: ['cauta', q, limit], queryFn: ({ signal }) => api.cauta(q, limit, signal), enabled: enabled && q.length > 0, staleTime: 5 * 60_000, retry });
export const useCui = (cui: string | null) =>
  useQuery({ queryKey: ['cui', cui], queryFn: ({ signal }) => api.cui(cui!, signal), enabled: !!cui, staleTime: 30 * 60_000, retry });
export const useInmatriculare = (cod: string | null) =>
  useQuery({ queryKey: ['inmatriculare', cod], queryFn: ({ signal }) => api.inmatriculare(cod!, signal), enabled: !!cod, staleTime: 30 * 60_000, retry });
export const useBilantToti = (cui: string | null) =>
  useQuery({ queryKey: ['bilant', cui], queryFn: ({ signal }) => api.bilantToti(cui!, signal), enabled: !!cui, staleTime: 60 * 60_000, retry });
export const useIndicatori = (an: number, formular: string, enabled = true) =>
  useQuery({ queryKey: ['indicatori', an, formular], queryFn: ({ signal }) => api.indicatori(an, formular, signal), enabled, staleTime: DAY, retry });
export const useStari = () => useQuery({ queryKey: ['stari'], queryFn: ({ signal }) => api.stari(signal), staleTime: DAY, retry });
export const useVersiuniCaen = () => useQuery({ queryKey: ['versiuni-caen'], queryFn: ({ signal }) => api.versiuniCaen(signal), staleTime: DAY, retry });
export const useCaen = (versiune: string, clasa?: string) =>
  useQuery({ queryKey: ['caen', versiune, clasa ?? ''], queryFn: ({ signal }) => api.caen(versiune, clasa, signal), staleTime: DAY, retry });
export const useHealth = () =>
  useQuery({
    queryKey: ['health'],
    queryFn: async ({ signal }) => { const t = performance.now(); const r = await api.health(signal); return { ...r, ms: Math.round(performance.now() - t) }; },
    refetchInterval: 30_000, retry: false, staleTime: 10_000,
  });
export function useBilanturi(cuis: string[]): UseQueryResult<BilantToti>[] {
  return useQueries({ queries: cuis.map((c) => ({ queryKey: ['bilant', c], queryFn: ({ signal }: { signal: AbortSignal }) => api.bilantToti(c, signal), staleTime: 60 * 60_000, retry })) });
}
export function useCuiMulti(cuis: string[]): UseQueryResult<CuiResponse>[] {
  return useQueries({ queries: cuis.map((c) => ({ queryKey: ['cui', c], queryFn: ({ signal }: { signal: AbortSignal }) => api.cui(c, signal), staleTime: 30 * 60_000, retry })) });
}
export function useIndicatoriAni(ani: number[], formular: string, enabled: boolean): UseQueryResult<import('./types').IndicatoriResponse>[] {
  return useQueries({ queries: ani.map((an) => ({ queryKey: ['indicatori', an, formular], queryFn: ({ signal }: { signal: AbortSignal }) => api.indicatori(an, formular, signal), enabled, staleTime: DAY, retry })) });
}
export type { InmatriculareResponse };

/** Graful se reconstruiește din aceeași interogare la fiecare filtru; desenul anterior rămâne vizibil cât se încarcă cel nou. */
export const useGrup = (cod: string | null, p: ParamGrup) =>
  useQuery({ queryKey: ['grup', cod, p], queryFn: ({ signal }) => api.grup(cod!, p, signal), enabled: !!cod, staleTime: 10 * 60_000, retry, placeholderData: keepPreviousData });

/** Stare fiscală ANAF v9 pentru un CUI (null = nu se interoghează). */
export const useAnaf = (cui: string | null) =>
  useQuery({ queryKey: ['anaf', cui], queryFn: ({ signal }) => api.anaf(cui!, signal), enabled: !!cui, staleTime: 30 * 60_000, retry });

/** Rezumate ANAF pentru liste, în pachete de 100 de CUI (limita API-ului). */
export function useAnafLista(cuis: string[]): { data: Map<string, AnafRezumat>; isPending: boolean } {
  const unice = [...new Set(cuis.filter(Boolean))].sort();
  const pachete: string[][] = []; for (let i = 0; i < unice.length; i += 100) pachete.push(unice.slice(i, i + 100));
  const rs = useQueries({ queries: pachete.map((p) => ({ queryKey: ['anaf-lista', p.join(',')], queryFn: ({ signal }: { signal: AbortSignal }) => api.anafLista(p, signal), staleTime: 30 * 60_000, retry })) });
  const data = new Map<string, AnafRezumat>();
  for (const r of rs) for (const x of r.data?.rezultate ?? []) data.set(x.cui, x);
  return { data, isPending: rs.some((r) => r.isPending) };
}

export const useDosare = (t: { cui: string | null; cod: string | null }, f: FiltreDosare) =>
  useQuery({ queryKey: ['dosare', t, f], queryFn: ({ signal }) => api.dosare(t, f, signal), enabled: !!(t.cui || t.cod), staleTime: 5 * 60_000, retry, placeholderData: keepPreviousData });
export const useDosar = (id: number | null, t: { cui: string | null; cod: string | null }) =>
  useQuery({ queryKey: ['dosar', id, t], queryFn: ({ signal }) => api.dosar(id!, t, signal), enabled: id !== null && !!(t.cui || t.cod), staleTime: 10 * 60_000, retry });
