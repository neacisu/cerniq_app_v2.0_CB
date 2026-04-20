'use client';

import type { ReactNode } from 'react';
import { useShellStore } from '../../lib/shell-store';

export type TelemetryTrayProps = Readonly<{
  children?: ReactNode;
}>;

export function TelemetryTray(props: Readonly<TelemetryTrayProps>) {
  const { children } = props;
  const open = useShellStore((s) => s.telemetryOpen);
  const setOpen = useShellStore((s) => s.setTelemetryOpen);

  if (!open) {
    return (
      <button
        type="button"
        className="fixed bottom-2 right-2 z-50 rounded-full border border-cb-border bg-cb-nav-hover px-3 py-1 text-xs text-cb-ink"
        onClick={() => setOpen(true)}
      >
        Telemetrie
      </button>
    );
  }

  return (
    <section
      aria-label="Telemetry tray"
      tabIndex={-1}
      className="fixed bottom-0 left-0 right-0 z-40 max-h-[28vh] overflow-auto border-t border-cb-border bg-cb-surface/95 px-4 py-2 text-sm text-cb-muted backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl items-start justify-between gap-4">
        <div className="min-w-0 flex-1">{children}</div>
        <button
          type="button"
          className="shrink-0 text-xs text-cb-muted hover:text-cb-ink"
          onClick={() => setOpen(false)}
        >
          Închide
        </button>
      </div>
    </section>
  );
}
