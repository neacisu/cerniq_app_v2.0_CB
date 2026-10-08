import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BarChart3, Copy, Download, HelpCircle, LineChart as LineIcon, Search, Share2 } from 'lucide-react';
import type { BilantToti } from '../api/types';
import { collapse, fmtLei, fmtNum, pctChange } from '../lib/format';
import { findMetric, METRICI, norm, seriesFor, metricById, unitFor } from '../lib/indicators';
import { copyText } from '../lib/export';
import { useSettings } from '../state/settings';
import { useUi } from '../state/ui';
import { Badge, Card, Empty, ErrorBox, Seg, SkeletonLines, Switch } from '../components/ui';
import { TrendChart } from '../components/TrendChart';
import { Delta } from './Delta';

export function FinanciarTab({ cui, ani, loading, error, noData, denumire, exportFin }: {
  cui: string | null; ani: BilantToti['ani']; loading: boolean; error: unknown; noData: boolean; denumire: string; exportFin: () => void;
}) {
  const [sp, setSp] = useSearchParams();
  const { open, toast } = useUi();
  const { settings } = useSettings();
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [q, setQ] = useState('');
  const [hideZero, setHideZero] = useState(false);
  const years = useMemo(() => [...ani].sort((a, b) => b.an - a.an), [ani]);
  const anSel = years.find((y) => String(y.an) === sp.get('an')) ?? years[0];
  const prev = anSel ? years.find((y) => y.an < anSel.an) : undefined;
  const [formIdx, setFormIdx] = useState(0);
  const forms = anSel?.formulare ?? [];
  const form = forms[Math.min(formIdx, forms.length - 1)];
  const available = useMemo(() => METRICI.filter((m) => ani.some((a) => findMetric(a.formulare, m, form?.formular))), [ani, form?.formular]);
  const [metricId, setMetricId] = useState('');
  const metric = metricById(available.find((m) => m.id === metricId)?.id ?? available[0]?.id ?? 'ca');

  if (!cui) return <div className="glass card"><Empty icon={LineIcon} title="Situațiile financiare cer un CUI valid">Această înmatriculare nu are un CUI utilizabil, deci bilanțul nu poate fi legat de firmă.</Empty></div>;
  if (noData) return <div className="glass card"><Empty icon={LineIcon} title="Fără situații financiare publicate">Nu există depuneri în 2008–2025 pentru acest CUI.</Empty></div>;
  if (loading) return <div className="glass card"><SkeletonLines n={8} /></div>;
  if (error) return <ErrorBox error={error} />;
  if (!anSel || !form) return <div className="glass card"><Empty icon={LineIcon} title="Fără date">Nu am primit indicatori pentru această firmă.</Empty></div>;

  const prevForm = prev?.formulare.find((f) => f.formular === form.formular);
  const prevMap = new Map(prevForm?.indicatori.map((i) => [norm(i.denumire), i.valoare]));
  const rows = form.indicatori.filter((i) => (!hideZero || i.valoare !== 0) && (!q || norm(`${i.cod} ${i.denumire}`).includes(norm(q))));
  const serie = seriesFor(ani, metric, form.formular);
  const kpiMetrics = ['ca', 'venituri', 'profit', 'pierdere', 'salariati'].map(metricById).map((m) => ({ m, cur: findMetric([form], m), pr: prevForm ? findMetric([prevForm], m) : undefined })).filter((k) => k.cur);

  return (
    <div className="stack-lg">
      <div className="row between no-print">
        <Seg label="An financiar" value={String(anSel.an)} onChange={(v) => { setFormIdx(0); setSp((p) => { const n = new URLSearchParams(p); n.set('an', v); n.set('tab', 'financiar'); return n; }, { replace: true }); }}
          options={years.map((y) => ({ value: String(y.an), label: String(y.an) }))} />
        <div className="row">
          <button className="btn btn-sm btn-ghost" onClick={() => open('help')}><HelpCircle size={18} aria-hidden="true" /> Cum citesc datele</button>
          <button className="btn btn-sm" onClick={() => open('share', { url: `${location.origin}/firma/${cui}?tab=financiar`, titlu: `${denumire}: situații financiare`, an: anSel.an })}><Share2 size={16} aria-hidden="true" /> Distribuie</button>
          <button className="btn btn-sm" onClick={exportFin}><Download size={16} aria-hidden="true" /> Exportă</button>
        </div>
      </div>

      {forms.length > 1 && <div className="row no-print" role="group" aria-label="Formulare depuse"><span className="muted">Formulare depuse în {anSel.an}:</span>
        {forms.map((f, i) => <button key={f.formular} className={`chip${i === formIdx ? ' on' : ''}`} aria-pressed={i === formIdx} onClick={() => setFormIdx(i)}>{f.formular}</button>)}</div>}

      <div className="kpi-grid">{kpiMetrics.map(({ m, cur, pr }) => (
        <div key={m.id} className="kpi glass live"><span className="k">{m.eticheta}</span>
          <span className="v">{m.tip === 'lei' ? fmtLei(cur!.valoare, settings.compactNumbers) : fmtNum(cur!.valoare)}</span>
          {pr && <Delta pct={pctChange(cur!.valoare, pr.valoare)} inverse={m.ton === 'negativ'} label={`față de ${prev!.an}`} />}</div>))}</div>

      {available.length > 0 && (
        <Card title="Evoluție în timp" icon={BarChart3} actions={<Seg label="Tip grafic" value={chartType} onChange={setChartType} options={[{ value: 'bar', label: 'Bare' }, { value: 'line', label: 'Linie' }]} />}>
          <div style={{ overflowX: 'auto' }} className="no-print"><Seg label="Indicator grafic" value={metric.id} onChange={setMetricId} options={available.map((m) => ({ value: m.id, label: m.eticheta }))} /></div>
          <TrendChart tip={chartType} unitate={metric.tip === 'lei' ? 'lei' : ''} altText={`${metric.eticheta}: ${serie.map((p) => `${p.an} ${p.valoare ?? 'lipsă'}`).join(', ')}`}
            serii={[{ id: metric.id, nume: metric.eticheta, color: 'var(--accent)', puncte: serie.map((p) => ({ x: p.an, y: p.valoare })) }]} />
          <p className="hint">Valorile sunt cele din formularul {form.formular}; anii în care firma nu a depus acest formular sau indicatorul lipsește nu sunt desenați. Identificarea se face după denumirea din legenda anului.</p>
        </Card>)}

      <Card title={`Toți indicatorii · ${anSel.an} · ${form.formular}`} icon={LineIcon}>
        <div className="row between">
          <div className="row">
            {form.caen && <Badge tone="blue" title={`CAEN versiunea ${form.caenVersiune}`}>CAEN {form.caen}</Badge>}
            <span className="muted">{form.caenDenumire ?? (form.caen ? 'Denumire CAEN indisponibilă pentru acest cod' : '')}</span>
            {form.caeno && <Badge tone="violet">CAEN ONG {form.caeno}</Badge>}
          </div>
          <div className="row no-print">
            <label className="row" style={{ gap: 8 }}><span className="muted">Doar valori nenule</span><Switch label="Doar valori nenule" checked={hideZero} onChange={setHideZero} /></label>
          </div>
        </div>
        <div className="searchbox no-print"><Search size={18} aria-hidden="true" /><input placeholder="Filtrează indicatori (denumire sau cod)…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filtrează indicatori" /></div>
        {rows.length === 0 ? <Empty icon={Search} title="Niciun indicator">Schimbă filtrul sau dezactivează „Doar valori nenule”.</Empty> : (
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Cod</th><th>Indicator</th><th className="num">Valoare</th><th>UM</th><th className="num">{prev ? `vs ${prev.an}` : 'Variație'}</th><th className="no-print"><span className="sr-only">Acțiuni</span></th></tr></thead>
            <tbody>{rows.map((i) => {
              const p = prevMap.get(norm(i.denumire));
              return <tr key={i.cod}><td className="mono">{i.cod}</td><td>{collapse(i.denumire)}</td>
                <td className={`num${i.valoare < 0 ? ' neg' : ''}`}>{fmtNum(i.valoare)}</td><td className="muted">{unitFor(i.denumire)}</td>
                <td className="num"><Delta pct={pctChange(i.valoare, p)} /></td>
                <td className="no-print"><button className="btn btn-ghost btn-icon btn-sm" aria-label={`Copiază valoarea ${collapse(i.denumire)}`} onClick={async () => toast((await copyText(String(i.valoare))) ? 'Valoare copiată' : 'Nu am putut copia')}><Copy size={16} aria-hidden="true" /></button></td></tr>;
            })}</tbody></table></div>)}
        <p className="hint">{rows.length} din {form.indicatori.length} indicatori. Celulele goale din sursă lipsesc din listă; zero este valoare reală.</p>
      </Card>
    </div>
  );
}
