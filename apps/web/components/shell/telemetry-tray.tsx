'use client';

import type { ReactNode } from 'react';
import { useShellStore } from '../../lib/shell-store';

export function TelemetryTray({ children }: { children?: ReactNode }) {
  const open = useShellStore((s) => s.telemetryOpen);
  const setOpen = useShellStore((s) => s.setTelemetryOpen);

  if (!open) {
    return (
      <button
        type="button"
        className="fixed bottom-2 right-2 z-50 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
        onClick={() => setOpen(true)}
      >
        Telemetrie
      </button>
    );
  }

  return (
    <div
      role="region"
      aria-label="Telemetry tray"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800 bg-zinc-950/95 px-4 py-2 text-sm text-zinc-300 backdrop-blur max-h-[28vh] overflow-auto"
    >
      <div className="mx-auto flex max-w-6xl items-start justify-between gap-4">
        <div className="flex-1 min-w-0">{children}</div>
        <button
          type="button"
          className="shrink-0 text-xs text-zinc-500 hover:text-zinc-300"
          onClick={() => setOpen(false)}
        >
          Închide
        </button>
      </div>
    </div>
  );
}
