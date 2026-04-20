'use client';

import { BrainSseToolbar } from './brain-sse-toolbar';
import { BrainCrossLinks } from '../shell/brain-cross-links';

const DEMO_TRACE = 'trace-demo-1';
const DEMO_GATEWAY = 'gateway-hello';
const DEMO_NEURON = 'neuron-ping';

/** Gateways — rulări și legături către trace/topology (§23.2). */
export function BrainGatewaysPanel() {
  return (
    <div className="space-y-4">
      <BrainSseToolbar contextLabel="Gateways" />
      <div className="grid gap-3 @md:grid-cols-2">
        <section className="rounded-xl border border-cb-border bg-cb-surface p-4">
          <h2 className="text-sm font-semibold text-cb-ink">Gateway activ (demo)</h2>
          <p className="mt-1 text-xs text-cb-muted">{DEMO_GATEWAY}</p>
          <p className="mt-3 text-xs text-cb-muted">
            Run queue și versiuni — date din manifest / API la integrare.
          </p>
        </section>
        <section className="rounded-xl border border-cb-border bg-cb-nav-hover/30 p-4">
          <h2 className="text-sm font-semibold text-cb-ink">Dovezi Brain</h2>
          <div className="mt-2">
            <BrainCrossLinks
              traceId={DEMO_TRACE}
              gatewayId={DEMO_GATEWAY}
              neuronId={DEMO_NEURON}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
