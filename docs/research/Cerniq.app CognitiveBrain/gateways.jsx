/* Cerniq CB V2 — Gateways Index + Gateway Detail */

/* ═══════ GATEWAYS INDEX ═══════ */

const GatewayCard = ({ gw, onClick }) => {
  const [hov, setHov] = useState(false);
  const color = gw.status === 'error' ? 'var(--status-error)' : gw.status === 'warn' ? 'var(--status-warn)' : 'var(--status-ok)';

  return (
    <Surface depth={hov ? 1 : 0} radius="md" onClick={onClick}
      style={{
        padding: 'var(--sp-4)', cursor: 'pointer',
        transform: hov ? 'translateY(-2px)' : 'none',
        borderColor: hov ? color : undefined,
        transition: 'all var(--dur-base) var(--ease-snappy)',
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <StatusDot status={gw.status} size={6} pulse={gw.status === 'error'} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{gw.id}</span>
        </div>
        <StageBadge stage={gw.stage} />
      </div>

      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--sp-3)', lineHeight: 1.4 }}>{gw.name}</div>

      <Sparkline data={gw.throughput} width={200} height={24} color={color} fill style={{ marginBottom: 'var(--sp-3)', width: '100%' }} />

      <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
        <MetricPill label="Runs" value={gw.runs} compact style={{ flex: 1 }} />
        <MetricPill label="Latency" value={gw.latency} unit="ms" compact
          status={gw.latency > 300 ? 'error' : gw.latency > 200 ? 'warn' : undefined}
          style={{ flex: 1 }} />
        {gw.errors > 0 && <ErrorTag count={gw.errors} />}
      </div>
    </Surface>
  );
};

const GatewaysIndex = () => {
  const { go } = useNav();
  const { isMobile, isTablet, isCompact } = useBreakpoint();
  const [search, setSearch] = useState('');
  const [view, setView] = useState(isMobile ? 'cards' : 'cards');
  const [stageFilter, setStageFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(!isMobile);

  const filtered = MOCK_GATEWAYS.filter(gw => {
    if (search && !gw.id.toLowerCase().includes(search.toLowerCase()) && !gw.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (stageFilter && gw.stage !== stageFilter) return false;
    if (statusFilter && gw.status !== statusFilter) return false;
    return true;
  });

  const pad = isMobile ? 'var(--sp-3)' : 'var(--sp-6)';

  return (
    <div style={{ padding: pad, maxWidth: 1600, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: 'var(--sp-4)', flexDirection: isMobile ? 'column' : 'row', gap: 'var(--sp-3)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600 }}>Gateways</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{MOCK_GATEWAYS.length} cognitive pathways</div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center', width: isMobile ? '100%' : 'auto' }}>
          <SearchField value={search} onChange={setSearch} placeholder="Search gateways…" style={{ width: isMobile ? '100%' : 220, flex: isMobile ? 1 : undefined }} />
          {!isMobile && (
            <SegmentedControl
              options={[{ value: 'cards', label: '▦' }, { value: 'table', label: '☰' }, { value: 'matrix', label: '▥' }]}
              value={view} onChange={setView}
            />
          )}
          {isMobile && (
            <IconButton icon="⫶" onClick={() => setFiltersOpen(f => !f)} active={filtersOpen} title="Filters" />
          )}
        </div>
      </div>

      {/* Filters */}
      {(filtersOpen || !isMobile) && (
        <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)', flexWrap: 'wrap' }}>
          <FilterChip label="All" active={!stageFilter && !statusFilter} onClick={() => { setStageFilter(null); setStatusFilter(null); }} />
          {['E1','E2','E3','E4','E5'].map(s => (
            <FilterChip key={s} label={s} active={stageFilter === s} onClick={() => setStageFilter(stageFilter === s ? null : s)}
              count={MOCK_GATEWAYS.filter(g => g.stage === s).length} />
          ))}
          <Hairline vertical style={{ margin: '0 var(--sp-2)' }} />
          {['ok','warn','error'].map(s => (
            <FilterChip key={s} label={s} active={statusFilter === s} onClick={() => setStatusFilter(statusFilter === s ? null : s)}
              count={MOCK_GATEWAYS.filter(g => g.status === s).length} />
          ))}
        </div>
      )}

      {/* Content */}
      {(view === 'cards' || isMobile) && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--sp-4)' }}>
          {filtered.map(gw => <GatewayCard key={gw.id} gw={gw} onClick={() => go('gateway-detail')} />)}
        </div>
      )}

      {view === 'table' && (
        <Surface depth={0} radius="md" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                {['Status', 'ID', 'Name', 'Stage', 'Runs', 'Latency', 'Errors', 'Throughput'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '10px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(gw => (
                <tr key={gw.id} onClick={() => go('gateway-detail')}
                  style={{ borderBottom: '1px solid var(--border-hairline)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '8px 12px' }}><StatusDot status={gw.status} size={6} /></td>
                  <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{gw.id}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{gw.name}</td>
                  <td style={{ padding: '8px 12px' }}><StageBadge stage={gw.stage} /></td>
                  <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>{gw.runs}</td>
                  <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: gw.latency > 300 ? 'var(--status-error)' : 'var(--text-secondary)' }}>{gw.latency}ms</td>
                  <td style={{ padding: '8px 12px' }}>{gw.errors > 0 ? <ErrorTag count={gw.errors} /> : <span style={{ color: 'var(--text-tertiary)' }}>—</span>}</td>
                  <td style={{ padding: '8px 12px' }}><Sparkline data={gw.throughput} width={60} height={14} color="var(--accent)" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Surface>
      )}

      {view === 'matrix' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 'var(--sp-2)' }}>
          {filtered.map(gw => {
            const color = gw.status === 'error' ? 'var(--status-error)' : gw.status === 'warn' ? 'var(--status-warn)' : 'var(--status-ok)';
            return (
              <div key={gw.id} onClick={() => go('gateway-detail')} style={{
                padding: 'var(--sp-3)', borderRadius: 'var(--r-sm)', cursor: 'pointer',
                background: `color-mix(in oklch, ${color} 8%, var(--bg-surface))`,
                border: `1px solid color-mix(in oklch, ${color} 20%, transparent)`,
                textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color, marginBottom: 4 }}>{gw.id}</div>
                <Sparkline data={gw.throughput} width={60} height={16} color={color} style={{ margin: '0 auto' }} />
                <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginTop: 4 }}>{gw.latency}ms</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ═══════ GATEWAY DETAIL ═══════ */

const GW_STEPS = [
  { id: 'S1', neuron: 'N-100', label: 'Intake', status: 'ok', duration: '12ms' },
  { id: 'S2', neuron: 'N-200', label: 'Validate', status: 'ok', duration: '34ms' },
  { id: 'S3', neuron: 'N-300', label: 'Enrich', status: 'ok', duration: '67ms' },
  { id: 'S4', neuron: 'N-400', label: 'Process', status: 'running', duration: '—' },
  { id: 'S5', neuron: 'N-500', label: 'Store', status: 'queued', duration: '—' },
];

const GW_EVENTS = [
  { time: '14:23:07.234', type: 'neuron.fire', detail: 'N-100 Intake started' },
  { time: '14:23:07.246', type: 'synapse.deliver', detail: 'S-4401 payload delivered 2.4KB' },
  { time: '14:23:07.280', type: 'neuron.complete', detail: 'N-100 Intake → 12ms' },
  { time: '14:23:07.281', type: 'neuron.fire', detail: 'N-200 Validate started' },
  { time: '14:23:07.315', type: 'model.call', detail: 'claude-sonnet → classify intent' },
  { time: '14:23:07.382', type: 'synapse.deliver', detail: 'S-4402 payload delivered 1.8KB' },
  { time: '14:23:07.400', type: 'neuron.complete', detail: 'N-200 Validate → 34ms' },
  { time: '14:23:07.401', type: 'neuron.fire', detail: 'N-300 Enrich started' },
];

const GatewayPathCanvas = () => {
  const steps = GW_STEPS;
  const nodeW = 100, nodeH = 40, gap = 40;
  const totalW = steps.length * (nodeW + gap) - gap + 40;
  const statusColor = s => s === 'running' ? 'var(--cyan)' : s === 'ok' ? 'var(--status-ok)' : s === 'queued' ? 'var(--text-tertiary)' : 'var(--status-error)';

  return (
    <svg width="100%" height="80" viewBox={`0 0 ${totalW} 80`} style={{ display: 'block' }}>
      {steps.map((s, i) => {
        const x = 20 + i * (nodeW + gap);
        const color = statusColor(s.status);
        return (
          <g key={s.id}>
            {/* Connector */}
            {i < steps.length - 1 && (
              <>
                <line x1={x + nodeW} y1={40} x2={x + nodeW + gap} y2={40}
                  stroke={s.status === 'ok' ? 'var(--status-ok)' : 'var(--border-subtle)'}
                  strokeWidth="2" strokeDasharray={s.status === 'ok' ? 'none' : '4 3'} />
                {s.status === 'ok' && (
                  <circle r="3" fill="var(--status-ok)">
                    <animateMotion dur="1.5s" repeatCount="indefinite"
                      path={`M${x + nodeW},40 L${x + nodeW + gap},40`} />
                  </circle>
                )}
              </>
            )}
            {/* Node */}
            <rect x={x} y={20} width={nodeW} height={nodeH} rx="12" fill="var(--bg-raised)"
              stroke={color} strokeWidth={s.status === 'running' ? 2 : 1} />
            <circle cx={x + 14} cy={40} r="4" fill={color}>
              {s.status === 'running' && <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />}
            </circle>
            <text x={x + 26} y={37} fontSize="11" fontFamily="var(--font-body)" fontWeight="500" fill="var(--text-primary)">{s.label}</text>
            <text x={x + 26} y={50} fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-tertiary)">{s.duration}</text>
          </g>
        );
      })}
    </svg>
  );
};

const GatewayDetail = () => {
  const { go } = useNav();
  const { isMobile, isTablet, isCompact } = useBreakpoint();
  const [inspTab, setInspTab] = useState('summary');
  const [trayTab, setTrayTab] = useState('events');
  const [trayOpen, setTrayOpen] = useState(!isMobile);
  const [inspOpen, setInspOpen] = useState(!isCompact);

  const gw = MOCK_GATEWAYS[0];
  const pad = isMobile ? 'var(--sp-3)' : 'var(--sp-4) var(--sp-6)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: isMobile ? 'var(--sp-3)' : 'var(--sp-4) var(--sp-6)', borderBottom: '1px solid var(--border-hairline)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)', flexWrap: 'wrap' }}>
          <button onClick={() => go('gateways')} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '14px' }}>←</button>
          <StatusDot status={gw.status} size={8} pulse />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 'var(--text-lg)' : 'var(--text-xl)', fontWeight: 600 }}>{gw.id}</span>
          {!isMobile && <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{gw.name}</span>}
          <StageBadge stage={gw.stage} />
          <RunBadge status="running" id="R-99201" />
          {/* Inspector toggle for compact screens */}
          {isCompact && (
            <IconButton icon={inspOpen ? '⊟' : '⊞'} onClick={() => setInspOpen(o => !o)} title="Toggle Inspector" style={{ marginLeft: 'auto' }} />
          )}
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
          <LiquidButton variant="ghost" size="sm" icon="⏸">Pause</LiquidButton>
          <LiquidButton variant="ghost" size="sm" icon="↻">Restart</LiquidButton>
          {!isMobile && <LiquidButton variant="ghost" size="sm" icon="🔍">Inspect</LiquidButton>}
          {!isMobile && <LiquidButton variant="ghost" size="sm" icon="◎">Isolate Path</LiquidButton>}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: isCompact ? 'column' : 'row', overflow: 'hidden', minHeight: 0 }}>
        {/* Center workspace */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', padding: isMobile ? 'var(--sp-3)' : 'var(--sp-4) var(--sp-6)', gap: 'var(--sp-4)', minWidth: 0 }}>
          {/* Path Canvas */}
          <Surface depth={0} radius="md" style={{ padding: 'var(--sp-4)', overflow: 'auto' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--sp-2)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Gateway Path</div>
            <GatewayPathCanvas />
          </Surface>

          {/* Current Run Timeline */}
          <Surface depth={0} radius="md" style={{ padding: 'var(--sp-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-3)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Current Run Timeline</span>
              <RunBadge status="running" id="R-99201" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {GW_STEPS.map((s, i) => {
                const w = s.status === 'ok' ? '100%' : s.status === 'running' ? '60%' : '0%';
                const color = s.status === 'ok' ? 'var(--status-ok)' : s.status === 'running' ? 'var(--cyan)' : 'var(--bg-surface)';
                return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                    <span style={{ width: 60, fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{s.label}</span>
                    <div style={{ flex: 1, height: 8, background: 'var(--bg-surface)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        width: w, height: '100%', borderRadius: 4, background: color,
                        transition: 'width 1s ease',
                        ...(s.status === 'running' ? { background: `linear-gradient(90deg, var(--cyan), var(--cyan-dim))`, animation: 'shimmer 2s infinite' } : {}),
                      }} />
                    </div>
                    <span style={{ width: 40, fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'right' }}>{s.duration}</span>
                  </div>
                );
              })}
            </div>
          </Surface>

          {/* Steps List */}
          <Surface depth={0} radius="md" style={{ overflow: 'hidden' }}>
            <div style={{ padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--border-hairline)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Steps</span>
            </div>
            {GW_STEPS.map(s => (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: 'var(--sp-2) var(--sp-4)',
                borderBottom: '1px solid var(--border-hairline)',
              }}>
                <StatusDot status={s.status === 'running' ? 'info' : s.status === 'ok' ? 'ok' : 'warn'} size={5} pulse={s.status === 'running'} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', width: 28 }}>{s.id}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', flex: 1 }}>{s.label}</span>
                {!isMobile && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>{s.neuron}</span>}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', width: 40, textAlign: 'right' }}>{s.duration}</span>
              </div>
            ))}
          </Surface>

          {/* Inline inspector on compact (shown below content when toggled) */}
          {isCompact && inspOpen && (
            <Surface depth={0} radius="md" style={{ overflow: 'hidden' }}>
              <TabBar tabs={[
                { id: 'summary', label: 'Summary' },
                { id: 'contracts', label: 'Contracts' },
                { id: 'controls', label: 'Controls' },
              ]} active={inspTab} onChange={setInspTab} style={{ padding: '0 var(--sp-3)' }} />
              <div style={{ padding: 'var(--sp-4)' }}>
                <InspectorContent tab={inspTab} />
              </div>
            </Surface>
          )}
        </div>

        {/* Right Inspector Dock — desktop only */}
        {!isCompact && (
          <div style={{
            width: 340, flexShrink: 0, borderLeft: '1px solid var(--border-hairline)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-surface)',
          }}>
            <TabBar tabs={[
              { id: 'summary', label: 'Summary' },
              { id: 'contracts', label: 'Contracts' },
              { id: 'controls', label: 'Controls' },
            ]} active={inspTab} onChange={setInspTab} style={{ padding: '0 var(--sp-3)' }} />
            <div style={{ flex: 1, overflow: 'auto', padding: 'var(--sp-4)' }}>
              <InspectorContent tab={inspTab} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Telemetry Tray */}
      {trayOpen && !isMobile && (
        <div style={{
          height: 200, flexShrink: 0, borderTop: '1px solid var(--border-hairline)',
          background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 var(--sp-4)', borderBottom: '1px solid var(--border-hairline)' }}>
            <TabBar tabs={[
              { id: 'events', label: 'Events', count: GW_EVENTS.length },
              { id: 'traces', label: 'Traces' },
              { id: 'metrics', label: 'Metrics' },
              { id: 'mutations', label: 'Mutations' },
            ]} active={trayTab} onChange={setTrayTab} />
            <IconButton icon="✕" size={24} onClick={() => setTrayOpen(false)} />
          </div>
          <div style={{ flex: 1, overflow: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
            {trayTab === 'events' && GW_EVENTS.map((ev, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--sp-3)', padding: '3px var(--sp-4)', borderBottom: '1px solid var(--border-hairline)' }}>
                <span style={{ color: 'var(--text-tertiary)', width: 90, flexShrink: 0 }}>{ev.time}</span>
                <span style={{
                  padding: '0 6px', borderRadius: 'var(--r-full)', fontSize: '10px',
                  background: ev.type.includes('error') ? 'var(--status-error-bg)' : 'var(--bg-raised)',
                  color: ev.type.includes('model') ? 'var(--cyan)' : 'var(--text-secondary)', flexShrink: 0,
                }}>{ev.type}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{ev.detail}</span>
              </div>
            ))}
            {trayTab === 'metrics' && (
              <div style={{ padding: 'var(--sp-4)', display: 'flex', gap: 'var(--sp-4)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: 'var(--sp-2)' }}>THROUGHPUT</div>
                  <Sparkline data={genSparkline(30, 89, 15)} width={200} height={40} color="var(--accent)" fill />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: 'var(--sp-2)' }}>LATENCY</div>
                  <Sparkline data={genSparkline(30, 142, 30)} width={200} height={40} color="var(--cyan)" fill />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: 'var(--sp-2)' }}>ERROR RATE</div>
                  <Sparkline data={genSparkline(30, 0.24, 0.1)} width={200} height={40} color="var(--status-error)" fill />
                </div>
              </div>
            )}
            {(trayTab === 'traces' || trayTab === 'mutations') && (
              <div style={{ padding: 'var(--sp-6)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>
                {trayTab === 'traces' ? 'Trace explorer — select a run to view traces' : 'No mutations recorded for current run'}
              </div>
            )}
          </div>
        </div>
      )}

      {!trayOpen && !isMobile && (
        <div style={{ height: 36, flexShrink: 0, borderTop: '1px solid var(--border-hairline)', display: 'flex', alignItems: 'center', padding: '0 var(--sp-4)', background: 'var(--bg-surface)' }}>
          <button onClick={() => setTrayOpen(true)} style={{
            background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer',
            fontSize: 'var(--text-xs)', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
          }}>▲ Show Telemetry Tray</button>
        </div>
      )}
    </div>
  );
};

/* ── Inspector Content (shared between dock and inline) ── */
const InspectorContent = ({ tab }) => {
  if (tab === 'summary') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      <div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--sp-2)' }}>Identity</div>
        <div style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>GW-2847</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>Intake→Process→Validate</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-2)' }}>
        <MetricPill label="Total Runs" value="1,247" />
        <MetricPill label="Avg Latency" value="142" unit="ms" />
        <MetricPill label="Error Rate" value="0.24" unit="%" status="ok" />
        <MetricPill label="Throughput" value="89" unit="/min" />
      </div>
      <div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--sp-2)' }}>Throughput (24h)</div>
        <Sparkline data={genSparkline(48, 89, 15)} width={290} height={40} color="var(--accent)" fill />
      </div>
      <div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--sp-2)' }}>Latency Distribution</div>
        <HistogramMini data={genHisto(16)} width={290} height={32} />
      </div>
      <div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--sp-2)' }}>Upstream</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--cyan)' }}>S-4401 → N-100</div>
      </div>
      <div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--sp-2)' }}>Downstream</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--cyan)' }}>N-500 → S-4410</div>
      </div>
    </div>
  );

  if (tab === 'contracts') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      {[{ name: 'Input Schema', type: 'JSON Schema', version: 'v3.2' }, { name: 'Output Schema', type: 'JSON Schema', version: 'v3.2' }, { name: 'SLA', type: 'Policy', version: 'v1.0' }].map((c, i) => (
        <Surface key={i} depth={0} radius="sm" style={{ padding: 'var(--sp-3)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-primary)', marginBottom: 2 }}>{c.name}</div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{c.type}</span>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>{c.version}</span>
          </div>
        </Surface>
      ))}
    </div>
  );

  if (tab === 'controls') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      <LiquidButton variant="accent" size="md" icon="▶" style={{ width: '100%', justifyContent: 'center' }}>Trigger Run</LiquidButton>
      <LiquidButton variant="default" size="md" icon="⏸" style={{ width: '100%', justifyContent: 'center' }}>Pause Gateway</LiquidButton>
      <LiquidButton variant="default" size="md" icon="↻" style={{ width: '100%', justifyContent: 'center' }}>Reset State</LiquidButton>
      <Hairline />
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Concurrency</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
        <input type="range" min="1" max="16" defaultValue="4" style={{ flex: 1, accentColor: 'var(--accent)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>4</span>
      </div>
    </div>
  );

  return null;
};

Object.assign(window, { GatewayCard, GatewaysIndex, GatewayPathCanvas, GatewayDetail, InspectorContent });
