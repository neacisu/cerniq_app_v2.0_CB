import type { AnafFirma, AnafRezumat, StareFiscala, StareTva } from '../api/types';

export type Ton = 'green' | 'amber' | 'red' | 'blue' | 'violet' | undefined;
export const STARE_FISCALA: Record<StareFiscala, { eticheta: string; ton: Ton; gravitate: number; descriere: string }> = {
  radiat: { eticheta: 'Radiat', ton: 'red', gravitate: 5, descriere: 'Firma figurează radiată în evidența ANAF.' },
  dizolvat: { eticheta: 'În dizolvare', ton: 'red', gravitate: 4, descriere: 'ANAF înregistrează dizolvarea firmei.' },
  suspendat: { eticheta: 'Suspendat', ton: 'amber', gravitate: 3, descriere: 'Activitatea figurează suspendată la ANAF.' },
  inactiv: { eticheta: 'Inactiv fiscal', ton: 'red', gravitate: 2, descriere: 'Contribuabil declarat inactiv de ANAF: nu poate deduce TVA și are restricții la tranzacții.' },
  activ: { eticheta: 'Activ fiscal', ton: 'green', gravitate: 0, descriere: 'Nu există nicio restricție în evidența ANAF.' },
  necunoscut: { eticheta: 'Stare necunoscută', ton: undefined, gravitate: 1, descriere: 'ANAF nu a întors suficiente date pentru a stabili starea.' },
};
export const STARE_TVA: Record<StareTva, { eticheta: string; ton: Ton }> = {
  platitor: { eticheta: 'Plătitor TVA', ton: 'violet' }, anulat: { eticheta: 'TVA anulat', ton: 'amber' },
  neplatitor: { eticheta: 'Neplătitor TVA', ton: undefined }, necunoscut: { eticheta: 'TVA necunoscut', ton: undefined },
};

/** Textul unei stări de interogare, pentru cazurile în care nu există date ANAF. */
export function mesajStare(a: Pick<AnafFirma | AnafRezumat, 'stare'> & { motiv?: string | null }): { titlu: string; text: string } | null {
  switch (a.stare) {
    case 'gasit': return null;
    case 'negasit': return { titlu: 'ANAF nu cunoaște acest CUI', text: 'CUI-ul a fost interogat la ANAF și nu a fost găsit. Poate fi un CUI radiat de mult, greșit sau neînregistrat fiscal.' };
    case 'asteptare': return { titlu: 'Încă neinterogat la ANAF', text: 'CUI-ul este în coada de interogare. Datele vor apărea după ce worker-ul îl procesează.' };
    case 'exclus': return { titlu: 'Persoană fizică', text: a.motiv ?? 'CUI-ul are formă de cod numeric personal; datele ANAF nu se afișează pentru persoane fizice.' };
    default: return { titlu: 'Fără date ANAF', text: 'Acest CUI nu figurează în stratul ANAF încărcat.' };
  }
}

export const ISO_RO = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
/** „2025-03-10” → „10 martie 2025”; orice altceva se întoarce neschimbat. */
export function dataRo(iso: string | null | undefined): string {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return Number.isNaN(d.getTime()) ? iso : ISO_RO.format(d);
}
/** „26.02.2018” (snapshot) → „2018-02-26”; datele ISO trec neschimbate. */
export function isoDin(data: string | null | undefined): string | null {
  const t = (data ?? '').trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(t)) return t.slice(0, 10);
  const m = /^(\d{2})[./](\d{2})[./](\d{4})/.exec(t);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
}
export const zileDe = (iso: string | null | undefined, acum = Date.now()): number | null => {
  if (!iso) return null; const t = Date.parse(iso); return Number.isNaN(t) ? null : Math.floor((acum - t) / 86_400_000);
};
