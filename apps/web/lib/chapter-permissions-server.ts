import type { ChapterId } from './shell-store';
import { parseDevChapterAllowlist } from './chapter-permissions';

/**
 * Capitole afișate în shell — implicit toate.
 * Setare opțională: `NEXT_PUBLIC_CERNIQ_DEV_CHAPTERS=home,brain,ingest` (build-time).
 */
export function getShellVisibleChapterIds(): ChapterId[] | undefined {
  return parseDevChapterAllowlist(process.env.NEXT_PUBLIC_CERNIQ_DEV_CHAPTERS);
}
