import { describe, expect, it } from 'vitest';
import { asaza, limite, type LMuchie, type LNod } from './layout';

const graf = (n: number): { noduri: LNod[]; muchii: LMuchie[] } => {
  const noduri: LNod[] = [{ id: 'r', nivel: 0, tip: 'firma', fix: true }, { id: 'p', nivel: 0, tip: 'persoana' }];
  const muchii: LMuchie[] = [{ a: 'p', b: 'r' }];
  for (let i = 0; i < n; i++) { noduri.push({ id: `f${i}`, nivel: 1, tip: 'firma' }); muchii.push({ a: 'p', b: `f${i}` }); }
  return { noduri, muchii };
};
describe('așezare', () => {
  it('rădăcina rămâne în origine și toate pozițiile sunt finite', () => {
    const { noduri, muchii } = graf(60);
    const p = asaza(noduri, muchii);
    expect(p.get('r')).toEqual({ x: 0, y: 0 });
    for (const v of p.values()) { expect(Number.isFinite(v.x)).toBe(true); expect(Number.isFinite(v.y)).toBe(true); }
  });
  it('este deterministă', () => {
    const { noduri, muchii } = graf(30);
    expect([...asaza(noduri, muchii).values()]).toEqual([...asaza(noduri, muchii).values()]);
  });
  it('nodurile nu se suprapun', () => {
    const { noduri, muchii } = graf(40);
    const v = [...asaza(noduri, muchii).values()];
    let min = Infinity;
    for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) min = Math.min(min, Math.hypot(v[i]!.x - v[j]!.x, v[i]!.y - v[j]!.y));
    expect(min).toBeGreaterThan(8);
  });
  it('limitele cuprind toate nodurile; graful gol are limite implicite', () => {
    const { noduri, muchii } = graf(10);
    const p = asaza(noduri, muchii); const b = limite(p);
    for (const v of p.values()) { expect(v.x).toBeGreaterThanOrEqual(b.x); expect(v.x).toBeLessThanOrEqual(b.x + b.w); }
    expect(limite(new Map()).w).toBeGreaterThan(0);
  });
  it('merge la plafon maxim în timp rezonabil', () => {
    const { noduri, muchii } = graf(398);
    const t = performance.now(); asaza(noduri, muchii); expect(performance.now() - t).toBeLessThan(4000);
  });
});
