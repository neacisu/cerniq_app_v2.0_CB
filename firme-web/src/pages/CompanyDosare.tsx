import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Calendar, Download, Gavel, Hourglass, Info, Scale, Search, SearchX, X } from 'lucide-react';
import { useDosare } from '../api/hooks';
import type { DosarLista, FiltreDosare, GradPotrivire } from '../api/types';
import { dataRo } from '../lib/anaf';
import { collapse } from '../lib/format';
import { useUi } from '../state/ui';
import type { ExportSection } from '../components/dialogs';
import { Badge, Card, Empty, ErrorBox, Skeleton } from '../components/ui';

export const GRAD: Record<GradPotrivire, { eticheta: string; scurt: string; ton: 'green' | 'blue' | 'amber' | 'red'; text: string }> = {
  exacta: { eticheta: 'Potrivire exactă a denumirii', scurt: 'Denumire exactă', ton: 'green', text: 'Numele părții din dosar coincide cu denumirea firmei (după eliminarea formei juridice și a mențiunilor de reprezentare). Rămâne o potrivire după nume: firme omonime pot exista.' },
  reprezentant: { eticheta: 'Găsit prin reprezentant', scurt: 'Prin reprezentant', ton: 'blue', text: 'Dosarul a fost găsit căutând numele unui reprezentant al firmei (de exemplu lichidatorul). Partea din dosar poate fi firma, dar legătura nu este confirmată de un identificator.' },
  partiala: { eticheta: 'Potrivire parțială', scurt: 'Parțială', ton: 'amber', text: 'Numele părții începe cu denumirea firmei sau invers (de exemplu „X IMPEX” față de „X”). Poate fi o altă firmă.' },
  nume: { eticheta: 'Doar nume asemănător', scurt: 'Doar nume', ton: 'red', text: 'Numele părții nu coincide clar cu denumirea firmei. Tratează-l ca neconfirmat.' },
};
const dataCurta = (iso: string | null) => (iso ? dataRo(iso) : '—');

export function DosareTab({ cui, cod, denumire }: { cui: string | null; cod: string | null; denumire: string }) {
  const { open } = useUi();
  const [f, setF] = useState<Omit<FiltreDosare, 'limit' | 'offset'>>({});
  const [limit, setLimit] = useState(25);
  const [q, setQ] = useState('');
  useEffect(() => { const t = setTimeout(() => setF((x) => ({ ...x, q: q.trim() || undefined })), 300); return () => clearTimeout(t); }, [q]);
  useEffect(() => { setF({}); setQ(''); setLimit(25); }, [cui, cod]);
  const t = useMemo(() => ({ cui, cod }), [cui, cod]);
  const r = useDosare(t, { ...f, limit, offset: 0 });
  const d = r.data;
  const filtrat = Object.entries(f).some(([k, v]) => v !== undefined && v !== false && k !== 'doarExacte') || !!f.doarExacte;
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => { setF((x) => ({ ...x, [k]: v })); setLimit(25); };

  const exporta = () => {
    if (!d) return;
    const sectiuni: ExportSection[] = [{ id: 'dosare', label: `Dosare afișate (${d.dosare.length} din ${d.total})`, json: d.dosare,
      rows: [['Număr', 'Instanță', 'Categorie', 'Stadiu', 'Obiect', 'Data dosar', 'Rol firmă', 'Potrivire', 'Părți', 'Ședințe', 'Ultima ședință'], ...d.dosare.map((x) => [x.numar, x.instanta, x.categorie, x.stadiu, x.obiect, x.dataDosar ?? '', x.rol.join('; '), GRAD[x.potrivire].eticheta, x.nrParti, x.nrSedinte, x.ultimaSedinta ?? ''])] }];
    open('export', { titlu: `${denumire}: dosare (potrivire după nume)`, fisier: `dosare-${cui ?? 'onrc'}`, sectiuni });
  };

  return (
    <div className="stack-lg">
      <div className="alerta" role="note"><AlertTriangle size={20} aria-hidden="true" />
        <div><b>Legătura cu firma se face după nume, nu după CUI.</b> Portalul instanțelor nu publică identificatori ai părților. Fiecare dosar arată de ce a fost legat de firmă și cât de sigură este potrivirea. Firmele cu denumiri asemănătoare sau omonime pot apărea în dosare care nu le aparțin.</div></div>

      {r.isPending ? <div className="glass card"><Skeleton h={220} r={26} /></div> : r.isError && !d ? <ErrorBox error={r.error} onRetry={() => void r.refetch()} /> : d && (
        <>
          <Acoperire d={d.acoperire} total={d.totalFirma} />
          {d.totalFirma === 0 ? <div className="glass card"><Empty icon={d.acoperire.stare === 'complet' ? SearchX : Hourglass} title={d.acoperire.stare === 'complet' ? 'Niciun dosar găsit' : d.acoperire.stare === 'partial' ? 'Căutare parțială, fără dosare' : 'Căutarea nu a fost încă rulată'}>
            {d.acoperire.stare === 'complet' ? 'Căutarea după denumirea firmei în portalul instanțelor nu a întors dosare. Asta nu garantează că nu există litigii: portalul poate să nu conțină toate dosarele.' : 'Dosarele apar după ce worker-ul interoghează portalul pentru această firmă.'}</Empty></div> : (
            <>
              <section className="kpi-grid" aria-label="Rezumat dosare">
                <div className="kpi glass live"><span className="k">Dosare găsite</span><span className="v">{d.totalFirma}</span><span className="faint">{dataCurta(d.sumarFirma.primul)} – {dataCurta(d.sumarFirma.ultimul)}</span></div>
                {d.sumarFirma.roluri.slice(0, 3).map((x) => <div key={x.valoare} className="kpi glass live"><span className="k">Ca {x.valoare.toLowerCase()}</span><span className="v">{x.nr}</span><span className="faint">dosare</span></div>)}
                <div className="kpi glass live"><span className="k">Potriviri sigure</span><span className="v">{d.sumarFirma.potriviri.filter((p) => p.valoare === 'exacta' || p.valoare === 'reprezentant').reduce((s, p) => s + p.nr, 0)}</span><span className="faint">exacte sau prin reprezentant</span></div>
              </section>

              <Card title="Pe ani" icon={Calendar}><AniBars ani={d.sumarFirma.ani} activ={f.an} onPick={(an) => set('an', f.an === an ? undefined : an)} /></Card>

              <section className="glass card stack">
                <div className="row between">
                  <h2 className="card-title"><Scale size={22} aria-hidden="true" />Dosare <span className="muted" style={{ fontWeight: 500, fontSize: 15 }}>{d.total === d.totalFirma ? d.total : `${d.total} din ${d.totalFirma}`}</span></h2>
                  <div className="row">{filtrat && <button className="btn btn-sm btn-ghost" onClick={() => { setF({}); setQ(''); }}><X size={16} aria-hidden="true" /> Resetează filtrele</button>}
                    <button className="btn btn-sm" onClick={exporta}><Download size={16} aria-hidden="true" /> Exportă</button></div>
                </div>
                <div className="searchbox"><Search size={18} aria-hidden="true" /><input placeholder="Caută în numărul dosarului, obiect, instanță sau părți…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Caută în dosare" /></div>
                <div className="grid-2" style={{ gap: 10 }}>
                  <Select label="Categorie" valoare={f.categorie} optiuni={d.sumarFirma.categorii} onChange={(v) => set('categorie', v)} />
                  <Select label="Stadiu" valoare={f.stadiu} optiuni={d.sumarFirma.stadii} onChange={(v) => set('stadiu', v)} />
                  <Select label="Rolul firmei" valoare={f.rol} optiuni={d.sumarFirma.roluri} onChange={(v) => set('rol', v)} />
                  <Select label="Potrivire" valoare={f.potrivire} optiuni={d.sumarFirma.potriviri.map((p) => ({ valoare: p.valoare, nr: p.nr }))} eticheta={(v) => GRAD[v as GradPotrivire]?.scurt ?? v} onChange={(v) => set('potrivire', v as GradPotrivire | undefined)} />
                </div>
                <label className="row" style={{ cursor: 'pointer', gap: 10 }}><input type="checkbox" checked={!!f.doarExacte} onChange={(e) => set('doarExacte', e.target.checked)} style={{ width: 20, height: 20, accentColor: 'var(--accent)' }} />Doar potriviri sigure (denumire exactă sau prin reprezentant)</label>
                {d.trunchiat && <div className="alerta" role="status"><AlertTriangle size={20} aria-hidden="true" /><div>Firma are peste {d.plafonIncarcare} de dosare; sunt luate în calcul cele mai recente {d.plafonIncarcare}.</div></div>}
                {d.dosare.length === 0 ? <Empty icon={SearchX} title="Niciun dosar pentru filtrele alese">Relaxează filtrele sau resetează-le.</Empty> : (
                  <div className="stack-sm" role="list">{d.dosare.map((x) => <DosarCard key={x.id} x={x} onOpen={() => open('dosar', { id: x.id, cui, cod, denumire })} />)}</div>)}
                {d.dosare.length < d.total && <button className="btn" style={{ alignSelf: 'center' }} onClick={() => setLimit((l) => l + 25)}>Arată încă {Math.min(25, d.total - d.dosare.length)} din {d.total - d.dosare.length}</button>}
                {r.isFetching && <span className="muted" role="status">Se actualizează…</span>}
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

function Select({ label, valoare, optiuni, onChange, eticheta }: { label: string; valoare: string | undefined; optiuni: { valoare: string; nr: number }[]; onChange: (v: string | undefined) => void; eticheta?: (v: string) => string }) {
  return (
    <div className="field"><label>{label}</label>
      <select className="select" value={valoare ?? ''} onChange={(e) => onChange(e.target.value || undefined)}>
        <option value="">Toate</option>{optiuni.map((o) => <option key={o.valoare} value={o.valoare}>{(eticheta?.(o.valoare) ?? o.valoare)} ({o.nr})</option>)}</select></div>
  );
}

function AniBars({ ani, activ, onPick }: { ani: { valoare: string; nr: number }[]; activ: number | undefined; onPick: (an: number) => void }) {
  const max = Math.max(1, ...ani.map((a) => a.nr));
  if (ani.length === 0) return <p className="muted">Fără date.</p>;
  return (
    <div className="ani-bars" role="group" aria-label="Dosare pe ani, apasă pentru a filtra">{ani.map((a) => (
      <button key={a.valoare} className={`ab${activ === Number(a.valoare) ? ' on' : ''}`} onClick={() => onPick(Number(a.valoare))} aria-pressed={activ === Number(a.valoare)} aria-label={`${a.valoare}: ${a.nr} dosare`}>
        <span className="n">{a.nr}</span><i style={{ height: `${Math.max(6, (a.nr / max) * 100)}%` }} /><span className="y">{a.valoare}</span></button>))}</div>
  );
}

function Acoperire({ d, total }: { d: import('../api/types').AcoperireDosare; total: number }) {
  const firma = d.cautari.filter((c) => c.tip === 'firma'), rep = d.cautari.filter((c) => c.tip === 'reprezentant');
  const msg = { complet: null, partial: 'Rezultat parțial: portalul a atins plafonul de rezultate la cel puțin o căutare.', 'in-asteptare': 'Căutarea după denumirea firmei este în așteptare.', necautat: 'Firma nu a fost încă pusă în coada de căutare.', necunoscut: 'Firma nu are CUI: acoperirea căutărilor nu poate fi stabilită.' }[d.stare];
  return (
    <details className="glass card" open={d.stare !== 'complet'}>
      <summary style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontWeight: 700 }}>
        <Gavel size={20} aria-hidden="true" />Acoperire și surse interogate
        <Badge tone={d.stare === 'complet' ? 'green' : d.stare === 'partial' ? 'amber' : undefined}>{{ complet: 'căutare completă', partial: 'parțială', 'in-asteptare': 'în așteptare', necautat: 'necăutat', necunoscut: 'necunoscută' }[d.stare]}</Badge>
        {total > 0 && <span className="muted" style={{ fontWeight: 500 }}>{total} dosare</span>}</summary>
      <div className="stack" style={{ marginTop: 12 }}>
        {msg && <div className="alerta info"><Info size={20} aria-hidden="true" /><div>{msg}</div></div>}
        <div className="stack-sm">{firma.map((c, i) => <div key={i} className="listrow"><div className="grow"><b>{c.sursa === 'portal' ? 'Portal instanțe (portal.just.ro)' : c.sursa === 'iccj' ? 'Înalta Curte (ICCJ)' : c.sursa}</b><div className="muted" style={{ fontSize: 13 }}>după denumirea „{c.nume}”</div></div>
          <Badge tone={c.stare === 'gasit' ? 'green' : c.stare === 'negasit' ? undefined : 'amber'}>{{ gasit: `${c.dosareGasite} dosare`, negasit: 'niciun dosar', asteptare: 'în așteptare', plafon: 'plafon atins' }[c.stare] ?? c.stare}</Badge>{c.plafonAtins && <Badge tone="amber">plafon atins</Badge>}</div>)}</div>
        {rep.length > 0 && <p className="hint">Căutări după administratori/reprezentanți ({rep.length}): {rep.filter((c) => c.stare === 'asteptare').length} în așteptare. Dosarele găsite așa apar cu potrivirea „prin reprezentant”.</p>}
      </div>
    </details>
  );
}

function DosarCard({ x, onOpen }: { x: DosarLista; onOpen: () => void }) {
  const g = GRAD[x.potrivire];
  return (
    <article role="listitem" className="dosar-card">
      <div className="row between nw" style={{ alignItems: 'flex-start' }}>
        <div style={{ minWidth: 0 }}><div className="mono" style={{ fontWeight: 600, fontSize: 16 }}>{x.numar}</div><div className="muted truncate">{collapse(x.instanta) || 'Instanță nepublicată în sursă'}{x.departament ? ` · ${collapse(x.departament)}` : ''}</div></div>
        <Badge tone={g.ton} title={g.text}>{g.scurt}</Badge>
      </div>
      <div className="row" style={{ gap: 6 }}>{x.categorie && <Badge tone="blue">{x.categorie}</Badge>}{x.stadiu && <Badge>{x.stadiu}</Badge>}{x.rol.map((r) => <Badge key={r} tone="violet">{r}</Badge>)}{x.dataInViitor && <Badge tone="amber" title="Data dosarului este în viitor: probabil o eroare a sursei">dată suspectă</Badge>}</div>
      {x.obiect && <p className="obiect">{x.obiect}</p>}
      <div className="row between"><span className="faint" style={{ fontSize: 13 }}>Înregistrat {dataCurta(x.dataDosar)} · {x.nrParti} părți · {x.nrSedinte} ședințe{x.ultimaSedinta ? ` · ultima ${dataCurta(x.ultimaSedinta)}` : ''}{x.nrCaiAtac ? ` · ${x.nrCaiAtac} căi de atac` : ''}</span>
        <button className="btn btn-sm" onClick={onOpen}>Detalii</button></div>
    </article>
  );
}
