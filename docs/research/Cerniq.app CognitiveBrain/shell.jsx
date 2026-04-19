/* Cerniq CB V2 — App Shell: NavRail, TopBar, CommandPalette */
const NAV_ITEMS = [
  { id: 'overview', icon: '◉', label: 'Overview', desc: 'Brain health & system status' },
  { id: 'live', icon: '◈', label: 'Live', desc: 'Real-time operations center' },
  { id: 'gateways', icon: '⬡', label: 'Gateways', desc: 'Neural pathways catalog' },
  { id: 'neurons', icon: '◇', label: 'Neurons', desc: 'Atomic processing units' },
  { id: 'synapses', icon: '⟡', label: 'Synapses', desc: 'Connection & delivery' },
  { id: 'topology', icon: '◎', label: 'Topology', desc: 'Brain atlas & structure' },
  { id: 'traces', icon: '≡', label: 'Traces', desc: 'Debug & trace explorer' },
  { id: 'memory', icon: '▣', label: 'Memory', desc: 'Embeddings & vector spaces' },
  { id: 'admin', icon: '⚙', label: 'Admin', desc: 'Models, policies & audit' },
  { id: 'settings', icon: '☰', label: 'Settings', desc: 'App configuration' },
];

/* ── Responsive hook ── */
const useBreakpoint = () => {
  const [bp, setBp] = useState(() => calcBp());
  function calcBp() {
    const w = window.innerWidth;
    if (w < 480) return 'mobile-sm';
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    if (w < 1440) return 'laptop';
    if (w < 1920) return 'desktop';
    return 'ultrawide';
  }
  useEffect(() => {
    const h = () => setBp(calcBp());
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  const isMobile = bp === 'mobile-sm' || bp === 'mobile';
  const isTablet = bp === 'tablet';
  const isCompact = isMobile || isTablet;
  return { bp, isMobile, isTablet, isCompact };
};

/* ── Nav Rail (desktop/tablet) ── */
const NavRail = () => {
  const { page, go, railOpen, toggleRail } = useNav();
  const { isTablet } = useBreakpoint();
  const [hovered, setHovered] = useState(null);
  const expanded = railOpen && !isTablet;
  const w = expanded ? 240 : 72;

  return (
    <nav style={{
      width: w, minWidth: w, height: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-surface)', borderRight: '1px solid var(--border-hairline)',
      transition: `width var(--dur-fluid) var(--ease-fluid), min-width var(--dur-fluid) var(--ease-fluid)`,
      zIndex: 20, overflow: 'hidden', position: 'relative',
    }}>
      {/* Logo */}
      <div style={{
        height: 'var(--topbar-h)', display: 'flex', alignItems: 'center', padding: '0 var(--sp-4)',
        gap: 'var(--sp-3)', borderBottom: '1px solid var(--border-hairline)', flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, var(--accent), var(--cyan))', color: '#fff',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', flexShrink: 0,
        }}>C</div>
        <div style={{ opacity: expanded ? 1 : 0, transition: `opacity var(--dur-base) var(--ease-fluid)`, whiteSpace: 'nowrap', overflow: 'hidden' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-md)', color: 'var(--text-primary)', lineHeight: 1.2 }}>Cerniq</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>CognitiveBrain</div>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: 'var(--sp-2)', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', overflowX: 'hidden' }}>
        {NAV_ITEMS.map(item => {
          const isActive = page === item.id || (page.startsWith('gateway-') && item.id === 'gateways');
          const isHov = hovered === item.id;
          return (
            <button key={item.id} onClick={() => go(item.id)}
              onMouseEnter={() => setHovered(item.id)} onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: expanded ? '10px 12px' : '10px',
                justifyContent: expanded ? 'flex-start' : 'center',
                background: isActive ? 'var(--accent-bg)' : isHov ? 'var(--bg-hover)' : 'transparent',
                color: isActive ? 'var(--accent)' : isHov ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none', borderRadius: 'var(--r-sm)', cursor: 'pointer', width: '100%',
                fontSize: '18px', transition: `all var(--dur-fast) var(--ease-snappy)`,
                position: 'relative',
              }}
              title={!expanded ? item.label : undefined}
            >
              <span style={{ width: 24, textAlign: 'center', flexShrink: 0, fontSize: '18px' }}>{item.icon}</span>
              <span style={{
                fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)', fontWeight: 500,
                opacity: expanded ? 1 : 0, whiteSpace: 'nowrap', overflow: 'hidden',
                transition: `opacity var(--dur-base) var(--ease-fluid)`,
                maxWidth: expanded ? 200 : 0,
              }}>{item.label}</span>
              {isActive && <div style={{
                position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                width: 3, height: 20, borderRadius: 2, background: 'var(--accent)',
              }} />}
            </button>
          );
        })}
      </div>

      {/* Collapse toggle */}
      <div style={{ padding: 'var(--sp-2)', borderTop: '1px solid var(--border-hairline)', flexShrink: 0 }}>
        <button onClick={toggleRail} style={{
          display: 'flex', alignItems: 'center', justifyContent: expanded ? 'flex-start' : 'center',
          gap: 'var(--sp-3)', padding: '10px 12px', width: '100%',
          background: 'transparent', border: 'none', color: 'var(--text-tertiary)',
          cursor: 'pointer', borderRadius: 'var(--r-sm)', fontSize: 'var(--text-sm)',
          transition: 'color var(--dur-fast) var(--ease-snappy)',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
        >
          <span style={{ transform: expanded ? 'rotate(0)' : 'rotate(180deg)', transition: `transform var(--dur-base) var(--ease-fluid)`, fontSize: '16px' }}>◂</span>
          {expanded && <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)' }}>Collapse</span>}
        </button>
      </div>
    </nav>
  );
};

/* ── Mobile Drawer Nav ── */
const MobileDrawer = ({ open, onClose }) => {
  const { page, go } = useNav();

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
        animation: 'fadeIn var(--dur-soft) var(--ease-fluid)',
      }} />
      {/* Drawer panel */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 280,
        background: 'var(--bg-surface)', borderRight: '1px solid var(--border-hairline)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        animation: 'slideInLeft var(--dur-fluid) var(--ease-snappy)',
      }}>
        {/* Header */}
        <div style={{
          height: 'var(--topbar-h)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 var(--sp-4)', borderBottom: '1px solid var(--border-hairline)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, var(--accent), var(--cyan))', color: '#fff',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)',
            }}>C</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.2 }}>Cerniq</div>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>CognitiveBrain</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-hover)', border: 'none', borderRadius: 'var(--r-xs)',
            color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '16px',
          }}>✕</button>
        </div>

        {/* Nav links */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-3)' }}>
          {NAV_ITEMS.map(item => {
            const isActive = page === item.id || (page.startsWith('gateway-') && item.id === 'gateways');
            return (
              <button key={item.id}
                onClick={() => { go(item.id); onClose(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: '12px var(--sp-3)',
                  width: '100%', background: isActive ? 'var(--accent-bg)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)', border: 'none',
                  borderRadius: 'var(--r-sm)', cursor: 'pointer', textAlign: 'left',
                  transition: 'all var(--dur-fast) var(--ease-snappy)', position: 'relative',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                {isActive && <div style={{
                  position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                  width: 3, height: 20, borderRadius: 2, background: 'var(--accent)',
                }} />}
                <span style={{ width: 24, textAlign: 'center', fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: 1 }}>{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: 'var(--sp-3)', borderTop: '1px solid var(--border-hairline)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', padding: '4px 10px', background: 'var(--status-ok-bg)', borderRadius: 'var(--r-full)', border: '1px solid var(--border-hairline)', width: 'fit-content' }}>
            <PulseIndicator />
            <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--status-ok)' }}>LIVE · production</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Top Bar ── */
const TopBar = ({ onMenuOpen }) => {
  const { theme, toggle } = useTheme();
  const { setOpen } = useCmd();
  const { page } = useNav();
  const { isMobile, isTablet, isCompact } = useBreakpoint();
  const titles = { overview: 'Overview', live: 'Live', gateways: 'Gateways', neurons: 'Neurons', synapses: 'Synapses', topology: 'Topology', traces: 'Traces', memory: 'Memory', admin: 'Admin', settings: 'Settings' };

  return (
    <header style={{
      height: 'var(--topbar-h)', display: 'flex', alignItems: 'center', gap: isMobile ? 'var(--sp-2)' : 'var(--sp-4)',
      padding: isMobile ? '0 var(--sp-3)' : '0 var(--sp-6)',
      borderBottom: '1px solid var(--border-hairline)',
      background: 'var(--bg-surface)', flexShrink: 0, zIndex: 15,
    }}>
      {/* Hamburger for mobile */}
      {isMobile && (
        <button onClick={onMenuOpen} style={{
          width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer',
          fontSize: '20px', flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="4" width="16" height="2" rx="1" fill="currentColor" />
            <rect x="2" y="9" width="16" height="2" rx="1" fill="currentColor" />
            <rect x="2" y="14" width="16" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
      )}

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', minWidth: 0, flexShrink: isMobile ? 1 : 0 }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 600,
          fontSize: isMobile ? 'var(--text-md)' : 'var(--text-lg)',
          color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {page.startsWith('gateway-') ? 'Gateways' : titles[page] || page}
        </span>
        {page.startsWith('gateway-') && !isMobile && (
          <>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>/</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--accent)' }}>GW-2847</span>
          </>
        )}
      </div>

      {/* Command bar — hide on small mobile */}
      {!isMobile && (
        <div onClick={() => setOpen(true)} style={{
          flex: 1, maxWidth: 480, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
          padding: '6px 14px', background: 'var(--bg-raised)', border: '1px solid var(--border-hairline)',
          borderRadius: 'var(--r-sm)', cursor: 'pointer',
        }}>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>⌕</span>
          <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', flex: 1 }}>
            {isTablet ? 'Search…' : 'Jump to gateway, neuron, trace…'}
          </span>
          <span style={{
            padding: '1px 6px', background: 'var(--bg-surface)', borderRadius: 4,
            fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)',
            border: '1px solid var(--border-hairline)',
          }}>⌘K</span>
        </div>
      )}

      {/* Spacer on mobile */}
      {isMobile && <div style={{ flex: 1 }} />}

      {/* Right cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexShrink: 0 }}>
        {/* Search icon on mobile */}
        {isMobile && <IconButton icon="⌕" onClick={() => setOpen(true)} title="Search" />}

        {/* Live status — hide label on mobile */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', padding: isMobile ? '4px 6px' : '4px 10px',
          background: 'var(--status-ok-bg)', borderRadius: 'var(--r-full)', border: '1px solid var(--border-hairline)',
        }}>
          <PulseIndicator />
          {!isMobile && <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--status-ok)' }}>LIVE</span>}
        </div>

        {/* Env chip — desktop only */}
        {!isCompact && (
          <span style={{
            padding: '3px 8px', background: 'var(--cyan-bg)', color: 'var(--cyan)',
            borderRadius: 'var(--r-full)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontWeight: 500,
            border: '1px solid var(--border-hairline)',
          }}>production</span>
        )}

        <IconButton icon={theme === 'dark' ? '☀' : '☾'} onClick={toggle} title="Toggle theme" />
        {!isMobile && <IconButton icon="⚡" title="Notifications" />}

        {/* Avatar */}
        <div style={{
          width: 30, height: 30, borderRadius: 'var(--r-full)', background: 'linear-gradient(135deg, var(--accent), var(--cyan))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 'var(--text-xs)', color: '#fff', fontWeight: 600, cursor: 'pointer',
        }}>CB</div>
      </div>
    </header>
  );
};

/* ── Command Palette ── */
const CommandPalette = () => {
  const { open, setOpen } = useCmd();
  const { go } = useNav();
  const { isMobile } = useBreakpoint();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const commands = NAV_ITEMS.map(n => ({ id: n.id, label: `Go to ${n.label}`, icon: n.icon, cat: 'Navigation' }));
  commands.push(
    { id: 'gateway-detail', label: 'Open GW-2847 Intake→Process', icon: '⬡', cat: 'Gateways' },
    { id: 'gw-pause', label: 'Pause GW-2847', icon: '⏸', cat: 'Actions' },
    { id: 'gw-inspect', label: 'Inspect last run', icon: '🔍', cat: 'Actions' },
  );

  const filtered = query ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase())) : commands;
  const grouped = filtered.reduce((acc, c) => { (acc[c.cat] = acc[c.cat] || []).push(c); return acc; }, {});

  useEffect(() => {
    if (open && inputRef.current) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(o => !o); }
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  if (!open) return null;

  return (
    <div onClick={() => setOpen(false)} style={{
      position: 'fixed', inset: 0, zIndex: 100, display: 'flex',
      alignItems: isMobile ? 'flex-start' : 'flex-start', justifyContent: 'center',
      paddingTop: isMobile ? 0 : 120, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: isMobile ? '100%' : '100%', maxWidth: isMobile ? '100%' : 560,
        height: isMobile ? '100%' : 'auto',
        background: 'var(--bg-raised)', border: isMobile ? 'none' : '1px solid var(--border-subtle)',
        borderRadius: isMobile ? 0 : 'var(--r-lg)', boxShadow: isMobile ? 'none' : 'var(--depth-3)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        animation: 'fadeIn var(--dur-soft) var(--ease-fluid)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: 'var(--sp-4)', borderBottom: '1px solid var(--border-hairline)', flexShrink: 0 }}>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '16px' }}>⌕</span>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search commands, gateways, neurons…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 'var(--text-md)', fontFamily: 'var(--font-body)' }}
          />
          <button onClick={() => setOpen(false)} style={{
            padding: '2px 8px', background: 'var(--bg-surface)', borderRadius: 4,
            fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)',
            border: '1px solid var(--border-hairline)', cursor: 'pointer',
          }}>{isMobile ? '✕' : 'ESC'}</button>
        </div>
        <div style={{ flex: 1, maxHeight: isMobile ? undefined : 400, overflowY: 'auto', padding: 'var(--sp-2)' }}>
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <div style={{ padding: '6px 12px', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{cat}</div>
              {items.map(item => (
                <button key={item.id} onClick={() => { go(item.id.startsWith('gw-') ? 'gateways' : item.id); setOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: '10px 12px', width: '100%',
                    background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer',
                    borderRadius: 'var(--r-xs)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ width: 24, textAlign: 'center', color: 'var(--text-tertiary)' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 'var(--sp-8)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
              No results for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── App Shell ── */
const AppShell = ({ children }) => {
  const [mobileDrawer, setMobileDrawer] = useState(false);
  const { isMobile, isCompact } = useBreakpoint();
  const { page, go } = useNav();

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg-root)' }}>
      {/* Desktop/tablet rail */}
      {!isMobile && <NavRail />}

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar onMenuOpen={() => setMobileDrawer(true)} />
        <main style={{ flex: 1, overflow: 'auto', position: 'relative', paddingBottom: isMobile ? 72 : 0 }}>
          {children}
        </main>
      </div>

      {/* Mobile bottom nav — quick access to top 5 + more */}
      {isMobile && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, height: 64,
          background: 'var(--bg-glass-dense)', backdropFilter: 'blur(var(--blur-heavy))',
          WebkitBackdropFilter: 'blur(var(--blur-heavy))',
          borderTop: '1px solid var(--border-hairline)', display: 'flex', alignItems: 'center',
          justifyContent: 'space-around', padding: '0 var(--sp-1)', zIndex: 30,
        }}>
          {NAV_ITEMS.slice(0, 4).map(item => {
            const isActive = page === item.id || (page.startsWith('gateway-') && item.id === 'gateways');
            return (
              <button key={item.id} onClick={() => go(item.id)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                background: 'none', border: 'none', color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
                fontSize: '18px', cursor: 'pointer', padding: '6px 10px', minWidth: 48,
                transition: 'color var(--dur-fast) var(--ease-snappy)',
              }}>
                <span>{item.icon}</span>
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-body)', fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
              </button>
            );
          })}
          <button onClick={() => setMobileDrawer(true)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: '18px',
            cursor: 'pointer', padding: '6px 10px', minWidth: 48,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4" width="16" height="2" rx="1" fill="currentColor" />
              <rect x="2" y="9" width="16" height="2" rx="1" fill="currentColor" />
              <rect x="2" y="14" width="16" height="2" rx="1" fill="currentColor" />
            </svg>
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-body)' }}>More</span>
          </button>
        </div>
      )}

      {/* Mobile drawer */}
      <MobileDrawer open={mobileDrawer} onClose={() => setMobileDrawer(false)} />

      <CommandPalette />
    </div>
  );
};

Object.assign(window, { NAV_ITEMS, useBreakpoint, NavRail, MobileDrawer, TopBar, CommandPalette, AppShell });
