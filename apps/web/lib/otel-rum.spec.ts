/**
 * @jest-environment node
 */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { buildRumPayload, initOtelRum } from './otel-rum';

function mockBrowser(opts: {
  pathname: string;
  nav?: { domInteractive: number; domComplete: number; loadEventEnd: number };
  lcp?: number;
  readyState?: 'loading' | 'complete';
  sendBeacon?: ReturnType<typeof jest.fn>;
}): void {
  const getEntriesByType = jest.fn((type: string) => {
    if (type === 'navigation' && opts.nav) return [opts.nav];
    if (type === 'largest-contentful-paint' && opts.lcp !== undefined) {
      return [{ startTime: opts.lcp }];
    }
    return [];
  });
  const performance = { getEntriesByType } as unknown as Performance;
  const beacon = opts.sendBeacon ?? jest.fn(() => true);
  const w = {
    location: { pathname: opts.pathname },
    addEventListener: jest.fn(),
    performance,
  } as unknown as Window & typeof globalThis;
  Object.defineProperty(globalThis, 'window', { value: w, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'performance', {
    value: performance,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(globalThis, 'navigator', {
    value: { sendBeacon: beacon },
    configurable: true,
    writable: true,
  });
  Object.defineProperty(globalThis, 'document', {
    value: { readyState: opts.readyState ?? 'complete' },
    configurable: true,
    writable: true,
  });
}

describe('buildRumPayload', () => {
  const origGrafana = process.env.NEXT_PUBLIC_GRAFANA_RUM_DASHBOARD_URL;

  afterEach(() => {
    if (origGrafana === undefined) {
      delete process.env.NEXT_PUBLIC_GRAFANA_RUM_DASHBOARD_URL;
    } else {
      process.env.NEXT_PUBLIC_GRAFANA_RUM_DASHBOARD_URL = origGrafana;
    }
    // @ts-expect-error cleanup test doubles
    delete globalThis.window;
    // @ts-expect-error cleanup
    delete globalThis.document;
    jest.restoreAllMocks();
  });

  it('returnează null fără window', () => {
    // @ts-expect-error SSR
    delete globalThis.window;
    expect(buildRumPayload()).toBeNull();
  });

  it('construiește payload cerniq.rum.web_v1 cu nav și vitals când există LCP', () => {
    mockBrowser({
      pathname: '/brain/overview',
      nav: { domInteractive: 10, domComplete: 40, loadEventEnd: 45 },
      lcp: 120,
    });
    const p = buildRumPayload();
    expect(p).not.toBeNull();
    if (p === null) {
      throw new Error('buildRumPayload a returnat null cu browser mock');
    }
    expect(p.event).toBe('cerniq.rum.web_v1');
    expect(p.path).toBe('/brain/overview');
    expect(p.nav.domComplete).toBe(40);
    expect(p.vitals?.lcpMs).toBe(120);
  });

  it('include ops.grafana_rum_dashboard_url când env este setat', () => {
    process.env.NEXT_PUBLIC_GRAFANA_RUM_DASHBOARD_URL = 'https://grafana.example/d/rum';
    mockBrowser({
      pathname: '/x',
      nav: { domInteractive: 1, domComplete: 2, loadEventEnd: 3 },
    });
    const p = buildRumPayload();
    expect(p?.ops?.grafana_rum_dashboard_url).toBe('https://grafana.example/d/rum');
  });
});

describe('initOtelRum', () => {
  const origOtel = process.env.NEXT_PUBLIC_OTEL_RUM;
  const origIngest = process.env.NEXT_PUBLIC_RUM_INGEST_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_OTEL_RUM = origOtel;
    process.env.NEXT_PUBLIC_RUM_INGEST_URL = origIngest;
    // @ts-expect-error cleanup
    delete globalThis.window;
    // @ts-expect-error cleanup
    delete globalThis.document;
    // @ts-expect-error cleanup
    delete globalThis.navigator;
    jest.restoreAllMocks();
  });

  it('nu trimite când NEXT_PUBLIC_OTEL_RUM !== 1', () => {
    process.env.NEXT_PUBLIC_OTEL_RUM = '0';
    const beacon = jest.fn(() => true);
    mockBrowser({ pathname: '/', sendBeacon: beacon });
    initOtelRum();
    expect(beacon).not.toHaveBeenCalled();
  });

  it('înregistrează listener load când document încă se încarcă', () => {
    process.env.NEXT_PUBLIC_OTEL_RUM = '1';
    process.env.NEXT_PUBLIC_RUM_INGEST_URL = 'https://ingest.example/rum';
    mockBrowser({ pathname: '/', readyState: 'loading' });
    initOtelRum();
    expect(globalThis.window.addEventListener).toHaveBeenCalledWith(
      'load',
      expect.any(Function),
      { once: true },
    );
  });

  it('trimite beacon când document este complete', () => {
    process.env.NEXT_PUBLIC_OTEL_RUM = '1';
    process.env.NEXT_PUBLIC_RUM_INGEST_URL = 'https://ingest.example/rum';
    const beacon = jest.fn(() => true);
    mockBrowser({
      pathname: '/',
      readyState: 'complete',
      nav: { domInteractive: 1, domComplete: 2, loadEventEnd: 3 },
      sendBeacon: beacon,
    });
    initOtelRum();
    expect(beacon).toHaveBeenCalled();
    const firstCall = beacon.mock.calls[0] as unknown as readonly [string, string];
    expect(firstCall.length).toBeGreaterThanOrEqual(2);
    const body = firstCall[1];
    expect(typeof body).toBe('string');
    expect(JSON.parse(body).event).toBe('cerniq.rum.web_v1');
  });
});
