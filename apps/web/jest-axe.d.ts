/**
 * jest-axe@10 fără .d.ts oficiale; `expect` din `@jest/globals` folosește pachetul `expect` (Jest 30).
 * Fișier ambient (fără import/export top-level) pentru module augmentation.
 */
declare module 'jest-axe' {
  import type { MatchersObject } from 'expect';

  export const toHaveNoViolations: MatchersObject;
  export const axe: (
    html: Element | string,
    options?: Record<string, unknown>,
  ) => Promise<unknown>;
  export function configureAxe(options?: Record<string, unknown>): typeof axe;
}

declare module 'expect' {
  interface Matchers<R extends void | Promise<void>> {
    toHaveNoViolations(): R;
  }
}
