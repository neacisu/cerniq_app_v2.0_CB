'use client';

/** Setări Brain — preferințe tenant-safe (fără secrete în state client). */
export function BrainSettingsPanel() {
  return (
    <form
      className="max-w-lg space-y-4 rounded-xl border border-cb-border bg-cb-surface p-4"
      aria-labelledby="brain-settings-title"
      onSubmit={(e) => e.preventDefault()}
    >
      <h2 id="brain-settings-title" className="text-lg font-semibold text-cb-ink">
        Setări Brain
      </h2>
      <div>
        <label htmlFor="brain-density" className="text-sm text-cb-muted">
          Densitate UI
        </label>
        <select
          id="brain-density"
          name="density"
          className="mt-1 w-full rounded-md border border-cb-border bg-cb-surface px-2 py-1.5 text-sm"
          defaultValue="comfortable"
        >
          <option value="compact">Compact</option>
          <option value="comfortable">Comfortable</option>
        </select>
      </div>
      <div>
        <label htmlFor="brain-telemetry" className="text-sm text-cb-muted">
          Telemetrie tray
        </label>
        <select
          id="brain-telemetry"
          name="telemetry"
          className="mt-1 w-full rounded-md border border-cb-border bg-cb-surface px-2 py-1.5 text-sm"
          defaultValue="on"
        >
          <option value="on">Activ</option>
          <option value="minimal">Minim</option>
        </select>
      </div>
      <p className="text-xs text-cb-muted">
        Preferințele sunt locale (demo) — persistență și policy la integrare API.
      </p>
    </form>
  );
}
