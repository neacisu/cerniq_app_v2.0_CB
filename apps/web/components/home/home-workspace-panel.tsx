import Link from 'next/link';

/** Home — Workspace (§22.1, §23.1): intrare rapidă în capitole și Brain. */
export function HomeWorkspacePanel() {
  return (
    <div className="grid gap-4 @lg:grid-cols-[2fr_1fr]">
      <section
        className="rounded-xl border border-cb-border bg-cb-surface p-4"
        aria-labelledby="hw-summary"
      >
        <h2 id="hw-summary" className="text-lg font-semibold text-cb-ink">
          Workspace Home
        </h2>
        <p className="mt-2 text-sm text-cb-muted">
          Rezumat activitate și acces rapid — RBAC `chapter:home`; date agregate fără PII în
          telemetrie client.
        </p>
        <ul className="mt-4 grid gap-2 text-sm">
          <li>
            <Link className="text-cb-accent underline" href="/brain/overview">
              Deschide Brain — Overview
            </Link>
          </li>
          <li>
            <Link className="text-cb-accent underline" href="/ingest/imports">
              Imports
            </Link>
          </li>
        </ul>
      </section>
      <aside className="rounded-xl border border-dashed border-cb-border p-4 text-sm text-cb-muted">
        <p className="font-medium text-cb-ink">Stare</p>
        <p className="mt-2">Tenant activ — configurare în Admin când API e disponibil.</p>
      </aside>
    </div>
  );
}
