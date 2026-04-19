/* Cerniq CB V2 — Overview Page */

/* ── Mock data generators ── */
const genSparkline = (n = 20, base = 50, vol = 20) => Array.from({ length: n }, () => base + (Math.random() - 0.4) * vol);
const genHisto = (n = 12) => Array.from({ length: n }, () => Math.random() * 100);

const MOCK_GATEWAYS = [
  { id: 'GW-2847', name: 'Intake→Process→Validate', stage: 'E2', status: 'ok', runs: 1247, latency: 142, errors: 3, throughput: genSparkline(20, 80, 15) },
  { id: 'GW-3091', name: 'Enrich→Score→Route', stage: 'E3', status: 'ok', runs: 892, latency: 89, errors: 0, throughput: genSparkline(20, 60, 10) },
  { id: 'GW-1563', name: 'Classify→Tag→Store', stage: 'E1', status: 'warn', runs: 2341, latency: 203, errors: 12, throughput: genSparkline(20, 120, 30) },
  { id: 'GW-4420', name: 'Extract→Transform→Load', stage: 'E2', status: 'ok', runs: 567, latency: 167, errors: 1, throughput: genSparkline(20, 40, 8) },
  { id: 'GW-5112', name: 'Detect→Alert→Escalate', stage: 'E4', status: 'error', runs: 312, latency: 445, errors: 28, throughput: genSparkline(20, 30, 20) },
  { id: 'GW-2200', name: 'Summarize→Embed→Index', stage: 'E3', status: 'ok', runs: 1890, latency: 112, errors: 2, throughput: genSparkline(20, 95, 12) },
  { id: 'GW-6780', name: 'Parse→Validate→Commit', stage: 'E1', status: 'ok', runs: 3402, latency: 78, errors: 0, throughput: genSparkline(20, 150, 20) },
  { id: 'GW-8901', name: 'Monitor→Diagnose→Heal', stage: 'E5', status: 'warn', runs: 145, latency: 312, errors: 7, throughput: genSparkline(20, 20, 10) },
];

const MOCK_ANOMALIES = [
  { time: '14:23:07', type: 'error', msg: 'GW-5112 neuron N-882 timeout after 30s', gateway: 'GW-5112' },
  { time: '14:22:51', type: 'warn', msg: 'GW-1563 synapse lag >500ms on S-4401', gateway: 'GW-1563' },
  { time: '14:22:34', type: 'info', msg: 'GW-2847 auto-scaled to 4 concurrent runs', gateway: 'GW-2847' },
  { time: '14:22:12', type: 'error', msg: 'GW-5112 retry exhausted on step Escalate', gateway: 'GW-5112' },
  { time: '14:21:58', type: 'warn', msg: 'Model router fallback: gpt-4o → claude-sonnet', gateway: null },
  { time: '14:21:30', type: 'ok', msg: 'GW-8901 recovered — healing path restored', gateway: 'GW-8901' },
  { time: '14:21:02', type: 'info', msg: 'GW-6780 batch #4420 completed 340 items', gateway: 'GW-6780' },
  { time: '14:20:45', type: 'warn', msg: 'Memory space "orders" at 87% capacity', gateway: null },
];

const MOCK_RUNS = [
  { id: 'R-99201', gateway: 'GW-2847', status: 'running', started: '14:23:01', duration: '6s', neurons: 4 },
  { id: 'R-99200', gateway: 'GW-3091', status: 'success', started: '14:22:44', duration: '12s', neurons: 3 },
  { id: 'R-99199', gateway: 'GW-5112', status: 'failed', started: '14:22:30', duration: '28s', neurons: 5 },
  { id: 'R-99198', gateway: 'GW-6780', status: 'success', started: '14:22:15', duration: '4s', neurons: 2 },
  { id: 'R-99197', gateway: 'GW-1563', status: 'running', started: '14:22:01', duration: '22s', neurons: 6 },
  { id: 'R-99196', gateway: 'GW-2200', status: 'success', started: '14:21:50', duration: '8s', neurons: 3 },
];

/* ── Brain Health Hero ── */
const BrainHealthHero = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => { const i = setInterval(() => setTick(t => t + 1), 3000); return () => clearInterval(i); }, []);

  const health = 94;
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (health / 100) * circumference;

  return (
    <Surface depth={1} radius="lg" style={{ padding: 'var(--sp-6)', display: 'flex', alignItems: 'center', gap: 'var(--sp-8)', gridColumn: 'span 2' }}>
      {/* Ring */}
      <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-hairline)" strokeWidth="4" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--status-ok)" strokeWidth="4"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--status-ok)', lineHeight: 1 }}>{health}</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>health</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--sp-1)' }}>Brain Status</div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--sp-4)' }}>
          All cognitive pathways operational · 2 warnings · 1 critical
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
          <MetricPill label="Gateways" value="8" status="ok" compact />
          <MetricPill label="Active Runs" value="14" compact />
          <MetricPill label="Neurons" value="47" compact />
          <MetricPill label="Synapses" value="126" compact />
        </div>
      </div>
    </Surface>
  );
};

/* ── KPI Grid ── */
const KPIGrid = () => {
  const kpis = [
    { label: 'Throughput', value: '2.4k', unit: '/min', trend: 'up', spark: genSparkline(20, 2400, 300) },
    { label: 'Error Rate', value: '0.12', unit: '%', trend: 'down', status: 'ok', spark: genSparkline(20, 0.12, 0.05) },
    { label: 'Avg Latency', value: '148', unit: 'ms', spark: genSparkline(20, 148, 40) },
    { label: 'LLM Calls', value: '891', unit: '/min', spark: genSparkline(20, 891, 100) },
    { label: 'Queue Depth', value: '23', trend: 'down', spark: genSparkline(20, 23, 10) },
    { label: 'Model Saturation', value: '67', unit: '%', status: 'warn', spark: genSparkline(20, 67, 8) },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--sp-3)' }}>
      {kpis.map((k, i) => (
        <Surface key={i} depth={0} radius="md" style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{k.label}</span>
            {k.trend && <span style={{ fontSize: 'var(--text-xs)', color: k.trend === 'down' ? 'var(--status-ok)' : 'var(--status-warn)', fontFamily: 'var(--font-mono)' }}>
              {k.trend === 'up' ? '↑' : '↓'}
            </span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--sp-1)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', fontWeight: 600, color: k.status ? `var(--status-${k.status})` : 'var(--text-primary)', lineHeight: 1 }}>{k.value}</span>
            {k.unit && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{k.unit}</span>}
          </div>
          <Sparkline data={k.spark} width={130} height={20} color={k.status ? `var(--status-${k.status})` : 'var(--accent)'} fill />
        </Surface>
      ))}
    </div>
  );
};

/* ── Live Event River ── */
const LiveRiver = () => {
  const [events, setEvents] = useState(MOCK_ANOMALIES);
  const colors = { error: 'var(--status-error)', warn: 'var(--status-warn)', info: 'var(--status-info)', ok: 'var(--status-ok)' };
  const bgs = { error: 'var(--status-error-bg)', warn: 'var(--status-warn-bg)', info: 'var(--status-info-bg)', ok: 'var(--status-ok-bg)' };

  return (
    <Surface depth={0} radius="md" style={{ overflow: 'hidden' }}>
      <div style={{ padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <PulseIndicator color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Live Event River</span>
        </div>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{events.length} events</span>
      </div>
      <div style={{ maxHeight: 240, overflowY: 'auto' }}>
        {events.map((ev, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-3)', padding: 'var(--sp-2) var(--sp-4)',
            borderBottom: '1px solid var(--border-hairline)',
            animation: `fadeIn var(--dur-soft) var(--ease-fluid) ${i * 40}ms both`,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors[ev.type], marginTop: 5, flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', flexShrink: 0, width: 56 }}>{ev.time}</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', flex: 1, lineHeight: 1.4 }}>{ev.msg}</span>
            {ev.gateway && <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: colors[ev.type], flexShrink: 0 }}>{ev.gateway}</span>}
          </div>
        ))}
      </div>
    </Surface>
  );
};

/* ── Stage Lanes ── */
const StageLanes = () => {
  const { go } = useNav();
  const { isMobile } = useBreakpoint();
  const stages = [
    { id: 'E1', label: 'Intake', count: 2, health: 92, gateways: ['GW-1563', 'GW-6780'] },
    { id: 'E2', label: 'Process', count: 2, health: 97, gateways: ['GW-2847', 'GW-4420'] },
    { id: 'E3', label: 'Enrich', count: 2, health: 99, gateways: ['GW-3091', 'GW-2200'] },
    { id: 'E4', label: 'Decide', count: 1, health: 62, gateways: ['GW-5112'] },
    { id: 'E5', label: 'Operate', count: 1, health: 78, gateways: ['GW-8901'] },
  ];

  return (
    <Surface depth={0} radius="md" style={{ overflow: 'hidden' }}>
      <div style={{ padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--border-hairline)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Stage Lanes</span>
      </div>
      <div style={{ display: 'flex', gap: 1, padding: 'var(--sp-3)', flexDirection: isMobile ? 'column' : 'row' }}>
        {stages.map(s => {
          const color = `var(--stage-${s.id.toLowerCase()})`;
          const healthColor = s.health > 90 ? 'var(--status-ok)' : s.health > 70 ? 'var(--status-warn)' : 'var(--status-error)';
          return (
            <div key={s.id} style={{
              flex: 1, padding: 'var(--sp-3)', borderRadius: 'var(--r-sm)',
              background: `color-mix(in oklch, ${color} 8%, transparent)`,
              border: `1px solid color-mix(in oklch, ${color} 20%, transparent)`,
              display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', minWidth: 0,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <StageBadge stage={s.id} />
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: healthColor }}>{s.health}%</span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{s.count} gateways</div>
              <Sparkline data={genSparkline(12, s.health, 5)} width={80} height={16} color={color} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {s.gateways.map(gid => {
                  const gw = MOCK_GATEWAYS.find(g => g.id === gid);
                  return gw && (
                    <div key={gid} onClick={() => go('gateway-detail')} style={{
                      padding: '3px 6px', borderRadius: 'var(--r-xs)', background: 'var(--bg-glass)',
                      fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                      transition: 'background var(--dur-fast) var(--ease-snappy)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-glass)'}
                    >
                      <StatusDot status={gw.status} size={4} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{gid}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Surface>
  );
};

/* ── Recent Runs ── */
const RecentRuns = () => {
  const { go } = useNav();
  return (
    <Surface depth={0} radius="md" style={{ overflow: 'hidden' }}>
      <div style={{ padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Recent Runs</span>
        <LiquidButton variant="ghost" size="sm">View all</LiquidButton>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-hairline)' }}>
              {['Run', 'Gateway', 'Status', 'Started', 'Duration', 'Neurons'].map(h => (
                <th key={h} style={{ padding: '6px 12px', textAlign: 'left', color: 'var(--text-tertiary)', fontWeight: 500, fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '10px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_RUNS.map(r => (
              <tr key={r.id} onClick={() => go('gateway-detail')}
                style={{ borderBottom: '1px solid var(--border-hairline)', cursor: 'pointer', transition: 'background var(--dur-fast)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{r.id}</td>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{r.gateway}</td>
                <td style={{ padding: '8px 12px' }}><RunBadge status={r.status} /></td>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{r.started}</td>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{r.duration}</td>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{r.neurons}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Surface>
  );
};

/* ── Gateway Heatmap ── */
const GatewayHeatmap = () => {
  const { go } = useNav();
  return (
    <Surface depth={0} radius="md" style={{ overflow: 'hidden' }}>
      <div style={{ padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--border-hairline)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Gateway Heatmap</span>
      </div>
      <div style={{ padding: 'var(--sp-3)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--sp-2)' }}>
        {MOCK_GATEWAYS.map(gw => {
          const color = gw.status === 'error' ? 'var(--status-error)' : gw.status === 'warn' ? 'var(--status-warn)' : 'var(--status-ok)';
          return (
            <div key={gw.id} onClick={() => go('gateway-detail')} style={{
              padding: 'var(--sp-3)', borderRadius: 'var(--r-sm)', cursor: 'pointer',
              background: `color-mix(in oklch, ${color} 8%, var(--bg-surface))`,
              border: `1px solid color-mix(in oklch, ${color} 20%, transparent)`,
              transition: 'all var(--dur-fast) var(--ease-snappy)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = color; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = `color-mix(in oklch, ${color} 20%, transparent)`; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-1)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color }}>{gw.id}</span>
                <StatusDot status={gw.status} size={5} pulse={gw.status === 'error'} />
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: 'var(--sp-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{gw.name}</div>
              <Sparkline data={gw.throughput} width={90} height={14} color={color} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--sp-1)' }}>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{gw.latency}ms</span>
                {gw.errors > 0 && <ErrorTag count={gw.errors} style={{ fontSize: '9px', padding: '0 4px' }} />}
              </div>
            </div>
          );
        })}
      </div>
    </Surface>
  );
};

/* ── Model Router Status ── */
const ModelRouterStatus = () => {
  const models = [
    { name: 'gpt-4o', load: 72, latency: 340, calls: '412/min', status: 'ok' },
    { name: 'claude-sonnet', load: 58, latency: 280, calls: '289/min', status: 'ok' },
    { name: 'claude-haiku', load: 34, latency: 90, calls: '156/min', status: 'ok' },
    { name: 'llama-3.3', load: 89, latency: 120, calls: '34/min', status: 'warn' },
  ];

  return (
    <Surface depth={0} radius="md" style={{ overflow: 'hidden' }}>
      <div style={{ padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--border-hairline)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Model Router</span>
      </div>
      <div style={{ padding: 'var(--sp-2)' }}>
        {models.map((m, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: 'var(--sp-2) var(--sp-3)',
            borderRadius: 'var(--r-xs)',
          }}>
            <StatusDot status={m.status} size={5} />
            <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', width: 100 }}>{m.name}</span>
            <div style={{ flex: 1, height: 4, background: 'var(--bg-surface)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                width: `${m.load}%`, height: '100%', borderRadius: 2,
                background: m.load > 80 ? 'var(--status-warn)' : 'var(--status-ok)',
                transition: 'width 1s ease',
              }} />
            </div>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', width: 32, textAlign: 'right' }}>{m.load}%</span>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', width: 48, textAlign: 'right' }}>{m.latency}ms</span>
          </div>
        ))}
      </div>
    </Surface>
  );
};

/* ── Overview Page Assembly ── */
const OverviewPage = () => {
  const { isMobile, isTablet, isCompact } = useBreakpoint();
  const pad = isMobile ? 'var(--sp-3)' : 'var(--sp-6)';

  return (
    <div style={{ padding: pad, display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', maxWidth: 1600, margin: '0 auto' }}>
      {/* Hero row */}
      <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '2fr 1fr', gap: 'var(--sp-4)' }}>
        <BrainHealthHero />
        <ModelRouterStatus />
      </div>

      {/* KPIs */}
      <KPIGrid />

      {/* Stage Lanes */}
      <StageLanes />

      {/* Two-column: Heatmap + River */}
      <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr', gap: 'var(--sp-4)' }}>
        <GatewayHeatmap />
        <LiveRiver />
      </div>

      {/* Recent runs */}
      <RecentRuns />
    </div>
  );
};

Object.assign(window, {
  MOCK_GATEWAYS, MOCK_ANOMALIES, MOCK_RUNS,
  BrainHealthHero, KPIGrid, LiveRiver, StageLanes, RecentRuns, GatewayHeatmap, ModelRouterStatus,
  OverviewPage,
});
