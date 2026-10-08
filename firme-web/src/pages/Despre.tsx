import { Link } from 'react-router-dom';
import { Database, FileWarning, Lock, ShieldCheck } from 'lucide-react';
import { Card, PageHead } from '../components/ui';

const LIMITE = [
  'Situațiile financiare acoperă doar 2008–2025. Nu există bilanțuri publicate înainte de 2008, iar o firmă are doar anii în care a depus.',
  'Băncile (WEB_INSTIT_DE_CREDIT) 2008–2018 și fondul de garantare înainte de 2014 nu sunt încărcate, pentru că sursa nu publică legenda coloanelor.',
  'Rândurile ONG cu număr greșit de câmpuri (10 845 la import) nu au fost încărcate. Sunt rânduri individuale, nu ani lipsă.',
  'CUI-urile cu rânduri conflictuale în sursă au fost excluse integral; duplicatele identice au fost păstrate o singură dată.',
  'Activitatea (CAEN) din bilanț este decodificată cu versiunea 2008. Codurile de 3 cifre nu primesc denumire (111 nu este 0111).',
  'Căutarea după denumire este pe prefix. Un prefix foarte scurt și comun poate depăși limita de 15 secunde a serverului.',
  'Un CUI din ONRC poate fi „0” sau gol; astfel de firme se pot deschide după numărul de înmatriculare, dar nu au bilanț legat.',
  'Starea ANAF și starea ONRC sunt lucruri diferite și nu se traduc una în alta.',
];
const SURSE = [
  { t: 'ANAF', d: 'Snapshot 2026 al plătitorilor: identificare, adresă, TVA, vector fiscal.', n: '2 647 765 plătitori' },
  { t: 'ONRC', d: 'Firme, stări, reprezentanți legali, întreprinzători individuali și sucursale în alte state membre.', n: '4 219 081 firme' },
  { t: 'Ministerul Finanțelor', d: 'Situații financiare anuale 2008–2025 publicate pe data.gov.ro, în model lung (indicator pe an și formular).', n: '14 169 607 depuneri' },
];

export default function Despre() {
  return (
    <div className="page">
      <PageHead eyebrow="Aplicație" title="Despre date și limite">De unde vin informațiile, cum sunt legate între ele și ce nu poți găsi aici.</PageHead>
      <div className="grid-auto">{SURSE.map((s) => (
        <div key={s.t} className="glass live card stack-sm"><h2 className="card-title"><Database size={20} aria-hidden="true" />{s.t}</h2><p className="muted">{s.d}</p><b>{s.n}</b></div>))}</div>
      <Card title="Cum sunt legate datele" icon={ShieldCheck}>
        <p>O firmă are trei identități, cu chei diferite. Aplicația le unește doar acolo unde legătura este sigură.</p>
        <ul className="stack-sm"><li><b>Plătitor ANAF</b>: după codul fiscal (CUI).</li><li><b>Înmatriculare ONRC</b>: după numărul de înmatriculare (ex. J9/150/2018). Același număr poate avea mai multe rânduri.</li><li><b>Bilanț</b>: după CUI, nu după câmpul CUI din ONRC, care poate fi 0.</li></ul>
      </Card>
      <Card title="Limite cunoscute" icon={FileWarning}><ul className="stack-sm" style={{ paddingLeft: 20, margin: 0 }}>{LIMITE.map((l) => <li key={l}>{l}</li>)}</ul></Card>
      <Card title="Confidențialitate" icon={Lock}>
        <p>Aplicația nu are conturi și nu trimite date personale. Favoritele, notele, istoricul și setările stau doar în browserul tău (localStorage) și pot fi șterse din <Link to="/setari" style={{ textDecoration: 'underline' }}>Setări</Link>. Interogările de căutare ajung la API-ul registrului pentru a returna rezultate.</p>
        <p className="hint">Informațiile sunt publice și au caracter informativ. Verifică întotdeauna datele critice în sursa oficială înainte de decizii juridice sau financiare.</p>
      </Card>
    </div>
  );
}
