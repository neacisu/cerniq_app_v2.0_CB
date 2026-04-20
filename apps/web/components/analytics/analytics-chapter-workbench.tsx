'use client';

import { useState } from 'react';
import { BrainCrossLinks } from '../shell/brain-cross-links';

export type AnalyticsChapterMode = 'executive' | 'operational' | 'drill-down';

const DEMO_TRACE = 'trace-demo-1';
const DEMO_GATEWAY = 'gateway-hello';
const DEMO_NEURON = 'neuron-ping';

/** Șablon blueprint §24.6 — KPI, bandă narativă, drill-down sheet, legături Brain. */
export function AnalyticsChapterWorkbench({
  mode,
}: Readonly<{ mode: AnalyticsChapterMode }>) {
  const [sheetOpen, setSheetOpen] = useState(mode === 'drill-down');
  const [selectedKpi, setSelectedKpi] = useState<string | null>(
    mode === 'drill-down' ? 'kpi-attribution' : null,
  );

  const kpis =
    mode === 'operational'
      ? [
          { id: 'ops-throughput', label: 'Throughput gateway', variance: '−2.1% vs 7d' },
          { id: 'ops-latency', label: 'Latency p95 model', variance: '+40 ms' },
          { id: 'ops-dlq', label: 'DLQ depth', variance: '3 evenimente' },
        ]
      : [
          { id: 'kpi-revenue', label: 'Revenue YTD', variance: '+4.2% vs plan' },
          { id: 'kpi-funnel', label: 'Funnel conversion', variance: '−0.8 pp' },
          { id: 'kpi-attribution', label: 'Attribution Brain', variance: 'Gateway +12%' },
        ];

  return (
    <article className="space-y-6" aria-labelledby="analytics-chapter-title">
      <h2 id="analytics-chapter-title" className="sr-only">
        Analytics — {mode}
      </h2>

      <section aria-labelledby="kpi-band" className="space-y-3">
        <h3 id="kpi-band" className="text-sm font-medium text-cb-ink">
          Bandă KPI (executive / operational)
        </h3>
        <div className="grid gap-3 @lg:grid-cols-3">
          {kpis.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => {
                setSelectedKpi(k.id);
                setSheetOpen(true);
              }}
              className="rounded-lg border border-cb-border bg-cb-nav-hover/30 p-4 text-left transition hover:bg-cb-nav-hover/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/80"
            >
              <p className="text-xs uppercase tracking-wide text-cb-muted">{k.label}</p>
              <p className="mt-2 text-lg font-semibold text-cb-ink">—</p>
              <p className="mt-1 text-xs text-cb-muted">{k.variance}</p>
              <p className="mt-2 text-xs text-cyan-300/90">Drill-down → run / trace</p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-dashed border-cb-border p-4">
        <h3 className="text-sm font-medium text-cb-ink">Rezumat narativ</h3>
        <p className="mt-2 text-sm text-cb-muted">
          Date demonstrative până la API-uri analytics; fiecare KPI susține salt către{' '}
          <strong className="text-cb-ink">run</strong>, <strong className="text-cb-ink">trace</strong>{' '}
          sau entitate business (blueprint §23.9).
        </p>
      </section>

      <section className="rounded-lg border border-cb-border bg-cb-nav-hover/25 p-4">
        <h3 className="text-sm font-medium text-cb-ink">Grilă analitică</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <caption className="sr-only">Indicatori și legături drill-down</caption>
            <thead className="border-b border-cb-border text-xs uppercase text-cb-muted">
              <tr>
                <th className="py-2 pr-4 font-medium">Dimensiune</th>
                <th className="py-2 pr-4 font-medium">Valoare</th>
                <th className="py-2 font-medium">Acțiune</th>
              </tr>
            </thead>
            <tbody className="text-cb-ink">
              <tr className="border-b border-cb-border/60">
                <td className="py-2 pr-4">Gateway activ</td>
                <td className="py-2 pr-4 text-cb-muted">demo</td>
                <td className="py-2">
                  <button
                    type="button"
                    className="text-cyan-300 hover:underline"
                    onClick={() => {
                      setSelectedKpi('row-gateway');
                      setSheetOpen(true);
                    }}
                  >
                    Drill-down
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Trace eșantion</td>
                <td className="py-2 pr-4 font-mono text-xs text-cb-muted">{DEMO_TRACE}</td>
                <td className="py-2">
                  <button
                    type="button"
                    className="text-cyan-300 hover:underline"
                    onClick={() => {
                      setSelectedKpi('row-trace');
                      setSheetOpen(true);
                    }}
                  >
                    Drill-down
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {sheetOpen ? (
        <aside
          className="fixed inset-y-0 right-0 z-40 w-full max-w-md border-l border-cb-border bg-zinc-950/95 p-4 shadow-xl backdrop-blur-md @container"
          aria-label="Drill-down analytics"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-cb-ink">Drill-down</h3>
            <button
              type="button"
              className="rounded-md px-2 py-1 text-xs text-cb-muted hover:bg-cb-nav-hover"
              onClick={() => setSheetOpen(false)}
            >
              Închide
            </button>
          </div>
          <p className="mt-2 text-xs text-cb-muted">
            KPI selectat: <span className="text-cb-ink">{selectedKpi ?? '—'}</span>
          </p>
          <p className="mt-4 text-sm text-cb-muted">
            Salturi obligatorii către dovezi Brain (§24.6 jump-to-source): trace, gateway, explicație
            neuron.
          </p>
          <div className="mt-4">
            <BrainCrossLinks
              traceId={DEMO_TRACE}
              gatewayId={DEMO_GATEWAY}
              neuronId={DEMO_NEURON}
            />
          </div>
        </aside>
      ) : null}

      {sheetOpen ? (
        <button
          type="button"
          aria-label="Închide drill-down"
          className="fixed inset-0 z-30 bg-black/40"
          onClick={() => setSheetOpen(false)}
        />
      ) : null}
    </article>
  );
}
