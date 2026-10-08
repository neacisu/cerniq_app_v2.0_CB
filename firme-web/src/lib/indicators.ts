import type { FormularBilant, Indicator } from '../api/types';
import { collapse } from './format';

/**
 * Codurile I* își schimbă sensul între ani și formulare (vezi raportul, secțiunea 8).
 * Metricile cheie sunt de aceea identificate după denumirea din dicționarul anului, nu după cod.
 */
export interface MetricDef { id: string; eticheta: string; potrivire: string; tip: 'lei' | 'numar'; ton: 'neutru' | 'pozitiv' | 'negativ' }

export const METRICI: MetricDef[] = [
  { id: 'ca', eticheta: 'Cifra de afaceri netă', potrivire: 'cifra de afaceri neta', tip: 'lei', ton: 'neutru' },
  { id: 'venituri', eticheta: 'Venituri totale', potrivire: 'venituri totale', tip: 'lei', ton: 'pozitiv' },
  { id: 'cheltuieli', eticheta: 'Cheltuieli totale', potrivire: 'cheltuieli totale', tip: 'lei', ton: 'negativ' },
  { id: 'profit-brut', eticheta: 'Profit brut', potrivire: 'profit brut', tip: 'lei', ton: 'pozitiv' },
  { id: 'profit', eticheta: 'Profit net', potrivire: 'profit net', tip: 'lei', ton: 'pozitiv' },
  { id: 'pierdere', eticheta: 'Pierdere netă', potrivire: 'pierdere neta', tip: 'lei', ton: 'negativ' },
  { id: 'salariati', eticheta: 'Număr mediu de salariați', potrivire: 'numar mediu de salariati', tip: 'numar', ton: 'neutru' },
  { id: 'capitaluri', eticheta: 'Capitaluri totale', potrivire: 'capitaluri - total', tip: 'lei', ton: 'neutru' },
  { id: 'datorii', eticheta: 'Datorii', potrivire: 'datorii', tip: 'lei', ton: 'negativ' },
];
export const metricById = (id: string): MetricDef => METRICI.find((m) => m.id === id) ?? METRICI[0]!;

export function norm(s: string): string {
  return collapse(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Caută un indicator după denumirea normalizată (potrivire exactă sau prefix). */
export function findMetric(formulare: FormularBilant[], metric: MetricDef): Indicator | undefined {
  for (const f of formulare) {
    const exact = f.indicatori.find((i) => norm(i.denumire) === metric.potrivire);
    if (exact) return exact;
  }
  for (const f of formulare) {
    const pref = f.indicatori.find((i) => norm(i.denumire).startsWith(metric.potrivire));
    if (pref) return pref;
  }
  return undefined;
}

export function seriesFor(ani: { an: number; formulare: FormularBilant[] }[], metric: MetricDef): { an: number; valoare: number | null }[] {
  return [...ani].sort((a, b) => a.an - b.an).map((a) => ({ an: a.an, valoare: findMetric(a.formulare, metric)?.valoare ?? null }));
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
