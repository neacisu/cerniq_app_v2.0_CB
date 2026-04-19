/**
 * Jest injectează `jest` ca variabilă globală în fișierele de test. Transformatorul SWC
 * din `next/jest` face hoist la `jest.mock(...)` doar când `jest` este identificator
 * global (nu binding importat din `@jest/globals`).
 *
 * `@types/jest` nu expune în toate contextele un `jest` global tipizat pentru module;
 * augmentăm explicit, doar pentru proiectul de spec-uri.
 */
declare global {
  // eslint-disable-next-line no-var -- API-ul Jest este expus ca `var` pe `globalThis`
  var jest: typeof import('@jest/globals').jest;
}

export {};
