'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CHAPTERS } from '../../lib/chapters';
import type { ChapterId } from '../../lib/shell-store';
import { useShellStore } from '../../lib/shell-store';
import { TelemetryTray } from './telemetry-tray';
import { CommandPalette } from './command-palette';
import { BrainStatusPanel } from '../brain-status-panel';
import { ThemeToggle } from '../theme-toggle';

function detectChapter(pathname: string): ChapterId | null {
  for (const c of CHAPTERS) {
    if (pathname === c.href || pathname.startsWith(`/${c.id}/`)) return c.id;
  }
  return null;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/';
  const chapterId = detectChapter(pathname);
  const chapter = CHAPTERS.find((c) => c.id === chapterId) ?? CHAPTERS[0];
  const setPalette = useShellStore((s) => s.setCommandOpen);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded focus:bg-zinc-800 focus:px-2 focus:py-1"
      >
        Sari la conținut
      </a>
      <header
        className="flex h-[var(--spacing-topbar)] shrink-0 items-center border-b border-zinc-800 bg-zinc-950/90 px-4 backdrop-blur"
        style={{ ['--spacing-topbar' as string]: '4.5rem' }}
      >
        <span className="text-lg font-semibold tracking-tight text-zinc-100">Cerniq CB v2</span>
        <nav aria-label="Navigare primară" className="ml-6 flex flex-wrap gap-1">
          {CHAPTERS.map((c) => (
            <Link
              key={c.id}
              href={c.href}
              className={`rounded-md px-2 py-1 text-xs font-medium ${
                chapter.id === c.id
                  ? 'bg-cyan-900/40 text-cyan-200'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
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
            className="text-xs text-zinc-500 hover:text-zinc-300"
            onClick={() => setPalette(true)}
          >
            Cmd+K
          </button>
        </div>
      </header>
      <div className="flex flex-1 min-h-0">
        <nav
          aria-label={`Sub-nav ${chapter.label}`}
          className="hidden w-52 shrink-0 flex-col gap-0.5 border-r border-zinc-800 bg-zinc-950/80 p-3 text-sm md:flex"
        >
          {chapter.secondary.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={`rounded-md px-2 py-1.5 ${
                pathname === s.href || pathname.startsWith(s.href + '/')
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              {s.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 flex-col min-w-0 pb-24">
          <div
            aria-live="polite"
            className="sr-only"
            id="shell-announcer"
          />
          <main id="main-content" className="flex-1 p-4 md:p-6" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>
      <TelemetryTray>
        <BrainStatusPanel />
      </TelemetryTray>
      <CommandPalette />
    </div>
  );
}
