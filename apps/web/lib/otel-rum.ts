'use client';

/**
 * Punct de ancorare RUM / OTel browser (stacks-02: Prometheus/Grafana/Tempo).
 * Extinde cu `@opentelemetry/sdk-trace-web` + exporter OTLP când endpoint-ul intern e disponibil.
 */
export function initOtelRum(): void {
  if (typeof globalThis.window === 'undefined') return;
  if (process.env.NEXT_PUBLIC_OTEL_RUM !== '1') return;
  // Fără PII: doar timing de bootstrap; detalii în observability-slo-alerts.md
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (nav && typeof console !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.debug('[cerniq-rum]', { domComplete: nav.domComplete, loadEventEnd: nav.loadEventEnd });
  }
}
