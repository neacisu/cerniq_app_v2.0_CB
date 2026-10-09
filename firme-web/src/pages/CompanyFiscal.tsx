import { useMemo } from 'react';
import { AlertTriangle, CalendarClock, Landmark, MapPin, Receipt, ShieldAlert, ShieldCheck, Split, BadgeCheck, GitCompareArrows, Database } from 'lucide-react';
import type { AnafFirma, AdresaAnaf, FirmaOnrc, Platitor } from '../api/types';
import { dataRo, isoDin, mesajStare, STARE_FISCALA, STARE_TVA } from '../lib/anaf';
import { adresaOnrc, adresaPlatitor, collapse, isYes, titleCase } from '../lib/format';
import { normaText } from '../lib/text';
import { Prospetime, Sursa } from '../components/Fiscal';
import { Badge, Card, Empty, ErrorBox, KV, SkeletonLines } from '../components/ui';
import type { Ton } from '../lib/anaf';

const adresaV9 = (a: AdresaAnaf | undefined): string => (a ? [a.strada && `${a.strada}${a.numar ? ` nr. ${a.numar}` : ''}`, a.detalii, a.localitate, a.judet && `jud. ${titleCase(a.judet)}`, a.codPostal].filter(Boolean).join(', ') : '');

interface Banda { id: string; eticheta: string; ton: Ton | 'gray'; perioade: { de: string; pana: string | null; titlu: string }[] }

function Frescă({ benzi, aniBilant }: { benzi: Banda[]; aniBilant: number[] }) {
  const toate = benzi.flatMap((b) => b.perioade.map((p) => p.de));
  const de = toate.length ? toate.reduce((m, x) => (x < m ? x : m)) : null;
  if (!de) return <p className="muted">Nu există perioade fiscale înregistrate.</p>;
  const an0 = Number(de.slice(0, 4)), an1 = new Date().getFullYear();
  const t0 = Date.UTC(an0, 0, 1), t1 = Date.UTC(an1 + 1, 0, 1);
  const x = (iso: string) => ((Date.parse(iso) - t0) / (t1 - t0)) * 100;
  const ani = Array.from({ length: an1 - an0 + 1 }, (_, i) => an0 + i);
  const pas = ani.length > 14 ? 2 : 1;
  return (
    <div className="fresca" role="img" aria-label={`Cronologie fiscală: ${benzi.map((b) => `${b.eticheta}: ${b.perioade.map((p) => `${dataRo(p.de)} – ${p.pana ? dataRo(p.pana) : 'în prezent'}`).join(', ') || 'fără perioade'}`).join('; ')}`}>
      {benzi.map((b) => (
        <div className="banda" key={b.id}>
          <span className="eticheta">{b.eticheta}</span>
          <div className="pista">
            {b.perioade.map((p, i) => { const s = x(p.de), e = p.pana ? x(p.pana) : 100; return <span key={i} className={`bara ${b.ton ?? ''}`} style={{ left: `${s}%`, width: `${Math.max(0.6, e - s)}%` }} title={`${p.titlu}: ${dataRo(p.de)} – ${p.pana ? dataRo(p.pana) : 'în prezent'}`} />; })}
          </div>
        </div>
      ))}
      <div className="banda">
        <span className="eticheta">Bilanțuri</span>
        <div className="pista">{aniBilant.map((a) => <span key={a} className="reper" style={{ left: `${x(`${a}-12-31`)}%` }} title={`Situații financiare ${a}`} />)}</div>
      </div>
      <div className="banda"><span className="eticheta" /><div className="axa">{ani.filter((_, i) => i % pas === 0).map((a) => <span key={a} style={{ left: `${x(`${a}-01-01`)}%` }}>{a}</span>)}</div></div>
    </div>
  );
}

export function FiscalTab({ anaf, loading, error, snapshot, onrc, aniBilant }: { anaf: AnafFirma | undefined; loading: boolean; error: unknown; snapshot: Platitor | null; onrc: FirmaOnrc | undefined; aniBilant: number[] }) {
  const benzi = useMemo<Banda[]>(() => {
    if (!anaf || anaf.stare !== 'gasit') return [];
    const b: Banda[] = [
      { id: 'tva', eticheta: 'Plătitor TVA', ton: 'violet', perioade: (anaf.tvaDetaliu?.perioade ?? []).filter((p) => p.inceput).map((p) => ({ de: p.inceput!, pana: p.sfarsit, titlu: 'Înregistrat în scopuri de TVA' })) },
      { id: 'inc', eticheta: 'TVA la încasare', ton: 'violet', perioade: anaf.tvaIncasare?.inceput ? [{ de: anaf.tvaIncasare.inceput, pana: anaf.tvaIncasare.sfarsit, titlu: 'TVA la încasare' }] : [] },
      { id: 'split', eticheta: 'Split TVA', ton: 'violet', perioade: anaf.split?.inceput ? [{ de: anaf.split.inceput, pana: anaf.split.anulare, titlu: 'Split TVA' }] : [] },
      { id: 'ina', eticheta: 'Inactiv fiscal', ton: 'red', perioade: anaf.inactiv?.dataInactivare ? [{ de: anaf.inactiv.dataInactivare, pana: anaf.inactiv.dataReactivare, titlu: 'Inactiv fiscal' }] : [] },
      { id: 'efa', eticheta: 'e-Factura', ton: 'green', perioade: anaf.eFactura?.data ? [{ de: anaf.eFactura.data, pana: null, titlu: 'Înregistrat în RO e-Factura' }] : [] },
    ];
    return b.filter((x) => x.perioade.length > 0);
  }, [anaf]);

  if (loading) return <div className="glass card"><SkeletonLines n={6} /></div>;
  if (error) return <ErrorBox error={error} />;
  const msg = anaf ? mesajStare(anaf) : { titlu: 'Fără CUI valid', text: 'Datele fiscale ANAF se leagă de CUI; această înmatriculare nu are un CUI utilizabil.' };
  const snapshotCard = snapshot && <SnapshotCard p={snapshot} />;
  if (msg || !anaf || anaf.stare !== 'gasit') return (<div className="stack-lg"><div className="glass card"><Empty icon={ShieldAlert} title={msg?.titlu ?? 'Fără date ANAF'}>{msg?.text}</Empty></div>{snapshotCard}</div>);

  const sf = STARE_FISCALA[anaf.stareFiscala ?? 'necunoscut'], tva = STARE_TVA[anaf.tva ?? 'necunoscut'];
  const g = anaf.generale!;
  const perioada = anaf.tvaDetaliu?.perioade[0];
  const adr = [
    { eticheta: 'Sediu social (ANAF v9)', valoare: adresaV9(anaf.sediu), sursa: 'ANAF v9' },
    { eticheta: 'Domiciliu fiscal (ANAF v9)', valoare: adresaV9(anaf.domiciliu), sursa: 'ANAF v9' },
    { eticheta: 'Adresă în datele generale (ANAF v9)', valoare: g.adresa ?? '', sursa: 'ANAF v9' },
    { eticheta: 'Adresă ONRC', valoare: adresaOnrc(onrc), sursa: 'ONRC' },
    { eticheta: 'Adresă în snapshot ANAF 2026', valoare: adresaPlatitor(snapshot), sursa: 'Snapshot ANAF 2026' },
  ].filter((a) => a.valoare);
  const ref = normaText(adr[0]?.valoare ?? '');
  const maiVechi = anaf.discrepante ?? [];

  return (
    <div className="stack-lg">
      {maiVechi.length > 0 && (
        <div className="alerta" role="note"><AlertTriangle size={20} aria-hidden="true" />
          <div><b>ANAF v9 diferă de snapshot-ul ANAF 2026.</b> Pentru stare folosim ANAF v9 (interogat direct, cu dată). Valorile din snapshot rămân vizibile mai jos, nu sunt șterse.
            <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>{maiVechi.map((d, i) => <li key={i}><b>{{ stare: 'Stare', tva: 'TVA', denumire: 'Denumire', adresa: 'Adresă' }[d.camp]}</b>: ANAF v9 „{d.v9}” · snapshot „{d.snapshot}”</li>)}</ul></div></div>
      )}

      <Card title="Stare curentă" icon={Landmark} actions={<Prospetime data={anaf.dataInterogare} />}>
        <div className="fiscal-grid">
          <div className={`stare-card ${sf.ton ?? ''}`}><span className="k"><ShieldCheck size={16} aria-hidden="true" />Activitate fiscală</span><b>{sf.eticheta}</b>
            <p>{sf.descriere}</p>
            {anaf.inactiv?.dataInactivare && <p className="mono">Inactiv din {dataRo(anaf.inactiv.dataInactivare)}{anaf.inactiv.dataPublicare && anaf.inactiv.dataPublicare !== anaf.inactiv.dataInactivare ? `, publicat ${dataRo(anaf.inactiv.dataPublicare)}` : ''}</p>}
            {anaf.inactiv?.dataReactivare && <p className="mono">Reactivat la {dataRo(anaf.inactiv.dataReactivare)}</p>}
            {anaf.inactiv?.dataRadiere && <p className="mono">Radiat la {dataRo(anaf.inactiv.dataRadiere)}</p>}
            {g.stareInregistrare && <p className="faint">Înregistrare: {collapse(g.stareInregistrare)}</p>}</div>
          <div className={`stare-card ${tva.ton ?? ''}`}><span className="k"><Receipt size={16} aria-hidden="true" />TVA</span><b>{tva.eticheta}</b>
            {perioada?.inceput && <p className="mono">Din {dataRo(perioada.inceput)}{perioada.sfarsit ? ` până la ${dataRo(perioada.sfarsit)}` : ''}</p>}
            {perioada?.mesaj && <p className="faint">{perioada.mesaj}</p>}
            {(anaf.tvaDetaliu?.perioade.length ?? 0) > 1 && <p className="faint">{anaf.tvaDetaliu!.perioade.length} perioade în total; vezi cronologia.</p>}</div>
          <div className={`stare-card ${anaf.tvaIncasare?.activ ? 'violet' : ''}`}><span className="k"><CalendarClock size={16} aria-hidden="true" />TVA la încasare</span><b>{anaf.tvaIncasare?.activ ? 'Activ' : anaf.tvaIncasare?.inceput ? 'Încheiat' : 'Nu'}</b>
            {anaf.tvaIncasare?.inceput && <p className="mono">Din {dataRo(anaf.tvaIncasare.inceput)}{anaf.tvaIncasare.sfarsit ? ` până la ${dataRo(anaf.tvaIncasare.sfarsit)}` : ''}</p>}
            {anaf.tvaIncasare?.tipAct && <p className="faint">Act: {anaf.tvaIncasare.tipAct}{anaf.tvaIncasare.publicare ? `, publicat ${dataRo(anaf.tvaIncasare.publicare)}` : ''}</p>}</div>
          <div className={`stare-card ${anaf.split?.activ ? 'violet' : ''}`}><span className="k"><Split size={16} aria-hidden="true" />Split TVA</span><b>{anaf.split?.activ ? 'Activ' : anaf.split?.inceput ? 'Anulat' : 'Nu'}</b>
            {anaf.split?.inceput && <p className="mono">Din {dataRo(anaf.split.inceput)}{anaf.split.anulare ? ` până la ${dataRo(anaf.split.anulare)}` : ''}</p>}</div>
          <div className={`stare-card ${anaf.eFactura?.inregistrat ? 'green' : ''}`}><span className="k"><BadgeCheck size={16} aria-hidden="true" />RO e-Factura</span><b>{anaf.eFactura?.inregistrat ? 'Înregistrat' : 'Neînregistrat'}</b>
            {anaf.eFactura?.data && <p className="mono">Din {dataRo(anaf.eFactura.data)}</p>}</div>
        </div>
      </Card>

      <Card title="Cronologie fiscală" icon={CalendarClock}>
        <Frescă benzi={benzi} aniBilant={aniBilant} />
        <p className="hint">Barele arată perioadele raportate de ANAF; punctele de jos sunt exercițiile financiare cu bilanț depus. Așa se vede ce s-a întâmplat fiscal față de ultimul bilanț publicat.</p>
        {(anaf.tvaDetaliu?.perioade.length ?? 0) > 0 && (
          <div className="table-wrap"><table className="table"><thead><tr><th>#</th><th>Început TVA</th><th>Sfârșit</th><th>Anulat la</th><th>Motiv</th></tr></thead>
            <tbody>{anaf.tvaDetaliu!.perioade.map((p) => <tr key={p.ordine}><td className="mono">{p.ordine + 1}</td><td>{dataRo(p.inceput) || '—'}</td><td>{dataRo(p.sfarsit) || 'în curs'}</td><td>{dataRo(p.dataAnulare) || '—'}</td><td className="muted">{p.mesaj ?? '—'}</td></tr>)}</tbody></table></div>
        )}
      </Card>

      <Card title="Adrese din toate sursele" icon={MapPin}>
        <p className="muted">Nu alegem o adresă „corectă”: le arătăm pe toate, cu sursa. O linie marcată „diferă” nu seamănă cu sediul social ANAF.</p>
        <div className="stack-sm">{adr.map((a, i) => { const dif = i > 0 && normaText(a.valoare) !== ref; return (
          <div key={a.eticheta} className="listrow" style={{ alignItems: 'flex-start' }}>
            <div className="grow"><div className="label">{a.eticheta}</div><div>{a.valoare}</div></div>
            <div className="row" style={{ gap: 6 }}><Sursa nume={a.sursa} />{dif && <Badge tone="amber">diferă</Badge>}</div></div>); })}</div>
      </Card>

      <div className="grid-2">
        <Card title="Date de identificare ANAF v9" icon={Landmark}>
          <KV items={[['Denumire', g.denumire], ['Nr. registrul comerțului', g.nrRegCom && <span className="mono" key="r">{g.nrRegCom}</span>], ['Cod CAEN (ANAF)', g.codCaen && <span className="mono" key="c">{g.codCaen}</span>], ['Telefon', g.telefon], ['Fax', g.fax], ['Cod poștal', g.codPostal], ['Organ fiscal competent', g.organFiscal],
            ['Forma de proprietate', g.formaProprietate], ['Forma de organizare', g.formaOrganizare], ['Forma juridică', g.formaJuridica], ['Act de înregistrare', g.act], ['IBAN', g.iban && <span className="mono" key="i">{g.iban}</span>], ['Înregistrat la', g.dataInregistrare && dataRo(g.dataInregistrare)]]} />
        </Card>
        <Card title="Surse și acuratețe" icon={Database}>
          <p className="muted">CUI-ul apare în aceste straturi. Nimic nu este contopit: fiecare strat își păstrează valorile.</p>
          <div className="stack-sm">{(anaf.surse ?? []).map((s) => (
            <div key={`${s.sursa}-${s.codInmatriculare}`} className="listrow"><div className="grow"><b>{{ od_firme: 'Registrul ONRC (firme)', platitori: 'Snapshot ANAF 2026 (plătitori)', sf_depunere: 'Situații financiare MFP' }[s.sursa] ?? s.sursa}</b>
              <div className="muted" style={{ fontSize: 13 }}>{s.nrRanduri} {s.nrRanduri === 1 ? 'rând' : 'rânduri'}{s.codInmatriculare ? ` · ${s.codInmatriculare}` : ''}</div></div>
              {s.adreseDiferite && <Badge tone="amber">adrese diferite</Badge>}{s.denumiriDiferite && <Badge tone="amber">denumiri diferite</Badge>}</div>))}
            {(anaf.surse?.length ?? 0) === 0 && <div className="alerta info"><GitCompareArrows size={20} aria-hidden="true" /><div>CUI-ul a fost descoperit doar prin scanarea ANAF: nu există în registrul ONRC, în snapshot sau în situațiile financiare.</div></div>}
          </div>
          <p className="hint">Interogat la {dataRo(anaf.dataInterogare)}. Stratul ANAF v9 se reîmprospătează prin interogări noi, iar datele vechi se păstrează pe data interogării.</p>
        </Card>
      </div>
      {snapshotCard}
    </div>
  );
}

function SnapshotCard({ p }: { p: Platitor }) {
  const vec = Object.entries(p).filter(([k]) => /^(imp|cont|accize)\d+/i.test(k)).map(([k, v]) => [k.replace(/^(imp|cont|accize)/i, (m) => m.toUpperCase()), collapse(v)] as const);
  return (
    <Card title="Snapshot ANAF 2026 (sursă secundară)" icon={Landmark} actions={<Sursa nume="Snapshot ANAF 2026" data={isoDin(p.dataPrelucrare)} />}>
      <p className="muted">Starea din acest snapshot poate fi depășită; pentru stare prevalează ANAF v9. Păstrăm aici vectorul fiscal și datele care nu există în v9.</p>
      <KV items={[['Stare în snapshot', collapse(p.stare)], ['Plătitor TVA în snapshot', isYes(p.tva) ? 'Da' : 'Nu'], ['Tip unitate', p.tipUnitate], ['Tip contribuabil', p.tipContrib], ['Cod fiscal părinte', p.codFiscalParinte],
        ['Număr registrul comerțului', p.judetComert && `${p.judetComert}/${p.nrComert}/${p.anComert}`], ['Data stării', p.dataStare], ['Data radierii', p.dataRadiere], ['Ultima prelucrare', p.dataPrelucrare], ['Telefon', p.telefon], ['Fax', p.fax]]} />
      <details><summary style={{ cursor: 'pointer', fontWeight: 600, padding: '6px 0' }}>Vector fiscal ({vec.filter(([, v]) => v === 'DA').length} obligații active)</summary>
        <div className="vector" style={{ marginTop: 8 }}>{vec.map(([k, v]) => <div key={k} className={v === 'DA' ? 'yes' : ''}><span className="mono">{k}</span><b>{v || '—'}</b></div>)}</div></details>
    </Card>
  );
}
