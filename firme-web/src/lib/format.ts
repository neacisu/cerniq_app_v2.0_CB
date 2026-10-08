const nf = new Intl.NumberFormat('ro-RO');
const cf = new Intl.NumberFormat('ro-RO', { notation: 'compact', maximumFractionDigits: 1 });

export function fmtNum(n: number | null | undefined, compact = false): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return compact ? cf.format(n) : nf.format(n);
}
export function fmtLei(n: number | null | undefined, compact = false): string {
  return n === null || n === undefined ? '—' : `${fmtNum(n, compact)} lei`;
}
export function fmtPct(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  const s = new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 1, signDisplay: 'exceptZero' }).format(n);
  return `${s}%`;
}
/** Variație procentuală; null dacă baza este 0/lipsă. */
export function pctChange(curr: number | null | undefined, prev: number | null | undefined): number | null {
  if (curr == null || prev == null || prev === 0) return null;
  return ((curr - prev) / Math.abs(prev)) * 100;
}
export function collapse(s: string | null | undefined): string {
  return (s ?? '').replace(/\s+/g, ' ').trim();
}
export function titleCase(s: string): string {
  return collapse(s).toLowerCase().replace(/(^|[\s\-(/.])(\p{L})/gu, (_, a: string, b: string) => a + b.toUpperCase());
}
export function ago(ts: number, now = Date.now()): string {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 60) return 'acum câteva secunde';
  const m = Math.round(s / 60); if (m < 60) return `acum ${m} min`;
  const h = Math.round(m / 60); if (h < 24) return `acum ${h} h`;
  const d = Math.round(h / 24); if (d < 30) return `acum ${d} zile`;
  return new Date(ts).toLocaleDateString('ro-RO');
}
export function isYes(v: string | undefined): boolean { return collapse(v).toUpperCase() === 'DA'; }
export function adresaPlatitor(p: Record<string, string> | null | undefined): string {
  if (!p) return '';
  const parts = [p.strada && `${titleCase(p.strada)}${p.nr ? ` nr. ${p.nr}` : ''}`, p.bloc && `bl. ${p.bloc}`, p.scara && `sc. ${p.scara}`,
    p.etaj && `et. ${p.etaj}`, p.ap && `ap. ${p.ap}`, p.localitate && titleCase(p.localitate), p.sector && `sector ${p.sector}`,
    p.judet && `jud. ${titleCase(p.judet)}`, p.codPostal && p.codPostal];
  return parts.filter(Boolean).join(', ');
}
export function adresaOnrc(f: Record<string, string> | null | undefined): string {
  if (!f) return '';
  const parts = [f.adrDenStrada && `${f.adrDenStrada}${f.adrNrStrada ? ` nr. ${f.adrNrStrada}` : ''}`, f.adrBloc && `bl. ${f.adrBloc}`,
    f.adrScara && `sc. ${f.adrScara}`, f.adrEtaj && `et. ${f.adrEtaj}`, f.adrApartament && `ap. ${f.adrApartament}`,
    f.adrLocalitate, f.adrSector && `sector ${f.adrSector}`, f.adrJudet && `jud. ${f.adrJudet}`, f.adrCodPostal];
  return parts.filter(Boolean).join(', ');
}
/** Format scurt pentru axe de grafic: mii / mil. / mld. */
export function fmtAxis(n: number): string {
  const a = Math.abs(n); const f = (x: number) => new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 1 }).format(x);
  if (a >= 1e9) return `${f(n / 1e9)} mld.`;
  if (a >= 1e6) return `${f(n / 1e6)} mil.`;
  if (a >= 1e3) return `${f(n / 1e3)} mii`;
  return f(n);
}
