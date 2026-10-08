import { Check, RotateCcw, Trash2 } from 'lucide-react';
import { ACCENTS, useSettings } from '../state/settings';
import { useLibrary } from '../state/library';
import { useUi } from '../state/ui';
import { Seg, Switch } from './ui';

export function SettingsForm({ full }: { full?: boolean }) {
  const { settings, set, reset } = useSettings();
  const { clearAll, favorite, istoric } = useLibrary();
  const { confirm, toast } = useUi();
  return (
    <div className="stack" style={{ gap: 22 }}>
      <div className="field"><span className="label">Temă</span>
        <Seg label="Temă" value={settings.theme} onChange={(v) => set('theme', v)} options={[{ value: 'auto', label: 'Automată' }, { value: 'light', label: 'Luminoasă' }, { value: 'dark', label: 'Întunecată' }]} /></div>
      <div className="field"><span className="label">Culoare de accent</span>
        <div className="row">{ACCENTS.map((a) => (
          <button key={a.id} className="swatch" style={{ background: a.id }} aria-pressed={settings.accent === a.id} aria-label={a.nume} title={a.nume} onClick={() => set('accent', a.id)}>
            {settings.accent === a.id && <Check size={18} color="#fff" style={{ margin: 'auto' }} aria-hidden="true" />}
          </button>))}</div></div>
      <div className="field"><label htmlFor="glass-range" className="label">Intensitate sticlă lichidă: {settings.glass}%</label>
        <input id="glass-range" className="range" type="range" min={0} max={100} step={5} value={settings.glass} onChange={(e) => set('glass', Number(e.target.value))} />
        <span className="hint">Mai mult = estompare mai puternică și transparență mai mare.</span></div>
      <div className="field"><span className="label">Densitate</span>
        <Seg label="Densitate" value={settings.density} onChange={(v) => set('density', v)} options={[{ value: 'comfortable', label: 'Confortabilă' }, { value: 'compact', label: 'Compactă' }]} /></div>
      <div className="field"><span className="label">Rezultate de căutare</span>
        <Seg label="Vizualizare rezultate" value={settings.cardView} onChange={(v) => set('cardView', v)} options={[{ value: 'cards', label: 'Carduri' }, { value: 'list', label: 'Listă' }]} /></div>
      <div className="row between nw"><div><div className="label">Numere compacte</div><div className="hint">Afișează 1,2 mil. în loc de 1 254 618 în cardurile cheie.</div></div>
        <Switch label="Numere compacte" checked={settings.compactNumbers} onChange={(v) => set('compactNumbers', v)} /></div>
      <div className="row between nw"><div><div className="label">Redu animațiile</div><div className="hint">Dezactivează mișcarea fundalului și a tranzițiilor.</div></div>
        <Switch label="Redu animațiile" checked={settings.motion === 'reduce'} onChange={(v) => set('motion', v ? 'reduce' : 'auto')} /></div>
      {full && <div className="row between nw"><div><div className="label">Bară laterală restrânsă</div><div className="hint">Doar pictograme pe ecrane late.</div></div>
        <Switch label="Bară laterală restrânsă" checked={settings.sidebarCollapsed} onChange={(v) => set('sidebarCollapsed', v)} /></div>}
      <hr className="divider" />
      <div className="row">
        <button className="btn" onClick={() => { reset(); toast('Setările au fost resetate', 'info'); }}><RotateCcw size={18} aria-hidden="true" /> Resetează setările</button>
        <button className="btn btn-danger" onClick={() => confirm({ titlu: 'Ștergi datele locale?', text: `Vor fi șterse ${favorite.length} favorite, ${istoric.length} elemente din istoric, lista de comparare și căutările salvate. Datele sunt păstrate doar în acest browser.`, confirmare: 'Șterge tot', periculos: true, onConfirm: () => { clearAll(); toast('Datele locale au fost șterse', 'info'); } })}>
          <Trash2 size={18} aria-hidden="true" /> Șterge datele locale</button>
      </div>
    </div>
  );
}
