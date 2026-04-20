import { describe, expect, it } from '@jest/globals';
import {
  CHAPTER_PERMISSION_STRINGS,
  chaptersVisibleFromRoles,
  parseDevChapterAllowlist,
} from './chapter-permissions';

describe('chapter-permissions', () => {
  it('număr permisiuni aliniat enum API (10 capitole)', () => {
    expect(CHAPTER_PERMISSION_STRINGS).toHaveLength(10);
    expect(CHAPTER_PERMISSION_STRINGS[0]).toBe('chapter:home');
  });

  it('superadmin vede toate capitolele', () => {
    const v = chaptersVisibleFromRoles(new Set(['superadmin']), {
      devFallbackAll: false,
    });
    expect(v).toHaveLength(10);
  });

  it('roluri explicite chapter:* restrâng nav', () => {
    const v = chaptersVisibleFromRoles(
      new Set(['chapter:home', 'chapter:sales']),
      { devFallbackAll: false },
    );
    const sorted = v.toSorted((a, b) => a.localeCompare(b, 'en'));
    expect(sorted).toEqual(['home', 'sales']);
  });

  it('fără roluri — fallback home+brain', () => {
    const v = chaptersVisibleFromRoles(new Set([]), { devFallbackAll: false });
    expect(v).toEqual(['home', 'brain']);
  });

  it('parseDevChapterAllowlist — subset sau undefined', () => {
    expect(parseDevChapterAllowlist(undefined)).toBeUndefined();
    expect(parseDevChapterAllowlist('')).toBeUndefined();
    expect(parseDevChapterAllowlist('home, brain')).toEqual(['home', 'brain']);
    expect(parseDevChapterAllowlist('invalid')).toBeUndefined();
  });
});
