import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, Search as SearchIcon, SearchX } from 'lucide-react';
import { useCautare } from '../api/hooks';
import { detectType, normalizeCui, tipEticheta } from '../lib/cui';
import { mergeRezultate } from '../lib/merge';
import { useSettings } from '../state/settings';
import { useLibrary } from '../state/library';
import { ResultCard } from '../components/Firma';
import { SearchBox } from '../components/SearchBox';
import { Badge, Empty, ErrorBox, PageHead, Seg, Skeleton } from '../components/ui';
import { useEffect } from 'react';

export default function SearchPage() {
  const [sp, setSp] = useSearchParams();
  const q = (sp.get('q') ?? '').trim();
  const limit = Number(sp.get('limit')) === 50 ? 50 : 20;
  const src = (sp.get('sursa') ?? 'toate') as 'toate' | 'anaf' | 'onrc';
  const sort = (sp.get('sort') ?? 'relevanta') as 'relevanta' | 'az';
  const { settings, set } = useSettings();
  const { cautari, clearCautari, addCautare } = useLibrary();
  const tip = detectType(q);
  const effective = tip === 'cui' ? normalizeCui(q) : q;
  const valid = tip !== 'gol' && tip !== 'prea-scurt';
  const res = useCautare(effective, limit, valid);
  useEffect(() => { if (valid && res.isSuccess) addCautare(q); }, [valid, res.isSuccess, q, addCautare]);

  const upd = (k: string, v: string, def: string) => setSp((p) => { const n = new URLSearchParams(p); if (v === def) n.delete(k); else n.set(k, v); return n; }, { replace: true });
  const list = useMemo(() => {
    let l = mergeRezultate(res.data?.rezultate ?? []);
    if (src !== 'toate') l = l.filter((f) => f.surse.includes(src));
    if (sort === 'az') l = [...l].sort((a, b) => a.denumire.localeCompare(b.denumire, 'ro'));
    return l;
  }, [res.data, src, sort]);
  const total = res.data?.rezultate.length ?? 0;

  return (
    <div className="page">
      <PageHead eyebrow="Căutare" title={q ? `Rezultate pentru „${q}”` : 'Caută o firmă'}>
        Caută după CUI (cu sau fără RO), denumire (minim 2 caractere) sau număr de înmatriculare, de exemplu J9/150/2018.
      </PageHead>
      <div className="glass card stack">
        <SearchBox big initial={q} id="page-search" autoFocus={!q} />
        {valid && <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="row"><Badge tone="blue">{tipEticheta[tip]}</Badge>
            <Seg label="Sursă" value={src} onChange={(v) => upd('sursa', v, 'toate')} options={[{ value: 'toate', label: 'Toate' }, { value: 'anaf', label: 'ANAF' }, { value: 'onrc', label: 'ONRC' }]} /></div>
          <div className="row">
            <Seg label="Sortare" value={sort} onChange={(v) => upd('sort', v, 'relevanta')} options={[{ value: 'relevanta', label: 'Relevanță' }, { value: 'az', label: 'A–Z' }]} />
            <Seg label="Număr rezultate" value={String(limit)} onChange={(v) => upd('limit', v, '20')} options={[{ value: '20', label: '20' }, { value: '50', label: '50' }]} />
            <Seg label="Vizualizare" value={settings.cardView} onChange={(v) => set('cardView', v)} options={[{ value: 'cards', label: <LayoutGrid size={18} aria-label="Carduri" /> }, { value: 'list', label: <List size={18} aria-label="Listă" /> }]} />
          </div>
        </div>}
      </div>

      {!q && (
        <div className="glass card">
          {cautari.length > 0 ? (
            <div className="stack"><div className="row between"><h2 className="card-title">Căutări recente</h2><button className="btn btn-sm btn-ghost" onClick={clearCautari}>Șterge lista</button></div>
              <div className="row">{cautari.map((c) => <button key={c.q} className="chip" onClick={() => setSp({ q: c.q })}><SearchIcon size={14} aria-hidden="true" />{c.q}</button>)}</div></div>
          ) : <Empty icon={SearchIcon} title="Începe o căutare">Scrie mai sus un CUI, o denumire sau un număr de înmatriculare.</Empty>}
        </div>
      )}
      {q && !valid && <div className="glass card"><Empty icon={SearchX} title="Mai scrie puțin">Pentru denumire sunt necesare cel puțin 2 caractere; un CUI are între 2 și 13 cifre.</Empty></div>}
      {valid && res.isPending && <div className={`results ${settings.cardView}`} aria-busy="true">{Array.from({ length: 6 }, (_, i) => <div key={i} className="result glass stack-sm"><Skeleton w={80} h={22} r={999} /><Skeleton w="70%" h={24} /><Skeleton w="40%" /></div>)}</div>}
      {valid && res.isError && <ErrorBox error={res.error} onRetry={() => void res.refetch()} />}
      {valid && res.isSuccess && (list.length === 0
        ? <div className="glass card"><Empty icon={SearchX} title="Nicio firmă găsită">{total > 0 ? 'Niciun rezultat pentru sursa aleasă. Încearcă „Toate”.' : 'Verifică ortografia sau încearcă doar începutul denumirii. Căutarea după denumire este pe prefix.'}</Empty></div>
        : <>
          <p className="muted" role="status">{list.length} {list.length === 1 ? 'firmă' : 'firme'}{total >= limit ? ` (limita de ${limit} a fost atinsă)` : ''}</p>
          <div className={`results ${settings.cardView}`}>{list.map((f) => <ResultCard key={f.key} f={f} />)}</div>
          {total >= limit && limit < 50 && <button className="btn" style={{ alignSelf: 'center' }} onClick={() => upd('limit', '50', '20')}>Arată până la 50 de rezultate</button>}
        </>)}
    </div>
  );
}
