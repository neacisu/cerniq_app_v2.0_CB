import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Building2, Clock, GitCompareArrows, Heart, LineChart, ScrollText, ShieldCheck } from 'lucide-react';
import { SearchBox } from '../components/SearchBox';
import { Card, Badge } from '../components/ui';
import { useLibrary } from '../state/library';
import { hrefFirma } from '../lib/merge';
import { ago } from '../lib/format';
import { pathFirma } from '../lib/cui';

const STATS: [string, string][] = [
  ['4 219 081', 'firme în registrul ONRC'], ['2 647 765', 'plătitori identificați de ANAF'],
  ['14 169 607', 'depuneri de situații financiare'], ['2008–2025', 'ani de bilanțuri acoperiți'],
];

export default function Home() {
  const { favorite, istoric } = useLibrary();
  return (
    <div className="page">
      <section className="hero">
        <span className="chip glass"><ShieldCheck size={16} aria-hidden="true" /> Date publice ANAF · ONRC · Ministerul Finanțelor</span>
        <h1>Orice firmă din România, <em>într-o singură căutare.</em></h1>
        <p className="lead">Identitate fiscală, stări ONRC, reprezentanți legali și bilanțuri pe ani, din 2008 până în 2025, într-o interfață rapidă pe orice ecran.</p>
        <div className="searchwrap"><SearchBox big id="hero-search" /></div>
        <div className="row" style={{ justifyContent: 'center' }}>
          <span className="muted">Încearcă:</span>
          <Link className="chip mono" to={pathFirma('38926034')}>38926034</Link>
          <Link className="chip mono" to="/inmatriculare/J9/150/2018">J9/150/2018</Link>
          <Link className="chip" to="/cauta?q=QBIKNEF">QBIKNEF</Link>
        </div>
      </section>

      <section className="stat-grid" aria-label="Volume de date">
        {STATS.map(([v, l]) => <div key={l} className="stat glass live"><b>{v}</b><span>{l}</span></div>)}
      </section>

      {(istoric.length > 0 || favorite.length > 0) && (
        <div className="grid-2">
          {istoric.length > 0 && (
            <Card title="Vizitate recent" icon={Clock} actions={<Link className="btn btn-sm btn-ghost" to="/istoric">Tot istoricul <ArrowRight size={16} aria-hidden="true" /></Link>}>
              <ul className="stack-sm" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {istoric.slice(0, 4).map((f) => (
                  <li key={f.cui ?? f.cod}><Link className="row nw glass-flat lift" style={{ padding: '10px 14px' }} to={hrefFirma(f)}>
                    <Building2 size={20} aria-hidden="true" /><span className="grow truncate" style={{ fontWeight: 600 }}>{f.denumire}</span><span className="faint">{ago(f.vizitat)}</span></Link></li>))}
              </ul>
            </Card>)}
          {favorite.length > 0 && (
            <Card title="Favorite" icon={Heart} actions={<Link className="btn btn-sm btn-ghost" to="/favorite">Toate <ArrowRight size={16} aria-hidden="true" /></Link>}>
              <ul className="stack-sm" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {favorite.slice(0, 4).map((f) => (
                  <li key={f.cui ?? f.cod}><Link className="row nw glass-flat lift" style={{ padding: '10px 14px' }} to={hrefFirma(f)}>
                    <Heart size={20} aria-hidden="true" /><span className="grow truncate" style={{ fontWeight: 600 }}>{f.denumire}</span><span className="mono faint">{f.cui ?? f.cod}</span></Link></li>))}
              </ul>
            </Card>)}
        </div>
      )}

      <section className="bento" aria-label="Ce poți face">
        <Card className="lift"><div className="ico"><LineChart size={24} aria-hidden="true" /></div><h2 className="card-title">Bilanț pe ani</h2>
          <p className="muted">Cifra de afaceri, profitul și salariații, cu grafic și variație anuală. Denumirile vin din legenda fiecărui an, ca să nu confunzi indicatorii.</p></Card>
        <Card className="lift"><div className="ico"><ScrollText size={24} aria-hidden="true" /></div><h2 className="card-title">Stări și reprezentanți</h2>
          <p className="muted">Insolvență, radiere sau reorganizare, plus reprezentanții legali și sucursalele din registrul ONRC.</p></Card>
        <Card className="lift"><div className="ico"><GitCompareArrows size={24} aria-hidden="true" /></div><h2 className="card-title">Compară până la 4 firme</h2>
          <p className="muted">Pune firmele una lângă alta pe același indicator, pe toți anii disponibili.</p>
          <Link to="/comparare" className="btn btn-sm" style={{ alignSelf: 'flex-start' }}>Deschide compararea <ArrowRight size={16} aria-hidden="true" /></Link></Card>
        <Card className="lift"><div className="ico"><BookOpen size={24} aria-hidden="true" /></div><h2 className="card-title">Nomenclatoare CAEN</h2>
          <p className="muted">Răsfoiește clasificarea activităților în patru versiuni și toate stările ONRC.</p>
          <Link to="/nomenclatoare" className="btn btn-sm" style={{ alignSelf: 'flex-start' }}>Răsfoiește <ArrowRight size={16} aria-hidden="true" /></Link></Card>
      </section>

      <section className="glass card row between" style={{ gap: 16 }}>
        <div className="stack-sm"><h2 className="card-title">Date oficiale, actualizate la 8 octombrie 2026</h2>
          <p className="muted">Surse: snapshot ANAF 2026, registrul ONRC și situațiile financiare MFP (data.gov.ro).</p></div>
        <div className="row"><Badge tone="green">Doar citire</Badge><Link className="btn" to="/despre">Despre date și limite</Link></div>
      </section>
    </div>
  );
}
