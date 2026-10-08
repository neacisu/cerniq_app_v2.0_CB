/** Așezare cu forțe, deterministă (același graf → aceleași poziții). Rădăcina rămâne în origine. */
export interface LNod { id: string; nivel: number; fix?: boolean; tip: 'firma' | 'persoana' | 'neconfirmat' }
export interface LMuchie { a: string; b: string }
export interface Poz { x: number; y: number }

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const RAZA = (n: LNod): number => (n.tip === 'persoana' ? 150 + n.nivel * 270 : n.tip === 'neconfirmat' ? 120 : 110 + n.nivel * 300);

export function asaza(noduri: LNod[], muchii: LMuchie[], opt: { iteratii?: number; seed?: number } = {}): Map<string, Poz> {
  const n = noduri.length;
  const rnd = mulberry32(opt.seed ?? 7);
  const idx = new Map(noduri.map((x, i) => [x.id, i]));
  const px = new Float64Array(n), py = new Float64Array(n), vx = new Float64Array(n), vy = new Float64Array(n);
  const peNivel = new Map<string, number>();
  noduri.forEach((nod, i) => {
    if (nod.fix) { px[i] = 0; py[i] = 0; return; }
    const g = `${nod.tip}${nod.nivel}`; const k = peNivel.get(g) ?? 0; peNivel.set(g, k + 1);
    const ang = k * 2.399963 + rnd() * 0.6; // unghi de aur: împrăștie uniform
    const r = RAZA(nod) * (0.85 + rnd() * 0.3);
    px[i] = Math.cos(ang) * r; py[i] = Math.sin(ang) * r;
  });
  const E = muchii.map((m) => [idx.get(m.a), idx.get(m.b)] as const).filter((e): e is readonly [number, number] => e[0] !== undefined && e[1] !== undefined);
  const iter = opt.iteratii ?? 260;
  for (let t = 0; t < iter; t++) {
    const cool = 1 - t / iter;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = px[i]! - px[j]!, dy = py[i]! - py[j]!; let d2 = dx * dx + dy * dy;
        if (d2 < 1) { dx = (rnd() - 0.5); dy = (rnd() - 0.5); d2 = 1; }
        if (d2 > 160000) continue; // repulsia are rază finită
        const f = 2600 / d2; const d = Math.sqrt(d2);
        const fx = (dx / d) * f, fy = (dy / d) * f;
        vx[i] = vx[i]! + fx; vy[i] = vy[i]! + fy; vx[j] = vx[j]! - fx; vy[j] = vy[j]! - fy;
      }
    }
    for (const [a, b] of E) {
      const dx = px[b]! - px[a]!, dy = py[b]! - py[a]!; const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = (d - 95) * 0.02; const fx = (dx / d) * f, fy = (dy / d) * f;
      vx[a] = vx[a]! + fx; vy[a] = vy[a]! + fy; vx[b] = vx[b]! - fx; vy[b] = vy[b]! - fy;
    }
    for (let i = 0; i < n; i++) {
      const nod = noduri[i]!;
      if (nod.fix) { px[i] = 0; py[i] = 0; vx[i] = 0; vy[i] = 0; continue; }
      vx[i] = vx[i]! - px[i]! * 0.004; vy[i] = vy[i]! - py[i]! * 0.004; // gravitație ușoară spre centru
      const sp = Math.hypot(vx[i]!, vy[i]!); const max = 24 * cool + 2;
      if (sp > max) { vx[i] = (vx[i]! / sp) * max; vy[i] = (vy[i]! / sp) * max; }
      px[i] = px[i]! + vx[i]!; py[i] = py[i]! + vy[i]!; vx[i] = vx[i]! * 0.6; vy[i] = vy[i]! * 0.6;
    }
  }
  return new Map(noduri.map((nod, i) => [nod.id, { x: px[i]!, y: py[i]! }]));
}

export function limite(poz: Map<string, Poz>, margine = 60): { x: number; y: number; w: number; h: number } {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of poz.values()) { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }
  if (!Number.isFinite(x0)) return { x: -200, y: -150, w: 400, h: 300 };
  return { x: x0 - margine, y: y0 - margine, w: Math.max(120, x1 - x0 + 2 * margine), h: Math.max(120, y1 - y0 + 2 * margine) };
}
