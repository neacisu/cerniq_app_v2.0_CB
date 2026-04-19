'use client';

import { motion } from 'motion/react';

export interface BrainCanvasProps {
  readonly gatewayLabel: string;
  readonly neuronLabel: string;
  readonly synapseLabel: string;
}

/** Zonă canvas tri-pane — date statice / mock (milestone UI 2). */
export function BrainCanvas({ gatewayLabel, neuronLabel, synapseLabel }: BrainCanvasProps) {
  return (
    <motion.div
      layout
      role="region"
      aria-label="Brain canvas — flux gateway"
      className="min-h-[200px] rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 @container"
    >
      <ul className="grid gap-2 text-sm @md:grid-cols-3">
        <li>
          <span className="text-zinc-500">Gateway</span>
          <p className="font-medium text-zinc-100">{gatewayLabel}</p>
        </li>
        <li>
          <span className="text-zinc-500">Neuron</span>
          <p className="font-medium text-zinc-100">{neuronLabel}</p>
        </li>
        <li>
          <span className="text-zinc-500">Synapse</span>
          <p className="font-medium text-zinc-100">{synapseLabel}</p>
        </li>
      </ul>
    </motion.div>
  );
}
