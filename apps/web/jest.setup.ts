// eslint-disable-next-line @typescript-eslint/triple-slash-reference -- augmentation `expect` pentru jest-axe
/// <reference path="./jest-axe.d.ts" />
import { expect } from '@jest/globals';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

/** jsdom: EventSource minimal — fără `onopen` async (evită avertismente `act()` în Jest). */
if (globalThis.EventSource === undefined) {
  class EventSourceMock {
    static readonly CONNECTING = 0;
    static readonly OPEN = 1;
    static readonly CLOSED = 2;
    readonly CONNECTING = 0;
    readonly OPEN = 1;
    readonly CLOSED = 2;
    readonly url: string;
    onopen: ((this: EventSource, ev: Event) => void) | null = null;
    onmessage: ((this: EventSource, ev: MessageEvent) => void) | null = null;
    onerror: ((this: EventSource, ev: Event) => void) | null = null;
    constructor(url: string) {
      this.url = url;
    }
    close(): void {
      void 0;
    }
    addEventListener(): void {
      void 0;
    }
    removeEventListener(): void {
      void 0;
    }
    dispatchEvent(): boolean {
      return true;
    }
  }
  globalThis.EventSource = EventSourceMock as unknown as typeof EventSource;
}
