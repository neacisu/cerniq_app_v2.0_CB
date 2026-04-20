import Link from 'next/link';
import {
  BRAIN_QS,
  NEURON_EXPLANATION_FOCUS,
  brainHref,
  type BrainCrossEntityInput,
} from '../../lib/brain-cross-entity';

export type BrainCrossLinksProps = Readonly<BrainCrossEntityInput>;

export function BrainCrossLinks({
  traceId,
  gatewayId,
  neuronId,
  synapseId,
}: BrainCrossLinksProps) {
  const entities: BrainCrossEntityInput = { traceId, gatewayId, neuronId, synapseId };

  const tracesHref = brainHref('/brain/traces', entities);
  const overviewHref = brainHref('/brain/overview', entities);
  const gatewaysHref = brainHref('/brain/gateways', entities);
  const liveHref = brainHref('/brain/live', entities);

  const neuronExplainHref = neuronId
    ? brainHref('/brain/overview', entities, {
        [BRAIN_QS.focus]: NEURON_EXPLANATION_FOCUS,
      })
    : null;

  return (
    <nav aria-label="Dovezi Brain" className="flex flex-wrap gap-2 text-sm">
      <Link
        href={tracesHref}
        className="rounded-md bg-zinc-800 px-2 py-1 text-cyan-300 hover:bg-zinc-700"
      >
        Open trace
      </Link>
      <Link
        href={overviewHref}
        className="rounded-md bg-zinc-800 px-2 py-1 text-cyan-300 hover:bg-zinc-700"
      >
        Open in Brain
      </Link>
      <Link
        href={gatewaysHref}
        className="rounded-md bg-zinc-800 px-2 py-1 text-cyan-300 hover:bg-zinc-700"
      >
        Open related gateway
      </Link>
      <Link
        href={liveHref}
        className="rounded-md bg-zinc-800 px-2 py-1 text-cyan-300 hover:bg-zinc-700"
      >
        Telemetrie live
      </Link>
      {neuronExplainHref ? (
        <Link
          href={neuronExplainHref}
          className="rounded-md bg-zinc-800 px-2 py-1 text-cyan-300 hover:bg-zinc-700"
        >
          View neuron explanation
        </Link>
      ) : null}
    </nav>
  );
}
