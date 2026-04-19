import { CHAPTERS } from './chapters';

describe('CHAPTERS (shell / navigare blueprint)', () => {
  it('are ID-uri unice și aliniate la rute relative stabile', () => {
    const ids = CHAPTERS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const ch of CHAPTERS) {
      expect(ch.href.startsWith(`/${ch.id}/`)).toBe(true);
      expect(ch.label.length).toBeGreaterThan(0);
      expect(ch.secondary.length).toBeGreaterThan(0);
      for (const sec of ch.secondary) {
        expect(sec.href.startsWith('/')).toBe(true);
        expect(sec.label.length).toBeGreaterThan(0);
      }
    }
  });

  it('acoperă exact cele 10 capitole din shell-store (ChapterId)', () => {
    const expected = [
      'home',
      'brain',
      'ingest',
      'customers',
      'inbox',
      'sales',
      'workflows',
      'operations',
      'analytics',
      'admin',
    ] as const;
    expect(new Set(CHAPTERS.map((c) => c.id))).toEqual(new Set(expected));
  });
});
