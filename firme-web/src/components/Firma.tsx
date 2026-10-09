import { Link } from 'react-router-dom';
import { ArrowUpRight, GitCompareArrows, Heart } from 'lucide-react';
import type { FirmaRez } from '../lib/merge';
import { hrefFirma } from '../lib/merge';
import { firmaKey, MAX_COMPARE, useLibrary, type FirmaRef } from '../state/library';
import { useUi } from '../state/ui';
import { Badge } from './ui';
import { PunctFiscal } from './Fiscal';
import type { AnafRezumat } from '../api/types';

export function useFirmaActions() {
  const lib = useLibrary();
  const { toast } = useUi();
  return {
    isFav: (f: FirmaRef) => lib.isFavorit(firmaKey(f)),
    isCmp: (f: FirmaRef) => lib.inCompare(firmaKey(f)),
    fav: (f: FirmaRef) => {
      const wasFav = lib.isFavorit(firmaKey(f));
      lib.toggleFavorit(f);
      toast(wasFav ? 'Eliminată din favorite' : 'Adăugată la favorite', 'ok', wasFav ? { label: 'Anulează', run: () => lib.toggleFavorit(f) } : undefined);
    },
    cmp: (f: FirmaRef) => {
      if (!f.cui) { toast('Compararea cere o firmă cu CUI valid', 'err'); return; }
      const r = lib.toggleCompare(f);
      if (r === 'plin') toast(`Poți compara cel mult ${MAX_COMPARE} firme`, 'err');
      else toast(r === 'adaugat' ? 'Adăugată la comparare' : 'Scoasă din comparare', 'ok', r === 'adaugat' ? { label: 'Vezi', run: () => { location.assign('/comparare'); } } : undefined);
    },
  };
}

export function FavButton({ f, label }: { f: FirmaRef; label?: boolean }) {
  const a = useFirmaActions(); const on = a.isFav(f);
  return (
    <button className={`btn${label ? '' : ' btn-icon btn-ghost'}${on ? ' on' : ''}`} aria-pressed={on} aria-label={on ? 'Elimină din favorite' : 'Adaugă la favorite'} title={on ? 'Elimină din favorite' : 'Adaugă la favorite'} onClick={() => a.fav(f)}>
      <Heart size={20} aria-hidden="true" fill={on ? 'currentColor' : 'none'} />{label && (on ? 'În favorite' : 'Favorit')}
    </button>
  );
}
export function CmpButton({ f, label }: { f: FirmaRef; label?: boolean }) {
  const a = useFirmaActions(); const on = a.isCmp(f);
  return (
    <button className={`btn${label ? '' : ' btn-icon btn-ghost'}${on ? ' on' : ''}`} aria-pressed={on} aria-label={on ? 'Scoate din comparare' : 'Adaugă la comparare'} title={on ? 'Scoate din comparare' : 'Adaugă la comparare'} disabled={!f.cui} onClick={() => a.cmp(f)}>
      <GitCompareArrows size={20} aria-hidden="true" />{label && (on ? 'La comparare' : 'Compară')}
    </button>
  );
}

export function ResultCard({ f, anaf }: { f: FirmaRez; anaf?: AnafRezumat }) {
  const ref: FirmaRef = { cui: f.cui, cod: f.cod, denumire: f.denumire };
  return (
    <article className="result glass live">
      <div className="grow stack-sm" style={{ minWidth: 220 }}>
        <div className="row" style={{ gap: 6 }}>
          {f.surse.includes('anaf') && <Badge tone="blue">ANAF</Badge>}{f.surse.includes('onrc') && <Badge tone="green">ONRC</Badge>}
          <PunctFiscal r={anaf} />
        </div>
        <h3><Link to={hrefFirma(f)} className="stretch">{f.denumire}</Link></h3>
        <div className="meta">{f.cui && <span className="mono">CUI {f.cui}</span>}{f.cod && <span className="mono">{f.cod}</span>}</div>
      </div>
      <div className="actions">
        <FavButton f={ref} /><CmpButton f={ref} />
        <Link to={hrefFirma(f)} className="btn btn-sm">Deschide <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
    </article>
  );
}
