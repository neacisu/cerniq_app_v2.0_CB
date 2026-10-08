import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, GitCompareArrows, Plus, Share2, Trash2, X } from 'lucide-react';
import { useBilanturi, useCuiMulti } from '../api/hooks';
import { isCui } from '../lib/cui';
import { findMetric, METRICI, metricById } from '../lib/indicators';
import { download, toCsv } from '../lib/export';
import { collapse, fmtLei, fmtNum, titleCase } from '../lib/format';
import { MAX_COMPARE, useLibrary } from '../state/library';
import { useUi } from '../state/ui';
import { Empty, PageHead, Seg, Skeleton } from '../components/ui';
import { PALETA, TrendChart } from '../components/TrendChart';
import { Link } from 'react-router-dom';
import { pathFirma } from '../lib/cui';

export default function Compare() {
  const { compare, removeCompare, clearCompare, toggleCompare } = useLibrary();
  const { open, confirm, toast } = useUi();
  const [sp, setSp] = useSearchParams();
  const urlCuis = useMemo(() => (sp.get('cui') ?? '').split(',').map((s) => s.trim()).filter(isCui).slice(0, MAX_COMPARE), [sp]);
  const fromUrl = urlCuis.length > 0;
  const cuis = fromUrl ? urlCuis : compare.map((c) => c.cui).filter((c): c is string => !!c);
  const meta = useCuiMulti(cuis);
  const bil = useBilanturi(cuis);
  const [metricId, setMetricId] = useState('ca');
  const [tip, setTip] = useState<'line' | 'bar'>('line');
  const metric = metricById(metricId);
  const nume = cuis.map((c, i) => titleCase(meta[i]?.data?.platitor?.denumire ?? meta[i]?.data?.inmatriculari[0]?.denumire ?? compare.find((x) => x.cui === c)?.denumire ?? c));
  useEffect(() => { if (fromUrl) document.title = 'Comparare · Firme Cerniq'; }, [fromUrl]);

  const serii = cuis.map((c, i) => ({
    id: c, nume: nume[i]!, color: PALETA[i % PALETA.length]!,
    puncte: (bil[i]?.data?.ani ?? []).map((a) => ({ x: a.an, y: findMetric(a.formulare, metric)?.valoare ?? null })),
  }));
  const ani = [...new Set(serii.flatMap((s) => s.puncte.map((p) => p.x)))].sort((a, b) => b - a);
  const loading = bil.some((b) => b.isPending) && cuis.length > 0;
  const anyData = serii.some((s) => s.puncte.some((p) => p.y !== null));

  const shareUrl = `${location.origin}/comparare?cui=${cuis.join(',')}`;
  const exportCsv = () => {
    const rows: unknown[][] = [['An', ...nume.map((n) => `${n} (${metric.eticheta})`)], ...ani.map((an) => [an, ...serii.map((s) => s.puncte.find((p) => p.x === an)?.y ?? '')])];
    download(`comparare-${metric.id}.csv`, toCsv(rows), 'text/csv');
  };
  const adopt = () => { clearCompare(); cuis.forEach((c, i) => toggleCompare({ cui: c, cod: null, denumire: nume[i]! })); setSp({}, { replace: true }); toast('Lista de comparare a fost salvată'); };

  return (
    <div className="page">
      <PageHead eyebrow="Comparare" title="Compară firme" actions={cuis.length > 0 && <>
        <button className="btn" onClick={() => open('share', { url: shareUrl, titlu: `Comparare: ${nume.join(' vs ')}` })}><Share2 size={20} aria-hidden="true" /> Distribuie</button>
        <button className="btn" onClick={exportCsv} disabled={!anyData}><Download size={20} aria-hidden="true" /> CSV</button></>}>
        Pune până la {MAX_COMPARE} firme una lângă alta pe același indicator, pe toți anii disponibili.
      </PageHead>

      <div className="glass card stack">
        <div className="row">
          {cuis.map((c, i) => (
            <span key={c} className="chip" style={{ paddingRight: 6, borderColor: PALETA[i % PALETA.length] }}>
              <i style={{ width: 10, height: 10, borderRadius: 3, background: PALETA[i % PALETA.length] }} /><Link to={pathFirma(c)}>{nume[i]}</Link><span className="mono faint">{c}</span>
              {!fromUrl && <button className="btn btn-ghost btn-icon btn-sm" aria-label={`Scoate ${nume[i]}`} onClick={() => removeCompare(c)} style={{ width: 28, height: 28 }}><X size={14} aria-hidden="true" /></button>}
            </span>))}
          {!fromUrl && cuis.length < MAX_COMPARE && <button className="btn btn-sm btn-primary" onClick={() => open('picker')}><Plus size={16} aria-hidden="true" /> Adaugă firmă</button>}
          {!fromUrl && cuis.length > 0 && <button className="btn btn-sm btn-ghost" onClick={() => confirm({ titlu: 'Golești lista?', text: 'Toate firmele vor fi scoase din comparare.', confirmare: 'Golește', onConfirm: clearCompare })}><Trash2 size={16} aria-hidden="true" /> Golește</button>}
          {fromUrl && <button className="btn btn-sm" onClick={adopt}>Salvează această listă</button>}
        </div>
        {fromUrl && <p className="hint">Comparație încărcată dintr-un link. „Salvează această listă” o înlocuiește pe cea locală.</p>}
      </div>

      {cuis.length === 0 ? (
        <div className="glass card"><Empty icon={GitCompareArrows} title="Nicio firmă selectată" action={<button className="btn btn-primary" onClick={() => open('picker')}><Plus size={18} aria-hidden="true" /> Alege prima firmă</button>}>
          Poți adăuga firme și direct din rezultatele căutării sau de pe fișa fiecărei firme, cu butonul „Compară”.</Empty></div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}><Seg label="Indicator" value={metricId} onChange={setMetricId} options={METRICI.map((m) => ({ value: m.id, label: m.eticheta }))} /></div>
          <section className="glass card stack" aria-busy={loading}>
            <div className="row between"><h2 className="card-title">{metric.eticheta}</h2><Seg label="Tip grafic" value={tip} onChange={setTip} options={[{ value: 'line', label: 'Linie' }, { value: 'bar', label: 'Bare' }]} /></div>
            {loading ? <Skeleton h={280} r={18} /> : anyData ? <TrendChart serii={serii} tip={tip} unitate={metric.tip === 'lei' ? 'lei' : ''} altText={`Comparație ${metric.eticheta} între ${nume.join(', ')}`} />
              : <Empty icon={GitCompareArrows} title="Nu există valori pentru acest indicator">Încearcă alt indicator sau alte firme. Unele formulare nu raportează toți indicatorii.</Empty>}
          </section>
          {anyData && (
            <section className="glass card stack"><h2 className="card-title">Tabel pe ani</h2>
              <div className="table-wrap"><table className="table"><thead><tr><th>An</th>{serii.map((s) => <th key={s.id} className="num"><i style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: s.color, marginRight: 6 }} />{s.nume}</th>)}</tr></thead>
                <tbody>{ani.map((an) => <tr key={an}><td><b>{an}</b></td>{serii.map((s) => { const v = s.puncte.find((p) => p.x === an)?.y; return <td key={s.id} className={`num${v != null && v < 0 ? ' neg' : ''}`}>{v == null ? '—' : metric.tip === 'lei' ? fmtLei(v) : fmtNum(v)}</td>; })}</tr>)}</tbody></table></div>
              <p className="hint">Indicatorul este identificat după denumirea din legenda fiecărui an ({collapse(metric.potrivire)}). „—” înseamnă că nu există valoare publicată.</p>
            </section>)}
        </>)}
    </div>
  );
}
