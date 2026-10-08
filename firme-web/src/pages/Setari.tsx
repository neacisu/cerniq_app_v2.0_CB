import { Link } from 'react-router-dom';
import { HardDrive, Keyboard, Palette } from 'lucide-react';
import { Card, PageHead } from '../components/ui';
import { SettingsForm } from '../components/SettingsForm';
import { useLibrary } from '../state/library';
import { useUi } from '../state/ui';

export default function Setari() {
  const { favorite, istoric, compare, cautari } = useLibrary();
  const { open } = useUi();
  return (
    <div className="page">
      <PageHead eyebrow="Aplicație" title="Setări">Personalizează aspectul și gestionează datele păstrate în acest browser.</PageHead>
      <div className="split">
        <div className="main-col"><Card title="Aspect și comportament" icon={Palette}><SettingsForm full /></Card></div>
        <div className="side-col">
          <Card title="Date locale" icon={HardDrive}>
            <dl className="kv"><div><dt>Favorite</dt><dd>{favorite.length}</dd></div><div><dt>Istoric</dt><dd>{istoric.length}</dd></div><div><dt>La comparare</dt><dd>{compare.length}</dd></div><div><dt>Căutări salvate</dt><dd>{cautari.length}</dd></div></dl>
            <Link to="/favorite" className="btn btn-sm">Gestionează favoritele</Link>
          </Card>
          <Card title="Tastatură" icon={Keyboard}><p className="muted">Folosește Ctrl K pentru comenzi rapide, / pentru căutare și ? pentru lista completă.</p><button className="btn btn-sm" onClick={() => open('shortcuts')}>Vezi scurtăturile</button></Card>
        </div>
      </div>
    </div>
  );
}
