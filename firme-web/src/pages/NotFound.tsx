import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="page"><div className="empty notfound glass card">
      <div className="big" aria-hidden="true">404</div><h1 style={{ fontSize: 28 }}>Pagina nu există</h1>
      <p>Linkul poate fi vechi sau scris greșit. Caută firma direct sau întoarce-te acasă.</p>
      <div className="row" style={{ justifyContent: 'center' }}><Link to="/" className="btn btn-primary"><Home size={18} aria-hidden="true" /> Acasă</Link><Link to="/cauta" className="btn"><Search size={18} aria-hidden="true" /> Căutare</Link></div>
    </div></div>
  );
}
