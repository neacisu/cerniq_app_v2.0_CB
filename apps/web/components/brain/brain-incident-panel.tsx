import Link from 'next/link';
import { BrainCrossLinks } from '../shell/brain-cross-links';

const DEMO_TRACE = 'trace-demo-1';
const DEMO_GATEWAY = 'gateway-hello';
const DEMO_NEURON = 'neuron-ping';

/**
 * Incident Brain — legătură cu excepții operațiuni (Operations §23.8) fără URL inventat.
 */
export function BrainIncidentPanel() {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-4">
        <h2 className="text-lg font-semibold text-amber-100">Incident deschis (demo)</h2>
        <p className="mt-2 text-sm text-cb-muted">
          Coroborare gateway ↔ trace ↔ excepții business — escaladare conform runbook incident.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-cb-ink">
          <li>Severity și owner — din API incident.</li>
          <li>Legătură comenzi / logistică cu excepții: </li>
        </ul>
        <p className="mt-3 text-sm">
          <Link
            href="/operations/orders"
            className="text-cb-accent underline"
          >
            Operations — Orders
          </Link>{' '}
          (excepții ridicate ca sub-task incident)
        </p>
      </section>
      <section className="rounded-xl border border-cb-border bg-cb-nav-hover/30 p-4">
        <h3 className="text-sm font-medium text-cb-ink">Dovezi Brain</h3>
        <div className="mt-2">
          <BrainCrossLinks
            traceId={DEMO_TRACE}
            gatewayId={DEMO_GATEWAY}
            neuronId={DEMO_NEURON}
          />
        </div>
      </section>
    </div>
  );
}
