'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useShellStore } from '../../lib/shell-store';
import { CHAPTERS } from '../../lib/chapters';
import type { ChapterDef } from '../../lib/chapters';

type PaletteItem = Readonly<{
  key: string;
  label: string;
  href: string;
  group: string;
}>;

function buildItems(chapters: readonly ChapterDef[]): PaletteItem[] {
  return chapters.flatMap((c) =>
    c.secondary.map((s) => ({
      key: `${c.id}:${s.href}`,
      label: `${c.label} — ${s.label}`,
      href: s.href,
      group: c.label,
    })),
  );
}

type CommandPaletteDialogProps = Readonly<{
  onRequestClose: () => void;
  chapters: readonly ChapterDef[];
}>;

/**
 * Conținut modal montat doar când paleta e deschisă — `showModal()` pentru backdrop nativ.
 */
function CommandPaletteDialog({ onRequestClose, chapters }: CommandPaletteDialogProps) {
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    // jsdom poate să nu implementeze `showModal` — fallback pentru teste Jest.
    if (typeof d.showModal === 'function') {
      d.showModal();
    } else {
      d.setAttribute('open', '');
    }
    queueMicrotask(() => inputRef.current?.focus());
    return () => {
      if (typeof d.close === 'function') {
        d.close();
      } else {
        d.removeAttribute('open');
      }
    };
  }, []);

  const items = useMemo(() => {
    const flat = buildItems(CHAPTERS);
    const needle = q.trim().toLowerCase();
    if (!needle) return flat;
    return flat.filter((x) => x.label.toLowerCase().includes(needle));
  }, [q]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command palette"
      className="fixed inset-0 z-50 m-0 flex max-h-none max-w-none items-start justify-center border-0 bg-transparent p-0 px-4 pt-[12vh] [&::backdrop]:bg-black/50"
      onClose={onRequestClose}
    >
      <div className="w-full max-w-lg rounded-lg border border-cb-border bg-cb-surface shadow-xl">
        <p className="border-b border-cb-border px-3 py-2 text-xs text-cb-muted">
          Cmd/Ctrl+K — căutare capitole și rute Brain (blueprint §6, §25)
        </p>
        <div className="border-b border-cb-border px-2 py-2">
          <label htmlFor="command-palette-q" className="sr-only">
            Căutare
          </label>
          <input
            id="command-palette-q"
            ref={inputRef}
            type="search"
            autoComplete="off"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Caută rută sau capitol…"
            className="w-full rounded-md border border-cb-border bg-cb-surface px-2 py-1.5 text-sm text-cb-ink outline-none ring-cb-accent focus:ring-2"
          />
        </div>
        <nav aria-label="Rezultate căutare" className="max-h-[50vh] overflow-auto py-1">
          <ul className="list-none p-0">
            {items.length === 0 ? (
              <li className="px-3 py-2 text-sm text-cb-muted">Niciun rezultat.</li>
            ) : (
              items.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="block px-3 py-2 text-sm text-cb-ink hover:bg-cb-nav-hover"
                    onClick={onRequestClose}
                  >
                    <span className="text-xs text-cb-muted">{item.group}</span>
                    <span className="block">{item.label}</span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </nav>
      </div>
    </dialog>
  );
}

/**
 * Command palette Cmd/Ctrl+K — căutare în rute suite + Brain.
 */
export type CommandPaletteProps = Readonly<{
  /** Subset capitole (aliniat nav primară). */
  chapters?: readonly ChapterDef[];
}>;

export function CommandPalette({ chapters = CHAPTERS }: CommandPaletteProps) {
  const open = useShellStore((s) => s.commandOpen);
  const setOpen = useShellStore((s) => s.setCommandOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!open);
      }
    };
    globalThis.addEventListener('keydown', onKey);
    return () => globalThis.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <CommandPaletteDialog
      chapters={chapters}
      onRequestClose={() => setOpen(false)}
    />
  );
}
