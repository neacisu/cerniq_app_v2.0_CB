/**
 * Stratul ANAF v9 (PlatitorTvaRest): funcții pure de derivare, testabile fără bază de date.
 * Regula de proveniență: v9 (interogat direct la ANAF, cu dată) prevalează la STARE față de snapshot-ul „platitori 2026”,
 * dar valoarea din snapshot se păstrează și se compară (vezi `discrepante`).
 */

export type StareInterogare = 'gasit' | 'negasit' | 'asteptare' | 'exclus' | 'absent';
export type StareFiscala = 'activ' | 'inactiv' | 'suspendat' | 'dizolvat' | 'radiat' | 'necunoscut';
export type StareTva = 'platitor' | 'anulat' | 'neplatitor' | 'necunoscut';

export interface InputStare {
  stareInregistrare: string | null;   // ex. „INREGISTRAT din data 26.02.2018”, „RADIERE din data …”
  statusInactiv: boolean | null;
  dataRadiere: string | null;
}
const primulCuvant = (s: string | null): string => (s ?? '').trim().split(/\s+/)[0]?.toUpperCase() ?? '';

/** Cea mai gravă stare câștigă: radiat > dizolvat > suspendat > inactiv > activ. */
export function stareFiscala(i: InputStare): StareFiscala {
  const w = primulCuvant(i.stareInregistrare);
  if (w === 'RADIERE' || (i.dataRadiere ?? '') !== '') return 'radiat';
  if (w === 'DIZOLVARE') return 'dizolvat';
  if (w === 'SUSPENDARE') return 'suspendat';
  if (i.statusInactiv === true) return 'inactiv';
  if (w === '' && i.statusInactiv === null) return 'necunoscut';
  return 'activ';
}

export interface InputTva { scopTva: boolean | null; nrPerioade: number }
/** Plătitor acum / a avut înregistrare dar a fost anulată / niciodată. */
export function stareTva(i: InputTva): StareTva {
  if (i.scopTva === true) return 'platitor';
  if (i.scopTva === false) return i.nrPerioade > 0 ? 'anulat' : 'neplatitor';
  return 'necunoscut';
}

/** Compară starea v9 cu cea din snapshot-ul ANAF 2026 și întoarce diferențele, fără să aleagă în tăcere. */
export interface Discrepanta { camp: 'stare' | 'tva' | 'denumire' | 'adresa'; v9: string; snapshot: string }
export function discrepante(v9: { stareFiscala: StareFiscala; tva: StareTva; denumire: string | null; adresa: string | null }, snapshot: { stare: string | null; tva: string | null; denumire: string | null; adresa: string | null } | null): Discrepanta[] {
  if (!snapshot) return [];
  const out: Discrepanta[] = [];
  const snapStare = primulCuvant(snapshot.stare);
  const snapEsteActiv = snapStare === 'INREGISTRAT' || snapStare === 'MODIFICARE' || snapStare === 'RELUARE';
  if (snapEsteActiv && v9.stareFiscala !== 'activ' && v9.stareFiscala !== 'necunoscut') out.push({ camp: 'stare', v9: v9.stareFiscala, snapshot: (snapshot.stare ?? '').trim() });
  const snapTva = (snapshot.tva ?? '').trim().toUpperCase();
  if (snapTva === 'NU' && v9.tva === 'platitor') out.push({ camp: 'tva', v9: 'plătitor', snapshot: 'neplătitor' });
  if (snapTva === 'DA' && v9.tva !== 'platitor' && v9.tva !== 'necunoscut') out.push({ camp: 'tva', v9: v9.tva === 'anulat' ? 'anulat' : 'neplătitor', snapshot: 'plătitor' });
  const n = (s: string | null) => normText(s);
  if (v9.denumire && snapshot.denumire && n(v9.denumire) !== n(snapshot.denumire)) out.push({ camp: 'denumire', v9: v9.denumire, snapshot: snapshot.denumire });
  return out;
}

/** Majuscule, fără diacritice, fără punctuație, spații colapsate — pentru comparații, niciodată pentru afișare. */
export function normText(s: string | null | undefined): string {
  return (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
}

/** Număr de telefon comparabil: doar cifre, prefix țară RO eliminat (0040/+40/40 → 0). */
export function telefonCanonic(raw: string | null | undefined): string | null {
  let d = (raw ?? '').replace(/[^\d+]/g, '');
  if (d === '') return null;
  d = d.replace(/^\+/, '').replace(/^0040/, '0').replace(/^40(?=7|2|3)/, '0');
  d = d.replace(/\D/g, '');
  return d.length >= 6 ? d : null;
}
