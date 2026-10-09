/**
 * Dosare (portal instanțe): legătura cu firma este întotdeauna „potrivire după nume”. Pentru fiecare dosar se
 * calculează un grad TRANSPARENT de potrivire, din numele părții comparat cu denumirea firmei; nimic nu se contopește automat.
 */
import { normText } from './anaf.js';

export type Grad = 'exacta' | 'reprezentant' | 'partiala' | 'nume';
export const ORDINE_GRAD: Grad[] = ['exacta', 'reprezentant', 'partiala', 'nume'];

const FORME = new Set(['SC', 'SRL', 'SA', 'SCS', 'SNC', 'SRLD', 'PFA', 'II', 'IF', 'RA', 'SCA', 'SRLS']);

/** „QBIKNEF S.R.L.” și „QBIKNEF SRL” → „QBIKNEF”; punctele dintre inițiale dispar înainte de curățare. */
export function bazaDenumire(s: string | null | undefined): string {
  const fara = (s ?? '').replace(/\b([A-Za-zĂÂÎȘŞȚŢăâîșşțţ])\.(?=\s|$|[A-Za-zĂÂÎȘŞȚŢăâîșşțţ]\.)/g, '$1');
  return normText(fara).split(' ').filter((t) => t && !FORME.has(t)).join(' ');
}

/** Numele părții fără mențiunile de reprezentare („… - PRIN LICHIDATOR …”, „… - CU DOM. PROC. ALES …”). */
export function numeParteCurat(nume: string): string {
  return nume.replace(/\s+-\s+(PRIN|CU DOM|CU DOMICILIUL|REPREZENTAT|IN CALITATE|ÎN CALITATE|LA SEDIUL|SUCCESOR)\b.*$/i, '').replace(/[,;\s]+$/, '');
}

export function gradPotrivire(parte: string, denumireFirma: string, motiv: string): Grad {
  const p = bazaDenumire(numeParteCurat(parte)), f = bazaDenumire(denumireFirma);
  if (p !== '' && p === f) return 'exacta';
  if (motiv === 'reprezentant') return 'reprezentant';
  if (p !== '' && f !== '' && (p.startsWith(`${f} `) || f.startsWith(`${p} `))) return 'partiala';
  return 'nume';
}
export const celMaiBun = (g: Grad[]): Grad => ORDINE_GRAD.find((x) => g.includes(x)) ?? 'nume';

export interface LegaturaDosar { parte: string; calitate: string; motiv: string; interogat: string }
export interface DosarLista {
  id: number; numar: string; instanta: string; departament: string; categorie: string; stadiu: string; obiect: string;
  dataDosar: string | null; dataModificare: string | null; anDosar: number | null;
  rol: string[]; potrivire: Grad; legaturi: (LegaturaDosar & { grad: Grad })[];
  nrParti: number; nrSedinte: number; ultimaSedinta: string | null; nrCaiAtac: number; dataInViitor: boolean;
}

export interface Filtre { categorie?: string; stadiu?: string; rol?: string; an?: number; potrivire?: Grad; q?: string; doarExacte?: boolean }
export function filtreaza(l: DosarLista[], f: Filtre): DosarLista[] {
  const q = normText(f.q);
  return l.filter((d) => (!f.categorie || d.categorie === f.categorie) && (!f.stadiu || d.stadiu === f.stadiu) && (!f.rol || d.rol.includes(f.rol))
    && (!f.an || d.anDosar === f.an) && (!f.potrivire || d.potrivire === f.potrivire) && (!f.doarExacte || d.potrivire === 'exacta' || d.potrivire === 'reprezentant')
    && (!q || normText(`${d.numar} ${d.obiect} ${d.instanta} ${d.legaturi.map((x) => x.parte).join(' ')}`).includes(q)));
}

export interface Faceta { valoare: string; nr: number }
const numara = (v: (string | number | null)[]): Faceta[] => {
  const m = new Map<string, number>();
  for (const x of v) if (x !== null && x !== '') m.set(String(x), (m.get(String(x)) ?? 0) + 1);
  return [...m.entries()].map(([valoare, nr]) => ({ valoare, nr })).sort((a, b) => b.nr - a.nr || a.valoare.localeCompare(b.valoare, 'ro'));
};
export function sumar(l: DosarLista[]) {
  return {
    total: l.length,
    categorii: numara(l.map((d) => d.categorie)), stadii: numara(l.map((d) => d.stadiu)), roluri: numara(l.flatMap((d) => d.rol)),
    ani: numara(l.map((d) => d.anDosar)).sort((a, b) => Number(a.valoare) - Number(b.valoare)),
    instante: numara(l.map((d) => d.instanta)).slice(0, 12), potriviri: numara(l.map((d) => d.potrivire)),
    primul: l.reduce<string | null>((m, d) => (d.dataDosar && (!m || d.dataDosar < m) ? d.dataDosar : m), null),
    ultimul: l.reduce<string | null>((m, d) => (d.dataDosar && !d.dataInViitor && (!m || d.dataDosar > m) ? d.dataDosar : m), null),
  };
}
