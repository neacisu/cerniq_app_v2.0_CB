import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Download, Search, ScrollText, Tags } from 'lucide-react';
import { useCaen, useStari, useVersiuniCaen } from '../api/hooks';
import { norm } from '../lib/indicators';
import { collapse } from '../lib/format';
import { download, toCsv } from '../lib/export';
import { useUi } from '../state/ui';
import { Badge, Empty, ErrorBox, PageHead, Seg, SkeletonLines, Switch } from '../components/ui';
import type { ClasaCaen } from '../api/types';

export default function Nomenclatoare() {
  const [sp, setSp] = useSearchParams();
  const tab = (['caen', 'stari', 'versiuni'].includes(sp.get('tab') ?? '') ? sp.get('tab') : 'caen') as 'caen' | 'stari' | 'versiuni';
  const setTab = (t: string, extra: Record<string, string> = {}) => setSp({ tab: t, ...extra }, { replace: true });
  return (
    <div className="page">
      <PageHead eyebrow="Date" title="Nomenclatoare">Clasificarea activităților economice (CAEN) în patru versiuni, stările ONRC și versiunile disponibile.</PageHead>
      <div style={{ overflowX: 'auto' }}><Seg label="Nomenclator" value={tab} onChange={(v) => setTab(v)} options={[{ value: 'caen', label: <><Tags size={18} aria-hidden="true" />CAEN</> }, { value: 'stari', label: <><ScrollText size={18} aria-hidden="true" />Stări ONRC</> }, { value: 'versiuni', label: <><BookOpen size={18} aria-hidden="true" />Versiuni CAEN</> }]} /></div>
      {tab === 'caen' && <CaenTab versiuneParam={sp.get('versiune') ?? '2'} setVersiune={(v) => setTab('caen', { versiune: v })} />}
      {tab === 'stari' && <StariNom />}
      {tab === 'versiuni' && <VersiuniTab go={(v) => setTab('caen', { versiune: v })} />}
    </div>
  );
}

const PAGE = 100;
const nivel = (c: ClasaCaen): string => (c.clasa ? 'Clasă' : c.grupa ? 'Grupă' : c.diviziunea ? 'Diviziune' : c.subsectiunea ? 'Subsecțiune' : 'Secțiune');
const cod = (c: ClasaCaen): string => c.clasa || c.grupa || c.diviziunea || c.subsectiunea || c.sectiunea;

function CaenTab({ versiuneParam, setVersiune }: { versiuneParam: string; setVersiune: (v: string) => void }) {
  const versiuni = useVersiuniCaen();
  const caen = useCaen(versiuneParam);
  const { open } = useUi();
  const [q, setQ] = useState('');
  const [doarClase, setDoarClase] = useState(true);
  const [shown, setShown] = useState(PAGE);
  const list = useMemo(() => {
    const n = norm(q);
    return (caen.data?.clase ?? []).filter((c) => (!doarClase || c.clasa) && (!n || norm(`${cod(c)} ${c.denumire}`).includes(n)));
  }, [caen.data, q, doarClase]);
  const exportCsv = () => download(`caen-v${versiuneParam}.csv`, toCsv([['Nivel', 'Cod', 'Denumire', 'Secțiune', 'Diviziune', 'Grupă'], ...list.map((c) => [nivel(c), cod(c), collapse(c.denumire), c.sectiunea, c.diviziunea, c.grupa])]), 'text/csv');
  return (
    <section className="glass card stack">
      <div className="row between">
        <div style={{ overflowX: 'auto' }}>{versiuni.data && <Seg label="Versiune CAEN" value={versiuneParam} onChange={setVersiune} options={versiuni.data.versiuni.map((v) => ({ value: v.cod, label: v.descriere.replace('Versiunea ', '') }))} />}</div>
        <div className="row"><label className="row" style={{ gap: 8 }}><span className="muted">Doar clase (4 cifre)</span><Switch label="Doar clase" checked={doarClase} onChange={(v) => { setDoarClase(v); setShown(PAGE); }} /></label>
          <button className="btn btn-sm" onClick={exportCsv} disabled={!list.length}><Download size={16} aria-hidden="true" /> CSV</button></div>
      </div>
      <div className="searchbox"><Search size={18} aria-hidden="true" /><input placeholder="Caută după cod sau denumire (ex. 4120, construcții)…" value={q} onChange={(e) => { setQ(e.target.value); setShown(PAGE); }} aria-label="Caută în CAEN" /></div>
      {caen.isPending ? <SkeletonLines n={8} /> : caen.isError ? <ErrorBox error={caen.error} onRetry={() => void caen.refetch()} compact /> : list.length === 0 ? <Empty icon={Search} title="Nicio clasă găsită">Încearcă un alt termen sau dezactivează filtrul „Doar clase”.</Empty> : (
        <>
          <p className="muted" role="status">{list.length} {doarClase ? 'clase' : 'intrări'} în versiunea {versiuni.data?.versiuni.find((v) => v.cod === versiuneParam)?.descriere.replace('Versiunea ', '') ?? versiuneParam}</p>
          <div className="stack-sm" role="list">{list.slice(0, shown).map((c, i) => (
            <button key={`${cod(c)}-${i}`} role="listitem" className={`tree-row${c.clasa ? '' : ' node'}`} onClick={() => open('caen', { clasa: cod(c), denumire: collapse(c.denumire), versiune: versiuneParam, ierarhie: [['Secțiune', c.sectiunea], ['Subsecțiune', c.subsectiunea], ['Diviziune', c.diviziunea], ['Grupă', c.grupa], ['Clasă', c.clasa]] })}>
              <span className="mono" style={{ minWidth: 54 }}>{cod(c)}</span><span className="grow">{collapse(c.denumire)}</span>{!c.clasa && <Badge>{nivel(c)}</Badge>}</button>))}</div>
          {shown < list.length && <button className="btn" style={{ alignSelf: 'center' }} onClick={() => setShown((s) => s + PAGE)}>Arată încă {Math.min(PAGE, list.length - shown)} din {list.length - shown}</button>}
        </>)}
      <p className="hint">Codurile se potrivesc exact: clasa 111 nu este 0111. Bilanțul decodifică activitatea întotdeauna cu versiunea 2008.</p>
    </section>
  );
}

function StariNom() {
  const st = useStari();
  const [q, setQ] = useState('');
  const list = useMemo(() => (st.data?.stari ?? []).filter((s) => !q || norm(`${s.cod} ${s.denumire}`).includes(norm(q))), [st.data, q]);
  return (
    <section className="glass card stack">
      <div className="row between"><h2 className="card-title">Stări ONRC</h2>{st.data && <Badge>{st.data.stari.length} stări</Badge>}</div>
      <div className="searchbox"><Search size={18} aria-hidden="true" /><input placeholder="Filtrează după cod sau denumire (ex. insolvență)…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filtrează stări" /></div>
      {st.isPending ? <SkeletonLines n={8} /> : st.isError ? <ErrorBox error={st.error} onRetry={() => void st.refetch()} compact /> : list.length === 0 ? <Empty icon={Search} title="Nicio stare găsită" /> : (
        <div className="table-wrap"><table className="table"><thead><tr><th>Cod</th><th>Denumire</th></tr></thead>
          <tbody>{list.map((s) => <tr key={s.cod}><td className="mono">{s.cod}</td><td>{collapse(s.denumire)}</td></tr>)}</tbody></table></div>)}
    </section>
  );
}

function VersiuniTab({ go }: { go: (v: string) => void }) {
  const v = useVersiuni();
  if (v.isPending) return <div className="glass card"><SkeletonLines n={4} /></div>;
  if (v.isError) return <ErrorBox error={v.error} onRetry={() => void v.refetch()} />;
  return (
    <div className="grid-auto">{v.data.versiuni.map((x) => (
      <div key={x.cod} className="glass live card stack-sm"><Badge tone="blue">cod {x.cod}</Badge><h2 className="card-title">{x.descriere}</h2>
        <p className="muted">Parametrul <span className="mono">versiune={x.cod}</span>. Nu folosi anul (2008) ca valoare de parametru.</p>
        <button className="btn btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => go(x.cod)}>Răsfoiește clasele</button></div>))}</div>
  );
}
function useVersiuni() { const q = useVersiuniCaen(); return Object.assign(q, { data: q.data as { versiuni: { cod: string; descriere: string }[] } }); }
