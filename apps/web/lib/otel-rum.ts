'use client';

/**
 * RUM minimal (echivalent OTel web) — fără PII; payload `cerniq.rum.web_v1`.
 * Ingest opțional: `NEXT_PUBLIC_RUM_INGEST_URL` + `sendBeacon` (JSON compatibil Vector).
 * @see docs/enterprise/ui-otel-rum-frontend.md
 */

export type RumWebVitals = Readonly<{
  lcpMs?: number;
}>;

export type RumPayload = Readonly<{
  event: 'cerniq.rum.web_v1';
  ts: string;
  path: string;
  nav: Readonly<{
    domInteractive?: number;
    domComplete?: number;
    loadEventEnd?: number;
  }>;
  vitals?: RumWebVitals;
  /** Legătură operațională către dashboard Grafana (URL public din CMDB / env deploy). */
  ops?: Readonly<{
    grafana_rum_dashboard_url?: string;
  }>;
}>;

function readNavigationTiming(): PerformanceNavigationTiming | undefined {
  const entries = performance.getEntriesByType('navigation');
  return entries[0] as PerformanceNavigationTiming | undefined;
}

function readLcpMs(): number | undefined {
  const entries = performance.getEntriesByType('largest-contentful-paint');
  const last = entries.at(-1);
  if (last === undefined) return undefined;
  return typeof last.startTime === 'number' ? last.startTime : undefined;
}

export function buildRumPayload(): RumPayload | null {
  if (globalThis.window === undefined) return null;
  const nav = readNavigationTiming();
  const lcpMs = readLcpMs();
  const grafanaUrl = process.env.NEXT_PUBLIC_GRAFANA_RUM_DASHBOARD_URL?.trim();
  return {
    event: 'cerniq.rum.web_v1',
    ts: new Date().toISOString(),
    path: globalThis.window.location.pathname,
    nav: {
      domInteractive: nav?.domInteractive,
      domComplete: nav?.domComplete,
      loadEventEnd: nav?.loadEventEnd,
    },
    vitals: lcpMs === undefined ? undefined : { lcpMs },
    ...(grafanaUrl
      ? { ops: { grafana_rum_dashboard_url: grafanaUrl } }
      : {}),
  };
}

function sendPayloadJson(payload: RumPayload): void {
  const ingest = process.env.NEXT_PUBLIC_RUM_INGEST_URL;
  if (ingest && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const body = JSON.stringify(payload);
    const ok = navigator.sendBeacon(ingest, body);
    if (!ok) {
      void fetch(ingest, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => undefined);
    }
  } else if (typeof console !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.debug('[cerniq-rum]', payload);
  }
}

/**
 * Inițializare RUM: după `load`, colectează timing + LCP (dacă există) și trimite opțional.
 */
export function initOtelRum(): void {
  if (globalThis.window === undefined) return;
  if (process.env.NEXT_PUBLIC_OTEL_RUM !== '1') return;

  const run = (): void => {
    const payload = buildRumPayload();
    if (payload) {
      sendPayloadJson(payload);
    }
  };

  if (document.readyState === 'complete') {
    run();
  } else {
    globalThis.window.addEventListener('load', run, { once: true });
  }
}
