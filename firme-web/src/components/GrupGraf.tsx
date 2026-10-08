import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import type { GrafGrup } from '../api/types';
import { asaza, limite, type LNod, type Poz } from '../lib/layout';
import { collapse } from '../lib/format';

interface VB { x: number; y: number; w: number; h: number }
const fit = (poz: Map<string, Poz>, ratio: number): VB => {
  const b = limite(poz, 70);
  const w = Math.max(b.w, b.h * ratio), h = w / ratio;
  return { x: b.x + b.w / 2 - w / 2, y: b.y + b.h / 2 - h / 2, w, h };
};

export interface NodDesen { id: string; tip: 'firma' | 'persoana' | 'neconfirmat'; eticheta: string; nivel: number; radacina?: boolean; slaba?: boolean }

export function GrupGraf({ graf, selected, onSelect, busy }: { graf: GrafGrup; selected: string | null; onSelect: (id: string | null) => void; busy: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [px, setPx] = useState(800);
  const [hover, setHover] = useState<string | null>(null);

  const { noduri, muchii, poz } = useMemo(() => {
    const radacina = graf.noduri.find((n) => n.tip === 'firma' && n.radacina);
    const noduri: NodDesen[] = graf.noduri.map((n) => (n.tip === 'firma'
      ? { id: n.id, tip: 'firma', eticheta: collapse(n.denumire), nivel: n.nivel, radacina: n.radacina }
      : { id: n.id, tip: 'persoana', eticheta: collapse(n.nume), nivel: n.nivel, slaba: n.slaba }));
    const muchii: { a: string; b: string; slaba: boolean; strat: string; neconfirmata: boolean }[] = graf.muchii.map((m) => ({ a: m.persoana, b: m.firma, slaba: m.slaba, strat: m.strat, neconfirmata: false }));
    graf.neconfirmate.forEach((u, i) => { if (!radacina) return; noduri.push({ id: `u:${i}`, tip: 'neconfirmat', eticheta: collapse(u.nume), nivel: 0 }); muchii.push({ a: `u:${i}`, b: radacina.id, slaba: false, strat: u.strat, neconfirmata: true }); });
    const l: LNod[] = noduri.map((n) => ({ id: n.id, nivel: n.nivel, tip: n.tip, fix: n.radacina }));
    return { noduri, muchii, poz: asaza(l, muchii.map((m) => ({ a: m.a, b: m.b }))) };
  }, [graf]);

  const ratioRef = useRef(1.6);
  const [vb, setVb] = useState<VB>(() => fit(poz, 1.6));
  useLayoutEffect(() => {
    const el = box.current; if (el && el.clientHeight > 0) ratioRef.current = el.clientWidth / el.clientHeight;
    setVb(fit(poz, ratioRef.current));
  }, [poz]);
  const vbRef = useRef(vb); vbRef.current = vb;

  useEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(() => { setPx(el.clientWidth || 800); if (el.clientHeight > 0) { const r = el.clientWidth / el.clientHeight; if (Math.abs(r - ratioRef.current) > 0.02) { ratioRef.current = r; setVb((v) => ({ ...v, h: v.w / r })); } } }); ro.observe(el); setPx(el.clientWidth || 800);
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect(); const f = Math.exp(e.deltaY * 0.0015);
      zoomLa(f, ((e.clientX - r.left) / r.width), ((e.clientY - r.top) / r.height));
    };
    el.addEventListener('wheel', wheel, { passive: false });
    return () => { ro.disconnect(); el.removeEventListener('wheel', wheel); };
  }, []);

  const zoomLa = (f: number, fx = 0.5, fy = 0.5) => setVb((v) => {
    const w = Math.min(6000, Math.max(120, v.w * f)); const h = w / ratioRef.current;
    return { x: v.x + (v.w - w) * fx, y: v.y + (v.h - h) * fy, w, h };
  });

  // Pan și ciupire (pinch)
  const ptr = useRef(new Map<number, { x: number; y: number }>());
  const moved = useRef(false);
  const pinch = useRef(0);
  const onDown = (e: React.PointerEvent) => {
    ptr.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved.current = false;
    if (ptr.current.size === 2) { const [a, b] = [...ptr.current.values()]; pinch.current = Math.hypot(a!.x - b!.x, a!.y - b!.y); }
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const prev = ptr.current.get(e.pointerId); if (!prev) return;
    const el = box.current!; const r = el.getBoundingClientRect();
    ptr.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptr.current.size === 2) {
      const [a, b] = [...ptr.current.values()]; const d = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      if (pinch.current > 0 && d > 0) zoomLa(pinch.current / d, ((a!.x + b!.x) / 2 - r.left) / r.width, ((a!.y + b!.y) / 2 - r.top) / r.height);
      pinch.current = d; moved.current = true; return;
    }
    const dx = e.clientX - prev.x, dy = e.clientY - prev.y;
    if (Math.abs(dx) + Math.abs(dy) > 0) moved.current = moved.current || Math.abs(dx) + Math.abs(dy) > 2;
    setVb((v) => ({ ...v, x: v.x - dx * (v.w / r.width), y: v.y - dy * (v.h / r.height) }));
  };
  const onUp = (e: React.PointerEvent) => { ptr.current.delete(e.pointerId); pinch.current = 0; };

  const scara = vb.w / px;
  const fs = 12.5 * scara;
  const activ = hover ?? selected;
  const vecini = useMemo(() => {
    const s = new Set<string>(); if (!activ) return s;
    s.add(activ); for (const m of muchii) { if (m.a === activ) s.add(m.b); if (m.b === activ) s.add(m.a); }
    return s;
  }, [activ, muchii]);
  const putine = noduri.length <= 45 && px >= 640; // pe ecrane înguste etichetele s-ar suprapune; apar la selecție/hover/zoom
  const arataEticheta = (n: NodDesen) => n.radacina || vecini.has(n.id) && !!activ || (putine && !activ) || (scara < 0.6 && !activ);

  return (
    <div className={`grup-box${busy ? ' busy' : ''}`} ref={box}>
      <svg viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} role="group" aria-label={`Graful administratorilor: ${noduri.filter((n) => n.tip === 'firma').length} firme și ${noduri.filter((n) => n.tip === 'persoana').length} persoane. Lista completă este alăturată.`}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onClick={() => { if (!moved.current) onSelect(null); }}>
        <g>
          {muchii.map((m, i) => {
            const a = poz.get(m.a), b = poz.get(m.b); if (!a || !b) return null;
            const dim = !!activ && !(vecini.has(m.a) && vecini.has(m.b) && (m.a === activ || m.b === activ));
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} vectorEffect="non-scaling-stroke" className={`ge${m.slaba ? ' slaba' : ''}${m.strat === 'profesional' ? ' prof' : ''}${m.neconfirmata ? ' neconf' : ''}${dim ? ' dim' : ''}`} />;
          })}
        </g>
        <g>
          {noduri.map((n) => {
            const p = poz.get(n.id); if (!p) return null;
            const r = (n.radacina ? 15 : n.tip === 'firma' ? 8 : 9) * Math.max(0.7, Math.min(2.2, scara * 1.1));
            const dim = !!activ && !vecini.has(n.id);
            const cls = `gn ${n.radacina ? 'radacina' : n.tip}${n.slaba ? ' slaba' : ''}${selected === n.id ? ' sel' : ''}${dim ? ' dim' : ''}`;
            return (
              <g key={n.id} transform={`translate(${p.x} ${p.y})`} className={cls} tabIndex={0} role="button" aria-label={`${n.tip === 'firma' ? 'Firma' : n.tip === 'persoana' ? 'Persoana' : 'Persoană neconfirmată'} ${n.eticheta}`} aria-pressed={selected === n.id}
                onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onSelect(selected === n.id ? null : n.id); }}
                onPointerEnter={() => setHover(n.id)} onPointerLeave={() => setHover(null)} onFocus={() => setHover(n.id)} onBlur={() => setHover(null)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(selected === n.id ? null : n.id); } }}>
                {n.tip === 'firma' ? <circle r={r} /> : <rect x={-r * 0.85} y={-r * 0.85} width={r * 1.7} height={r * 1.7} rx={n.tip === 'neconfirmat' ? r : r * 0.35} transform="rotate(45)" />}
                {n.tip === 'neconfirmat' && <text className="q" y={r * 0.35} fontSize={r * 1.1} textAnchor="middle">?</text>}
                {arataEticheta(n) && <text className="et" y={-r - 5 * scara} fontSize={fs} textAnchor="middle">{n.eticheta.length > 34 ? `${n.eticheta.slice(0, 33)}…` : n.eticheta}</text>}
              </g>
            );
          })}
        </g>
      </svg>
      <div className="grup-zoom no-print" role="group" aria-label="Zoom graf">
        <button className="btn btn-icon btn-sm" onClick={() => zoomLa(0.75)} aria-label="Mărește"><ZoomIn size={18} aria-hidden="true" /></button>
        <button className="btn btn-icon btn-sm" onClick={() => zoomLa(1.33)} aria-label="Micșorează"><ZoomOut size={18} aria-hidden="true" /></button>
        <button className="btn btn-icon btn-sm" onClick={() => setVb(fit(poz, ratioRef.current))} aria-label="Potrivește în ecran"><Maximize2 size={18} aria-hidden="true" /></button>
      </div>
    </div>
  );
}
