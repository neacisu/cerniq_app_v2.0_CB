/**
 * Helper importat în spec-uri care rulează în afara folderului `specs/`.
 *
 * `apps/web/tsconfig.json` exclude `specs/**` (pentru build-ul Next), deci acest fișier
 * trebuie să trăiască sub `lib/**` ca să poată fi importat fără TS6307.
 *
 * Tipurile globale Jest vin din `@types/jest` + `tsconfig` (`types: ["jest"]`).
 * Nu redeclarăm `jest` — ar produce conflict TS2300.
 */
export {};

