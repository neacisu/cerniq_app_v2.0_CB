'use client';

import { useEffect } from 'react';

/**
 * Scurtături globale — focus între main / nav secundar / telemetrie (blueprint §15).
 * Alt+Shift+M → main; Alt+Shift+N → sub-nav; Alt+Shift+T → tray.
 */
export function useKeyboardLandmarks(): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || !e.shiftKey) return;
      if (e.code === 'KeyM') {
        e.preventDefault();
        document.getElementById('main-content')?.focus();
      }
      if (e.code === 'KeyN') {
        e.preventDefault();
        document.getElementById('cerniq-secondary-nav')?.focus();
      }
      if (e.code === 'KeyT') {
        e.preventDefault();
        document.getElementById('cerniq-telemetry-region')?.focus();
      }
    };
    globalThis.addEventListener('keydown', onKey);
    return () => globalThis.removeEventListener('keydown', onKey);
  }, []);
}
