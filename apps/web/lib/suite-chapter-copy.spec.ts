import { describe, expect, it } from '@jest/globals';
import { CHAPTERS } from './chapters';
import { SUITE_CHAPTER_COPY, getSuiteChapterCopy } from './suite-chapter-copy';

/** Rute cu panou dedicat (nu intră în `SUITE_CHAPTER_COPY`). */
const SPECIAL_LEAF_PATHS = new Set<string>([
  '/home/workspace',
  '/home/my-work',
  '/home/saved-views',
  '/home/notifications',
  '/brain/overview',
  '/brain/live',
  '/brain/gateways',
  '/brain/topology',
  '/brain/traces',
  '/brain/memory',
  '/brain/settings',
  '/brain/incident',
  '/ingest/imports',
]);

describe('suite-chapter-copy', () => {
  it('fiecare rută leaf din CHAPTERS are copy suite sau panou special', () => {
    const leaves = CHAPTERS.flatMap((c) => c.secondary.map((s) => s.href));
    expect(leaves.length).toBeGreaterThan(40);
    for (const href of leaves) {
      const hasCopy = getSuiteChapterCopy(href) !== undefined;
      const special = SPECIAL_LEAF_PATHS.has(href);
      expect(hasCopy || special).toBe(true);
    }
  });

  it('chei unice în mapă copy', () => {
    expect(Object.keys(SUITE_CHAPTER_COPY).length).toBe(
      new Set(Object.keys(SUITE_CHAPTER_COPY)).size,
    );
  });
});
