import Link from 'next/link';

export function BrainCrossLinks(props: {
  traceId?: string;
  gatewayId?: string;
  neuronId?: string;
}) {
  const q = new URLSearchParams();
  if (props.traceId) q.set('trace', props.traceId);
  if (props.gatewayId) q.set('gateway', props.gatewayId);
  if (props.neuronId) q.set('neuron', props.neuronId);
  const qs = q.toString();

  return (
    <div className="flex flex-wrap gap-2 text-sm">
      <Link
        href={`/brain/traces${qs ? `?${qs}` : ''}`}
        className="rounded-md bg-zinc-800 px-2 py-1 text-cyan-300 hover:bg-zinc-700"
      >
        Open trace
      </Link>
      <Link
        href={`/brain/overview${qs ? `?${qs}` : ''}`}
        className="rounded-md bg-zinc-800 px-2 py-1 text-cyan-300 hover:bg-zinc-700"
      >
        Open in Brain
      </Link>
      {props.neuronId ? (
        <Link
          href={`/brain/live?neuron=${encodeURIComponent(props.neuronId)}`}
          className="rounded-md bg-zinc-800 px-2 py-1 text-cyan-300 hover:bg-zinc-700"
        >
          Neuron explanation
        </Link>
      ) : null}
    </div>
  );
}
