'use client';

import { useEffect, useRef, useState } from 'react';

export interface BrainSseEvent {
  readonly type?: string;
  readonly [k: string]: unknown;
}

const MAX_EVENTS = 100;

/**
 * EventSource cu reconectare simplă (exponential backoff) — fără PII în loguri client.
 */
export function useBrainSse(url = '/api/live') {
  const [events, setEvents] = useState<BrainSseEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [debug, setDebug] = useState(false);
  const attemptRef = useRef(0);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const connect = () => {
      if (cancelled) return;
      const es = new EventSource(url);
      esRef.current = es;
      es.onopen = () => {
        attemptRef.current = 0;
        setConnected(true);
      };
      es.onerror = () => {
        setConnected(false);
        es.close();
        const delay = Math.min(30_000, 500 * 2 ** attemptRef.current);
        attemptRef.current += 1;
        timer = setTimeout(connect, delay);
      };
      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data) as BrainSseEvent;
          setEvents((prev) => [...prev.slice(-(MAX_EVENTS - 1)), data]);
        } catch {
          /* ignore */
        }
      };
    };

    connect();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      esRef.current?.close();
      esRef.current = null;
    };
  }, [url]);

  return { events, connected, debug, setDebug };
}
