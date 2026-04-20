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

function isChapterPermission(s: string): s is ChapterPermission {
  return (CHAPTER_PERMISSIONS as readonly string[]).includes(s);
}

/** Rezolvă lista de capitole din JWT (`roles` / `chapters`) + fallback compat. */
export function chaptersResolvedFromJwt(
  auth: {
    sub?: string;
    roles?: string[];
    chapters?: string[];
  } | null,
  opts: { devTenantOnly: boolean },
): ChapterPermission[] {
  if (opts.devTenantOnly && !auth?.sub) {
    return ['chapter:home', 'chapter:brain'];
  }
  if (!auth?.sub) {
    return [];
  }
  if (auth.roles?.includes('superadmin')) {
    return [...CHAPTER_PERMISSIONS];
  }
  const out = new Set<ChapterPermission>();
  for (const r of auth.roles ?? []) {
    if (isChapterPermission(r)) out.add(r);
  }
  for (const c of auth.chapters ?? []) {
    if (isChapterPermission(c)) out.add(c);
  }
  if (out.size === 0) {
    return ['chapter:home', 'chapter:brain'];
  }
  return [...out];
}
