'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import type { ChapterId } from '../../lib/shell-store';
import { useShellStore } from '../../lib/shell-store';
import { CHAPTERS as CHAPTERS_ALL } from '../../lib/chapters';
import type { ChapterDef } from '../../lib/chapters';
import { useKeyboardLandmarks } from '../../lib/use-keyboard-landmarks';
import { TelemetryTray } from './telemetry-tray';
import { CommandPalette } from './command-palette';
import { BrainStatusPanel } from '../brain-status-panel';
import { ThemeToggle } from '../theme-toggle';

export type AppShellProps = Readonly<{
  children: ReactNode;
  /** Subset capitole în nav (roluri `chapter:*`); `undefined` = toate. */
  visibleChapterIds?: readonly ChapterId[];
}>;

function filterChapters(ids: readonly ChapterId[] | undefined): readonly ChapterDef[] {
  if (!ids || ids.length === 0) return CHAPTERS_ALL;
  const set = new Set(ids);
  return CHAPTERS_ALL.filter((c) => set.has(c.id));
}

function detectChapter(pathname: string, chapters: readonly ChapterDef[]): ChapterId | null {
  for (const c of chapters) {
    if (pathname === c.href || pathname.startsWith(`/${c.id}/`)) return c.id;
  }
  return null;
}

export function AppShell({ children, visibleChapterIds }: AppShellProps) {
  const chapters = useMemo(
    () => filterChapters(visibleChapterIds),
    [visibleChapterIds],
  );
  const pathname = usePathname() ?? '/';
  const chapterId = detectChapter(pathname, chapters);
  const chapter = chapters.find((c) => c.id === chapterId) ?? chapters[0];
  const setPalette = useShellStore((s) => s.setCommandOpen);
  useKeyboardLandmarks();

  return (
    <div className="flex min-h-screen flex-col bg-cb-surface text-cb-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded focus:bg-cb-nav-hover focus:px-2 focus:py-1 focus:outline focus:outline-2 focus:outline-cb-accent"
      >
        Sari la conținut
      </a>
      <motion.header
        layout
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        className="flex h-[var(--spacing-topbar)] shrink-0 items-center border-b border-cb-border bg-cb-surface/95 px-4 backdrop-blur"
        style={{ ['--spacing-topbar' as string]: '4.5rem' }}
      >
        <span className="text-lg font-semibold tracking-tight text-cb-ink">Cerniq CB v2</span>
        <nav aria-label="Navigare primară" className="ml-6 flex flex-wrap gap-1">
          {chapters.map((c) => (
            <Link
              key={c.id}
              href={c.href}
              className={`rounded-md px-2 py-1 text-xs font-medium ${
                chapter.id === c.id
                  ? 'bg-cb-nav-active text-cb-accent'
                  : 'text-cb-muted hover:bg-cb-nav-hover hover:text-cb-ink'
              }`}
            >
              {c.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="text-xs text-cb-muted hover:text-cb-ink"
            onClick={() => setPalette(true)}
          >
            Cmd+K
          </button>
        </div>
      </motion.header>
      <div className="flex min-h-0 flex-1">
        <nav
          id="cerniq-secondary-nav"
          aria-label={`Sub-nav ${chapter.label}`}
          tabIndex={-1}
          className="hidden w-52 shrink-0 flex-col gap-0.5 border-r border-cb-border bg-cb-surface/90 p-3 text-sm md:flex"
        >
          {chapter.secondary.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={`rounded-md px-2 py-1.5 ${
                pathname === s.href || pathname.startsWith(s.href + '/')
                  ? 'bg-cb-nav-active text-cb-ink'
                  : 'text-cb-muted hover:bg-cb-nav-hover hover:text-cb-ink'
              }`}
            >
              {s.label}
            </Link>
          ))}
        </nav>
        <div className="flex min-w-0 flex-1 flex-col pb-24">
          <div aria-live="polite" className="sr-only" id="shell-announcer" />
          <main id="main-content" className="flex-1 p-4 outline-none md:p-6" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>
      <div id="cerniq-telemetry-region" tabIndex={-1}>
        <TelemetryTray>
          <BrainStatusPanel />
        </TelemetryTray>
      </div>
      <CommandPalette chapters={chapters} />
    </div>
  );
}
