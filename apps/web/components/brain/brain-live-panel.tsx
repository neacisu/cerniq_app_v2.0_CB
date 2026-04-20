'use client';

import { BrainSseToolbar } from './brain-sse-toolbar';

/** Live — flux SSE prin `/api/live` (proxy către API când e configurat). */
export function BrainLivePanel() {
  return (
    <div className="space-y-4">
      <BrainSseToolbar contextLabel="Live" />
      <div className="rounded-xl border border-dashed border-cb-border p-4 text-sm text-cb-muted">
        Stream-ul este afișat în toolbar (tip ultim eveniment). Lista detaliată evenimente se
        conectează la contractul SSE backend — fără PII în consolă client (mod debug doar metadate).
      </div>
    </div>
  );
}
