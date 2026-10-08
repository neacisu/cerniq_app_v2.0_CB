import type { FormularBilant, Indicator } from '../api/types';
import { collapse } from './format';

/**
 * Codurile I* își schimbă sensul între ani și formulare (vezi raportul, secțiunea 8).
 * Metricile cheie sunt de aceea identificate după denumirea din dicționarul anului, nu după cod.
 */
export interface MetricDef { id: string; eticheta: string; potriviri: string[]; tip: 'lei' | 'numar'; ton: 'neutru' | 'pozitiv' | 'negativ' }

export const METRICI: MetricDef[] = [
  { id: 'ca', eticheta: 'Cifra de afaceri netă', potriviri: ['cifra de afaceri neta'], tip: 'lei', ton: 'neutru' },
  { id: 'venituri', eticheta: 'Venituri totale', potriviri: ['venituri totale'], tip: 'lei', ton: 'pozitiv' },
  { id: 'cheltuieli', eticheta: 'Cheltuieli totale', potriviri: ['cheltuieli totale'], tip: 'lei', ton: 'negativ' },
  { id: 'profit-brut', eticheta: 'Profit brut', potriviri: ['profit brut', 'profitul brut'], tip: 'lei', ton: 'pozitiv' },
  { id: 'profit', eticheta: 'Profit net', potriviri: ['profit net', 'profitul net'], tip: 'lei', ton: 'pozitiv' },
  { id: 'pierdere', eticheta: 'Pierdere netă', potriviri: ['pierdere neta'], tip: 'lei', ton: 'negativ' },
  { id: 'salariati', eticheta: 'Număr mediu de salariați', potriviri: ['numar mediu de salariati'], tip: 'numar', ton: 'neutru' },
  { id: 'capitaluri', eticheta: 'Capitaluri totale', potriviri: ['capitaluri - total'], tip: 'lei', ton: 'neutru' },
  { id: 'datorii', eticheta: 'Datorii', potriviri: ['datorii'], tip: 'lei', ton: 'negativ' },
];
export const metricById = (id: string): MetricDef => METRICI.find((m) => m.id === id) ?? METRICI[0]!;

export function norm(s: string): string {
  return collapse(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Denumirea fără sufixul „, din care:”, ca „CAPITALURI - TOTAL din care:” și „…, din care:” să fie același indicator. */
export function baseName(s: string): string { return norm(s).replace(/,?\s*din care:?$/, ''); }

/**
 * Caută un indicator după denumire, doar prin potrivire exactă (fără prefix): formularele ONG și IFN au etichete
 * precum „Venituri totale - prevederi anuale” sau „Datorii financiare…”, care nu sunt aceeași mărime.
 * Cu `formular` dat, se caută numai în depunerea acelui formular.
 */
export function findMetric(formulare: FormularBilant[], metric: MetricDef, formular?: string): Indicator | undefined {
  for (const f of formulare) {
    if (formular && f.formular !== formular) continue;
    const hit = f.indicatori.find((i) => metric.potriviri.includes(baseName(i.denumire)));
    if (hit) return hit;
  }
  return undefined;
}

export function seriesFor(ani: { an: number; formulare: FormularBilant[] }[], metric: MetricDef, formular?: string): { an: number; valoare: number | null }[] {
  return [...ani].sort((a, b) => a.an - b.an).map((a) => ({ an: a.an, valoare: findMetric(a.formulare, metric, formular)?.valoare ?? null }));
}

/** Formularul cu cele mai multe ani de depunere (la egalitate, cel mai recent): seria comparabilă a unei firme. */
export function primaryFormular(ani: { an: number; formulare: FormularBilant[] }[]): string | undefined {
  const stat = new Map<string, { n: number; last: number }>();
  for (const a of ani) for (const f of a.formulare) { const c = stat.get(f.formular) ?? { n: 0, last: 0 }; c.n++; c.last = Math.max(c.last, a.an); stat.set(f.formular, c); }
  return [...stat.entries()].sort((x, y) => y[1].n - x[1].n || y[1].last - x[1].last)[0]?.[0];
}

/** Unitatea de măsură a unui indicator: numărul mediu de salariați nu este în lei. */
export function unitFor(denumire: string): 'lei' | 'persoane' {
  return norm(denumire).startsWith('numar mediu de salariati') ? 'persoane' : 'lei';
}

export const FORMULARE: { cod: string; titlu: string; descriere: string }[] = [
  { cod: 'WEB_UU', titlu: 'Bilanț prescurtat', descriere: 'Societăți comerciale, din 2011.' },
  { cod: 'WEB_BL_BS_SL', titlu: 'Bilanț lung / scurt', descriere: 'În 2008–2010 formularul mare al societăților.' },
  { cod: 'WEB_ONG', titlu: 'Organizații fără scop patrimonial', descriere: 'Include și CAENO.' },
  { cod: 'WEB_IR', titlu: 'Raportări IFRS', descriere: 'Din 2012.' },
  { cod: 'WEB_IFN', titlu: 'Instituții financiare nebancare', descriere: 'Din 2012.' },
  { cod: 'WEB_INSTIT_DE_CREDIT', titlu: 'Instituții de credit', descriere: 'Încărcat din 2019.' },
  { cod: 'WEB_IP_IEME', titlu: 'Instituții de plată / monedă electronică', descriere: 'Din 2023.' },
  { cod: 'WEBASIG', titlu: 'Societăți de asigurare', descriere: '' },
  { cod: 'WEBBROK', titlu: 'Brokeri de asigurare', descriere: '' },
  { cod: 'WEB_FOND_GARANTARE', titlu: 'Fond de garantare', descriere: 'Încărcat din 2014.' },
  { cod: 'WEB_PENSII', titlu: 'Pensii', descriere: '' },
  { cod: 'WEB_SIF', titlu: 'Societăți de investiții financiare', descriere: '' },
  { cod: 'WEB_VM', titlu: 'Intermediari și consultanți de investiții', descriere: '' },
  { cod: 'WEB_VS', titlu: 'Entități de instrumente de investiții', descriere: 'Din 2015.' },
];
export const AN_MIN = 2008;
export const AN_MAX = 2025;
export const ANI = Array.from({ length: AN_MAX - AN_MIN + 1 }, (_, i) => AN_MAX - i);
