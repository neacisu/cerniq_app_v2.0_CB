import { useState } from 'react';
import { Activity, Check, Copy, Database, Play, RefreshCw } from 'lucide-react';
import { useHealth } from '../api/hooks';
import { API_BASE, ApiError, apiGet } from '../api/client';
import { copyText } from '../lib/export';
import { FORMULARE } from '../lib/indicators';
import { fmtNum } from '../lib/format';
import { useUi } from '../state/ui';
import { Badge, Card, PageHead, Spinner } from '../components/ui';

const VOLUME: [string, number, string][] = [
  ['sf_valoare · valori bilanț', 218_399_238, '26 GB'], ['sf_depunere · depuneri', 14_169_607, '2,1 GB'], ['od_stare_firma · stări ONRC', 4_658_034, '366 MB'],
  ['od_firme · firme ONRC', 4_219_081, '923 MB'], ['od_reprezentanti_legali', 3_689_931, '530 MB'], ['date_identificare_platitori_2026 · ANAF', 2_647_765, '946 MB'],
  ['od_reprezentanti_if', 123_349, '19 MB'], ['sf_respins · rânduri respinse la import', 10_911, '—'], ['n_caen · clase CAEN', 3_740, '568 kB'], ['sf_indicator · dicționar', 5_838, '1,3 MB'],
];
const MAX = 218_399_238;

interface Ep { id: string; titlu: string; path: (v: Record<string, string>) => string; campuri: { k: string; label: string; def: string }[] }
const ENDPOINTS: Ep[] = [
  { id: 'health', titlu: '/health', path: () => '/health', campuri: [] },
  { id: 'firme', titlu: '/firme?q=&limit=', path: (v) => `/firme?q=${encodeURIComponent(v.q ?? '')}&limit=${encodeURIComponent(v.limit ?? '5')}`, campuri: [{ k: 'q', label: 'q', def: 'QBIKNEF' }, { k: 'limit', label: 'limit', def: '5' }] },
  { id: 'cui', titlu: '/cui/:cui', path: (v) => `/cui/${encodeURIComponent(v.cui ?? '')}`, campuri: [{ k: 'cui', label: 'cui', def: '38926034' }] },
  { id: 'inm', titlu: '/firme/inmatriculare/*', path: (v) => `/firme/inmatriculare/${(v.cod ?? '').split('/').map(encodeURIComponent).join('/')}`, campuri: [{ k: 'cod', label: 'cod', def: 'J9/150/2018' }] },
  { id: 'bilant', titlu: '/bilant/:cui/:an', path: (v) => `/bilant/${encodeURIComponent(v.cui ?? '')}${v.an ? `/${encodeURIComponent(v.an)}` : ''}`, campuri: [{ k: 'cui', label: 'cui', def: '25629090' }, { k: 'an', label: 'an (opțional)', def: '2025' }] },
  { id: 'indicatori', titlu: '/indicatori/:an/:formular', path: (v) => `/indicatori/${encodeURIComponent(v.an ?? '')}/${encodeURIComponent(v.formular ?? '')}`, campuri: [{ k: 'an', label: 'an', def: '2024' }, { k: 'formular', label: 'formular', def: 'WEB_UU' }] },
  { id: 'stari', titlu: '/nomenclatoare/stari', path: () => '/nomenclatoare/stari', campuri: [] },
  { id: 'versiuni', titlu: '/nomenclatoare/versiuni-caen', path: () => '/nomenclatoare/versiuni-caen', campuri: [] },
  { id: 'caen', titlu: '/nomenclatoare/caen', path: (v) => `/nomenclatoare/caen?versiune=${encodeURIComponent(v.versiune ?? '2')}${v.clasa ? `&clasa=${encodeURIComponent(v.clasa)}` : ''}`, campuri: [{ k: 'versiune', label: 'versiune', def: '2' }, { k: 'clasa', label: 'clasa', def: '4120' }] },
];

export default function DateApi() {
  const h = useHealth();
  const ok = h.data?.stare === 'ok';
  return (
    <div className="page">
      <PageHead eyebrow="Date" title="Date și API" actions={<button className="btn" onClick={() => void h.refetch()} disabled={h.isFetching}><RefreshCw size={20} className={h.isFetching ? 'spin' : ''} aria-hidden="true" /> Verifică acum</button>}>
        Ce conține registrul, cât de mare este și un explorator pentru interogările API-ului de citire.</PageHead>
      <div className="stat-grid">
        <div className="stat glass"><span>Stare API</span><b className="row nw" style={{ gap: 10 }}><span className={`pulse${ok ? '' : ' bad'}`} aria-hidden="true" />{h.isPending ? '…' : ok ? 'Operațional' : 'Indisponibil'}</b></div>
        <div className="stat glass"><span>Latență health</span><b>{h.data ? `${h.data.ms} ms` : '—'}</b></div>
        <div className="stat glass"><span>Prefix API</span><b className="mono" style={{ fontSize: 22 }}>{API_BASE}</b></div>
        <div className="stat glass"><span>Mod de acces</span><b>Doar citire</b></div>
      </div>
      <Card title="Volume la 8 octombrie 2026" icon={Database}>
        <div className="stack">{VOLUME.map(([n, v, s]) => (
          <div key={n} className="stack-sm"><div className="row between nw"><span className="truncate">{n}</span><span className="mono nowrap">{fmtNum(v)} <span className="faint">· {s}</span></span></div><div className="bar"><i style={{ width: `${Math.max(1, (Math.log10(v) / Math.log10(MAX)) * 100)}%` }} /></div></div>))}</div>
        <p className="hint">Barele sunt pe scară logaritmică, ca tabelele mici să rămână vizibile.</p>
      </Card>
      <Card title="Formulare de situații financiare" icon={Database}>
        <div className="table-wrap"><table className="table"><thead><tr><th>Cod</th><th>Conținut</th><th>Note</th></tr></thead>
          <tbody>{FORMULARE.map((f) => <tr key={f.cod}><td className="mono">{f.cod}</td><td>{f.titlu}</td><td className="muted">{f.descriere || '—'}</td></tr>)}</tbody></table></div>
      </Card>
      <Card title="Explorator API" icon={Activity}><Explorer /></Card>
    </div>
  );
}

function Explorer() {
  const [id, setId] = useState(ENDPOINTS[2]!.id);
  const ep = ENDPOINTS.find((e) => e.id === id)!;
  const [vals, setVals] = useState<Record<string, string>>({});
  const [out, setOut] = useState<{ ms: number; json: string; status: number; url: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useUi();
  const v = (k: string, def: string) => vals[`${id}.${k}`] ?? def;
  const eff = Object.fromEntries(ep.campuri.map((c) => [c.k, v(c.k, c.def)]));
  const url = ep.path(eff);
  const run = async () => {
    setBusy(true); const t = performance.now();
    try { const data = await apiGet<unknown>(url); setOut({ ms: Math.round(performance.now() - t), json: JSON.stringify(data, null, 2), status: 200, url }); }
    catch (e) { setOut({ ms: Math.round(performance.now() - t), json: JSON.stringify({ eroare: e instanceof Error ? e.message : String(e) }, null, 2), status: e instanceof ApiError ? e.status : 0, url }); }
    setBusy(false);
  };
  return (
    <div className="stack">
      <div className="field"><label htmlFor="ep">Endpoint</label>
        <select id="ep" className="select mono" value={id} onChange={(e) => { setId(e.target.value); setOut(null); }}>{ENDPOINTS.map((e) => <option key={e.id} value={e.id}>GET {e.titlu}</option>)}</select></div>
      {ep.campuri.length > 0 && <div className="grid-2">{ep.campuri.map((c) => (
        <div key={c.k} className="field"><label htmlFor={`ep-${c.k}`}>{c.label}</label>
          <input id={`ep-${c.k}`} className="input mono" value={v(c.k, c.def)} onChange={(e) => setVals((p) => ({ ...p, [`${id}.${c.k}`]: e.target.value }))} /></div>))}</div>}
      <div className="endpoint"><span className="method">GET</span><span className="mono grow" style={{ overflowWrap: 'anywhere' }}>{API_BASE}{url}</span>
        <button className="btn btn-primary btn-sm" onClick={() => void run()} disabled={busy}>{busy ? <Spinner size={16} /> : <Play size={16} aria-hidden="true" />} Rulează</button></div>
      {out && <>
        <div className="row between"><div className="row"><Badge tone={out.status === 200 ? 'green' : 'red'}>{out.status || 'rețea'}</Badge><span className="muted">{out.ms} ms · {(out.json.length / 1024).toFixed(1)} kB</span></div>
          <button className="btn btn-sm" onClick={async () => toast((await copyText(out.json)) ? 'JSON copiat' : 'Nu am putut copia')}><Copy size={16} aria-hidden="true" /> Copiază</button></div>
        <pre className="json" tabIndex={0} aria-label="Răspuns JSON">{out.json.length > 60000 ? `${out.json.slice(0, 60000)}\n… (trunchiat pentru afișare, copiază pentru varianta completă)` : out.json}</pre></>}
      {!out && <p className="hint"><Check size={14} aria-hidden="true" style={{ display: 'inline' }} /> Interogările sunt exclusiv de citire; serverul respinge orice altă metodă.</p>}
    </div>
  );
}
