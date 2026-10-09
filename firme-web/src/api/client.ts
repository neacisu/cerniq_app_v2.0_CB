import type {
  BilantAnResponse, BilantToti, CaenResponse, CautareResponse, CuiResponse, IndicatoriResponse,
  InmatriculareResponse, StareNomenclator, VersiuneCaen, GrafGrup, ParamGrup, AnafFirma, AnafRezumat, DosareResponse, DosarDetaliu, FiltreDosare,
} from './types';

export const API_BASE: string = import.meta.env.VITE_API_BASE ?? '/api';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { signal, headers: { Accept: 'application/json' } });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e;
    throw new ApiError(0, 'Nu se poate contacta serverul. Verifică conexiunea la internet.');
  }
  let body: unknown = null;
  try { body = await res.json(); } catch { /* corp gol sau non-JSON */ }
  if (!res.ok) {
    const msg = body && typeof body === 'object' && 'eroare' in body ? String((body as { eroare: unknown }).eroare) : `Eroare ${res.status}`;
    throw new ApiError(res.status, msg);
  }
  return body as T;
}

const enc = encodeURIComponent;

export function queryGrup(p: ParamGrup): string {
  const q = new URLSearchParams({ adancime: String(p.adancime), plafon: String(p.plafon), profesionisti: String(p.profesionisti), slabe: String(p.slabe) });
  p.fara.forEach((x) => q.append('fara', x));
  p.faraRoluri.forEach((x) => q.append('faraRoluri', x));
  return q.toString();
}

export function queryDosare(t: { cui: string | null; cod: string | null }, f: FiltreDosare): string {
  const q = new URLSearchParams();
  if (t.cui) q.set('cui', t.cui); else if (t.cod) q.set('cod', t.cod);
  for (const k of ['categorie', 'stadiu', 'rol', 'potrivire', 'q'] as const) { const v = f[k]; if (v) q.set(k, v); }
  if (f.an) q.set('an', String(f.an));
  if (f.doarExacte) q.set('doarExacte', 'true');
  q.set('limit', String(f.limit)); q.set('offset', String(f.offset));
  return q.toString();
}

export const api = {
  grup: (cod: string, p: ParamGrup, s?: AbortSignal) =>
    apiGet<GrafGrup>(`/grup/${cod.split('/').map(enc).join('/')}?${queryGrup(p)}`, s),
  anaf: (cui: string, s?: AbortSignal) => apiGet<AnafFirma>(`/anaf/${enc(cui)}`, s),
  anafLista: (cuis: string[], s?: AbortSignal) => apiGet<{ rezultate: AnafRezumat[] }>(`/anaf?cui=${cuis.map(enc).join(',')}`, s),
  dosare: (t: { cui: string | null; cod: string | null }, f: FiltreDosare, s?: AbortSignal) => apiGet<DosareResponse>(`/dosare?${queryDosare(t, f)}`, s),
  dosar: (id: number, t: { cui: string | null; cod: string | null }, s?: AbortSignal) => apiGet<DosarDetaliu>(`/dosare/${id}?${t.cui ? `cui=${enc(t.cui)}` : `cod=${enc(t.cod ?? '')}`}`, s),
  health: (s?: AbortSignal) => apiGet<{ stare: string }>('/health', s),
  cauta: (q: string, limit: number, s?: AbortSignal) => apiGet<CautareResponse>(`/firme?q=${enc(q)}&limit=${limit}`, s),
  cui: (cui: string, s?: AbortSignal) => apiGet<CuiResponse>(`/cui/${enc(cui)}`, s),
  inmatriculare: (cod: string, s?: AbortSignal) =>
    apiGet<InmatriculareResponse>(`/firme/inmatriculare/${cod.split('/').map(enc).join('/')}`, s),
  bilantAn: (cui: string, an: number, s?: AbortSignal) => apiGet<BilantAnResponse>(`/bilant/${enc(cui)}/${an}`, s),
  bilantToti: (cui: string, s?: AbortSignal) => apiGet<BilantToti>(`/bilant/${enc(cui)}`, s),
  indicatori: (an: number, formular: string, s?: AbortSignal) => apiGet<IndicatoriResponse>(`/indicatori/${an}/${enc(formular)}`, s),
  stari: (s?: AbortSignal) => apiGet<{ stari: StareNomenclator[] }>('/nomenclatoare/stari', s),
  versiuniCaen: (s?: AbortSignal) => apiGet<{ versiuni: VersiuneCaen[] }>('/nomenclatoare/versiuni-caen', s),
  caen: (versiune: string, clasa: string | undefined, s?: AbortSignal) =>
    apiGet<CaenResponse>(`/nomenclatoare/caen?versiune=${enc(versiune)}${clasa ? `&clasa=${enc(clasa)}` : ''}`, s),
};
