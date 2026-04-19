import { assertChapterAccess, CHAPTER_PERMISSIONS } from './rbac-chapters.js';

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
});
