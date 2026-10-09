/** Majuscule, fără diacritice și punctuație: doar pentru comparații, niciodată pentru afișare. */
export function normaText(s: string | null | undefined): string {
  return (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
}
