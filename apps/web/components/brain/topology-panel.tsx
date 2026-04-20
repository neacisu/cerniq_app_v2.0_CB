'use client';

import Link from 'next/link';

/** Vedere Topology — noduri gateway / neuron / sinapsă (blueprint Brain §23). */
export function TopologyPanel() {
  const nodes = [
    { id: 'gw-1', label: 'gateway-hello', kind: 'gateway' as const },
    { id: 'n-ping', label: 'neuron-ping', kind: 'neuron' as const },
    { id: 's-ping', label: 'synapse-ping', kind: 'synapse' as const },
  ];

  return (
    <div className="@container grid gap-4 rounded-xl border border-cb-border bg-cb-surface p-4">
      <div>
        <h2 className="text-lg font-semibold text-cb-ink">Topologie Brain</h2>
        <p className="text-sm text-cb-muted">
          Hartă minimă bounded-context — date manifest / CMDB la integrare API.
        </p>
      </div>
      <ul className="grid gap-2 @md:grid-cols-3">
        {nodes.map((n) => (
          <li
            key={n.id}
            className="rounded-lg border border-cb-border bg-cb-nav-hover/30 p-3 text-sm"
          >
            <p className="text-xs uppercase tracking-wide text-cb-muted">{n.kind}</p>
            <p className="font-medium text-cb-ink">{n.label}</p>
            <Link
              href="/brain/traces"
              className="mt-2 inline-block text-xs text-cb-accent underline"
            >
              Deschide trace-uri
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
