import Link from 'next/link';

/** Zonă densă Imports — container query + legături ingest (milestone 6). */
export function ImportsPanel() {
  return (
    <div className="@container space-y-4 rounded-xl border border-cb-border bg-cb-surface p-4">
      <div>
        <h2 className="text-lg font-semibold text-cb-ink">Imports — zonă operațională</h2>
        <p className="text-sm text-cb-muted">
          Batch CSV, mapare câmpuri, carantină — vezi{' '}
          <code className="rounded bg-cb-nav-hover px-1">doc-business-tenancy-batch-import</code>.
        </p>
      </div>
      <div className="grid gap-3 @lg:grid-cols-2">
        <div className="rounded-lg border border-dashed border-cb-border p-4 text-sm text-cb-muted">
          Preview rânduri (API import la pasul următor)
        </div>
        <div className="rounded-lg border border-dashed border-cb-border p-4 text-sm text-cb-muted">
          Mapare coloane → domeniu
        </div>
      </div>
      <p className="text-xs text-cb-muted">
        Legătură Brain:{' '}
        <Link className="text-cb-accent underline" href="/brain/traces">
          trace-uri
        </Link>{' '}
        pentru erori de procesare.
      </p>
    </div>
  );
}
