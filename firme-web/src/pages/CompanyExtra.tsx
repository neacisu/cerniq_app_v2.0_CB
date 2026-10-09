import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Eye, Globe, History, Info, Lock, Mail, Phone, PieChart, ShieldCheck } from 'lucide-react';
import { useDosare } from '../api/hooks';
import type { AnafFirma, FirmaOnrc, InmatriculareResponse, Platitor, Stare, DosarLista } from '../api/types';
import { dataRo, isoDin, STARE_FISCALA } from '../lib/anaf';
import { hrefWeb, uneste, type Contact } from '../lib/contact';
import { construieste, faraData, type CategorieEv } from '../lib/cronologie';
import { Sursa } from '../components/Fiscal';
import { Badge, Card, Empty, SkeletonLines } from '../components/ui';

/* ───────── Contact: toate sursele, deduplicate fără pierdere ───────── */
export function ContactCard({ platitor, onrc, anaf }: { platitor: Platitor | null; onrc: FirmaOnrc | undefined; anaf: AnafFirma | undefined }) {
  const v9 = anaf?.stare === 'gasit' ? anaf : null;
  const contacte = useMemo(() => uneste([
    { tip: 'telefon', valoare: v9?.generale?.telefon, sursa: 'ANAF v9', data: v9?.dataInterogare }, { tip: 'fax', valoare: v9?.generale?.fax, sursa: 'ANAF v9', data: v9?.dataInterogare },
    { tip: 'telefon', valoare: platitor?.telefon, sursa: 'Snapshot ANAF 2026', data: isoDin(platitor?.dataPrelucrare) }, { tip: 'fax', valoare: platitor?.fax, sursa: 'Snapshot ANAF 2026', data: isoDin(platitor?.dataPrelucrare) },
    { tip: 'web', valoare: onrc?.web, sursa: 'ONRC' },
  ]), [v9, platitor, onrc]);
  const icon = { telefon: Phone, fax: Phone, web: Globe } as const;
  return (
    <Card title="Contact" icon={Phone}>
      {contacte.length === 0 ? <p className="muted">Nicio dată de contact în sursele încărcate.</p> : (
        <div className="stack-sm">{contacte.map((c: Contact) => { const I = icon[c.tip]; return (
          <div key={`${c.tip}-${c.canonic}`} className="contact">
            <I size={18} aria-hidden="true" />
            {c.tip === 'web' ? <a href={hrefWeb(c.valoare)} target="_blank" rel="noreferrer noopener" style={{ textDecoration: 'underline' }}>{c.valoare}</a>
              : c.tip === 'telefon' ? <a href={`tel:${c.canonic}`} className="mono" style={{ fontWeight: 600 }}>{c.valoare}</a> : <span className="mono">{c.valoare}</span>}
            {c.tip === 'fax' && <Badge>fax</Badge>}
            <span className="row" style={{ gap: 4, marginLeft: 'auto' }}>{c.surse.map((s) => <Sursa key={s.sursa} nume={s.sursa} data={s.data} />)}</span>
          </div>); })}</div>
      )}
      <div className="alerta info" style={{ marginTop: 6 }}><Mail size={20} aria-hidden="true" /><div><b>E-mail, telefoane mobile ale reprezentanților și pagini de social media nu există</b> în nicio sursă publică încărcată (ANAF, ONRC, MFP). Nu le afișăm și nu le deducem din alte date.</div></div>
      <p className="hint">Același număr din mai multe surse apare o singură dată, cu toate sursele lui.</p>
    </Card>
  );
}

/* ───────── Semnale: fapte cu sursă, fără scoruri ───────── */
export function SemnaleCard({ anaf, stari, aniBilant, nrDosare }: { anaf: AnafFirma | undefined; stari: Stare[]; aniBilant: number[]; nrDosare: number | null }) {
  const sem: { text: string; ton: 'red' | 'amber' | 'blue'; sursa: string; data?: string | null }[] = [];
  const a = anaf?.stare === 'gasit' ? anaf : null;
  if (a?.stareFiscala && STARE_FISCALA[a.stareFiscala].gravitate >= 2) sem.push({ text: `${STARE_FISCALA[a.stareFiscala].eticheta}${a.inactiv?.dataInactivare ? ` din ${dataRo(a.inactiv.dataInactivare)}` : ''}`, ton: 'red', sursa: 'ANAF v9', data: a.dataInterogare });
  const sf = a?.tvaDetaliu?.perioade.at(-1);
  if (a?.tva === 'anulat' && sf?.sfarsit) sem.push({ text: `Înregistrarea în scopuri de TVA a fost anulată la ${dataRo(sf.sfarsit)}`, ton: 'amber', sursa: 'ANAF v9', data: a.dataInterogare });
  for (const s of stari) if (/insolven|faliment|lichid|reorganiz|85\/2014|dizolv|radier/i.test(s.denumire ?? '')) sem.push({ text: (s.denumire ?? '').replace(/\s+/g, ' ').trim(), ton: 'amber', sursa: 'ONRC' });
  const ultim = aniBilant.length ? Math.max(...aniBilant) : null;
  if (ultim !== null && a?.inactiv?.dataInactivare && Number(a.inactiv.dataInactivare.slice(0, 4)) > ultim) sem.push({ text: `Ultimul bilanț depus este pe ${ultim}, înainte de inactivarea fiscală`, ton: 'blue', sursa: 'MFP + ANAF v9' });
  if (nrDosare && nrDosare > 0) sem.push({ text: `${nrDosare} dosare în portalul instanțelor, legate după nume`, ton: 'blue', sursa: 'Portal instanțe' });
  if (sem.length === 0) return null;
  return (
    <Card title="Semnale" icon={Eye}>
      <div className="stack-sm">{sem.map((s, i) => (
        <div key={i} className="row nw" style={{ alignItems: 'flex-start' }}><Badge tone={s.ton}><AlertTriangle size={13} aria-hidden="true" /></Badge><div className="grow"><div>{s.text}</div><Sursa nume={s.sursa} data={s.data} /></div></div>))}</div>
      <p className="hint">Fapte din surse publice, fără interpretare. Nu sunt un scor de risc.</p>
    </Card>
  );
}

/* ───────── Structura asociaților/acționarilor și beneficiarul real ───────── */
export function StructuraCard({ inm }: { inm: InmatriculareResponse | undefined }) {
  const asociati = (inm?.reprezentantiLegali ?? []).filter((r) => /asociat|actionar|acționar/i.test(r.calitate));
  return (
    <Card title="Asociați, acționari și beneficiar real" icon={PieChart}>
      <div className="alerta" role="note"><Lock size={20} aria-hidden="true" /><div><b>Aceste date nu sunt publicate în sursele încărcate.</b> Cota de participare a fiecărui asociat sau acționar și beneficiarul real nu apar în datele deschise ONRC, ANAF sau MFP. De aceea nu afișăm procente: orice cifră ar fi inventată.</div></div>
      {asociati.length > 0 && <div className="stack-sm"><div className="label">Calitate de asociat în registru (fără cotă)</div>{asociati.map((r, i) => <div className="listrow" key={i}><span className="grow">{r.persoanaImputernicita}</span><Badge>{r.calitate}</Badge></div>)}</div>}
      <div className="stack-sm">
        <div className="label">Ce poți vedea oficial</div>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
          <li><b>Asociați/acționari și cote:</b> certificatul constatator sau extrasul ONRC al firmei (cu taxă) și actele constitutive depuse la registru.</li>
          <li><b>Beneficiar real:</b> Registrul beneficiarilor reali (ONRC). După hotărârea CJUE din 22 noiembrie 2022, accesul public general a fost restrâns; verifică la ONRC condițiile curente de acces.</li>
          <li><b>Societăți listate:</b> participațiile semnificative sunt publicate de emitent și de ASF/BVB.</li>
        </ul>
      </div>
      <p className="hint">Administratorii și reprezentanții legali (cu calitatea lor) sunt afișați mai sus; ei nu sunt echivalentul acționarilor.</p>
    </Card>
  );
}

/* ───────── Cronologie unificată ───────── */
const CATEGORII: { id: CategorieEv; eticheta: string }[] = [
  { id: 'inmatriculare', eticheta: 'Înmatriculare' }, { id: 'fiscal', eticheta: 'Stare fiscală' }, { id: 'tva', eticheta: 'TVA' }, { id: 'efactura', eticheta: 'e-Factura' }, { id: 'bilant', eticheta: 'Bilanțuri' }, { id: 'dosar', eticheta: 'Dosare' },
];
export function CronologieTab({ cui, cod, onrc, anaf, aniBilant, stari }: { cui: string | null; cod: string | null; onrc: FirmaOnrc | undefined; anaf: AnafFirma | undefined; aniBilant: number[]; stari: Stare[] }) {
  const dosare = useDosare({ cui, cod }, { limit: 100, offset: 0 });
  const [off, setOff] = useState<CategorieEv[]>([]);
  const lista: DosarLista[] = dosare.data?.dosare ?? [];
  const { cu } = useMemo(() => construieste({ onrc, anaf, aniBilant, dosare: lista }), [onrc, anaf, aniBilant, lista]);
  const vizibile = cu.filter((e) => !off.includes(e.categorie));
  const peAn = useMemo(() => { const m = new Map<string, typeof vizibile>(); for (const e of vizibile) { const y = e.data.slice(0, 4); m.set(y, [...(m.get(y) ?? []), e]); } return [...m.entries()]; }, [vizibile]);
  const fara = faraData(stari);
  const lipsa: string[] = [];
  if (!anaf || anaf.stare !== 'gasit') lipsa.push('ANAF v9 (nu există date pentru acest CUI)');
  if (dosare.isPending) lipsa.push('dosare (se încarcă)');
  else if (dosare.data && dosare.data.totalFirma > 100) lipsa.push(`dosare: cele mai recente 100 din ${dosare.data.totalFirma}`);
  return (
    <div className="stack-lg">
      <Card title="Cronologie unificată" icon={History}>
        <p className="muted">Evenimente din toate sursele, într-o singură axă. Fiecare are sursa lui; nimic nu este contopit sau șters.</p>
        <div className="row" role="group" aria-label="Filtrează după tip">{CATEGORII.map((c) => { const n = cu.filter((e) => e.categorie === c.id).length; const on = !off.includes(c.id); return <button key={c.id} className={`chip${on ? ' on' : ''}`} aria-pressed={on} disabled={n === 0} onClick={() => setOff((l) => (on ? [...l, c.id] : l.filter((x) => x !== c.id)))}>{c.eticheta}<span className="mono faint">{n}</span></button>; })}</div>
        {lipsa.length > 0 && <div className="alerta info"><Info size={20} aria-hidden="true" /><div>Incomplet: {lipsa.join('; ')}.</div></div>}
        {dosare.isPending && cu.length === 0 ? <SkeletonLines n={6} /> : peAn.length === 0 ? <Empty icon={History} title="Niciun eveniment datat">Nu există evenimente cu dată pentru filtrele alese.</Empty> : (
          <div>{peAn.map(([an, ev]) => (
            <section key={an} aria-label={`Anul ${an}`}><h3 className="tl-an">{an}</h3>
              <ul className="tl">{ev.map((e, i) => <li key={`${e.data}-${i}`} className={`tl-ev ${e.ton ?? ''}`}><span className="d">{dataRo(e.data)}</span><div className="p"><div style={{ fontWeight: 600 }}>{e.titlu}</div>{e.detaliu && <div className="muted" style={{ fontSize: 14 }}>{e.detaliu}</div>}<Sursa nume={e.sursa} /></div></li>)}</ul></section>))}</div>)}
      </Card>
      {fara.length > 0 && <Card title="Fără dată publicată" icon={ShieldCheck}>
        <p className="muted">Stările din registrul ONRC nu au dată în datele deschise. Nu le atribuim una.</p>
        <div className="stack-sm">{fara.map((s, i) => <div key={i} className="listrow"><span className="grow">{s.titlu}</span><Sursa nume="ONRC" /></div>)}</div></Card>}
      {cod && <p className="hint">Dosarele din cronologie sunt legate după nume (vezi tab-ul Dosare, cu gradul fiecărei potriviri). Exercițiile financiare apar la 31 decembrie; data depunerii nu este publicată. <Link to={`?tab=dosare`} style={{ textDecoration: 'underline' }}>Deschide dosarele</Link></p>}
    </div>
  );
}
