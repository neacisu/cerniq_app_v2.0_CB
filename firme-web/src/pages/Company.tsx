import { useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Briefcase, Building2, Download, Gavel, History, LineChart as LineIcon, MapPin, Network, Printer, ScrollText, Share2, ShieldCheck, Users } from 'lucide-react';
import { useAnaf, useBilantToti, useCui, useDosare, useInmatriculare } from '../api/hooks';
import { ApiError } from '../api/client';
import { adresaOnrc, adresaPlatitor, collapse, fmtLei, fmtNum, isYes, pctChange, titleCase } from '../lib/format';
import { cuiUtilizabil, pathFirma } from '../lib/cui';
import { findMetric, METRICI, metricById, primaryFormular, seriesFor, unitFor } from '../lib/indicators';
import { useLibrary, type FirmaRef } from '../state/library';
import { useSettings } from '../state/settings';
import { useUi } from '../state/ui';
import { CmpButton, FavButton } from '../components/Firma';
import { Badge, Card, Empty, ErrorBox, KV, Seg, Skeleton, SkeletonLines } from '../components/ui';
import { TrendChart } from '../components/TrendChart';
import type { ExportSection } from '../components/dialogs';
import { FinanciarTab } from './CompanyFinanciar';
import { GrupTab } from './CompanyGrup';
import { FiscalTab } from './CompanyFiscal';
import { DosareTab } from './CompanyDosare';
import { ContactCard, CronologieTab, SemnaleCard, StructuraCard } from './CompanyExtra';
import { Prospetime, Sursa, StariFiscale as StariFiscaleChips } from '../components/Fiscal';
import { STARE_FISCALA, STARE_TVA } from '../lib/anaf';
import { Delta } from './Delta';
import type { AnafFirma, BilantToti, CuiResponse, FirmaOnrc, InmatriculareResponse, Platitor } from '../api/types';

const TABS = [
  { value: 'prezentare', label: 'Prezentare', icon: Building2 }, { value: 'financiar', label: 'Financiar', icon: LineIcon },
  { value: 'fiscal', label: 'Fiscal', icon: ShieldCheck }, { value: 'dosare', label: 'Dosare', icon: Gavel }, { value: 'cronologie', label: 'Cronologie', icon: History },
  { value: 'stari', label: 'Stări ONRC', icon: ScrollText }, { value: 'reprezentanti', label: 'Reprezentanți', icon: Users }, { value: 'grup', label: 'Grup', icon: Network },
] as const;
type TabId = (typeof TABS)[number]['value'];

const stareTon = (d: string | null | undefined): 'red' | 'amber' | 'green' | undefined => {
  const t = (d ?? '').toLowerCase();
  if (/radier|dizolv|lichid|suspend/.test(t)) return 'red';
  if (/insolven|faliment|reorganiz|85\/2014|penal/.test(t)) return 'amber';
  return undefined;
};

export default function Company() {
  const params = useParams();
  const loc = useLocation();
  const nav = useNavigate();
  const isInm = loc.pathname.startsWith('/inmatriculare');
  const cuiParam = !isInm ? (params.cui ?? null) : null;
  const codParam = isInm ? (params['*'] ?? null) : null;
  const [sp, setSp] = useSearchParams();
  const tabCerut = TABS.find((t) => t.value === sp.get('tab'))?.value ?? 'prezentare';
  const { addIstoric } = useLibrary();
  const { settings } = useSettings();
  const { open } = useUi();

  // Cale 1: după CUI. Cale 2: după nr. înmatriculare, apoi CUI-ul derivat (dacă este utilizabil).
  const inmByCod = useInmatriculare(codParam);
  const cuiFromCod = inmByCod.data?.firme.map((f) => f.cui).find(cuiUtilizabil) ?? inmByCod.data?.platitori[0]?.codFiscal ?? null;
  const cui = cuiParam ?? (cuiUtilizabil(cuiFromCod) ? cuiFromCod : null);
  const cuiQ = useCui(cui);
  const cod = codParam ?? cuiQ.data?.inmatriculari.map((f) => f.codInmatriculare).find(Boolean) ?? null;
  const inmByCui = useInmatriculare(!isInm ? cod : null);
  const inm: InmatriculareResponse | undefined = isInm ? inmByCod.data : inmByCui.data;
  const bilant = useBilantToti(cui && (cuiQ.data?.bilant.length ?? 0) > 0 ? cui : null);
  const anafQ = useAnaf(cui);
  const dosareSumar = useDosare({ cui, cod }, { limit: 1, offset: 0 });
  const anaf: AnafFirma | undefined = anafQ.data;

  const platitor: Platitor | null = cuiQ.data?.platitor ?? inm?.platitori[0] ?? null;
  const onrc: FirmaOnrc[] = cuiQ.data?.inmatriculari?.length ? cuiQ.data.inmatriculari : inm?.firme ?? [];
  const anafOnly = !platitor && onrc.length === 0 && anaf?.stare === 'gasit';
  const denumire = platitor?.denumire ?? onrc[0]?.denumire ?? (anaf?.stare === 'gasit' ? anaf.generale?.denumire ?? '' : '');
  const ref: FirmaRef = useMemo(() => ({ cui: cui ?? null, cod: cod ?? null, denumire }), [cui, cod, denumire]);

  const primaryErr = isInm ? inmByCod.error : anaf?.stare === 'gasit' ? null : cuiQ.error;
  const loadingMain = isInm ? inmByCod.isPending : cuiQ.isPending || (!!cuiQ.error && anafQ.isPending);
  useEffect(() => { if (denumire && (cui || cod)) addIstoric(ref); }, [denumire, cui, cod, ref, addIstoric]);
  useEffect(() => { if (denumire) document.title = `${titleCase(denumire)} · Firme Cerniq`; return () => { document.title = 'Firme Cerniq — registrul firmelor din România'; }; }, [denumire]);
  // Căutare după înmatriculare cu CUI utilizabil → URL canonic pe CUI.
  useEffect(() => { if (isInm && cui && inmByCod.isSuccess && cuiQ.isSuccess) nav(`${pathFirma(cui)}${loc.search}`, { replace: true }); }, [isInm, cui, inmByCod.isSuccess, cuiQ.isSuccess, nav, loc.search]);

  if (primaryErr && !denumire) return <div className="page"><ErrorBox error={primaryErr} onRetry={() => void (isInm ? inmByCod.refetch() : cuiQ.refetch())} /><Link to="/cauta" className="btn" style={{ alignSelf: 'center' }}>Înapoi la căutare</Link></div>;
  if (loadingMain || (isInm && !inmByCod.data)) return <CompanySkeleton />;

  const taburi = TABS.filter((t) => (t.value !== 'grup' && t.value !== 'dosare') || (t.value === 'grup' ? !!cod : !!(cui || cod)));
  const tab: TabId = !taburi.some((t) => t.value === tabCerut) ? 'prezentare' : tabCerut;
  const stari = inm?.stari ?? [];
  const ani = bilant.data?.ani ?? [];
  const statusBadges = (
    <div className="stack-sm">
      <div className="row" style={{ gap: 6 }}>
        {(platitor || anaf?.stare === 'gasit') && <Badge tone="blue">ANAF</Badge>}{onrc.length > 0 && <Badge tone="green">ONRC</Badge>}
        {onrc[0]?.formaJuridica && <Badge>{onrc[0].formaJuridica}</Badge>}
        {stari.filter((s) => stareTon(s.denumire)).slice(0, 2).map((s) => <Badge key={s.cod} tone={stareTon(s.denumire)}>{collapse(s.denumire)}</Badge>)}
      </div>
      {anaf?.stare === 'gasit' ? <div className="row" style={{ gap: 8 }}><StariFiscaleChips anaf={anaf} /><Prospetime data={anaf.dataInterogare} /></div> : platitor && (
        <div className="row" style={{ gap: 6 }}>{platitor.stare && <Badge tone={/inregistrat/i.test(platitor.stare) ? 'green' : 'red'}>{titleCase(platitor.stare)}</Badge>}<Badge tone={isYes(platitor.tva) ? 'violet' : undefined}>{isYes(platitor.tva) ? 'Plătitor TVA' : 'Neplătitor TVA'}</Badge>
          <span className="sursa" title="Snapshot ANAF 2026: starea poate fi depășită">Snapshot ANAF 2026</span></div>)}
    </div>
  );

  const exportSections = (): ExportSection[] => {
    const id: unknown[][] = [['Câmp', 'Valoare'], ['Denumire', denumire], ['CUI', cui ?? ''], ['Nr. înmatriculare', cod ?? ''], ['Stare ANAF (v9, altfel snapshot)', anaf?.stare === 'gasit' ? anaf.stareFiscala ?? '' : platitor?.stare ?? ''], ['Adresă', adresaPlatitor(platitor) || adresaOnrc(onrc[0])]];
    const fin: unknown[][] = [['An', 'Formular', 'Cod', 'Indicator', 'Valoare', 'UM']];
    ani.forEach((a) => a.formulare.forEach((f) => f.indicatori.forEach((i) => fin.push([a.an, f.formular, i.cod, collapse(i.denumire), i.valoare, unitFor(i.denumire)]))));
    return [
      { id: 'identificare', label: 'Identificare', rows: id, json: { denumire, cui, codInmatriculare: cod, platitor, onrc } },
      ...(anaf?.stare === 'gasit' ? [{ id: 'anaf', label: 'Stare fiscală ANAF v9', rows: [['Câmp', 'Valoare'], ['Stare fiscală', anaf.stareFiscala ?? ''], ['TVA', anaf.tva ?? ''], ['Inactiv din', anaf.inactiv?.dataInactivare ?? ''], ['Reactivat', anaf.inactiv?.dataReactivare ?? ''], ['e-Factura din', anaf.eFactura?.data ?? ''], ['Interogat la', anaf.dataInterogare ?? ''], ...(anaf.tvaDetaliu?.perioade ?? []).map((p) => [`Perioadă TVA ${p.ordine + 1}`, `${p.inceput ?? ''} – ${p.sfarsit ?? 'în curs'}`])], json: anaf }] : []),
      { id: 'financiar', label: 'Situații financiare', rows: fin, json: ani },
      { id: 'stari', label: 'Stări ONRC', rows: [['Cod', 'Denumire'], ...stari.map((s) => [s.cod, collapse(s.denumire)])], json: stari },
      { id: 'reprezentanti', label: 'Reprezentanți legali', rows: [['Nume', 'Calitate', 'Data nașterii'], ...(inm?.reprezentantiLegali ?? []).map((r) => [r.persoanaImputernicita, r.calitate, r.dataNastere])], json: inm?.reprezentantiLegali ?? [] },
    ];
  };
  const base = `${location.origin}${cui ? pathFirma(cui) : loc.pathname}`;

  return (
    <div className="page">
      <section className="company-head glass">
        <div className="stack" style={{ minWidth: 0, flex: '1 1 360px' }}>
          {statusBadges}
          <h1>{denumire || 'Firmă'}</h1>
          <div className="company-id">{cui && <span>CUI {cui}</span>}{cod && <span>{cod}</span>}{onrc[0]?.euid && <span className="hide-sm">{onrc[0].euid}</span>}</div>
          {(platitor || onrc[0] || anafOnly) && <p className="muted row nw" style={{ alignItems: 'flex-start' }}><MapPin size={18} aria-hidden="true" style={{ flex: 'none', marginTop: 3 }} />{adresaPlatitor(platitor) || adresaOnrc(onrc[0]) || anaf?.generale?.adresa}</p>}
        </div>
        <div className="company-actions no-print">
          <FavButton f={ref} label /><CmpButton f={ref} label />
          <button className="btn" onClick={() => open('share', { url: base, titlu: denumire, an: undefined })}><Share2 size={20} aria-hidden="true" /> Distribuie</button>
          <button className="btn" onClick={() => open('export', { titlu: denumire, fisier: `firma-${cui ?? 'onrc'}`, sectiuni: exportSections() })}><Download size={20} aria-hidden="true" /> Exportă</button>
          <button className="btn btn-icon btn-ghost" onClick={() => window.print()} aria-label="Tipărește" title="Tipărește"><Printer size={20} aria-hidden="true" /></button>
        </div>
      </section>

      <div className="no-print" style={{ overflowX: 'auto' }}>
        <Seg label="Secțiuni fișă" value={tab} onChange={(v) => setSp((p) => { const n = new URLSearchParams(p); n.set('tab', v); return n; }, { replace: true })}
          options={taburi.map((t) => ({ value: t.value, label: <><t.icon size={18} aria-hidden="true" />{t.label}</> }))} />
      </div>

      {tab === 'prezentare' && <Prezentare anaf={anaf} nrDosare={dosareSumar.data?.totalFirma ?? null} platitor={platitor} onrc={onrc} cui={cui} stari={stari} bilant={bilant.data} bilantLoading={bilant.isPending && !!cui && (cuiQ.data?.bilant.length ?? 0) > 0} cuiData={cuiQ.data} go={(t) => setSp({ tab: t })} compact={settings.compactNumbers} />}
      {tab === 'financiar' && <FinanciarTab cui={cui} ani={ani} loading={bilant.isPending && !!cui} error={bilant.error} noData={!!cuiQ.data && cuiQ.data.bilant.length === 0} denumire={denumire} exportFin={() => open('export', { titlu: `${denumire}: situații financiare`, fisier: `bilant-${cui}`, sectiuni: exportSections().filter((s) => s.id === 'financiar') })} />}
      {tab === 'stari' && <StariTab stari={stari} loading={isInm ? false : inmByCui.isPending} error={inmByCui.error} cod={cod} />}
      {tab === 'reprezentanti' && <ReprezentantiTab inm={inm} loading={isInm ? false : inmByCui.isPending} error={inmByCui.error} />}
      {tab === 'grup' && cod && <GrupTab cod={cod} cui={cui} denumire={denumire} />}
      {tab === 'fiscal' && <FiscalTab anaf={anaf} loading={anafQ.isPending && !!cui} error={anafQ.error} snapshot={platitor} onrc={onrc[0]} aniBilant={ani.map((a) => a.an)} />}
      {tab === 'dosare' && <DosareTab cui={cui} cod={cod} denumire={denumire} />}
      {tab === 'cronologie' && <CronologieTab cui={cui} cod={cod} onrc={onrc[0]} anaf={anaf} aniBilant={ani.map((a) => a.an)} stari={stari} />}
    </div>
  );
}

function CompanySkeleton() {
  return (
    <div className="page" aria-busy="true"><div className="company-head glass"><div className="stack grow"><Skeleton w={180} h={26} r={999} /><Skeleton w="70%" h={48} /><Skeleton w="40%" /></div></div>
      <div className="kpi-grid">{Array.from({ length: 4 }, (_, i) => <div key={i} className="kpi"><Skeleton w="50%" /><Skeleton w="80%" h={30} /></div>)}</div>
      <div className="glass card"><SkeletonLines n={5} /></div></div>
  );
}

function Prezentare({ anaf, nrDosare, platitor, onrc, cui, stari, bilant, bilantLoading, cuiData, go, compact }: {
  anaf: AnafFirma | undefined; nrDosare: number | null; platitor: Platitor | null; onrc: FirmaOnrc[]; cui: string | null; stari: InmatriculareResponse['stari']; bilant?: BilantToti; bilantLoading: boolean; cuiData?: CuiResponse; go: (t: TabId) => void; compact: boolean;
}) {
  const ani = bilant?.ani ?? [];
  const sorted = [...ani].sort((a, b) => b.an - a.an);
  const fp = primaryFormular(ani);
  const last = sorted.find((a) => a.formulare.some((f) => f.formular === fp)) ?? sorted[0];
  const prev = sorted.find((a) => a.an < (last?.an ?? 0) && a.formulare.some((f) => f.formular === fp));
  const kpis = ['ca', 'profit', 'pierdere', 'salariati', 'capitaluri'].map((id) => {
    const m = metricById(id); const cur = last ? findMetric(last.formulare, m, fp) : undefined; const pr = prev ? findMetric(prev.formulare, m, fp) : undefined;
    return { m, cur, delta: pctChange(cur?.valoare, pr?.valoare) };
  }).filter((k) => k.cur && !(k.m.id === 'pierdere' && k.cur.valoare === 0)).slice(0, 4);
  const serieCa = ani.length > 1 ? seriesFor(ani, METRICI[0]!, fp).map((p) => ({ x: p.an, y: p.valoare })) : [];
  const caen = last?.formulare.find((f) => f.formular === fp) ?? last?.formulare[0];
  return (
    <>
      {bilantLoading && <div className="kpi-grid">{Array.from({ length: 4 }, (_, i) => <div key={i} className="kpi"><Skeleton w="50%" /><Skeleton w="80%" h={30} /></div>)}</div>}
      {kpis.length > 0 && last && (
        <section aria-label={`Indicatori cheie ${last.an}`} className="stack-sm">
          <div className="row between"><h2 className="card-title">Indicatori cheie · {last.an} <Badge>{fp}</Badge></h2><button className="btn btn-sm btn-ghost" onClick={() => go('financiar')}>Toate datele financiare →</button></div>
          <div className="kpi-grid">{kpis.map((k) => (
            <div key={k.m.id} className="kpi glass live"><span className="k">{k.m.eticheta}</span>
              <span className="v">{k.m.tip === 'lei' ? fmtLei(k.cur!.valoare, compact) : fmtNum(k.cur!.valoare)}</span>{k.delta !== null && <Delta pct={k.delta} inverse={k.m.ton === 'negativ'} label={prev ? `față de ${prev.an}` : ''} />}</div>))}</div>
        </section>)}
      {cuiData && cuiData.bilant.length === 0 && <div className="glass card"><Empty icon={LineIcon} title="Fără situații financiare publicate">Pentru această firmă nu există depuneri în perioada 2008–2025 din sursa folosită.</Empty></div>}
      <div className="split">
        <div className="main-col stack-lg">
          <Card title="Identificare" icon={Briefcase}>
            <KV items={[
              ['Denumire', platitor?.denumire ?? onrc[0]?.denumire ?? anaf?.generale?.denumire], ['CUI', cui && <span className="mono">{cui}</span>], ['Nr. înmatriculare', onrc[0] && <span className="mono">{onrc[0].codInmatriculare}</span>],
              ['EUID', onrc[0] && <span className="mono">{onrc[0].euid}</span>], ['Formă juridică', onrc[0]?.formaJuridica], ['Data înmatriculării', onrc[0]?.dataInmatriculare],
              ['Stare fiscală', anaf?.stare === 'gasit' ? <span key="sf">{STARE_FISCALA[anaf.stareFiscala ?? 'necunoscut'].eticheta} <Sursa nume="ANAF v9" data={anaf.dataInterogare} /></span> : platitor && <span key="sn">{collapse(platitor.stare)} <Sursa nume="Snapshot ANAF 2026" /></span>], ['Plătitor TVA', anaf?.stare === 'gasit' ? STARE_TVA[anaf.tva ?? 'necunoscut'].eticheta : platitor && (isYes(platitor.tva) ? 'Da' : 'Nu')], ['Țara firmei-mamă', onrc[0]?.taraFirmaMama],
            ]} />
            {onrc.length > 1 && <Badge tone="amber">{onrc.length} înmatriculări asociate acestui CUI. Se afișează prima.</Badge>}
          </Card>
          {serieCa.some((p) => p.y !== null) && (
            <Card title="Cifra de afaceri pe ani" icon={LineIcon} actions={<button className="btn btn-sm btn-ghost" onClick={() => go('financiar')}>Detalii</button>}>
              <TrendChart tip="bar" altText={`Cifra de afaceri a firmei, ${serieCa.map((p) => `${p.x}: ${p.y ?? 'lipsă'} lei`).join(', ')}`} serii={[{ id: 'ca', nume: 'Cifra de afaceri netă', color: 'var(--accent)', puncte: serieCa }]} />
              {caen?.caen && <p className="muted">Activitate principală (CAEN {caen.caen}, versiunea {caen.caenVersiune === '2' ? '2008' : caen.caenVersiune}): {caen.caenDenumire ?? 'denumire indisponibilă pentru acest cod în nomenclator'}</p>}
            </Card>)}
        </div>
        <div className="side-col">
          <SemnaleCard anaf={anaf} stari={stari} aniBilant={ani.map((a) => a.an)} nrDosare={nrDosare} />
          <ContactCard platitor={platitor} onrc={onrc[0]} anaf={anaf} />
          <Card title="Stări ONRC" icon={ScrollText} actions={<button className="btn btn-sm btn-ghost" onClick={() => go('stari')}>Toate</button>}>
            {stari.length === 0 ? <p className="muted">Nicio stare specială înregistrată.</p> : <div className="stack-sm">{stari.slice(0, 4).map((s) => <div key={s.cod} className="row nw" style={{ alignItems: 'flex-start' }}><Badge tone={stareTon(s.denumire)}>{s.cod}</Badge><span>{collapse(s.denumire)}</span></div>)}</div>}
          </Card>
          <Card title="Sediu" icon={MapPin}><p>{adresaPlatitor(platitor) || adresaOnrc(onrc[0]) || 'Adresă nepublicată.'}</p>
            {(platitor?.strada || onrc[0]?.adrLocalitate) && <a className="btn btn-sm" target="_blank" rel="noreferrer noopener" href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(adresaPlatitor(platitor) || adresaOnrc(onrc[0]))}`}>Vezi pe hartă</a>}</Card>
        </div>
      </div>
    </>
  );
}

function StariTab({ stari, loading, error, cod }: { stari: InmatriculareResponse['stari']; loading: boolean; error: unknown; cod: string | null }) {
  if (loading) return <div className="glass card"><SkeletonLines n={4} /></div>;
  if (error) return error instanceof ApiError && error.status === 404 ? <div className="glass card"><Empty title="Fără înregistrare ONRC">Nu am găsit o înmatriculare pentru {cod ?? 'această firmă'}.</Empty></div> : <ErrorBox error={error} />;
  return (
    <Card title="Stări înregistrate la ONRC" icon={ScrollText}>
      {stari.length === 0 ? <Empty icon={ScrollText} title="Nicio stare specială">Firma nu are stări înregistrate (insolvență, radiere, reorganizare).</Empty>
        : <ol className="timeline">{stari.map((s) => (
          <li key={s.cod}><div className="row" style={{ gap: 8 }}><Badge tone={stareTon(s.denumire)}>{s.cod}</Badge></div><p style={{ marginTop: 4, fontWeight: 600 }}>{collapse(s.denumire) || 'Denumire indisponibilă'}</p></li>))}</ol>}
      <p className="hint">Datele calendaristice ale stărilor nu sunt publicate în sursă; ordinea este cea din registru.</p>
    </Card>
  );
}

function initials(n: string) { return collapse(n).split(' ').filter(Boolean).slice(0, 2).map((x) => x[0]).join('').toUpperCase() || '?'; }
function ReprezentantiTab({ inm, loading, error }: { inm?: InmatriculareResponse; loading: boolean; error: unknown }) {
  const structura = <StructuraCard inm={inm} />;
  if (loading) return <div className="glass card"><SkeletonLines n={4} /></div>;
  if (error && !inm) return <ErrorBox error={error} />;
  const rl = inm?.reprezentantiLegali ?? [], ri = inm?.reprezentantiIf ?? [], su = inm?.sucursale ?? [];
  if (!rl.length && !ri.length && !su.length) return <div className="stack-lg"><div className="glass card"><Empty icon={Users} title="Fără reprezentanți publicați">Registrul nu conține reprezentanți sau sucursale pentru această firmă.</Empty></div>{structura}</div>;
  return (
    <div className="stack-lg"><div className="grid-2">
      <Card title={`Reprezentanți legali (${rl.length})`} icon={Users}>
        {rl.length === 0 ? <p className="muted">Niciunul publicat.</p> : rl.map((r, i) => (
          <div className="person" key={i}><span className="avatar" aria-hidden="true">{initials(r.persoanaImputernicita)}</span>
            <div style={{ minWidth: 0 }}><div style={{ fontWeight: 700 }}>{titleCase(r.persoanaImputernicita)}</div>
              <div className="muted" style={{ fontSize: 14 }}>{collapse(r.calitate)}{r.dataNastere ? ` · născut ${r.dataNastere}` : ''}{r.localitate ? ` · ${titleCase(r.localitate)}` : ''}</div></div></div>))}
      </Card>
      <Card title={`Întreprinzători / IF (${ri.length})`} icon={Briefcase}>
        {ri.length === 0 ? <p className="muted">Niciunul publicat.</p> : ri.map((r, i) => (
          <div className="person" key={i}><span className="avatar" aria-hidden="true">{initials(r.nume)}</span>
            <div><div style={{ fontWeight: 700 }}>{titleCase(r.nume)}</div><div className="muted" style={{ fontSize: 14 }}>{collapse(r.calitate)}{r.dataNastere ? ` · născut ${r.dataNastere}` : ''}</div></div></div>))}
      </Card>
      {su.length > 0 && <Card title={`Sucursale în alte state membre (${su.length})`} icon={Building2} className="" >
        <div className="table-wrap"><table className="table"><thead><tr><th>Sucursală</th><th>Țara</th><th>Cod fiscal</th><th>EUID</th></tr></thead>
          <tbody>{su.map((s, i) => <tr key={i}><td>{s.denumireSucursala}</td><td>{s.tara}</td><td className="mono">{s.codFiscal}</td><td className="mono">{s.euid}</td></tr>)}</tbody></table></div></Card>}
    </div>{structura}</div>
  );
}
