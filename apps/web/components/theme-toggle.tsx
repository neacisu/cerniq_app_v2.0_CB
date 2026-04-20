'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cerniq-theme';

function readInitialDark(): boolean {
  if (globalThis.window === undefined) {
    return true;
  }
  try {
    const raw = globalThis.localStorage.getItem(STORAGE_KEY);
    if (raw === 'light') return false;
    if (raw === 'dark') return true;
  } catch {
    /* private mode / quota */
  }
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
}

/** Comutator temă light/dark — tokeni `global.css`; persistă în localStorage (milestone UI 3). */
export function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(readInitialDark);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', dark);
    try {
      globalThis.localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  }, [dark]);

  return (
    <button
      type="button"
      className="rounded-md border border-cb-border px-2 py-1 text-xs text-cb-ink/90 hover:bg-cb-nav-hover"
      aria-pressed={dark}
      aria-label={dark ? 'Comută la temă clară' : 'Comută la temă întunecată'}
      onClick={() => setDark((d) => !d)}
    >
      {dark ? 'Întunecată' : 'Clară'}
    </button>
  );
}
