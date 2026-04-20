import type { ChapterId } from './shell-store';

/**
 * Permisiuni capitol — aceeași enumerare ca `apps/api/src/lib/rbac-chapters.ts` (sursă API).
 * UI filtrează nav; autoritatea finală rămâne API + JWT.
 */
export const CHAPTER_PERMISSION_STRINGS: readonly string[] = [
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

export function chapterIdToPermission(id: ChapterId): string {
  return `chapter:${id}`;
}

/** Rezolvă capitole vizibile ca în API: superadmin → toate; altfel roluri explicite; fallback dev. */
export function chaptersVisibleFromRoles(
  roles: ReadonlySet<string>,
  opts: { devFallbackAll: boolean },
): ChapterId[] {
  if (opts.devFallbackAll) {
    return [
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
    ];
  }
  if (roles.has('superadmin')) {
    return [
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
    ];
  }
  const out = new Set<ChapterId>();
  for (const r of roles) {
    if (r.startsWith('chapter:')) {
      const id = r.slice('chapter:'.length) as ChapterId;
      if (isChapterId(id)) out.add(id);
    }
  }
  if (out.size === 0) {
    return ['home', 'brain'];
  }
  return [...out];
}

export function isChapterId(s: string): s is ChapterId {
  return (
    s === 'home' ||
    s === 'brain' ||
    s === 'ingest' ||
    s === 'customers' ||
    s === 'inbox' ||
    s === 'sales' ||
    s === 'workflows' ||
    s === 'operations' ||
    s === 'analytics' ||
    s === 'admin'
  );
}

/**
 * Parse `NEXT_PUBLIC_CERNIQ_DEV_CHAPTERS` (ex. `home,brain,sales`) → subset ChapterId.
 * Gol sau nedefinit = toate capitolele (comportament implicit dev).
 */
export function parseDevChapterAllowlist(
  raw: string | undefined,
): ChapterId[] | undefined {
  if (raw === undefined || raw.trim() === '') return undefined;
  const parts = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const ids = parts.filter(isChapterId);
  if (ids.length === 0) return undefined;
  return ids;
}
