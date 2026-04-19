/* Cerniq CB V2 — Live Page */

const LiveTopologyCanvas = () => {
  const [selected, setSelected] = useState(null);
  const [hovNode, setHovNode] = useState(null);
  const canvasRef = useRef(null);

  const nodes = [
    { id: 'N-100', x: 80, y: 60, label: 'Intake', type: 'neuron', status: 'ok', stage: 'E1' },
    { id: 'N-101', x: 80, y: 180, label: 'Parse', type: 'neuron', status: 'ok', stage: 'E1' },
    { id: 'N-200', x: 260, y: 60, label: 'Validate', type: 'neuron', status: 'ok', stage: 'E2' },
    { id: 'N-201', x: 260, y: 180, label: 'Transform', type: 'neuron', status: 'warn', stage: 'E2' },
    { id: 'N-202', x: 260, y: 300, label: 'Classify', type: 'neuron', status: 'ok', stage: 'E2' },
    { id: 'N-300', x: 440, y: 100, label: 'Enrich', type: 'neuron', status: 'ok', stage: 'E3' },
    { id: 'N-301', x: 440, y: 240, label: 'Score', type: 'neuron', status: 'ok', stage: 'E3' },
    { id: 'N-400', x: 620, y: 120, label: 'Decide', type: 'neuron', status: 'error', stage: 'E4' },
    { id: 'N-401', x: 620, y: 260, label: 'Route', type: 'neuron', status: 'ok', stage: 'E4' },
    { id: 'N-500', x: 780, y: 180, label: 'Execute', type: 'neuron', status: 'ok', stage: 'E5' },
  ];

  const edges = [
    ['N-100', 'N-200'], ['N-100', 'N-201'], ['N-101', 'N-201'], ['N-101', 'N-202'],
    ['N-200', 'N-300'], ['N-201', 'N-300'], ['N-201', 'N-301'], ['N-202', 'N-301'],
    ['N-300', 'N-400'], ['N-301', 'N-400'], ['N-301', 'N-401'],
    ['N-400', 'N-500'], ['N-401', 'N-500'],
  ];

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
  const statusColor = s => s === 'error' ? 'var(--status-error)' : s === 'warn' ? 'var(--status-warn)' : 'var(--status-ok)';

  return (
    <Surface depth={1} radius="lg" style={{ flex: 1, minHeight: 360, overflow: 'hidden', position: 'relative' }}>
      <div style={{ padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <PulseIndicator color="var(--status-ok)" />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Live Topology</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
          {['E1','E2','E3','E4','E5'].map(s => <StageBadge key={s} stage={s} style={{ fontSize: '9px' }} />)}
        </div>
      </div>

      <svg ref={canvasRef} width="100%" height="340" viewBox="0 0 900 360" style={{ display: 'block' }}>
        {/* Stage backgrounds */}
        {[{ x: 20, w: 160, stage: 'e1' }, { x: 190, w: 180, stage: 'e2' }, { x: 380, w: 160, stage: 'e3' }, { x: 550, w: 180, stage: 'e4' }, { x: 740, w: 140, stage: 'e5' }].map(s => (
          <rect key={s.stage} x={s.x} y={10} width={s.w} height={340} rx="12" fill={`var(--stage-${s.stage})`} opacity="0.04" />
        ))}

        {/* Edges */}
        {edges.map(([from, to], i) => {
          const a = nodeMap[from], b = nodeMap[to];
          const active = selected === from || selected === to || hovNode === from || hovNode === to;
          return (
            <line key={i} x1={a.x + 40} y1={a.y + 18} x2={b.x} y2={b.y + 18}
              stroke={active ? 'var(--accent)' : 'var(--border-subtle)'}
              strokeWidth={active ? 2 : 1} opacity={active ? 1 : 0.5}
              strokeDasharray={active ? 'none' : '4 3'}
              style={{ transition: 'all var(--dur-base) var(--ease-fluid)' }}
            />
          );
        })}

        {/* Flow particles on edges */}
        {edges.map(([from, to], i) => {
          const a = nodeMap[from], b = nodeMap[to];
          return (
            <circle key={`p-${i}`} r="2.5" fill="var(--accent)" opacity="0.6">
              <animateMotion dur={`${2 + Math.random()}s`} repeatCount="indefinite"
                path={`M${a.x + 40},${a.y + 18} L${b.x},${b.y + 18}`} />
            </circle>
          );
        })}

        {/* Nodes */}
        {nodes.map(n => {
          const isHov = hovNode === n.id;
          const isSel = selected === n.id;
          return (
            <g key={n.id} onClick={() => setSelected(s => s === n.id ? null : n.id)}
              onMouseEnter={() => setHovNode(n.id)} onMouseLeave={() => setHovNode(null)}
              style={{ cursor: 'pointer' }}>
              {/* Glow */}
              {(isHov || isSel) && <rect x={n.x - 4} y={n.y - 4} width={88} height={44} rx="14" fill={statusColor(n.status)} opacity="0.12" />}
              {/* Body */}
              <rect x={n.x} y={n.y} width={80} height={36} rx="10"
                fill="var(--bg-raised)" stroke={isSel ? 'var(--accent)' : isHov ? statusColor(n.status) : 'var(--border-hairline)'}
                strokeWidth={isSel ? 2 : 1} />
              {/* Status dot */}
              <circle cx={n.x + 12} cy={n.y + 18} r="3.5" fill={statusColor(n.status)}>
                {n.status !== 'ok' && <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />}
              </circle>
              {/* Label */}
              <text x={n.x + 24} y={n.y + 22} fontSize="11" fontFamily="var(--font-mono)" fill="var(--text-primary)" fontWeight="500">{n.label}</text>
            </g>
          );
        })}
      </svg>

      {/* Selection inspector mini */}
      {selected && (() => {
        const n = nodeMap[selected];
        return (
          <div style={{
            position: 'absolute', bottom: 'var(--sp-3)', right: 'var(--sp-3)', width: 220,
            background: 'var(--bg-glass-dense)', backdropFilter: 'blur(var(--blur-heavy))',
            border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-md)', padding: 'var(--sp-3)',
            animation: 'fadeIn var(--dur-soft) var(--ease-fluid)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>{n.id}</span>
              <StatusDot status={n.status} size={6} pulse={n.status !== 'ok'} />
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--sp-2)' }}>{n.label}</div>
            <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
              <StageBadge stage={n.stage} />
              <MetricPill label="Lat" value={Math.floor(80 + Math.random() * 200)} unit="ms" compact style={{ flex: 1 }} />
            </div>
          </div>
        );
      })()}
    </Surface>
  );
};

/* ── Stream Ticker ── */
const StreamTicker = () => {
  const [events, setEvents] = useState([]);
  const tickerRef = useRef(null);

  useEffect(() => {
    const types = ['run.start', 'run.complete', 'neuron.fire', 'synapse.deliver', 'error.timeout', 'model.call', 'memory.write'];
    const gws = ['GW-2847', 'GW-3091', 'GW-1563', 'GW-5112', 'GW-2200'];
    let idx = 0;
    const add = () => {
      const t = types[Math.floor(Math.random() * types.length)];
      const gw = gws[Math.floor(Math.random() * gws.length)];
      const isErr = t.startsWith('error');
      setEvents(prev => [{ id: idx++, type: t, gw, time: new Date().toLocaleTimeString('en', { hour12: false }), isErr }, ...prev].slice(0, 50));
    };
    const i = setInterval(add, 1800);
    for (let j = 0; j < 8; j++) add();
    return () => clearInterval(i);
  }, []);

  return (
    <Surface depth={0} radius="md" style={{ overflow: 'hidden' }}>
      <div style={{ padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <PulseIndicator color="var(--cyan)" />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Stream Ticker</span>
        </div>
        <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{events.length} events</span>
      </div>
      <div ref={tickerRef} style={{ maxHeight: 280, overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
        {events.map((ev, i) => (
          <div key={ev.id} style={{
            display: 'flex', gap: 'var(--sp-3)', padding: '4px var(--sp-4)', borderBottom: '1px solid var(--border-hairline)',
            animation: i === 0 ? 'fadeIn var(--dur-soft) var(--ease-fluid)' : 'none',
          }}>
            <span style={{ color: 'var(--text-tertiary)', width: 60, flexShrink: 0 }}>{ev.time}</span>
            <span style={{
              padding: '0 6px', borderRadius: 'var(--r-full)', fontSize: '10px',
              background: ev.isErr ? 'var(--status-error-bg)' : 'var(--bg-raised)',
              color: ev.isErr ? 'var(--status-error)' : 'var(--text-secondary)',
              flexShrink: 0,
            }}>{ev.type}</span>
            <span style={{ color: 'var(--accent)' }}>{ev.gw}</span>
          </div>
        ))}
      </div>
    </Surface>
  );
};

/* ── Active Gateways Panel ── */
const ActiveGatewaysPanel = () => {
  const active = MOCK_GATEWAYS.filter(g => g.status !== 'error').slice(0, 5);
  return (
    <Surface depth={0} radius="md" style={{ overflow: 'hidden' }}>
      <div style={{ padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--border-hairline)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Active Gateways</span>
      </div>
      {active.map(gw => (
        <div key={gw.id} style={{
          display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: 'var(--sp-2) var(--sp-4)',
          borderBottom: '1px solid var(--border-hairline)',
        }}>
          <StatusDot status={gw.status} size={5} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-primary)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{gw.id} {gw.name}</span>
          <Sparkline data={gw.throughput} width={48} height={14} color="var(--accent)" />
          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{gw.latency}ms</span>
        </div>
      ))}
    </Surface>
  );
};

/* ── Alerts & Incidents ── */
const AlertsPanel = () => {
  const alerts = MOCK_ANOMALIES.filter(a => a.type === 'error' || a.type === 'warn');
  return (
    <Surface depth={0} radius="md" style={{ overflow: 'hidden' }}>
      <div style={{ padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Alerts & Incidents</span>
        <ErrorTag count={alerts.length} />
      </div>
      {alerts.map((a, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-2)', padding: 'var(--sp-2) var(--sp-4)',
          borderBottom: '1px solid var(--border-hairline)',
          background: a.type === 'error' ? 'var(--status-error-bg)' : 'transparent',
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: `var(--status-${a.type})`, marginTop: 5, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{a.msg}</div>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginTop: 2 }}>{a.time}</div>
          </div>
        </div>
      ))}
    </Surface>
  );
};

/* ── Backpressure Map ── */
const BackpressureMap = () => {
  const data = MOCK_GATEWAYS.map(gw => ({
    id: gw.id,
    pressure: Math.floor(Math.random() * 100),
    status: gw.status,
  }));

  return (
    <Surface depth={0} radius="md" style={{ overflow: 'hidden' }}>
      <div style={{ padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--border-hairline)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Backpressure</span>
      </div>
      <div style={{ padding: 'var(--sp-3)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
        {data.map(d => (
          <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', width: 52 }}>{d.id}</span>
            <div style={{ flex: 1, height: 6, background: 'var(--bg-surface)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                width: `${d.pressure}%`, height: '100%', borderRadius: 3,
                background: d.pressure > 80 ? 'var(--status-error)' : d.pressure > 50 ? 'var(--status-warn)' : 'var(--status-ok)',
                transition: 'width 1s ease',
              }} />
            </div>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', width: 28, textAlign: 'right' }}>{d.pressure}%</span>
          </div>
        ))}
      </div>
    </Surface>
  );
};

/* ── Live Page Assembly ── */
const LivePage = () => {
  const { isMobile, isTablet, isCompact } = useBreakpoint();
  const pad = isMobile ? 'var(--sp-3)' : 'var(--sp-6)';

  return (
    <div style={{ padding: pad, display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', maxWidth: 1600, margin: '0 auto', height: '100%' }}>
      {/* Top: Topology + Ticker */}
      <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '2fr 1fr', gap: 'var(--sp-4)', flex: isCompact ? undefined : 1, minHeight: 0 }}>
        <LiveTopologyCanvas />
        <StreamTicker />
      </div>

      {/* Bottom: Active + Alerts + Backpressure */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 1fr', gap: 'var(--sp-4)' }}>
        <ActiveGatewaysPanel />
        <AlertsPanel />
        <BackpressureMap />
      </div>
    </div>
  );
};

Object.assign(window, { LiveTopologyCanvas, StreamTicker, ActiveGatewaysPanel, AlertsPanel, BackpressureMap, LivePage });
