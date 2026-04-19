'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useShellStore } from '../../lib/shell-store';
import { CHAPTERS } from '../../lib/chapters';

export function CommandPalette() {
  const open = useShellStore((s) => s.commandOpen);
  const setOpen = useShellStore((s) => s.setCommandOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!open);
      }
      if (open && e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  if (!open) return null;

  const flat = CHAPTERS.flatMap((c) => [
    ...c.secondary.map((s) => ({ label: `${c.label} — ${s.label}`, href: s.href })),
  ]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[12vh] px-4"
    >
      <div className="w-full max-w-lg rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl">
        <p className="border-b border-zinc-800 px-3 py-2 text-xs text-zinc-500">
          Cmd/Ctrl+K — navigare capitole (blueprint §6)
        </p>
        <ul className="max-h-[50vh] overflow-auto py-1">
          {flat.map((item) => (
            <li key={item.href + item.label}>
              <Link
                href={item.href}
                className="block px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
