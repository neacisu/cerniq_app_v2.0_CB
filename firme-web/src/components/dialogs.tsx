import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, BookOpen, Building2, Check, Clock, Command, Copy, Database, Download, FileJson, FileSpreadsheet, GitCompareArrows, Heart, Home, Info, Layers, Mail, Printer, Search, Settings, Share2, SunMoon, Keyboard, type LucideIcon,
} from 'lucide-react';
import { useUi } from '../state/ui';
import { useSettings } from '../state/settings';
import { firmaKey, MAX_COMPARE, useLibrary, type FirmaRef } from '../state/library';
import { useCautare } from '../api/hooks';
import { detectType, normalizeCui } from '../lib/cui';
import { hrefFirma, mergeRezultate } from '../lib/merge';
import { copyText, download, toCsv } from '../lib/export';
import { Dialog } from './Dialog';
import { SettingsForm } from './SettingsForm';
import { Badge, Empty, Spinner } from './ui';

/* ───────── Paletă de comenzi ───────── */
interface Cmd { id: string; group: string; label: string; sub?: string; icon: LucideIcon; run: () => void }

function CommandPalette() {
  const { close, open, toast } = useUi();
  const nav = useNavigate();
  const { settings, set } = useSettings();
  const { favorite, istoric, cautari, addCautare } = useLibrary();
  const [q, setQ] = useState('');
  const [dq, setDq] = useState('');
  const [sel, setSel] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const tip = detectType(q);
  useEffect(() => { const t = setTimeout(() => setDq(tip === 'cui' ? normalizeCui(q) : q.trim()), 250); return () => clearTimeout(t); }, [q, tip]);
  const live = useCautare(dq, 6, dq.length >= 2 && tip !== 'prea-scurt');

  const go = (to: string) => { close(); nav(to); };
  const cmds = useMemo<Cmd[]>(() => {
    const pages: Cmd[] = [
      { id: 'p-home', group: 'Pagini', label: 'Acasă', icon: Home, run: () => go('/') }, { id: 'p-cauta', group: 'Pagini', label: 'Căutare', icon: Search, run: () => go('/cauta') },
      { id: 'p-cmp', group: 'Pagini', label: 'Comparare firme', icon: GitCompareArrows, run: () => go('/comparare') }, { id: 'p-fav', group: 'Pagini', label: 'Favorite', icon: Heart, run: () => go('/favorite') },
      { id: 'p-ist', group: 'Pagini', label: 'Istoric', icon: Clock, run: () => go('/istoric') }, { id: 'p-nom', group: 'Pagini', label: 'Nomenclatoare CAEN și stări', icon: BookOpen, run: () => go('/nomenclatoare') },
      { id: 'p-ind', group: 'Pagini', label: 'Indicatori financiari', icon: Layers, run: () => go('/indicatori') }, { id: 'p-date', group: 'Pagini', label: 'Date și API', icon: Database, run: () => go('/date') },
      { id: 'p-desp', group: 'Pagini', label: 'Despre date și limite', icon: Info, run: () => go('/despre') }, { id: 'p-set', group: 'Pagini', label: 'Setări', icon: Settings, run: () => go('/setari') },
    ];
    const actions: Cmd[] = [
      { id: 'a-theme', group: 'Acțiuni', label: `Schimbă tema (acum: ${{ auto: 'automată', light: 'luminoasă', dark: 'întunecată' }[settings.theme]})`, icon: SunMoon, run: () => { set('theme', settings.theme === 'auto' ? 'light' : settings.theme === 'light' ? 'dark' : 'auto'); close(); } },
      { id: 'a-set', group: 'Acțiuni', label: 'Deschide setările rapide', icon: Settings, run: () => open('settings') },
      { id: 'a-keys', group: 'Acțiuni', label: 'Arată scurtăturile de tastatură', icon: Keyboard, run: () => open('shortcuts') },
      { id: 'a-copy', group: 'Acțiuni', label: 'Copiază linkul paginii curente', icon: Copy, run: () => { void copyText(location.href).then(() => toast('Link copiat')); close(); } },
    ];
    const firme: Cmd[] = [
      ...favorite.slice(0, 5).map((f) => ({ id: `f-${firmaKey(f)}`, group: 'Favorite', label: f.denumire, sub: f.cui ?? f.cod ?? '', icon: Heart, run: () => go(hrefFirma(f)) })),
      ...istoric.slice(0, 5).map((f) => ({ id: `i-${firmaKey(f)}`, group: 'Vizitate recent', label: f.denumire, sub: f.cui ?? f.cod ?? '', icon: Clock, run: () => go(hrefFirma(f)) })),
    ];
    const rec: Cmd[] = cautari.slice(0, 4).map((c) => ({ id: `c-${c.q}`, group: 'Căutări recente', label: c.q, icon: Search, run: () => go(`/cauta?q=${encodeURIComponent(c.q)}`) }));
    const needle = q.trim().toLowerCase();
    if (!needle) return [...firme, ...rec, ...pages.slice(0, 6), ...actions];
    const match = (c: Cmd) => `${c.label} ${c.sub ?? ''}`.toLowerCase().includes(needle);
    const liveCmds: Cmd[] = live.data && dq === (tip === 'cui' ? normalizeCui(q) : q.trim())
      ? mergeRezultate(live.data.rezultate).map((f) => ({ id: `l-${f.key}`, group: 'Rezultate din registru', label: f.denumire, sub: f.cui ?? f.cod ?? '', icon: Building2, run: () => go(hrefFirma(f)) })) : [];
    const search: Cmd[] = tip !== 'prea-scurt' && tip !== 'gol' ? [{ id: 's-all', group: 'Căutare', label: `Caută „${q.trim()}” în registru`, icon: Search, run: () => { addCautare(q.trim()); go(`/cauta?q=${encodeURIComponent(tip === 'cui' ? normalizeCui(q) : q.trim())}`); } }] : [];
    return [...liveCmds, ...[...firme, ...pages, ...actions].filter(match), ...search];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, live.data, dq, favorite, istoric, cautari, settings.theme]);

  useEffect(() => setSel(0), [q, cmds.length]);
  useEffect(() => { listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }); }, [sel]);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(cmds.length - 1, s + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); cmds[sel]?.run(); }
  };
  let last = '';
  return (
    <Dialog title="Comenzi rapide" bare className="palette">
      <div className="palette-input">
        <Command size={22} aria-hidden="true" />
        <input data-autofocus placeholder="Caută firme, pagini sau acțiuni…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} aria-label="Comenzi rapide" role="combobox" aria-expanded="true" aria-controls="palette-list" />
        {live.isFetching && <Spinner size={18} />}<span className="kbd">Esc</span>
      </div>
      <div className="palette-list" id="palette-list" role="listbox" ref={listRef}>
        {cmds.length === 0 && <Empty icon={Search} title="Niciun rezultat">Încearcă alt termen sau un CUI.</Empty>}
        {cmds.map((c, i) => {
          const head = c.group !== last ? <div className="palette-group" key={`g-${c.group}-${i}`}>{c.group}</div> : null; last = c.group;
          return [head, <button key={c.id} className="palette-item" role="option" aria-selected={i === sel} onMouseMove={() => setSel(i)} onClick={c.run}>
            <c.icon size={20} aria-hidden="true" /><span className="truncate">{c.label}</span>{c.sub && <span className="sub mono">{c.sub}</span>}</button>];
        })}
      </div>
    </Dialog>
  );
}

/* ───────── Setări rapide ───────── */
function SettingsDialog() {
  const { close } = useUi();
  const nav = useNavigate();
  return (
    <Dialog title="Setări rapide" footer={<><button className="btn" onClick={() => { close(); nav('/setari'); }}>Toate setările</button><button className="btn btn-primary" onClick={close}>Gata</button></>}>
      <SettingsForm />
    </Dialog>
  );
}

/* ───────── Scurtături ───────── */
function ShortcutsDialog() {
  const rows: [string[], string][] = [[['Ctrl', 'K'], 'Comenzi rapide (⌘ K pe Mac)'], [['/'], 'Focus pe căutare'], [['?'], 'Această listă'], [['Esc'], 'Închide dialogul sau meniul'], [['↑', '↓'], 'Navighează în rezultate'], [['Enter'], 'Deschide elementul selectat'], [['Tab'], 'Mută focusul între elemente']];
  return (
    <Dialog title="Scurtături de tastatură" footer={<button className="btn btn-primary" onClick={useUi().close}>Închide</button>}>
      <ul className="stack" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {rows.map(([k, d]) => <li key={d} className="row between nw"><span>{d}</span><span className="row" style={{ gap: 4 }}>{k.map((x) => <span key={x} className="kbd">{x}</span>)}</span></li>)}
      </ul>
    </Dialog>
  );
}

/* ───────── Distribuie ───────── */
function ShareDialog({ url, titlu, an }: { url: string; titlu: string; an?: number }) {
  const { toast, close } = useUi();
  const [withAn, setWithAn] = useState(false);
  const final = withAn && an ? `${url}${url.includes('?') ? '&' : '?'}an=${an}` : url;
  const canShare = typeof navigator.share === 'function';
  return (
    <Dialog title="Distribuie" footer={<button className="btn btn-primary" onClick={close}>Gata</button>}>
      <p className="muted">{titlu}</p>
      <div className="row nw"><input className="input mono" readOnly value={final} aria-label="Link" onFocus={(e) => e.target.select()} />
        <button className="btn btn-primary" onClick={async () => toast((await copyText(final)) ? 'Link copiat' : 'Nu am putut copia', 'ok')}><Copy size={18} aria-hidden="true" /> Copiază</button></div>
      {an && <label className="row" style={{ cursor: 'pointer' }}><input type="checkbox" checked={withAn} onChange={(e) => setWithAn(e.target.checked)} style={{ width: 20, height: 20, accentColor: 'var(--accent)' }} /> Deschide direct la bilanțul din {an}</label>}
      <div className="row">
        {canShare && <button className="btn" onClick={() => navigator.share({ title: titlu, url: final }).catch(() => undefined)}><Share2 size={18} aria-hidden="true" /> Trimite…</button>}
        <a className="btn" href={`mailto:?subject=${encodeURIComponent(titlu)}&body=${encodeURIComponent(final)}`}><Mail size={18} aria-hidden="true" /> E-mail</a>
        <button className="btn" onClick={() => { close(); setTimeout(() => window.print(), 250); }}><Printer size={18} aria-hidden="true" /> Tipărește / PDF</button>
      </div>
    </Dialog>
  );
}

/* ───────── Export ───────── */
export interface ExportSection { id: string; label: string; rows: unknown[][]; json: unknown }
function ExportDialog({ titlu, fisier, sectiuni }: { titlu: string; fisier: string; sectiuni: ExportSection[] }) {
  const { close, toast } = useUi();
  const [sel, setSel] = useState<string[]>(sectiuni.map((s) => s.id));
  const [fmt, setFmt] = useState<'csv' | 'json'>('csv');
  const chosen = sectiuni.filter((s) => sel.includes(s.id));
  const run = () => {
    if (!chosen.length) { toast('Alege cel puțin o secțiune', 'err'); return; }
    if (fmt === 'json') download(`${fisier}.json`, JSON.stringify(Object.fromEntries(chosen.map((s) => [s.id, s.json])), null, 2), 'application/json');
    else download(`${fisier}.csv`, toCsv(chosen.flatMap((s, i) => [...(i ? [[]] : []), [`# ${s.label}`], ...s.rows])), 'text/csv');
    toast('Export descărcat'); close();
  };
  return (
    <Dialog title="Exportă datele" footer={<><button className="btn" onClick={close}>Anulează</button><button className="btn btn-primary" onClick={run}><Download size={18} aria-hidden="true" /> Descarcă</button></>}>
      <p className="muted">{titlu}</p>
      <div className="field"><span className="label">Format</span>
        <div className="seg" role="tablist" aria-label="Format">
          <button role="tab" aria-selected={fmt === 'csv'} onClick={() => setFmt('csv')}><FileSpreadsheet size={18} aria-hidden="true" /> CSV (Excel)</button>
          <button role="tab" aria-selected={fmt === 'json'} onClick={() => setFmt('json')}><FileJson size={18} aria-hidden="true" /> JSON</button></div></div>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }} className="stack-sm"><legend className="label" style={{ marginBottom: 8 }}>Secțiuni</legend>
        {sectiuni.map((s) => (
          <label key={s.id} className="row nw glass-flat" style={{ padding: '10px 14px', cursor: 'pointer' }}>
            <input type="checkbox" checked={sel.includes(s.id)} onChange={(e) => setSel((p) => (e.target.checked ? [...p, s.id] : p.filter((x) => x !== s.id)))} style={{ width: 20, height: 20, accentColor: 'var(--accent)' }} />
            <span className="grow">{s.label}</span><span className="faint mono">{s.rows.length - 1 > 0 ? `${s.rows.length - 1} rânduri` : '—'}</span></label>))}
      </fieldset>
    </Dialog>
  );
}

/* ───────── Alege firmă pentru comparare ───────── */
function PickerDialog() {
  const { close, toast } = useUi();
  const { favorite, istoric, compare, toggleCompare, inCompare } = useLibrary();
  const [q, setQ] = useState('');
  const [dq, setDq] = useState('');
  const tip = detectType(q);
  useEffect(() => { const t = setTimeout(() => setDq(tip === 'cui' ? normalizeCui(q) : q.trim()), 260); return () => clearTimeout(t); }, [q, tip]);
  const res = useCautare(dq, 8, dq.length >= 2 && tip !== 'prea-scurt');
  const found = res.data && dq ? mergeRezultate(res.data.rezultate).filter((f) => f.cui) : [];
  const quick = [...favorite, ...istoric].filter((f, i, a) => f.cui && a.findIndex((x) => x.cui === f.cui) === i).slice(0, 8);
  const add = (f: FirmaRef) => { const r = toggleCompare(f); if (r === 'plin') toast(`Poți compara cel mult ${MAX_COMPARE} firme`, 'err'); else if (r === 'adaugat') toast(`${f.denumire} adăugată la comparare`); };
  const rows = q.trim() ? found.map((f) => ({ cui: f.cui, cod: f.cod, denumire: f.denumire })) : quick;
  return (
    <Dialog title="Adaugă firmă la comparare" footer={<><span className="muted grow">{compare.length}/{MAX_COMPARE} selectate</span><button className="btn btn-primary" onClick={close}>Gata</button></>}>
      <div className="searchbox"><Search size={20} aria-hidden="true" /><input data-autofocus placeholder="CUI sau denumire…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Caută firmă de adăugat" />{res.isFetching && <Spinner size={18} />}</div>
      <div className="stack-sm" role="list">
        {!q.trim() && quick.length > 0 && <div className="label">Din favorite și istoric</div>}
        {!q.trim() && quick.length === 0 && <Empty icon={GitCompareArrows} title="Caută o firmă">Scrie un CUI sau o denumire (minim 2 caractere). Se pot compara doar firme cu CUI valid.</Empty>}
        {q.trim() && !res.isFetching && rows.length === 0 && dq.length >= 2 && <Empty icon={Search} title="Nicio firmă cu CUI">Încearcă alt termen.</Empty>}
        {rows.map((f) => (
          <div key={f.cui!} role="listitem" className="row nw glass-flat" style={{ padding: '8px 8px 8px 14px' }}>
            <div className="grow"><div className="truncate" style={{ fontWeight: 600 }}>{f.denumire}</div><div className="mono faint">{f.cui}</div></div>
            <button className={`btn btn-sm${inCompare(f.cui!) ? ' on' : ''}`} onClick={() => add({ cui: f.cui, cod: f.cod, denumire: f.denumire })}>{inCompare(f.cui!) ? <><Check size={16} aria-hidden="true" /> Adăugată</> : 'Adaugă'}</button>
          </div>))}
      </div>
    </Dialog>
  );
}

/* ───────── Confirmare ───────── */
function ConfirmDialog() {
  const { close, confirmOpts } = useUi();
  if (!confirmOpts) return null;
  return (
    <Dialog title={confirmOpts.titlu} width={460} footer={<><button className="btn" data-autofocus onClick={close}>Anulează</button>
      <button className={`btn ${confirmOpts.periculos ? 'btn-danger' : 'btn-primary'}`} onClick={() => { confirmOpts.onConfirm(); close(); }}>{confirmOpts.confirmare}</button></>}>
      <div className="row nw" style={{ alignItems: 'flex-start' }}>{confirmOpts.periculos && <AlertTriangle size={24} color="#e03131" aria-hidden="true" style={{ flex: 'none' }} />}<p>{confirmOpts.text}</p></div>
    </Dialog>
  );
}

/* ───────── Ajutor: cum citești un bilanț ───────── */
function HelpDialog() {
  return (
    <Dialog title="Cum citești datele financiare" footer={<button className="btn btn-primary" onClick={useUi().close}>Am înțeles</button>}>
      <p>Codurile indicatorilor (<span className="mono">I13</span>, <span className="mono">I18</span>…) <b>nu au același sens în toți anii</b>. De exemplu, <span className="mono">I13</span> este „VENITURI TOTALE” în 2011–2015 și „Cifra de afaceri netă” din 2016.</p>
      <p>De aceea aplicația identifică indicatorii cheie după <b>denumirea din legenda anului</b>, nu după cod. Celulele goale din sursă nu sunt afișate; un zero real apare ca <span className="mono">0</span>.</p>
      <p>Formularul diferă după tipul entității (societăți, ONG, bănci, asigurări). Dacă o firmă are mai multe formulare într-un an, le poți comuta separat.</p>
      <Badge tone="amber">Valorile sunt cele publicate de Ministerul Finanțelor, în lei.</Badge>
    </Dialog>
  );
}

/* ───────── Detaliu CAEN ───────── */
function CaenDialog({ clasa, denumire, versiune, ierarhie }: { clasa: string; denumire: string; versiune: string; ierarhie: [string, string][] }) {
  const { close, toast } = useUi();
  return (
    <Dialog title={`CAEN ${clasa || '—'}`} footer={<><button className="btn" onClick={async () => toast((await copyText(`${clasa} ${denumire}`)) ? 'Copiat' : 'Nu am putut copia')}><Copy size={18} aria-hidden="true" /> Copiază</button><button className="btn btn-primary" onClick={close}>Închide</button></>}>
      <p style={{ fontSize: 18, fontWeight: 600 }}>{denumire}</p><Badge tone="blue">Versiunea {versiune}</Badge>
      <dl className="kv">{ierarhie.filter(([, v]) => v).map(([k, v]) => <div key={k}><dt>{k}</dt><dd className="mono">{v}</dd></div>)}</dl>
    </Dialog>
  );
}

export function DialogHost() {
  const { dialog } = useUi();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = (dialog.props ?? {}) as Record<string, any>;
  switch (dialog.id) {
    case 'palette': return <CommandPalette />;
    case 'settings': return <SettingsDialog />;
    case 'shortcuts': return <ShortcutsDialog />;
    case 'share': return <ShareDialog url={p.url} titlu={p.titlu} an={p.an} />;
    case 'export': return <ExportDialog titlu={p.titlu} fisier={p.fisier} sectiuni={p.sectiuni} />;
    case 'picker': return <PickerDialog />;
    case 'confirm': return <ConfirmDialog />;
    case 'help': return <HelpDialog />;
    case 'caen': return <CaenDialog clasa={p.clasa} denumire={p.denumire} versiune={p.versiune} ierarhie={p.ierarhie} />;
    default: return null;
  }
}
