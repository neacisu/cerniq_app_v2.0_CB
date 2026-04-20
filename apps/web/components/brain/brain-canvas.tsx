'use client';

import { motion } from 'motion/react';

/** Nod demonstrativ — research UI: selecție + eveniment (milestone 2). */
export interface BrainCanvasNode {
  readonly id: string;
  readonly label: string;
}

export interface BrainCanvasProps {
  readonly gatewayLabel: string;
  readonly neuronLabel: string;
  readonly synapseLabel: string;
  /** Opțional: noduri pentru selecție (tabel research: onSelectNode). */
  readonly nodes?: readonly BrainCanvasNode[];
  readonly selectedNodeId?: string | null;
  readonly onSelectNode?: (nodeId: string) => void;
}

/** Zonă canvas tri-pane — date statice / mock (milestone UI 2). */
export function BrainCanvas({
  gatewayLabel,
  neuronLabel,
  synapseLabel,
  nodes,
  selectedNodeId,
  onSelectNode,
}: BrainCanvasProps) {
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
      {nodes && nodes.length > 0 ? (
        <ul
          className="mt-4 flex flex-wrap gap-2 border-t border-zinc-800 pt-3"
          aria-label="Noduri demonstrative"
        >
          {nodes.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                className={`rounded px-2 py-1 text-xs ${
                  selectedNodeId === n.id
                    ? 'bg-cyan-900/50 text-cyan-100'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
                onClick={() => onSelectNode?.(n.id)}
              >
                {n.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </motion.div>
  );
}
