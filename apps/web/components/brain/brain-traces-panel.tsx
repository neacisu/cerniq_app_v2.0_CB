'use client';

import Link from 'next/link';
import { BrainSseToolbar } from './brain-sse-toolbar';

export type BrainTracesPanelProps = Readonly<{
  /** `trace` din query (ex. din BrainCrossLinks). */
  readonly highlightTraceId?: string;
}>;

/** Traces — explorare run; highlight din query fără persistență client sensibilă. */
export function BrainTracesPanel({ highlightTraceId }: BrainTracesPanelProps) {
  const rows = [
    { id: 'trace-demo-1', gateway: 'gateway-hello', status: 'ok' as const },
    { id: 'trace-demo-2', gateway: 'gateway-batch', status: 'error' as const },
  ];

  return (
    <div className="space-y-4">
      <BrainSseToolbar contextLabel="Traces" />
      {highlightTraceId ? (
        <p className="text-sm text-cb-ink">
          <label className="mr-2 text-cb-muted" htmlFor="brain-traces-highlight">
            Filtru din URL
          </label>
          <output
            id="brain-traces-highlight"
            className="rounded bg-cb-nav-hover px-1"
            aria-live="polite"
          >
            {highlightTraceId}
          </output>
        </p>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-cb-border">
        <table className="w-full min-w-[320px] text-left text-sm">
          <caption className="sr-only">Listă trace-uri demo</caption>
          <thead className="border-b border-cb-border bg-cb-nav-hover/40 text-xs uppercase text-cb-muted">
            <tr>
              <th className="px-3 py-2">Trace</th>
              <th className="px-3 py-2">Gateway</th>
              <th className="px-3 py-2">Stare</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const active = highlightTraceId === r.id;
              return (
                <tr
                  key={r.id}
                  className={
                    active ? 'bg-cb-nav-active/50' : 'border-t border-cb-border/60'
                  }
                >
                  <td className="px-3 py-2 font-mono text-xs">
                    <Link
                      href={`/brain/traces?trace=${encodeURIComponent(r.id)}`}
                      className="text-cb-accent underline"
                    >
                      {r.id}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-cb-muted">{r.gateway}</td>
                  <td className="px-3 py-2">{r.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
