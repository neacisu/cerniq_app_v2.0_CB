/* Cerniq CB V2 — Shared UI Primitives */
const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } = React;

/* ── Theme Context ── */
const ThemeCtx = createContext({ theme: 'dark', toggle: () => {} });
const useTheme = () => useContext(ThemeCtx);

/* ── Navigation Context ── */
const NavCtx = createContext({ page: 'overview', go: () => {}, railOpen: false, toggleRail: () => {} });
const useNav = () => useContext(NavCtx);

/* ── Utility Dock Context ── */
const DockCtx = createContext({ dockOpen: true, toggleDock: () => {}, dockContent: null, setDockContent: () => {} });
const useDock = () => useContext(DockCtx);

/* ── Command Palette Context ── */
const CmdCtx = createContext({ open: false, setOpen: () => {} });
const useCmd = () => useContext(CmdCtx);

/* ══════════ FOUNDATIONS ══════════ */

const Surface = ({ children, glass, dense, depth = 0, radius = 'md', style, className = '', onClick, ...props }) => {
  const bg = glass ? (dense ? 'var(--bg-glass-dense)' : 'var(--bg-glass)') : `var(--bg-${depth === 0 ? 'surface' : depth === 1 ? 'raised' : 'overlay'})`;
  const blur = glass ? `blur(${dense ? 'var(--blur-heavy)' : 'var(--blur-medium)'})` : 'none';
  const s = {
    background: bg,
    backdropFilter: blur,
    WebkitBackdropFilter: blur,
    borderRadius: `var(--r-${radius})`,
    border: '1px solid var(--border-hairline)',
    ...style,
  };
  return <div className={className} style={s} onClick={onClick} {...props}>{children}</div>;
};

const GlassSurface = (props) => <Surface glass {...props} />;

const Hairline = ({ vertical, style }) => (
  <div style={{
    [vertical ? 'width' : 'height']: '1px',
    [vertical ? 'height' : 'width']: '100%',
    background: 'var(--border-hairline)',
    flexShrink: 0,
    ...style,
  }} />
);

/* ══════════ STATUS & DATA PRIMITIVES ══════════ */

const StatusDot = ({ status = 'ok', size = 8, pulse, style }) => {
  const color = `var(--status-${status})`;
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size * 2.5, height: size * 2.5, ...style }}>
      <span style={{ width: size, height: size, borderRadius: '50%', background: color, position: 'relative', zIndex: 1 }} />
      {pulse && <span style={{
        position: 'absolute', width: size, height: size, borderRadius: '50%', background: color,
        animation: 'pulse-ring 2s ease-out infinite',
      }} />}
    </span>
  );
};

const MetricPill = ({ label, value, unit, trend, status, compact, style }) => {
  const trendColor = trend === 'up' ? 'var(--status-error)' : trend === 'down' ? 'var(--status-ok)' : 'var(--text-tertiary)';
  const trendArrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  return (
    <div style={{
      display: 'flex', flexDirection: compact ? 'row' : 'column', alignItems: compact ? 'center' : 'flex-start',
      gap: compact ? 'var(--sp-2)' : 'var(--sp-1)', padding: compact ? 'var(--sp-1) var(--sp-2)' : 'var(--sp-3) var(--sp-4)',
      background: status ? `var(--status-${status}-bg)` : 'var(--bg-raised)', borderRadius: 'var(--r-sm)',
      border: '1px solid var(--border-hairline)', ...style,
    }}>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--sp-1)' }}>
        <span style={{ fontSize: compact ? 'var(--text-md)' : 'var(--text-2xl)', fontFamily: 'var(--font-mono)', fontWeight: 600, color: status ? `var(--status-${status})` : 'var(--text-primary)', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{unit}</span>}
        {trend && <span style={{ fontSize: 'var(--text-xs)', color: trendColor, fontFamily: 'var(--font-mono)' }}>{trendArrow}</span>}
      </div>
    </div>
  );
};

const LatencyPill = ({ value, threshold = 200, style }) => {
  const status = value < threshold * 0.5 ? 'ok' : value < threshold ? 'warn' : 'error';
  return <MetricPill label="Latency" value={value} unit="ms" status={status} compact style={style} />;
};

const RunBadge = ({ status = 'running', id, style }) => {
  const colors = { running: 'var(--cyan)', success: 'var(--status-ok)', failed: 'var(--status-error)', queued: 'var(--text-tertiary)' };
  const bgs = { running: 'var(--cyan-bg)', success: 'var(--status-ok-bg)', failed: 'var(--status-error-bg)', queued: 'var(--bg-raised)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-1)', padding: '2px 8px',
      background: bgs[status], color: colors[status], borderRadius: 'var(--r-full)',
      fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontWeight: 500, border: '1px solid var(--border-hairline)', ...style,
    }}>
      {status === 'running' && <StatusDot status="info" size={5} pulse />}
      {id && <span>{id}</span>}
      <span style={{ textTransform: 'capitalize' }}>{status}</span>
    </span>
  );
};

const ErrorTag = ({ count, style }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '1px 7px',
    background: 'var(--status-error-bg)', color: 'var(--status-error)', borderRadius: 'var(--r-full)',
    fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontWeight: 600, ...style,
  }}>✕ {count}</span>
);

const StageBadge = ({ stage, style }) => {
  const c = `var(--stage-${stage.toLowerCase()})`;
  return (
    <span style={{
      display: 'inline-flex', padding: '1px 8px', borderRadius: 'var(--r-full)',
      fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontWeight: 600,
      color: c, background: `color-mix(in oklch, ${c} 15%, transparent)`,
      border: `1px solid color-mix(in oklch, ${c} 25%, transparent)`, ...style,
    }}>{stage}</span>
  );
};

/* ── Sparkline ── */
const Sparkline = ({ data = [], width = 80, height = 24, color = 'var(--accent)', fill, style }) => {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ');
  const fillPts = fill ? `0,${height} ${pts} ${width},${height}` : '';
  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible', ...style }}>
      {fill && <polygon points={fillPts} fill={color} opacity="0.1" />}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* ── HistogramMini ── */
const HistogramMini = ({ data = [], width = 80, height = 24, color = 'var(--cyan)', style }) => {
  const max = Math.max(...data, 1);
  const bw = width / data.length - 1;
  return (
    <svg width={width} height={height} style={{ display: 'block', ...style }}>
      {data.map((v, i) => (
        <rect key={i} x={i * (bw + 1)} y={height - (v / max) * height} width={bw} height={(v / max) * height} fill={color} rx="1" opacity="0.7" />
      ))}
    </svg>
  );
};

/* ── PulseIndicator ── */
const PulseIndicator = ({ active = true, color = 'var(--status-ok)', style }) => (
  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: color, animation: active ? 'pulse-live 2s ease-in-out infinite' : 'none', ...style }} />
);

/* ── TimelineMarker ── */
const TimelineMarker = ({ time, label, color = 'var(--accent)', style }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', ...style }}>
    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
    <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{time}</span>
    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{label}</span>
  </div>
);

/* ══════════ CONTROLS ══════════ */

const LiquidButton = ({ children, variant = 'default', size = 'md', icon, active, onClick, style, ...props }) => {
  const [hov, setHov] = useState(false);
  const [press, setPress] = useState(false);
  const variants = {
    default: { bg: 'var(--bg-raised)', color: 'var(--text-primary)', hoverBg: 'var(--bg-overlay)' },
    accent: { bg: 'var(--accent-bg)', color: 'var(--accent)', hoverBg: 'var(--accent)' },
    ghost: { bg: 'transparent', color: 'var(--text-secondary)', hoverBg: 'var(--bg-hover)' },
    danger: { bg: 'var(--status-error-bg)', color: 'var(--status-error)', hoverBg: 'var(--status-error)' },
  };
  const v = variants[variant];
  const sizes = { sm: { px: 8, py: 4, fs: 'var(--text-xs)' }, md: { px: 12, py: 6, fs: 'var(--text-sm)' }, lg: { px: 16, py: 8, fs: 'var(--text-md)' } };
  const sz = sizes[size];
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => { setHov(false); setPress(false); }}
      onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-2)', padding: `${sz.py}px ${sz.px}px`,
        background: active ? 'var(--accent-bg)' : hov ? v.hoverBg : v.bg,
        color: active ? 'var(--accent)' : hov && variant === 'accent' ? 'var(--text-inverse)' : v.color,
        border: '1px solid var(--border-hairline)', borderRadius: 'var(--r-sm)', cursor: 'pointer',
        fontSize: sz.fs, fontFamily: 'var(--font-body)', fontWeight: 500,
        transform: press ? 'scale(0.97)' : 'scale(1)',
        transition: `all var(--dur-fast) var(--ease-snappy)`, ...style,
      }}
      {...props}
    >
      {icon && <span style={{ fontSize: '14px', lineHeight: 1 }}>{icon}</span>}
      {children}
    </button>
  );
};

const IconButton = ({ icon, size = 32, active, onClick, title, style }) => {
  const [hov, setHov] = useState(false);
  return (
    <button title={title} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size,
        background: active ? 'var(--accent-bg)' : hov ? 'var(--bg-hover)' : 'transparent',
        color: active ? 'var(--accent)' : hov ? 'var(--text-primary)' : 'var(--text-secondary)',
        border: 'none', borderRadius: 'var(--r-xs)', cursor: 'pointer',
        transition: `all var(--dur-fast) var(--ease-snappy)`, fontSize: '16px', ...style,
      }}
    >{icon}</button>
  );
};

const SegmentedControl = ({ options, value, onChange, style }) => (
  <div style={{
    display: 'inline-flex', background: 'var(--bg-surface)', borderRadius: 'var(--r-sm)',
    border: '1px solid var(--border-hairline)', padding: 2, gap: 2, ...style,
  }}>
    {options.map(opt => (
      <button key={opt.value} onClick={() => onChange(opt.value)} style={{
        padding: '4px 12px', borderRadius: 'var(--r-xs)', border: 'none', cursor: 'pointer',
        background: value === opt.value ? 'var(--accent-bg)' : 'transparent',
        color: value === opt.value ? 'var(--accent)' : 'var(--text-secondary)',
        fontSize: 'var(--text-xs)', fontFamily: 'var(--font-body)', fontWeight: 500,
        transition: `all var(--dur-fast) var(--ease-snappy)`,
      }}>{opt.label}</button>
    ))}
  </div>
);

const FilterChip = ({ label, active, onClick, count, style }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px',
        background: active ? 'var(--accent-bg)' : hov ? 'var(--bg-hover)' : 'var(--bg-surface)',
        color: active ? 'var(--accent)' : 'var(--text-secondary)',
        border: `1px solid ${active ? 'var(--accent-dim)' : 'var(--border-hairline)'}`,
        borderRadius: 'var(--r-full)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 500,
        fontFamily: 'var(--font-body)', transition: `all var(--dur-fast) var(--ease-snappy)`, ...style,
      }}
    >
      {label}
      {count != null && <span style={{ fontFamily: 'var(--font-mono)', opacity: 0.7 }}>{count}</span>}
    </button>
  );
};

const SearchField = ({ placeholder = 'Search...', value, onChange, style }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', padding: '6px 12px',
    background: 'var(--bg-surface)', border: '1px solid var(--border-hairline)',
    borderRadius: 'var(--r-sm)', ...style,
  }}>
    <span style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>⌕</span>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{
        flex: 1, background: 'transparent', border: 'none', outline: 'none',
        color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)',
      }}
    />
  </div>
);

/* ── Tabs ── */
const TabBar = ({ tabs, active, onChange, style }) => (
  <div style={{ display: 'flex', gap: 'var(--sp-1)', borderBottom: '1px solid var(--border-hairline)', ...style }}>
    {tabs.map(t => (
      <button key={t.id} onClick={() => onChange(t.id)} style={{
        padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer',
        color: active === t.id ? 'var(--accent)' : 'var(--text-tertiary)',
        fontSize: 'var(--text-xs)', fontWeight: 500, fontFamily: 'var(--font-body)',
        borderBottom: active === t.id ? '2px solid var(--accent)' : '2px solid transparent',
        marginBottom: '-1px', transition: `all var(--dur-fast) var(--ease-snappy)`,
      }}>{t.label}{t.count != null && <span style={{ marginLeft: 4, fontFamily: 'var(--font-mono)', opacity: 0.6 }}>{t.count}</span>}</button>
    ))}
  </div>
);

/* Export to window */
Object.assign(window, {
  ThemeCtx, useTheme, NavCtx, useNav, DockCtx, useDock, CmdCtx, useCmd,
  Surface, GlassSurface, Hairline, StatusDot, MetricPill, LatencyPill, RunBadge, ErrorTag, StageBadge,
  Sparkline, HistogramMini, PulseIndicator, TimelineMarker,
  LiquidButton, IconButton, SegmentedControl, FilterChip, SearchField, TabBar,
});
