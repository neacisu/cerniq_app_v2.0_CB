'use client';

import Link from 'next/link';
import { useBrainSse } from '../../lib/use-brain-sse';

export type BrainSseToolbarProps = Readonly<{
  /** Titlu scurt pentru context (ex. Live, Gateways). */
  readonly contextLabel: string;
}>;

/**
 * Organism comun Brain — stare SSE + legături rapide topology/traces/memory (blueprint §14, §23.2).
 */
export function BrainSseToolbar({ contextLabel }: BrainSseToolbarProps) {
  const { connected, events } = useBrainSse({ url: '/api/live', throttleMs: 200 });
  const last = events.at(-1);
  const lastType = typeof last?.type === 'string' ? last.type : '—';
  const titleId = `brain-sse-toolbar-title-${contextLabel.toLowerCase()}`;

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-wrap items-center gap-3 rounded-lg border border-cb-border bg-cb-nav-hover/40 px-3 py-2 text-xs text-cb-muted"
    >
      <span id={titleId} className="font-medium text-cb-ink">
        Telemetrie Brain — {contextLabel}
      </span>
      <span
        className={`rounded px-1.5 py-0.5 ${
          connected ? 'bg-emerald-950/50 text-emerald-300' : 'bg-amber-950/50 text-amber-200'
        }`}
        aria-live="polite"
      >
        SSE: {connected ? 'conectat' : 'reconectare…'}
      </span>
      <span className="hidden sm:inline" aria-live="polite">
        Ultim tip eveniment: <span className="text-cb-ink">{lastType}</span> (fără payload în UI)
      </span>
      <nav aria-label="Scurtături Brain" className="ml-auto flex flex-wrap gap-2">
        <Link className="text-cb-accent underline" href="/brain/topology">
          Topology
        </Link>
        <Link className="text-cb-accent underline" href="/brain/traces">
          Traces
        </Link>
        <Link className="text-cb-accent underline" href="/brain/memory">
          Memory
        </Link>
        <Link className="text-cb-accent underline" href="/brain/gateways">
          Gateways
        </Link>
      </nav>
    </section>
  );
}
