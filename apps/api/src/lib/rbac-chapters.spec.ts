import {
  assertChapterAccess,
  CHAPTER_PERMISSIONS,
  chaptersResolvedFromJwt,
} from './rbac-chapters.js';

describe('rbac-chapters', () => {
  it('superadmin trece', () => {
    expect(assertChapterAccess(new Set(['superadmin']), 'chapter:brain')).toBe(true);
  });

  it('necesită permisiune explicită', () => {
    expect(assertChapterAccess(new Set(['chapter:brain']), 'chapter:brain')).toBe(true);
    expect(assertChapterAccess(new Set([]), 'chapter:brain')).toBe(false);
  });

  it('lista capitole este exhaustivă ca tip', () => {
    expect(CHAPTER_PERMISSIONS.length).toBe(10);
  });

  it('chaptersResolvedFromJwt — superadmin primește toate capitolele', () => {
    const ch = chaptersResolvedFromJwt(
      { sub: 'u', roles: ['superadmin'] },
      { devTenantOnly: false },
    );
    expect(ch.length).toBe(10);
  });

  it('chaptersResolvedFromJwt — roluri explicite chapter:*', () => {
    const ch = chaptersResolvedFromJwt(
      { sub: 'u', roles: ['chapter:admin', 'chapter:brain'] },
      { devTenantOnly: false },
    );
    expect(ch).toEqual(expect.arrayContaining(['chapter:admin', 'chapter:brain']));
    expect(ch.length).toBe(2);
  });

  it('chaptersResolvedFromJwt — fallback când lipsește rolul', () => {
    const ch = chaptersResolvedFromJwt({ sub: 'u' }, { devTenantOnly: false });
    expect(ch).toEqual(['chapter:home', 'chapter:brain']);
  });
});
