import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBrainSse } from './use-brain-sse';

type MockInstance = {
  url: string;
  onopen?: () => void;
  onmessage?: (ev: { data: string }) => void;
  onerror?: () => void;
  close: () => void;
};

function installEventSourceMock(instances: MockInstance[]) {
  globalThis.EventSource = class MockEventSource {
    onopen?: () => void;
    onmessage?: (ev: { data: string }) => void;
    onerror?: () => void;
    close = jest.fn();
    constructor(public url: string) {
      instances.push(this);
      queueMicrotask(() => {
        this.onopen?.();
      });
    }
  } as unknown as typeof EventSource;
}

describe('useBrainSse', () => {
  const OriginalEventSource = globalThis.EventSource;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    globalThis.EventSource = OriginalEventSource;
  });

  it('parsează mesaje JSON și le adaugă la listă', async () => {
    const instances: MockInstance[] = [];
    installEventSourceMock(instances);

    const { result } = renderHook(() => useBrainSse('/api/live-test'));

    await waitFor(() => {
      expect(result.current.connected).toBe(true);
    });

    const es = instances[0];
    expect(es.url).toBe('/api/live-test');

    act(() => {
      es.onmessage?.({ data: JSON.stringify({ type: 'ping', n: 1 }) });
    });

    expect(result.current.events).toEqual([{ type: 'ping', n: 1 }]);

    act(() => {
      es.onmessage?.({ data: 'not-json' });
    });

    expect(result.current.events).toEqual([{ type: 'ping', n: 1 }]);
  });

  it('throttleMs amână aplicarea mai multor mesaje într-un singur flush', async () => {
    const instances: MockInstance[] = [];
    installEventSourceMock(instances);

    const { result } = renderHook(() =>
      useBrainSse({ url: '/api/live-throttle', throttleMs: 40 })
    );

    await waitFor(() => {
      expect(result.current.connected).toBe(true);
    });

    const es = instances[0];
    act(() => {
      es.onmessage?.({ data: JSON.stringify({ type: 'x', n: 1 }) });
      es.onmessage?.({ data: JSON.stringify({ type: 'x', n: 2 }) });
    });

    expect(result.current.events).toHaveLength(0);

    await act(async () => {
      jest.advanceTimersByTime(40);
    });

    await waitFor(() => {
      expect(result.current.events).toEqual([
        { type: 'x', n: 1 },
        { type: 'x', n: 2 },
      ]);
    });
  });
});
