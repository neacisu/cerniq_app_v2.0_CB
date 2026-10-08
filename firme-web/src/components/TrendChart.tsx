import { useId, useMemo, useRef, useState } from 'react';
import { fmtAxis, fmtNum } from '../lib/format';

export interface Serie { id: string; nume: string; color: string; puncte: { x: number; y: number | null }[] }
const W = 760, H = 320, M = { l: 64, r: 20, t: 20, b: 36 };
export const PALETA = ['#3b5bdb', '#0ca678', '#e8590c', '#ae3ec9'];

function niceTicks(min: number, max: number, n = 5): number[] {
  if (min === max) { min -= 1; max += 1; }
  const step0 = (max - min) / n; const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= step0) ?? 10 * mag;
  const out: number[] = []; for (let v = Math.floor(min / step) * step; ; v += step) { out.push(Math.round(v * 1e6) / 1e6); if (v >= max - step * 1e-6) break; }
  return out;
}

export function TrendChart({ serii, tip = 'line', unitate = 'lei', altText }: { serii: Serie[]; tip?: 'line' | 'bar'; unitate?: string; altText: string }) {
  const uid = useId().replace(/:/g, '');
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const { xs, ticks, sx, sy } = useMemo(() => {
    const xs = [...new Set(serii.flatMap((s) => s.puncte.map((p) => p.x)))].sort((a, b) => a - b);
    const ys = serii.flatMap((s) => s.puncte.map((p) => p.y).filter((y): y is number => y !== null));
    const lo = Math.min(0, ...(ys.length ? ys : [0])), hi = Math.max(0, ...(ys.length ? ys : [1]));
    const ticks = niceTicks(lo, hi);
    const tmin = ticks[0]!, tmax = ticks[ticks.length - 1]!;
    const pad = tip === 'bar' ? 0.5 : 0;
    const sx = (x: number) => { const i = xs.indexOf(x); const n = xs.length; return M.l + ((i + pad) / Math.max(1, n - 1 + 2 * pad)) * (W - M.l - M.r) + (n === 1 && tip === 'line' ? (W - M.l - M.r) / 2 : 0); };
    const sy = (y: number) => H - M.b - ((y - tmin) / (tmax - tmin || 1)) * (H - M.t - M.b);
    return { xs, ticks, sx, sy };
  }, [serii, tip]);

  if (!xs.length) return null;
  const bw = Math.min(46, ((W - M.l - M.r) / Math.max(1, xs.length)) * 0.7 / serii.length);
  const zero = sy(0);
  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect(); if (!r) return;
    const px = ((e.clientX - r.left) / r.width) * W; let best = 0, bd = Infinity;
    xs.forEach((x, i) => { const d = Math.abs(sx(x) - px); if (d < bd) { bd = d; best = i; } });
    setHover(best);
  };
  const hx = hover !== null ? xs[hover]! : null;

  return (
    <div className="chart" ref={ref} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={altText} preserveAspectRatio="xMidYMid meet">
        <defs>{serii.map((s) => (
          <linearGradient key={s.id} id={`${uid}-${s.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={s.color} stopOpacity=".32" /><stop offset="1" stopColor={s.color} stopOpacity="0" /></linearGradient>
        ))}</defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={M.l} x2={W - M.r} y1={sy(t)} y2={sy(t)} stroke="var(--chart-grid)" strokeDasharray={t === 0 ? undefined : '3 5'} />
            <text x={M.l - 10} y={sy(t) + 4} textAnchor="end" fontSize="12" fill="var(--text-3)" fontFamily="var(--font-mono)">{fmtAxis(t)}</text>
          </g>
        ))}
        {xs.map((x) => <text key={x} x={sx(x)} y={H - 10} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-2)">{x}</text>)}
        {hx !== null && <line x1={sx(hx)} x2={sx(hx)} y1={M.t} y2={H - M.b} stroke="var(--text-3)" strokeDasharray="4 4" />}
        {serii.map((s, si) => {
          const pts = s.puncte.filter((p) => p.y !== null) as { x: number; y: number }[];
          if (tip === 'bar') {
            return <g key={s.id}>{pts.map((p) => {
              const cx = sx(p.x) + (si - (serii.length - 1) / 2) * (bw + 3); const y = sy(p.y);
              return <rect key={p.x} x={cx - bw / 2} y={Math.min(y, zero)} width={bw} height={Math.max(2, Math.abs(zero - y))} rx="6" fill={s.color} opacity={hx === null || hx === p.x ? 1 : .45} />;
            })}</g>;
          }
          const d = pts.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join('');
          const area = pts.length > 1 ? `${d}L${sx(pts[pts.length - 1]!.x)},${zero}L${sx(pts[0]!.x)},${zero}Z` : '';
          return (
            <g key={s.id}>
              {serii.length === 1 && area && <path d={area} fill={`url(#${uid}-${s.id})`} />}
              <path d={d} fill="none" stroke={s.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {pts.map((p) => <circle key={p.x} cx={sx(p.x)} cy={sy(p.y)} r={hx === p.x ? 6 : 4} fill="var(--bg)" stroke={s.color} strokeWidth="3" />)}
            </g>
          );
        })}
      </svg>
      {hx !== null && (
        <div className="tip glass" style={{ left: `${(Math.min(Math.max(sx(hx), 90), W - 90) / W) * 100}%`, top: '14%' }}>
          <b>{hx}</b>
          {serii.map((s) => { const p = s.puncte.find((q) => q.x === hx); return <div key={s.id} className="row nw" style={{ gap: 8, justifyContent: 'space-between' }}><span><i style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: s.color, marginRight: 6 }} />{s.nume}</span><span className="mono">{p?.y == null ? '—' : `${fmtNum(p.y)} ${unitate}`.trim()}</span></div>; })}
        </div>
      )}
      {serii.length > 1 && <div className="legend" style={{ marginTop: 8 }}>{serii.map((s) => <span key={s.id}><i style={{ background: s.color }} />{s.nume}</span>)}</div>}
    </div>
  );
}
