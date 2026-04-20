'use client';

import { BrainSseToolbar } from './brain-sse-toolbar';

/** Memory — segmente și index (pgvector doar după confirmare instanță — stacks-01). */
export function BrainMemoryPanel() {
  const segments = [
    { id: 'mem-1', label: 'Scurtă durată (session)', bytes: '—' },
    { id: 'mem-2', label: 'Long-term (tenant)', bytes: '—' },
  ];

  return (
    <div className="space-y-4">
      <BrainSseToolbar contextLabel="Memory" />
      <ul className="grid gap-2 @md:grid-cols-2">
        {segments.map((s) => (
          <li
            key={s.id}
            className="rounded-lg border border-cb-border bg-cb-surface p-3 text-sm"
          >
            <p className="text-xs uppercase text-cb-muted">{s.id}</p>
            <p className="font-medium text-cb-ink">{s.label}</p>
            <p className="mt-1 text-xs text-cb-muted">Dimensiune estimată: {s.bytes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
