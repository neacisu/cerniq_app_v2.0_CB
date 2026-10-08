import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Download, Heart, Search, Trash2, Upload, X } from 'lucide-react';
import { firmaKey, useLibrary, type Favorit } from '../state/library';
import { useUi } from '../state/ui';
import { ago } from '../lib/format';
import { download } from '../lib/export';
import { hrefFirma } from '../lib/merge';
import { CmpButton, FavButton } from '../components/Firma';
import { Empty, PageHead, Seg } from '../components/ui';

export function Favorite() {
  const { favorite, removeFavorit, setNota, importFavorite } = useLibrary();
  const { toast } = useUi();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'recent' | 'az'>('recent');
  const file = useRef<HTMLInputElement>(null);
  const list = favorite.filter((f) => !q || `${f.denumire} ${f.cui ?? ''} ${f.cod ?? ''} ${f.nota}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (sort === 'az' ? a.denumire.localeCompare(b.denumire, 'ro') : b.adaugat - a.adaugat));
  const onImport = async (f: File | undefined) => {
    if (!f) return;
    try {
      const data: unknown = JSON.parse(await f.text());
      const items = (Array.isArray(data) ? data : []) as Favorit[];
      const n = importFavorite(items.filter((x) => x && typeof x.denumire === 'string'));
      toast(n ? `${n} favorite importate` : 'Nimic nou de importat', n ? 'ok' : 'info');
    } catch { toast('Fișier invalid. Folosește un export JSON din această aplicație.', 'err'); }
    if (file.current) file.current.value = '';
  };
  return (
    <div className="page">
      <PageHead eyebrow="Biblioteca ta" title="Favorite" actions={<>
        <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => void onImport(e.target.files?.[0])} />
        <button className="btn" onClick={() => file.current?.click()}><Upload size={20} aria-hidden="true" /> Importă</button>
        <button className="btn" disabled={!favorite.length} onClick={() => download('favorite-firme.json', JSON.stringify(favorite, null, 2), 'application/json')}><Download size={20} aria-hidden="true" /> Exportă</button></>}>
        Firmele salvate rămân doar în acest browser. Adaugă o notă personală la fiecare.</PageHead>
      {favorite.length === 0 ? <div className="glass card"><Empty icon={Heart} title="Încă nu ai favorite" action={<Link to="/cauta" className="btn btn-primary"><Search size={18} aria-hidden="true" /> Caută o firmă</Link>}>Apasă inima de pe orice fișă sau rezultat ca să o găsești ușor aici.</Empty></div> : (
        <>
          <div className="row between glass card" style={{ padding: 14 }}>
            <div className="searchbox grow" style={{ minWidth: 220 }}><Search size={18} aria-hidden="true" /><input placeholder="Caută în favorite și note…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Caută în favorite" /></div>
            <Seg label="Sortare" value={sort} onChange={setSort} options={[{ value: 'recent', label: 'Recente' }, { value: 'az', label: 'A–Z' }]} />
          </div>
          {list.length === 0 ? <div className="glass card"><Empty icon={Search} title="Nimic găsit" /></div> : (
            <div className="grid-auto">{list.map((f) => (
              <article key={firmaKey(f)} className="glass live card stack">
                <div className="row between nw" style={{ alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 0 }}><h2 className="card-title" style={{ fontSize: 19 }}><Link to={hrefFirma(f)} className="truncate" style={{ whiteSpace: 'normal' }}>{f.denumire}</Link></h2>
                    <div className="mono faint" style={{ marginTop: 4 }}>{f.cui ? `CUI ${f.cui}` : f.cod}</div></div>
                  <FavButton f={f} />
                </div>
                <div className="field"><label htmlFor={`n-${firmaKey(f)}`}>Notă personală</label>
                  <textarea id={`n-${firmaKey(f)}`} className="textarea" defaultValue={f.nota} placeholder="Ex.: client potențial, de sunat luni" maxLength={500} onBlur={(e) => { if (e.target.value !== f.nota) { setNota(firmaKey(f), e.target.value); toast('Notă salvată'); } }} /></div>
                <div className="row between"><span className="faint">Salvată {ago(f.adaugat)}</span>
                  <div className="row"><CmpButton f={f} /><button className="btn btn-ghost btn-icon" aria-label={`Elimină ${f.denumire}`} onClick={() => removeFavorit(firmaKey(f))}><Trash2 size={20} aria-hidden="true" /></button></div></div>
              </article>))}</div>)}
        </>)}
    </div>
  );
}

export function Istoric() {
  const { istoric, clearIstoric, removeIstoric } = useLibrary();
  const { confirm } = useUi();
  return (
    <div className="page">
      <PageHead eyebrow="Biblioteca ta" title="Istoric" actions={istoric.length > 0 && <button className="btn" onClick={() => confirm({ titlu: 'Ștergi istoricul?', text: 'Lista firmelor vizitate recent va fi golită. Favoritele nu sunt afectate.', confirmare: 'Șterge istoricul', periculos: true, onConfirm: clearIstoric })}><Trash2 size={20} aria-hidden="true" /> Șterge tot</button>}>
        Ultimele 50 de firme deschise, păstrate doar în acest browser.</PageHead>
      {istoric.length === 0 ? <div className="glass card"><Empty icon={Clock} title="Istoricul este gol" action={<Link to="/cauta" className="btn btn-primary"><Search size={18} aria-hidden="true" /> Începe o căutare</Link>}>Firmele pe care le deschizi vor apărea aici.</Empty></div> : (
        <div className="stack-sm">{istoric.map((f) => (
          <div key={firmaKey(f)} className="glass live row nw" style={{ padding: '12px 14px 12px 20px', borderRadius: 'var(--r-lg)' }}>
            <Link to={hrefFirma(f)} className="grow" style={{ minWidth: 0 }}><div className="truncate" style={{ fontWeight: 700, fontSize: 17 }}>{f.denumire}</div><div className="mono faint">{f.cui ?? f.cod} · {ago(f.vizitat)}</div></Link>
            <FavButton f={f} /><CmpButton f={f} />
            <button className="btn btn-ghost btn-icon" aria-label={`Scoate ${f.denumire} din istoric`} onClick={() => removeIstoric(firmaKey(f))}><X size={20} aria-hidden="true" /></button>
          </div>))}</div>)}
    </div>
  );
}
