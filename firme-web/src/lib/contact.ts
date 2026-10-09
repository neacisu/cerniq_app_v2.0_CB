/**
 * Contacte din toate sursele, deduplicate FĂRĂ pierdere: același număr din mai multe surse apare o dată, cu toate sursele
 * și datele lui. Emailul nu există în nicio sursă încărcată (vezi avertismentul din interfață).
 */
export interface ContactSursa { sursa: string; data: string | null }
export interface Contact { tip: 'telefon' | 'fax' | 'web'; valoare: string; canonic: string; surse: ContactSursa[] }

export function telefonCanonic(raw: string | null | undefined): string | null {
  let d = (raw ?? '').replace(/[^\d+]/g, '');
  if (d === '') return null;
  d = d.replace(/^\+/, '').replace(/^0040/, '0').replace(/^40(?=7|2|3)/, '0').replace(/\D/g, '');
  return d.length >= 6 ? d : null;
}
export function webCanonic(raw: string | null | undefined): string | null {
  const t = (raw ?? '').trim().toLowerCase();
  if (t === '' || t === '0') return null;
  return t.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '') || null;
}
export const hrefWeb = (raw: string): string => (/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);

export interface IntrareContact { tip: Contact['tip']; valoare: string | null | undefined; sursa: string; data?: string | null }
export function uneste(intrari: IntrareContact[]): Contact[] {
  const m = new Map<string, Contact>();
  for (const i of intrari) {
    const canonic = i.tip === 'web' ? webCanonic(i.valoare) : telefonCanonic(i.valoare);
    if (!canonic || !i.valoare) continue;
    const k = `${i.tip}:${canonic}`;
    const cur = m.get(k);
    const sursa = { sursa: i.sursa, data: i.data ?? null };
    if (cur) { if (!cur.surse.some((s) => s.sursa === sursa.sursa)) cur.surse.push(sursa); }
    else m.set(k, { tip: i.tip, valoare: i.valoare.trim(), canonic, surse: [sursa] });
  }
  return [...m.values()];
}
