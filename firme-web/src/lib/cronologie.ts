/**
 * Cronologie unificată: evenimente din toate sursele, sortate, fiecare cu sursa ei. Nimic nu este contopit sau eliminat;
 * evenimentele fără dată (stări ONRC) sunt listate separat, nu inventăm o dată.
 */
import type { AnafFirma, DosarLista, FirmaOnrc, Stare } from '../api/types';
import { isoDin } from './anaf';

export type CategorieEv = 'inmatriculare' | 'fiscal' | 'tva' | 'efactura' | 'bilant' | 'dosar' | 'onrc';
export interface Eveniment { data: string; sfarsit?: string | null; categorie: CategorieEv; titlu: string; detaliu?: string; sursa: string; ton?: 'green' | 'amber' | 'red' | 'blue' | 'violet' }

export function construieste(i: { onrc?: FirmaOnrc | null; anaf?: AnafFirma | null; aniBilant?: number[]; dosare?: DosarLista[]; snapshotInregistrare?: string | null }): { cu: Eveniment[]; fara: { titlu: string; sursa: string }[] } {
  const ev: Eveniment[] = [];
  const add = (e: Omit<Eveniment, 'data'> & { data: string | null | undefined }) => { const d = isoDin(e.data ?? null); if (d) ev.push({ ...e, data: d }); };
  const a = i.anaf?.stare === 'gasit' ? i.anaf : null;

  add({ data: i.onrc?.dataInmatriculare, categorie: 'inmatriculare', titlu: 'Înmatriculare la ONRC', detaliu: i.onrc?.codInmatriculare, sursa: 'ONRC', ton: 'blue' });
  if (a?.generale?.dataInregistrare && isoDin(a.generale.dataInregistrare) !== isoDin(i.onrc?.dataInmatriculare)) {
    add({ data: a.generale.dataInregistrare, categorie: 'inmatriculare', titlu: 'Înregistrare la ANAF', sursa: 'ANAF v9', ton: 'blue' });
  }
  for (const p of a?.tvaDetaliu?.perioade ?? []) {
    add({ data: p.inceput, categorie: 'tva', titlu: 'Înregistrare în scopuri de TVA', sursa: 'ANAF v9', ton: 'violet' });
    if (p.sfarsit) add({ data: p.sfarsit, categorie: 'tva', titlu: 'Anulare înregistrare TVA', detaliu: p.mesaj ?? undefined, sursa: 'ANAF v9', ton: 'amber' });
  }
  const t = a?.tvaIncasare;
  if (t?.inceput) { add({ data: t.inceput, categorie: 'tva', titlu: 'TVA la încasare: început', sursa: 'ANAF v9', ton: 'violet' }); if (t.sfarsit) add({ data: t.sfarsit, categorie: 'tva', titlu: `TVA la încasare: încheiat${t.tipAct ? ` (${t.tipAct.toLowerCase()})` : ''}`, sursa: 'ANAF v9', ton: 'amber' }); }
  if (a?.split?.inceput) { add({ data: a.split.inceput, categorie: 'tva', titlu: 'Split TVA: început', sursa: 'ANAF v9', ton: 'violet' }); if (a.split.anulare) add({ data: a.split.anulare, categorie: 'tva', titlu: 'Split TVA: anulat', sursa: 'ANAF v9', ton: 'amber' }); }
  if (a?.eFactura?.data) add({ data: a.eFactura.data, categorie: 'efactura', titlu: 'Înregistrare în RO e-Factura', sursa: 'ANAF v9', ton: 'green' });
  if (a?.inactiv?.dataInactivare) add({ data: a.inactiv.dataInactivare, categorie: 'fiscal', titlu: 'Declarat inactiv fiscal', detaliu: a.inactiv.dataPublicare ? `Publicat la ${a.inactiv.dataPublicare}` : undefined, sursa: 'ANAF v9', ton: 'red' });
  if (a?.inactiv?.dataReactivare) add({ data: a.inactiv.dataReactivare, categorie: 'fiscal', titlu: 'Reactivat fiscal', sursa: 'ANAF v9', ton: 'green' });
  if (a?.inactiv?.dataRadiere) add({ data: a.inactiv.dataRadiere, categorie: 'fiscal', titlu: 'Radiat', sursa: 'ANAF v9', ton: 'red' });
  for (const an of i.aniBilant ?? []) add({ data: `${an}-12-31`, categorie: 'bilant', titlu: `Exercițiul financiar ${an}`, detaliu: 'Situații financiare depuse (data afișată este sfârșitul exercițiului)', sursa: 'MFP', ton: 'blue' });
  for (const d of i.dosare ?? []) if (d.dataDosar && !d.dataInViitor) add({ data: d.dataDosar, categorie: 'dosar', titlu: `Dosar ${d.numar}`, detaliu: `${d.categorie}${d.obiect ? ` · ${d.obiect}` : ''}`, sursa: 'Portal instanțe (potrivire după nume)', ton: d.potrivire === 'exacta' ? undefined : 'amber' });

  ev.sort((x, y) => (x.data < y.data ? 1 : x.data > y.data ? -1 : 0));
  return { cu: ev, fara: [] };
}
export function faraData(stari: Stare[]): { titlu: string; sursa: string }[] {
  return stari.map((s) => ({ titlu: `${s.cod} · ${(s.denumire ?? '').replace(/\s+/g, ' ').trim()}`, sursa: 'ONRC (stări, fără dată publicată)' }));
}
