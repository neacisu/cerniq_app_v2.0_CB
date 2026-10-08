export type TipCautare = 'cui' | 'inmatriculare' | 'denumire' | 'prea-scurt' | 'gol';

/** Curăță prefixul RO și spațiile dintr-un CUI introdus de utilizator. */
export function normalizeCui(raw: string): string {
  return raw.trim().replace(/^RO\s*/i, '').replace(/\s+/g, '');
}
export function isCui(s: string): boolean { return /^\d{2,13}$/.test(s); }
export function isCodInmatriculare(s: string): boolean { return /^[A-Za-z0-9][A-Za-z0-9/.\-]{2,63}$/.test(s) && s.includes('/'); }
export function cuiUtilizabil(cui: string | null | undefined): cui is string {
  return !!cui && cui !== '0' && /^\d{2,13}$/.test(cui);
}
export function detectType(raw: string): TipCautare {
  const q = raw.trim();
  if (!q) return 'gol';
  const c = normalizeCui(q);
  if (/^\d+$/.test(c)) return isCui(c) ? 'cui' : 'prea-scurt';
  if (q.includes('/')) return 'inmatriculare';
  return q.length >= 2 ? 'denumire' : 'prea-scurt';
}
export const tipEticheta: Record<TipCautare, string> = {
  cui: 'Cod fiscal (CUI)', inmatriculare: 'Nr. înmatriculare', denumire: 'Denumire', 'prea-scurt': 'Mai scrie puțin', gol: '',
};
/** Slash-urile din codul de înmatriculare rămân în URL ca segmente. */
export function pathInmatriculare(cod: string): string {
  return `/inmatriculare/${cod.split('/').map(encodeURIComponent).join('/')}`;
}
export function pathFirma(cui: string): string { return `/firma/${encodeURIComponent(cui)}`; }
