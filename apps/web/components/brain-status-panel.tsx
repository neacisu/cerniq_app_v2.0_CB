'use client';

import { useEffect, useState } from 'react';

type SseState = 'idle' | 'open' | 'error';

export function BrainStatusPanel() {
  const [sse, setSse] = useState<SseState>('idle');
  const [lastEvent, setLastEvent] = useState<string>('');

  useEffect(() => {
    const es = new EventSource('/api/live');
    es.onopen = () => setSse('open');
    es.onerror = () => setSse('error');
    es.onmessage = (ev) => {
      setLastEvent(ev.data ?? '');
    };
    return () => es.close();
  }, []);

  return (
    <section
      data-testid="cerniq-brain-status"
      style={{
        margin: '1rem 0',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: 8,
        maxWidth: 560,
      }}
    >
      <h2 style={{ marginTop: 0 }}>Cerniq Cognitive Brain — status</h2>
      <p data-testid="sse-state">
        SSE: <strong>{sse}</strong>
      </p>
      <p data-testid="sse-last" style={{ fontFamily: 'monospace', fontSize: 12 }}>
        {lastEvent || '—'}
      </p>
      <p style={{ fontSize: 12, color: '#444' }}>
        Redis / Temporal: configurație prin variabile de mediu (stacks-02); fără datastore
        duplicat în compose.
      </p>
    </section>
  );
}
