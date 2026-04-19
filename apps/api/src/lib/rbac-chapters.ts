/** Capitole blueprint → cod permisiune API (prefix). */

export const CHAPTER_PERMISSIONS = [
  'chapter:home',
  'chapter:brain',
  'chapter:ingest',
  'chapter:customers',
  'chapter:inbox',
  'chapter:sales',
  'chapter:workflows',
  'chapter:operations',
  'chapter:analytics',
  'chapter:admin',
] as const;

export type ChapterPermission = (typeof CHAPTER_PERMISSIONS)[number];

export function assertChapterAccess(
  roles: Set<string>,
  required: ChapterPermission
): boolean {
  if (roles.has('superadmin')) return true;
  return roles.has(required);
}
