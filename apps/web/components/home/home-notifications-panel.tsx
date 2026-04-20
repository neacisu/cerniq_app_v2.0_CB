/** Notifications — centru notificări (fără conținut PII în listă demo). */
export function HomeNotificationsPanel() {
  const notes = [
    { id: 'n1', kind: 'info' as const, text: 'Workflow finalizat în coadă demo.' },
    { id: 'n2', kind: 'warning' as const, text: 'SLA inbox aproape depășit (simulare).' },
  ];

  return (
    <div className="rounded-xl border border-cb-border bg-cb-surface p-4">
      <h2 className="text-lg font-semibold text-cb-ink">Notifications</h2>
      <p className="mt-1 text-sm text-cb-muted">
        Evenimente business și sistem — livrare prin inbox/API, nu prin SSE cu PII.
      </p>
      <ul className="mt-4 space-y-2" aria-live="polite">
        {notes.map((n) => (
          <li
            key={n.id}
            className={`rounded-lg px-3 py-2 text-sm ${
              n.kind === 'warning'
                ? 'border border-amber-800/60 bg-amber-950/30'
                : 'border border-cb-border bg-cb-nav-hover/30'
            }`}
          >
            {n.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
