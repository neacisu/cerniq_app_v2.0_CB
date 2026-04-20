'use client';

import { useState } from 'react';
import { BrainCanvas } from './brain-canvas';
import { NeuronInspector } from './neuron-inspector';

export type BrainOverviewPanelProps = Readonly<{
  /** ID neuron din contract încrucișat (query `neuron`) — demo: `neuron-ping`. */
  crossRefNeuronId?: string;
  /** Adevărat dacă `cerniq_focus=neuron_explanation` (blueprint §25). */
  crossRefExplanation?: boolean;
}>;

/** Layout Brain overview — canvas + inspector cu selecție nod (research UI milestone 2). */
function initialCanvasNodeId(crossRefNeuronId: string | undefined): string {
  /**
   * Mapare demo: ID din contract încrucișat (query `neuron`) → nod canvas.
   * Până la un catalog real de neuroni, folosim o regulă deterministă:
   * - `neuron-ping` (exemplu manifest) → nod A
   * - orice alt ID prezent → nod B (semnal că deep-link-ul cere un neuron anume)
   * - lipsă → nod A (default)
   */
  if (!crossRefNeuronId) return 'n-demo-1';
  if (crossRefNeuronId === 'neuron-ping') return 'n-demo-1';
  return 'n-demo-2';
}

export function BrainOverviewPanel({
  crossRefNeuronId,
  crossRefExplanation,
}: BrainOverviewPanelProps = {}) {
  const nodes = [
    { id: 'n-demo-1', label: 'Neuron A' },
    { id: 'n-demo-2', label: 'Neuron B' },
  ];

  const [selectedId, setSelectedId] = useState<string>(() =>
    initialCanvasNodeId(crossRefNeuronId),
  );

  return (
    <div
      id="brain-canvas-region"
      className="grid gap-4 @lg:grid-cols-[1fr_280px]"
      aria-label="Brain canvas și inspector"
    >
      {crossRefExplanation ? (
        <p className="col-span-full rounded-md border border-cyan-500/40 bg-cyan-950/30 px-3 py-2 text-sm text-cyan-100 @lg:col-span-2">
          <span className="text-cyan-200">Mod explicație neuron</span>{' '}
          <span className="text-cyan-100">
            — drill-down din pagini business (blueprint §25). ID:{' '}
          </span>
          <output className="font-mono text-cyan-300" aria-live="polite">
            {crossRefNeuronId ?? '—'}
          </output>
        </p>
      ) : null}
      <BrainCanvas
        gatewayLabel="gateway-hello"
        neuronLabel="neuron-ping"
        synapseLabel="synapse-ping"
        nodes={nodes}
        selectedNodeId={selectedId}
        onSelectNode={(id) => setSelectedId(id)}
      />
      <NeuronInspector
        neuronId={selectedId}
        description="Exemplu static — milestone UI (canvas + inspector + selecție nod)."
        capabilities={['ping', 'telemetry']}
        explanationMode={Boolean(crossRefExplanation && crossRefNeuronId)}
      />
    </div>
  );
}
