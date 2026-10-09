import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Ban, Download, ExternalLink, Info, Network, RotateCcw, Search, Users, Workflow } from 'lucide-react';
import { useAnafLista, useGrup } from '../api/hooks';
import type { GrafGrup, NodFirmaGrup, NodPersoanaGrup, ParamGrup } from '../api/types';
import { collapse, titleCase } from '../lib/format';
import { hrefFirma } from '../lib/merge';
import { useUi } from '../state/ui';
import { GrupGraf } from '../components/GrupGraf';
import { PunctFiscal } from '../components/Fiscal';
import type { ExportSection } from '../components/dialogs';
import { Badge, Card, Empty, ErrorBox, Seg, Skeleton, Switch } from '../components/ui';

const cap = (s: string): string => (s ? s[0]!.toUpperCase() + s.slice(1) : s);
const PLAFOANE = [60, 120, 200, 400];

export function GrupTab({ cod, denumire }: { cod: string; cui: string | null; denumire: string }) {
  const { open, toast } = useUi();
  const [adancime, setAdancime] = useState<1 | 2>(1);
  const [plafon, setPlafon] = useState(120);
  const [profesionisti, setProfesionisti] = useState(false);
  const [slabe, setSlabe] = useState(true);
  const [fara, setFara] = useState<{ id: string; eticheta: string }[]>([]);
  const [faraRoluri, setFaraRoluri] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [filtruFirme, setFiltruFirme] = useState('');
  const [maxFirme, setMaxFirme] = useState(40);

  useEffect(() => { setFara([]); setFaraRoluri([]); setSelected(null); setAdancime(1); }, [cod]);
  const param: ParamGrup = useMemo(() => ({ adancime, plafon, profesionisti, slabe, fara: fara.map((f) => f.id), faraRoluri }), [adancime, plafon, profesionisti, slabe, fara, faraRoluri]);
  const q = useGrup(cod, param);
  const graf: GrafGrup | undefined = q.data;
  useEffect(() => { if (graf && selected && !graf.noduri.some((n) => n.id === selected) && !selected.startsWith('u:')) setSelected(null); }, [graf, selected]);

  const firme = useMemo(() => (graf?.noduri.filter((n): n is NodFirmaGrup => n.tip === 'firma') ?? []), [graf]);
  const persoane = useMemo(() => (graf?.noduri.filter((n): n is NodPersoanaGrup => n.tip === 'persoana') ?? []), [graf]);
  const fiscal = useAnafLista(firme.map((f) => f.cui).filter((c): c is string => !!c));
  const interogate = firme.filter((f) => f.cui && fiscal.data.get(f.cui)?.stare === 'gasit');
  const problematice = interogate.filter((f) => { const r = fiscal.data.get(f.cui!); return r?.stareFiscala !== 'activ' && r?.stareFiscala !== 'necunoscut'; });
  const nod = graf && selected ? graf.noduri.find((n) => n.id === selected) : undefined;
  const neconf = graf && selected?.startsWith('u:') ? graf.neconfirmate[Number(selected.slice(2))] : undefined;
  const muchiiSlabe = graf?.muchii.filter((m) => m.slaba).length ?? 0;
  const muchiiProf = graf?.muchii.filter((m) => m.strat === 'profesional').length ?? 0;
  const firmaDe = (id: string) => firme.find((f) => f.id === id);
  const persDe = (id: string) => persoane.find((p) => p.id === id);

  const scoate = (p: NodPersoanaGrup) => {
    setFara((l) => (l.some((x) => x.id === p.id) ? l : [...l, { id: p.id, eticheta: `${titleCase(p.nume)} · ${p.data}` }]));
    setSelected(null);
    toast(`${titleCase(p.nume)} a fost scoasă din graf`, 'info', { label: 'Anulează', run: () => setFara((l) => l.filter((x) => x.id !== p.id)) });
  };
  const exporta = () => {
    if (!graf) return;
    const sectiuni: ExportSection[] = [
      { id: 'firme', label: 'Firme din grup', rows: [['Nivel', 'Denumire', 'CUI', 'Nr. înmatriculare (toate)', 'CUI partajat'], ...firme.map((f) => [f.nivel, collapse(f.denumire), f.cui ?? '', f.coduri.join('; '), f.cuiPartajat ? 'da' : 'nu'])], json: firme },
      { id: 'persoane', label: 'Administratori (nume + dată naștere)', rows: [['Nume', 'Data nașterii', 'Dată slabă', 'Nr. firme (total)', 'Calități'], ...persoane.map((p) => [titleCase(p.nume), p.data, p.slaba ? 'da' : 'nu', p.nrFirme, p.calitati.join('; ')])], json: persoane },
      { id: 'legaturi', label: 'Legături persoană–firmă', rows: [['Persoană', 'Data nașterii', 'Firmă', 'Nr. înmatriculare', 'Calitate', 'Strat', 'Dată slabă'], ...graf.muchii.map((m) => { const p = persDe(m.persoana), f = firmaDe(m.firma); return [p ? titleCase(p.nume) : '', p?.data ?? '', f ? collapse(f.denumire) : '', f?.cod ?? '', m.calitate, m.strat, m.slaba ? 'da' : 'nu']; })], json: graf.muchii },
      { id: 'neconfirmate', label: 'Neconfirmați (fără dată de naștere sau dată slabă exclusă)', rows: [['Nume', 'Calitate', 'Motiv'], ...graf.neconfirmate.map((u) => [titleCase(u.nume), u.calitate, u.motiv === 'fara-data' ? 'fără dată de naștere' : 'dată slabă exclusă'])], json: graf.neconfirmate },
    ];
    open('export', { titlu: `${denumire}: grupul administratorilor`, fisier: `grup-${cod.replace(/[^A-Za-z0-9]+/g, '_')}`, sectiuni });
  };

  return (
    <div className="stack-lg">
      <div className="alerta info" role="note"><Info size={20} aria-hidden="true" />
        <div><b>Grupul este al administratorilor, nu al acționarilor.</b> Registrul încărcat nu conține asociați sau acționari. Două firme apar legate doar dacă au același administrator, identificat prin <b>nume + dată de naștere</b>; nu înseamnă că au același proprietar.</div></div>

      <Card title="Extindere din această firmă" icon={Workflow} actions={<button className="btn btn-sm" onClick={exporta} disabled={!graf}><Download size={16} aria-hidden="true" /> Exportă</button>}>
        <div className="row between">
          <div className="row">
            <Seg label="Adâncime" value={String(adancime)} onChange={(v) => setAdancime(v === '2' ? 2 : 1)} options={[{ value: '1', label: 'Nivelul 1' }, { value: '2', label: 'Nivelul 2' }]} />
            <label className="row" style={{ gap: 8 }}><span className="muted">Plafon</span>
              <select className="select" style={{ width: 'auto', minHeight: 40 }} value={plafon} onChange={(e) => setPlafon(Number(e.target.value))} aria-label="Plafon de noduri">{PLAFOANE.map((p) => <option key={p} value={p}>{p} noduri</option>)}</select></label>
          </div>
          <div className="row">
            <label className="row" style={{ gap: 8 }}><span className="muted">Date slabe (01/01)</span><Switch label="Arată legăturile cu dată slabă 01/01" checked={slabe} onChange={setSlabe} /></label>
            <label className="row" style={{ gap: 8 }}><span className="muted">Roluri profesionale</span><Switch label="Include lichidatori, administratori judiciari și reprezentanți ai persoanei juridice" checked={profesionisti} onChange={setProfesionisti} /></label>
          </div>
        </div>
        <p className="hint">Nivelul 1: celelalte firme ale administratorilor acestei firme. Nivelul 2: firmele legate prin administratorii acelora. Implicit contează doar „administrator” și „administrator si reprezentant”; lichidatorii, administratorii judiciari și reprezentanții persoanei juridice sunt un strat separat, pornit explicit.</p>
      </Card>

      {q.isPending ? <div className="glass card stack"><Skeleton h={360} r={26} /></div>
        : q.isError && !graf ? <ErrorBox error={q.error} onRetry={() => void q.refetch()} />
        : graf && (
          <div className="split">
            <div className="main-col stack-lg">
              <section className="glass card stack" aria-busy={q.isFetching}>
                <div className="row between">
                  <h2 className="card-title"><Network size={22} aria-hidden="true" />Graf <span className="muted" style={{ fontWeight: 500, fontSize: 15 }}>{firme.length} firme · {persoane.length} persoane · {graf.muchii.length} legături</span></h2>
                  {q.isFetching && <span className="muted" role="status">Se actualizează…</span>}
                </div>
                {graf.trunchiat && <div className="alerta" role="status"><AlertTriangle size={20} aria-hidden="true" />
                  <div>Afișarea s-a oprit la plafonul de {graf.parametri.plafon} noduri. Lipsesc <b>{graf.omise.firme}</b> firme{graf.omise.persoane > 0 && <> și <b>{graf.omise.persoane}</b> persoane</>}. Mărește plafonul, scoate o persoană sau un rol, ori deschide grupul dintr-o firmă mai mică.</div></div>}
                {muchiiSlabe > 0 && <div className="alerta" role="note"><AlertTriangle size={20} aria-hidden="true" />
                  <div><b>{muchiiSlabe}</b> legături se bazează pe o dată <b>01/01</b> (linie întreruptă, portocaliu). Data 01/01 este foarte frecventă: două persoane diferite cu același nume pot fi lipite. Oprește „Date slabe” pentru a le scoate.</div></div>}
                {firme.length === 1 && persoane.length <= 1 && <Empty icon={Users} title="Nicio altă firmă legată">Administratorii cu dată de naștere cunoscută nu mai apar la alte firme (în calitățile alese){graf.neconfirmate.length > 0 ? `. ${graf.neconfirmate.length} persoane fără dată confirmată nu pot fi unite cu alte firme.` : '.'}</Empty>}
                {interogate.length > 0 && <p className="row" role="status"><Badge tone={problematice.length > 0 ? 'red' : 'green'}>{problematice.length} din {interogate.length} firme cu stare fiscală ANAF problematică</Badge><span className="faint">(inactive, suspendate, în dizolvare sau radiate; {firme.length - interogate.length} fără date ANAF)</span></p>}
                <GrupGraf graf={graf} selected={selected} onSelect={setSelected} busy={q.isFetching} fiscal={fiscal.data} />
                <div className="legend-grup" aria-hidden="true">
                  <span><i className="c" style={{ background: 'var(--accent)' }} />Firma deschisă</span><span><i className="c" style={{ background: '#0ca678' }} />Alte firme</span>
                  <span><i className="d" style={{ background: '#7048e8' }} />Administrator</span><span><i className="d" style={{ background: '#e8890c' }} />Dată slabă</span>
                  <span><i className="c" style={{ border: '3px solid #e03131', background: 'transparent' }} />Stare fiscală problematică</span><span><i className="l" />Legătură</span><span><i className="l" style={{ borderTopStyle: 'dashed', borderColor: '#e8890c' }} />Dată slabă</span>
                  <span><i className="l" style={{ borderColor: '#ae3ec9' }} />Rol profesional</span><span><i className="l" style={{ borderTopStyle: 'dotted' }} />Neconfirmat</span>
                </div>
                <p className="hint">Trage pentru a muta, rotița sau butoanele pentru zoom, apasă un nod pentru detalii. Aceeași informație este în listele alăturate, pentru tastatură și cititoare de ecran.</p>
              </section>
            </div>

            <div className="side-col">
              <Card title="Detalii" icon={Info}>
                {!nod && !neconf && <p className="muted">Alege o firmă sau o persoană din graf sau din liste.</p>}
                {neconf && <div className="stack-sm"><b>{titleCase(neconf.nume)}</b><Badge tone="amber">neconfirmat</Badge>
                  <p className="muted">{cap(neconf.calitate)}. {neconf.motiv === 'fara-data' ? 'Fără dată de naștere în registru, deci nu poate fi unit cu alte firme.' : 'Are dată 01/01, exclusă din filtru; nu mai este unit cu alte firme.'}</p></div>}
                {nod?.tip === 'firma' && <div className="stack-sm"><b style={{ fontSize: 17 }}>{collapse(nod.denumire)}</b>
                  <div className="mono faint">{nod.cui ? `CUI ${nod.cui} · ` : ''}{nod.coduri.join(' · ')}</div>
                  {nod.coduri.length > 1 && <p className="hint">{nod.coduri.length} numere de înmatriculare pentru aceeași firmă (mutări de sediu între județe). CUI-ul și denumirea sunt aceleași, deci este un singur nod.</p>}
                  {nod.cuiPartajat && <div className="alerta" role="note"><AlertTriangle size={18} aria-hidden="true" /><div>Acest CUI apare în sursă și la o firmă cu altă denumire. Nu le-am contopit; verifică la ONRC.</div></div>}
                  {nod.cui && <div><PunctFiscal r={fiscal.data.get(nod.cui)} /></div>}
                  <div className="stack-sm">{graf.muchii.filter((m) => m.firma === nod.id).map((m, i) => { const p = persDe(m.persoana); return p ? <div key={i} className="row" style={{ gap: 6 }}><button className="chip" onClick={() => setSelected(p.id)}>{titleCase(p.nume)}</button><span className="muted">{cap(m.calitate)}</span>{m.slaba && <Badge tone="amber">dată slabă</Badge>}</div> : null; })}</div>
                  <div className="row"><Link className="btn btn-sm btn-primary" to={hrefFirma({ cui: nod.cui, cod: nod.cod })}><ExternalLink size={16} aria-hidden="true" /> Deschide fișa</Link>
                    {!nod.radacina && <Link className="btn btn-sm" to={`${hrefFirma({ cui: nod.cui, cod: nod.cod })}?tab=grup`}><Network size={16} aria-hidden="true" /> Grupul de aici</Link>}</div></div>}
                {nod?.tip === 'persoana' && <div className="stack-sm"><b style={{ fontSize: 17 }}>{titleCase(nod.nume)}</b>
                  <div className="row" style={{ gap: 6 }}><span className="mono">{nod.data}</span>{nod.slaba && <Badge tone="amber">dată slabă</Badge>}</div>
                  <p className="muted">{nod.calitati.map(cap).join(', ')} · administrează {nod.nrFirme} {nod.nrFirme === 1 ? 'firmă' : 'firme'} în total.</p>
                  <div className="stack-sm">{graf.muchii.filter((m) => m.persoana === nod.id).slice(0, 12).map((m, i) => { const f = firmaDe(m.firma); return f ? <button key={i} className="chip" style={{ justifyContent: 'flex-start' }} onClick={() => setSelected(f.id)}><span className="truncate">{collapse(f.denumire)}</span></button> : null; })}</div>
                  <button className="btn btn-sm" onClick={() => scoate(nod)}><Ban size={16} aria-hidden="true" /> Scoate din graf</button></div>}
              </Card>

              <Card title="Roluri" icon={Users}>
                <p className="hint">Dezactivează o calitate ca să dispară din graf.</p>
                <div className="row" role="group" aria-label="Filtru după calitate">
                  {graf.roluri.length === 0 && <span className="muted">Niciun rol în graf.</span>}
                  {graf.roluri.map((r) => {
                    const off = faraRoluri.includes(r.calitate);
                    return <button key={r.calitate} className={`chip${off ? '' : ' on'}`} aria-pressed={!off} onClick={() => setFaraRoluri((l) => (off ? l.filter((x) => x !== r.calitate) : [...l, r.calitate]))}>{cap(r.calitate)}{r.nr > 0 && <span className="mono faint">{r.nr}</span>}</button>;
                  })}
                </div>
                {!profesionisti && <p className="hint">Rolurile profesionale sunt oprite. Pornește „Roluri profesionale” pentru lichidatori, administratori judiciari etc.</p>}
                {muchiiProf > 0 && <Badge tone="violet">{muchiiProf} legături de tip profesional</Badge>}
              </Card>

              {fara.length > 0 && <Card title="Scoase din graf" icon={Ban}>
                <div className="stack-sm">{fara.map((f) => <div key={f.id} className="listrow"><span className="grow truncate">{f.eticheta}</span><button className="btn btn-sm" onClick={() => setFara((l) => l.filter((x) => x.id !== f.id))}><RotateCcw size={14} aria-hidden="true" /> Readu</button></div>)}</div></Card>}
            </div>
          </div>
        )}

      {graf && (
        <div className="grid-2">
          <Card title={`Persoane (${persoane.length})`} icon={Users}>
            {persoane.length === 0 ? <p className="muted">Nicio persoană cu dată de naștere confirmată.</p> : <div className="stack-sm" role="list">{persoane.map((p) => (
              <div key={p.id} role="listitem" className="listrow" aria-current={selected === p.id}>
                <button className="pick" onClick={() => setSelected(p.id)} aria-label={`Selectează ${titleCase(p.nume)}`}>
                  <div className="truncate" style={{ fontWeight: 600 }}>{titleCase(p.nume)}</div>
                  <div className="muted" style={{ fontSize: 13 }}><span className="mono">{p.data}</span>{p.slaba && ' · dată slabă'} · {p.nrFirme} {p.nrFirme === 1 ? 'firmă' : 'firme'} · {p.calitati.map(cap).join(', ')}</div></button>
                <button className="btn btn-ghost btn-icon btn-sm" aria-label={`Scoate ${titleCase(p.nume)} din graf`} onClick={() => scoate(p)}><Ban size={16} aria-hidden="true" /></button>
              </div>))}</div>}
            {graf.neconfirmate.length > 0 && <div className="stack-sm" style={{ marginTop: 6 }}><div className="label">Neconfirmați pe firma deschisă ({graf.neconfirmate.length})</div>
              {graf.neconfirmate.map((u, i) => <div key={i} className="listrow" aria-current={selected === `u:${i}`}><button className="pick" onClick={() => setSelected(`u:${i}`)}><div className="truncate">{titleCase(u.nume)}</div><div className="muted" style={{ fontSize: 13 }}>{cap(u.calitate)} · {u.motiv === 'fara-data' ? 'fără dată de naștere' : 'dată slabă exclusă'}</div></button><Badge tone="amber">neconfirmat</Badge></div>)}</div>}
          </Card>
          <Card title={`Firme (${firme.length})`} icon={Network}>
            <div className="searchbox"><Search size={18} aria-hidden="true" /><input placeholder="Filtrează firmele din grup…" value={filtruFirme} onChange={(e) => { setFiltruFirme(e.target.value); setMaxFirme(40); }} aria-label="Filtrează firmele din grup" /></div>
            {(() => {
              const f = firme.filter((x) => !filtruFirme || `${x.denumire} ${x.cui ?? ''} ${x.cod}`.toLowerCase().includes(filtruFirme.toLowerCase()));
              return <><div className="stack-sm" role="list">{f.slice(0, maxFirme).map((x) => (
                <div key={x.id} role="listitem" className="listrow" aria-current={selected === x.id}>
                  <button className="pick" onClick={() => setSelected(x.id)} aria-label={`Selectează ${collapse(x.denumire)}`}><div className="truncate" style={{ fontWeight: 600 }}>{collapse(x.denumire)}</div><div className="mono faint" style={{ fontSize: 13 }}>{x.cui ? `CUI ${x.cui} · ` : ''}{x.coduri.join(' · ')}{x.cuiPartajat ? ' · CUI partajat' : ''}</div></button>
                  {x.radacina ? <Badge tone="blue">deschisă</Badge> : <Link className="btn btn-ghost btn-icon btn-sm" to={hrefFirma({ cui: x.cui, cod: x.cod })} aria-label={`Deschide fișa ${collapse(x.denumire)}`}><ExternalLink size={16} aria-hidden="true" /></Link>}
                </div>))}</div>
                {f.length > maxFirme && <button className="btn" style={{ alignSelf: 'center' }} onClick={() => setMaxFirme((m) => m + 60)}>Arată încă {Math.min(60, f.length - maxFirme)}</button>}
                {f.length === 0 && <p className="muted">Nicio firmă potrivită.</p>}</>;
            })()}
          </Card>
        </div>
      )}
    </div>
  );
}
