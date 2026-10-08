import { describe, expect, it } from 'vitest';
import { pctChange, titleCase, collapse } from './format';
import { detectType, normalizeCui, pathInmatriculare, cuiUtilizabil } from './cui';
import { findMetric, METRICI, norm, seriesFor } from './indicators';
import { toCsv } from './export';

describe('format', () => {
  it('pctChange', () => { expect(pctChange(150, 100)).toBe(50); expect(pctChange(1, 0)).toBeNull(); expect(pctChange(null, 5)).toBeNull(); });
  it('titleCase', () => { expect(titleCase('IANCU DE HUNEDOARA')).toBe('Iancu De Hunedoara'); });
  it('collapse', () => { expect(collapse('Pierdere  neta ')).toBe('Pierdere neta'); });
});
describe('cui', () => {
  it('detectType', () => {
    expect(detectType('38926034')).toBe('cui'); expect(detectType('RO 38926034')).toBe('cui');
    expect(detectType('J9/150/2018')).toBe('inmatriculare'); expect(detectType('qb')).toBe('denumire');
    expect(detectType('a')).toBe('prea-scurt'); expect(detectType('1')).toBe('prea-scurt'); expect(detectType('  ')).toBe('gol');
  });
  it('normalizeCui', () => { expect(normalizeCui(' ro 123 456')).toBe('123456'); });
  it('path', () => { expect(pathInmatriculare('J9/150/2018')).toBe('/inmatriculare/J9/150/2018'); });
  it('cuiUtilizabil', () => { expect(cuiUtilizabil('0')).toBe(false); expect(cuiUtilizabil('')).toBe(false); expect(cuiUtilizabil('1234')).toBe(true); });
});
describe('indicators', () => {
  const f = (den: string, valoare: number) => ({ formular: 'WEB_UU', caen: null, caenDenumire: null, caenVersiune: '2', caeno: null, indicatori: [{ cod: 'I1', denumire: den, pozitie: 1, valoare }] });
  it('găsește după denumire, indiferent de cod/spații', () => {
    const m = METRICI.find((x) => x.id === 'pierdere')!;
    expect(findMetric([f('Pierdere  neta', 5)], m)?.valoare).toBe(5);
    expect(norm('VENITURI TOTALE')).toBe('venituri totale');
  });
  it('seriesFor sortează după an', () => {
    const m = METRICI.find((x) => x.id === 'profit')!;
    const s = seriesFor([{ an: 2021, formulare: [f('Profit net', 2)] }, { an: 2019, formulare: [f('Profit net', 1)] }], m);
    expect(s.map((x) => x.an)).toEqual([2019, 2021]);
  });
});
describe('export', () => { it('csv', () => { expect(toCsv([['a;b', 'c']])).toContain('"a;b";c'); }); });
import { fmtAxis } from './format';
describe('fmtAxis', () => { it('scurtează', () => { expect(fmtAxis(1_250_000)).toBe('1,3 mil.'); expect(fmtAxis(750_000)).toBe('750 mii'); expect(fmtAxis(-500)).toBe('-500'); }); });
