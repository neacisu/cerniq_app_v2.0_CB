'use client';

export interface NeuronInspectorProps {
  readonly neuronId: string;
  readonly description: string;
  readonly capabilities: readonly string[];
  /** Panou explicație pentru deep-link din suite business (blueprint §25). */
  readonly explanationMode?: boolean;
}

/** Panou inspector — ARIA + props explicite (research UI + blueprint §12). */
export function NeuronInspector({
  neuronId,
  description,
  capabilities,
  explanationMode = false,
}: NeuronInspectorProps) {
  return (
    <aside
      aria-label={`Inspector neuron ${neuronId}`}
      className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4"
    >
      <h3 className="text-sm font-semibold text-zinc-200">Neuron</h3>
      <p className="mt-1 font-mono text-xs text-cyan-300">{neuronId}</p>
      {explanationMode ? (
        <section
          className="mt-3 rounded border border-cyan-500/30 bg-zinc-950/50 p-2"
          aria-label="Explicație neuron"
        >
          <h4 className="text-xs font-medium uppercase tracking-wide text-cyan-400">
            Explicație (business context)
          </h4>
          <p className="mt-1 text-xs text-zinc-300">
            Rezumat decisie și intrări/ieșiri — date complete în API catalog neuroni / trace
            asociat; fără PII în UI demo.
          </p>
        </section>
      ) : null}
      <p className="mt-3 text-sm text-zinc-400">{description}</p>
      <h4 className="mt-4 text-xs uppercase tracking-wide text-zinc-500">Capabilities</h4>
      <ul className="mt-1 list-inside list-disc text-sm text-zinc-300">
        {capabilities.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </aside>
  );
}
