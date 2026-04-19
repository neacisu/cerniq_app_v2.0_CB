'use client';

import { useEffect, useState } from 'react';

/** Comutator temă light/dark (blueprint + milestone UI 3). */
export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [dark]);

  return (
    <button
      type="button"
      className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300"
      onClick={() => setDark((d) => !d)}
    >
      {dark ? 'Temă întunecată' : 'Temă clară'}
    </button>
  );
}
