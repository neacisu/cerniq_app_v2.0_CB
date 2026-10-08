import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { History, Search } from 'lucide-react';
import { useIndicatori, useIndicatoriAni } from '../api/hooks';
import { ANI, FORMULARE, norm } from '../lib/indicators';
import { collapse } from '../lib/format';
import { Badge, Card, Empty, ErrorBox, PageHead, SkeletonLines, Spinner, Switch } from '../components/ui';

export default function Indicatori() {
  const [sp, setSp] = useSearchParams();
  const an = ANI.includes(Number(sp.get('an'))) ? Number(sp.get('an')) : 2025;
  const formular = FORMULARE.some((f) => f.cod === sp.get('formular')) ? sp.get('formular')! : 'WEB_UU';
  const upd = (k: string, v: string) => setSp((p) => { const n = new URLSearchParams(p); n.set(k, v); return n; }, { replace: true });
  const q = useIndicatori(an, formular);
  const [filtru, setFiltru] = useState('');
  const [dim, setDim] = useState(false);
  const [istoric, setIstoric] = useState<string | null>(null);
  const rows = useMemo(() => (q.data?.indicatori ?? []).filter((i) => (dim || !i.esteDimensiune) && (!filtru || norm(`${i.cod} ${i.denumire}`).includes(norm(filtru)))), [q.data, filtru, dim]);
  const info = FORMULARE.find((f) => f.cod === formular);
  return (
    <div className="page">
      <PageHead eyebrow="Date" title="Indicatori financiari">Dicționarul indicatorilor pentru fiecare an și formular. Același cod poate avea sensuri diferite de la un an la altul.</PageHead>
      <section className="glass card stack">
        <div className="grid-2">
          <div className="field"><label htmlFor="ind-an">An financiar</label>
            <select id="ind-an" className="select" value={an} onChange={(e) => upd('an', e.target.value)}>{ANI.map((a) => <option key={a} value={a}>{a}</option>)}</select></div>
          <div className="field"><label htmlFor="ind-form">Formular</label>
            <select id="ind-form" className="select" value={formular} onChange={(e) => upd('formular', e.target.value)}>{FORMULARE.map((f) => <option key={f.cod} value={f.cod}>{f.cod} · {f.titlu}</option>)}</select></div>
        </div>
        {info && <p className="muted">{info.titlu}. {info.descriere}</p>}
      </section>

      <Card title={`${formular} · ${an}`} icon={Search} actions={q.data && <Badge>{rows.length} indicatori</Badge>}>
        <div className="row between">
          <div className="searchbox grow" style={{ minWidth: 220 }}><Search size={18} aria-hidden="true" /><input placeholder="Filtrează (ex. cifra, profit, I13)…" value={filtru} onChange={(e) => setFiltru(e.target.value)} aria-label="Filtrează indicatori" /></div>
          <label className="row" style={{ gap: 8 }}><span className="muted">Arată și dimensiunile (CUI, CAEN)</span><Switch label="Arată dimensiunile" checked={dim} onChange={setDim} /></label>
        </div>
        {q.isPending ? <SkeletonLines n={8} /> : q.isError ? <ErrorBox error={q.error} onRetry={() => void q.refetch()} compact />
          : rows.length === 0 ? <Empty icon={Search} title="Niciun indicator">Schimbă filtrul.</Empty> : (
            <div className="table-wrap"><table className="table"><thead><tr><th>Poz.</th><th>Cod</th><th>Denumire</th><th><span className="sr-only">Istoric</span></th></tr></thead>
              <tbody>{rows.map((i) => <tr key={i.cod}><td className="mono">{i.pozitie}</td><td className="mono">{i.cod}</td><td>{collapse(i.denumire)}{i.esteDimensiune && <> <Badge tone="violet">dimensiune</Badge></>}</td>
                <td>{!i.esteDimensiune && <button className="btn btn-sm btn-ghost" onClick={() => setIstoric(i.cod)}><History size={16} aria-hidden="true" /> Istoric</button>}</td></tr>)}</tbody></table></div>)}
      </Card>
      {istoric && <Istoric formular={formular} cod={istoric} onClose={() => setIstoric(null)} />}
    </div>
  );
}

function Istoric({ formular, cod, onClose }: { formular: string; cod: string; onClose: () => void }) {
  const qs = useIndicatoriAni(ANI, formular, true);
  const loading = qs.some((x) => x.isPending);
  const rows = ANI.map((an, i) => ({ an, d: qs[i]?.data?.indicatori.find((x) => x.cod === cod), exists: !!qs[i]?.data, err: qs[i]?.isError }));
  let prev: string | null = null;
  return (
    <Card title={`Cum s-a schimbat ${cod} în ${formular}`} icon={History} actions={<button className="btn btn-sm" onClick={onClose}>Închide</button>}>
      {loading && <div className="row muted"><Spinner size={16} /> Se încarcă anii…</div>}
      <div className="table-wrap"><table className="table"><thead><tr><th>An</th><th>Denumire în legenda anului</th></tr></thead>
        <tbody>{[...rows].reverse().map((r) => {
          const den = r.d ? collapse(r.d.denumire) : null; const changed = den !== null && prev !== null && den !== prev; if (den) prev = den;
          return <tr key={r.an}><td className="mono">{r.an}</td><td>{r.d ? <>{den} {changed && <Badge tone="amber">schimbat</Badge>}</> : <span className="faint">{r.err ? 'Eroare la încărcare' : r.exists ? 'Cod inexistent în acel an' : 'Formular nepublicat în acel an'}</span>}</td></tr>;
        })}</tbody></table></div>
      <p className="hint">Anii sunt în ordine cronologică; „schimbat” marchează o denumire diferită față de anul anterior publicat.</p>
    </Card>
  );
}
