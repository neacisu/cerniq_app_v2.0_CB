/**
 * Jest injectează `jest` ca variabilă globală; augmentăm pentru tipuri în spec-uri.
 */
declare global {
  var jest: typeof import('@jest/globals').jest;
}

export {};
