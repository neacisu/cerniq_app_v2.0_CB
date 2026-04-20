'use client';

import type { BrainSseEvent } from '../lib/use-brain-sse';
import { useBrainSse } from '../lib/use-brain-sse';

function formatLastEventPreview(last: BrainSseEvent | undefined): string {
  if (last === undefined) {
    return '—';
  }
  if (typeof last.type === 'string') {
    return last.type;
  }
  return JSON.stringify(last).slice(0, 200);
}

/**
 * Telemetrie tray — SSE real prin `/api/live` (proxy API sau mod local).
 * @see docs/enterprise/ui-sse-optimistic-realtime.md
 */
export function BrainStatusPanel() {
  const { events, connected } = useBrainSse({ url: '/api/live', throttleMs: 150 });
  const last = events.at(-1);
  const preview = formatLastEventPreview(last);

  return (
    <section
      data-testid="cerniq-brain-status"
      className="rounded-lg border border-cb-border bg-cb-nav-hover/20 p-3 text-sm text-cb-ink"
    >
      <h2 className="mt-0 text-base font-semibold text-cb-ink">Cerniq Cognitive Brain — status</h2>
      <p data-testid="sse-state" className="text-cb-muted">
        SSE:{' '}
        <strong className="text-cb-ink">{connected ? 'open' : 'reconnecting'}</strong>
      </p>
      <p data-testid="sse-last" className="font-mono text-xs text-cb-muted">
        {preview}
      </p>
      <p className="text-xs text-cb-muted">
        Redis / Temporal: configurație prin variabile de mediu (stacks-02); fără datastore duplicat în
        compose.
      </p>
    </section>
  );
}
