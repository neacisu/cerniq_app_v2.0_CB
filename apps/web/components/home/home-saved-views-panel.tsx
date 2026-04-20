'use client';

import { useState } from 'react';

/** Saved Views — filtre salvate per utilizator (stare locală demo). */
export function HomeSavedViewsPanel() {
  const [views] = useState(() => [
    { id: 'v1', name: 'Pipeline Q2 — teritoriu RO' },
    { id: 'v2', name: 'Inbox — prioritate ridicată' },
  ]);

  return (
    <div className="rounded-xl border border-cb-border bg-cb-surface p-4">
      <h2 className="text-lg font-semibold text-cb-ink">Saved Views</h2>
      <p className="mt-1 text-sm text-cb-muted">
        View-uri salvate — persistență server la integrare API (`/v1/me` + preferințe).
      </p>
      <ul className="mt-4 space-y-2">
        {views.map((v) => (
          <li
            key={v.id}
            className="rounded-lg border border-cb-border/80 px-3 py-2 text-sm text-cb-ink"
          >
            {v.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
