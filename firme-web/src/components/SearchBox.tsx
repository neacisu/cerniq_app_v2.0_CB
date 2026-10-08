import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Clock, CornerDownLeft, Search, X } from 'lucide-react';
import { useCautare } from '../api/hooks';
import { detectType, normalizeCui, tipEticheta } from '../lib/cui';
import { hrefFirma, mergeRezultate } from '../lib/merge';
import { useLibrary } from '../state/library';
import { Badge, Spinner } from './ui';

export function SearchBox({ big, initial = '', autoFocus, id = 'global-search' }: { big?: boolean; initial?: string; autoFocus?: boolean; id?: string }) {
  const nav = useNavigate();
  const { cautari, addCautare } = useLibrary();
  const [q, setQ] = useState(initial);
  const [focus, setFocus] = useState(false);
  const [dq, setDq] = useState('');
  const [sel, setSel] = useState(-1);
  const wrap = useRef<HTMLFormElement>(null);
  const listId = useId();
  useEffect(() => setQ(initial), [initial]);

  const tip = detectType(q);
  const effective = tip === 'cui' ? normalizeCui(q) : q.trim();
  useEffect(() => {
    const t = setTimeout(() => setDq(tip === 'denumire' || tip === 'cui' || tip === 'inmatriculare' ? effective : ''), 260);
    return () => clearTimeout(t);
  }, [effective, tip]);
  const res = useCautare(dq, 6, focus && dq.length > 0);
  const sugg = useMemo(() => (res.data && dq === effective ? mergeRezultate(res.data.rezultate) : []), [res.data, dq, effective]);

  const showRecent = focus && !q.trim() && cautari.length > 0;
  const items: { kind: 'firma' | 'all' | 'recent'; label: string; href?: string; q?: string }[] = showRecent
    ? cautari.slice(0, 6).map((c) => ({ kind: 'recent', label: c.q, q: c.q }))
    : [...sugg.map((f) => ({ kind: 'firma' as const, label: f.denumire, href: hrefFirma(f) })), ...(tip !== 'gol' && tip !== 'prea-scurt' ? [{ kind: 'all' as const, label: effective, q: effective }] : [])];

  useEffect(() => setSel(-1), [items.length, q]);
  useEffect(() => {
    const on = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setFocus(false); };
    document.addEventListener('pointerdown', on);
    return () => document.removeEventListener('pointerdown', on);
  }, []);

  const go = (query: string) => { const t = query.trim(); if (!t) return; addCautare(t); setFocus(false); nav(`/cauta?q=${encodeURIComponent(tip === 'cui' && query === q ? normalizeCui(t) : t)}`); };
  const choose = (i: number) => {
    const it = items[i]; if (!it) return;
    if (it.kind === 'firma' && it.href) { setFocus(false); nav(it.href); } else go(it.q ?? it.label);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(items.length - 1, s + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(-1, s - 1)); }
    else if (e.key === 'Escape') { setFocus(false); (e.target as HTMLElement).blur(); }
  };

  return (
    <form ref={wrap} role="search" className="searchwrap" style={{ position: 'relative', width: '100%' }}
      onSubmit={(e) => { e.preventDefault(); if (sel >= 0) choose(sel); else go(q); }}>
      <div className={`searchbox${big ? ' big' : ''}`}>
        <Search size={big ? 24 : 20} aria-hidden="true" />
        <input id={id} type="search" inputMode="search" enterKeyHint="search" autoComplete="off" autoCapitalize="off" spellCheck={false} autoFocus={autoFocus}
          placeholder={big ? 'CUI, denumire sau nr. înmatriculare (J9/150/2018)' : 'Caută firmă, CUI sau J…'} aria-label="Caută firmă"
          role="combobox" aria-expanded={focus && items.length > 0} aria-controls={listId} aria-autocomplete="list" aria-activedescendant={sel >= 0 ? `${listId}-${sel}` : undefined}
          value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setFocus(true)} onKeyDown={onKey} />
        {res.isFetching && dq && <Spinner size={18} />}
        {q && <button type="button" className="btn btn-ghost btn-icon btn-sm" aria-label="Șterge căutarea" onClick={() => { setQ(''); document.getElementById(id)?.focus(); }}><X size={18} aria-hidden="true" /></button>}
        {tip !== 'gol' && tip !== 'prea-scurt' && big && <span className="hide-sm"><Badge tone="blue">{tipEticheta[tip]}</Badge></span>}
        <button type="submit" className="btn btn-primary" style={{ borderRadius: 999, minHeight: big ? 52 : 40 }} disabled={tip === 'gol' || tip === 'prea-scurt'}>Caută</button>
      </div>
      {focus && (items.length > 0 || (res.isError && dq)) && (
        <div className="suggest glass" id={listId} role="listbox">
          {showRecent && <div className="grp">Căutări recente</div>}
          {!showRecent && sugg.length > 0 && <div className="grp">Firme</div>}
          {items.map((it, i) => (
            <button type="button" key={`${it.kind}${it.label}${i}`} id={`${listId}-${i}`} role="option" aria-selected={sel === i} onMouseEnter={() => setSel(i)} onClick={() => choose(i)}>
              {it.kind === 'recent' ? <Clock size={18} aria-hidden="true" /> : it.kind === 'firma' ? <Building2 size={18} aria-hidden="true" /> : <CornerDownLeft size={18} aria-hidden="true" />}
              <span className="truncate grow">{it.kind === 'all' ? <>Toate rezultatele pentru <b>„{it.label}”</b></> : it.label}</span>
              {it.kind === 'firma' && sugg[i] && <span className="mono faint">{sugg[i]!.cui ?? sugg[i]!.cod}</span>}
            </button>
          ))}
          {res.isError && dq && <div className="grp" style={{ textTransform: 'none', letterSpacing: 0 }}>Căutarea nu a reușit acum. Apasă Enter pentru a încerca pe pagina de rezultate.</div>}
        </div>
      )}
    </form>
  );
}
