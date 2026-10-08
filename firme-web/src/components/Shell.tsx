import { useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BookOpen, Building2, ChevronsLeft, ChevronsRight, Clock, Command, Database, GitCompareArrows, Heart, Home, Info, Layers, Menu, Moon, Search, Settings, Sun, SunMoon, X, Keyboard,
  type LucideIcon,
} from 'lucide-react';
import { useSettings } from '../state/settings';
import { useLibrary } from '../state/library';
import { useUi } from '../state/ui';
import { useHealth } from '../api/hooks';
import { SearchBox } from './SearchBox';
import { Toasts } from './Toasts';
import { DialogHost } from './dialogs';

interface NavDef { to: string; label: string; icon: LucideIcon; end?: boolean; count?: number }

function useNav(): { principal: NavDef[]; date: NavDef[]; app: NavDef[] } {
  const { favorite, compare, istoric } = useLibrary();
  return {
    principal: [
      { to: '/', label: 'Acasă', icon: Home, end: true },
      { to: '/cauta', label: 'Căutare', icon: Search },
      { to: '/comparare', label: 'Comparare', icon: GitCompareArrows, count: compare.length },
      { to: '/favorite', label: 'Favorite', icon: Heart, count: favorite.length },
      { to: '/istoric', label: 'Istoric', icon: Clock, count: istoric.length },
    ],
    date: [
      { to: '/nomenclatoare', label: 'Nomenclatoare', icon: BookOpen },
      { to: '/indicatori', label: 'Indicatori', icon: Layers },
      { to: '/date', label: 'Date și API', icon: Database },
    ],
    app: [
      { to: '/despre', label: 'Despre', icon: Info },
      { to: '/setari', label: 'Setări', icon: Settings },
    ],
  };
}

function Item({ n, onNavigate }: { n: NavDef; onNavigate: () => void }) {
  return (
    <NavLink to={n.to} end={n.end} className="nav-item" onClick={onNavigate} title={n.label}>
      <n.icon size={22} aria-hidden="true" /><span className="nav-text">{n.label}</span>
      {!!n.count && <span className="count">{n.count}</span>}
    </NavLink>
  );
}

function Sidebar() {
  const { settings, set } = useSettings();
  const { navOpen, setNavOpen, open } = useUi();
  const nav = useNav();
  const close = () => setNavOpen(false);
  return (
    <aside className={`sidebar${navOpen ? ' open' : ''}`} aria-label="Navigare principală">
      <div className="sidebar-in glass">
        <div className="row nw between">
          <Link to="/" className="brand" onClick={close} aria-label="Firme Cerniq, acasă">
            <span className="brand-mark"><Building2 size={20} aria-hidden="true" /></span>
            <span className="brand-text">firme<small>.cerniq</small></span>
          </Link>
          <button className="btn btn-ghost btn-icon btn-sm tabbar-hide" style={{ display: navOpen ? 'inline-flex' : 'none' }} onClick={close} aria-label="Închide meniul"><X size={20} aria-hidden="true" /></button>
        </div>
        <nav className="stack-sm" aria-label="Pagini">
          <div className="nav-label">Explorează</div>
          {nav.principal.map((n) => <Item key={n.to} n={n} onNavigate={close} />)}
          <div className="nav-label">Date</div>
          {nav.date.map((n) => <Item key={n.to} n={n} onNavigate={close} />)}
          <div className="nav-label">Aplicație</div>
          {nav.app.map((n) => <Item key={n.to} n={n} onNavigate={close} />)}
        </nav>
        <div className="sidebar-foot">
          <button className="nav-item" onClick={() => { close(); open('palette'); }}><Command size={22} aria-hidden="true" /><span className="nav-text">Comenzi rapide</span></button>
          <button className="nav-item" onClick={() => { close(); open('shortcuts'); }}><Keyboard size={22} aria-hidden="true" /><span className="nav-text">Scurtături</span></button>
          <button className="nav-item hide-compact" onClick={() => set('sidebarCollapsed', !settings.sidebarCollapsed)} aria-label={settings.sidebarCollapsed ? 'Extinde bara laterală' : 'Restrânge bara laterală'}>
            {settings.sidebarCollapsed ? <ChevronsRight size={22} aria-hidden="true" /> : <ChevronsLeft size={22} aria-hidden="true" />}<span className="nav-text">Restrânge</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function ThemeButton() {
  const { settings, set, resolvedDark } = useSettings();
  const next = settings.theme === 'auto' ? 'light' : settings.theme === 'light' ? 'dark' : 'auto';
  const Icon = settings.theme === 'auto' ? SunMoon : resolvedDark ? Moon : Sun;
  const label = { auto: 'Temă: automată', light: 'Temă: luminoasă', dark: 'Temă: întunecată' }[settings.theme];
  return <button className="btn btn-ghost btn-icon" onClick={() => set('theme', next)} aria-label={`${label}. Schimbă`} title={label}><Icon size={22} aria-hidden="true" /></button>;
}

function Topbar() {
  const { setNavOpen, open } = useUi();
  const health = useHealth();
  const ok = health.data?.stare === 'ok';
  return (
    <header className="topbar glass">
      <button className="btn btn-ghost btn-icon crumbs" onClick={() => setNavOpen(true)} aria-label="Deschide meniul"><Menu size={22} aria-hidden="true" /></button>
      <div className="search-wrap"><SearchBox /></div>
      <div className="topbar-actions">
        <span className="chip hide-sm" title={ok ? `API operațional (${health.data?.ms} ms)` : health.isLoading ? 'Se verifică API-ul' : 'API indisponibil'} aria-live="polite">
          <span className={`pulse${ok || health.isLoading ? '' : ' bad'}`} aria-hidden="true" />{ok ? 'Operațional' : health.isLoading ? 'Verificare' : 'Indisponibil'}
        </span>
        <button className="btn btn-ghost btn-icon hide-sm" onClick={() => open('palette')} aria-label="Comenzi rapide (Ctrl K)" title="Comenzi rapide (Ctrl K)"><Command size={22} aria-hidden="true" /></button>
        <ThemeButton />
        <button className="btn btn-ghost btn-icon" onClick={() => open('settings')} aria-label="Setări rapide" title="Setări rapide"><Settings size={22} aria-hidden="true" /></button>
      </div>
    </header>
  );
}

function Footer() {
  const { open } = useUi();
  return (
    <footer className="footer glass">
      <div className="stack-sm">
        <Link to="/" className="brand" style={{ padding: 0 }}><span className="brand-mark"><Building2 size={20} aria-hidden="true" /></span><span>firme<small>.cerniq</small></span></Link>
        <p className="muted">Registrul public al firmelor din România: identificare ANAF, registrul ONRC și situații financiare 2008–2025.</p>
      </div>
      <div><h4>Explorează</h4><ul><li><Link to="/cauta">Căutare</Link></li><li><Link to="/comparare">Comparare firme</Link></li><li><Link to="/favorite">Favorite</Link></li><li><Link to="/istoric">Istoric</Link></li></ul></div>
      <div><h4>Date</h4><ul><li><Link to="/nomenclatoare">Nomenclatoare CAEN</Link></li><li><Link to="/indicatori">Indicatori financiari</Link></li><li><Link to="/date">Acoperire și API</Link></li></ul></div>
      <div><h4>Aplicație</h4><ul><li><Link to="/despre">Despre și limite</Link></li><li><Link to="/setari">Setări</Link></li><li><button className="btn-link" onClick={() => open('shortcuts')} style={{ all: 'unset', cursor: 'pointer' }}>Scurtături tastatură</button></li></ul></div>
      <div className="footer-bottom">
        <span>Date publice: ANAF, ONRC, Ministerul Finanțelor (data.gov.ro). Informativ, nu constituie consultanță juridică sau financiară.</span>
        <span>© {new Date().getFullYear()} Cerniq</span>
      </div>
    </footer>
  );
}

function TabBar() {
  const { favorite, compare } = useLibrary();
  const { setNavOpen } = useUi();
  const { pathname } = useLocation();
  const tabs: NavDef[] = [
    { to: '/', label: 'Acasă', icon: Home, end: true }, { to: '/cauta', label: 'Căutare', icon: Search },
    { to: '/comparare', label: 'Compară', icon: GitCompareArrows, count: compare.length }, { to: '/favorite', label: 'Favorite', icon: Heart, count: favorite.length },
  ];
  return (
    <nav className="tabbar glass" aria-label="Navigare rapidă">
      {tabs.map((t) => (
        <NavLink key={t.to} to={t.to} end={t.end} aria-current={(t.end ? pathname === t.to : pathname.startsWith(t.to)) ? 'page' : undefined}>
          <t.icon size={22} aria-hidden="true" />{t.label}
        </NavLink>
      ))}
      <button onClick={() => setNavOpen(true)} aria-label="Deschide meniul complet"><Menu size={22} aria-hidden="true" />Meniu</button>
    </nav>
  );
}

/** Evidențiere dinamică: poziția cursorului alimentează reflexiile sticlei și paralaxa fundalului. */
function usePointerGlow() {
  const raf = useRef(0);
  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches) return;
    const on = (e: PointerEvent) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const r = document.documentElement.style;
        r.setProperty('--px', String((e.clientX / innerWidth - 0.5) * 2));
        r.setProperty('--py', String((e.clientY / innerHeight - 0.5) * 2));
        const g = (e.target as HTMLElement | null)?.closest<HTMLElement>('.glass');
        if (g) { const b = g.getBoundingClientRect(); g.style.setProperty('--mx', `${e.clientX - b.left}px`); g.style.setProperty('--my', `${e.clientY - b.top}px`); }
      });
    };
    addEventListener('pointermove', on, { passive: true });
    return () => { removeEventListener('pointermove', on); cancelAnimationFrame(raf.current); };
  }, []);
}

export function Shell() {
  const { settings } = useSettings();
  const { navOpen, setNavOpen } = useUi();
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  usePointerGlow();
  useEffect(() => { setNavOpen(false); window.scrollTo({ top: 0 }); main.current?.focus({ preventScroll: true }); }, [pathname, setNavOpen]);
  useEffect(() => {
    if (!navOpen) return;
    const on = (e: KeyboardEvent) => { if (e.key === 'Escape') setNavOpen(false); };
    addEventListener('keydown', on); return () => removeEventListener('keydown', on);
  }, [navOpen, setNavOpen]);
  return (
    <>
      <div className="bg" aria-hidden="true"><i /><i /><i /></div>
      <a href="#continut" className="btn btn-primary sr-only" style={{ position: 'fixed', top: 8, left: 8, zIndex: 300 }}>Sari la conținut</a>
      <div className={`app${settings.sidebarCollapsed ? ' collapsed' : ''}`}>
        <Sidebar />
        {navOpen && <div className="scrim" onClick={() => setNavOpen(false)} aria-hidden="true" />}
        <div className="shell">
          <Topbar />
          <main id="continut" className="main" tabIndex={-1} ref={main} style={{ outline: 0 }}><Outlet /></main>
          <Footer />
        </div>
      </div>
      <TabBar />
      <Toasts />
      <DialogHost />
    </>
  );
}
