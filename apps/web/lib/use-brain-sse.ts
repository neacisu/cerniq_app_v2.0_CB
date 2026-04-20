'use client';

import { useEffect, useRef, useState } from 'react';

export interface BrainSseEvent {
  readonly type?: string;
  readonly [k: string]: unknown;
}

const MAX_EVENTS = 100;

export interface UseBrainSseOptions {
  /** URL SSE (implicit `/api/live`). */
  readonly url?: string;
  /** Coalescează mesaje rapide: întârziere minimă între actualizări de stare (ms). `0` = fără throttle. */
  readonly throttleMs?: number;
}

export type UseBrainSseArg = string | UseBrainSseOptions;

function mergeIncomingEvent(prev: BrainSseEvent[], data: BrainSseEvent): BrainSseEvent[] {
  return [...prev.slice(-(MAX_EVENTS - 1)), data];
}

function applyIncomingEvent(data: BrainSseEvent): (prev: BrainSseEvent[]) => BrainSseEvent[] {
  return (prev) => mergeIncomingEvent(prev, data);
}

function tryParseSsePayload(raw: string): BrainSseEvent | undefined {
  try {
    return JSON.parse(raw) as BrainSseEvent;
  } catch {
    return undefined;
  }
}

function normalizeArg(arg: UseBrainSseArg): UseBrainSseOptions {
  return typeof arg === 'string' ? { url: arg } : arg;
}

/**
 * EventSource cu reconectare (backoff exponențial), opțional throttle pe burst-uri.
 * Modul debug loghează doar metadate (fără payload complet — evită PII).
 */
export function useBrainSse(arg: UseBrainSseArg = '/api/live') {
  const { url = '/api/live', throttleMs = 0 } = normalizeArg(arg);
  const [events, setEvents] = useState<BrainSseEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [debug, setDebug] = useState(false);
  const attemptRef = useRef(0);
  const esRef = useRef<EventSource | null>(null);
  const bufferRef = useRef<BrainSseEvent[]>([]);
  const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushBuffer = () => {
    throttleTimerRef.current = null;
    const batch = bufferRef.current;
    bufferRef.current = [];
    if (batch.length === 0) return;
    setEvents((prev) => {
      let next = prev;
      for (const item of batch) {
        next = mergeIncomingEvent(next, item);
      }
      return next;
    });
  };

  useEffect(() => {
    let cancelled = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

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
        reconnectTimer = setTimeout(connect, delay);
      };
      es.onmessage = (ev) => {
        const data = tryParseSsePayload(ev.data);
        if (data === undefined) return;
        if (throttleMs > 0) {
          bufferRef.current.push(data);
          throttleTimerRef.current ??= setTimeout(flushBuffer, throttleMs);
        } else {
          setEvents(applyIncomingEvent(data));
        }
      };
    };

    connect();
    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current);
      throttleTimerRef.current = null;
      bufferRef.current = [];
      esRef.current?.close();
      esRef.current = null;
    };
  }, [url, throttleMs]);

  useEffect(() => {
    if (!debug || typeof console === 'undefined' || !console.debug) return;
    const last = events.at(-1);
    const lastType = typeof last?.type === 'string' ? last.type : undefined;
    console.debug('[brain-sse]', {
      connected,
      eventCount: events.length,
      lastType,
    });
  }, [debug, connected, events]);

  return { events, connected, debug, setDebug };
}
