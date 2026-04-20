/**
 * Convenții ID-uri încrucișate business ↔ Brain (blueprint §25).
 * Schema OpenAPI: `components.schemas.BrainCrossEntityRefs` în `docs/openapi/openapi.yaml`.
 */
export const BRAIN_QS = {
  trace: 'trace',
  gateway: 'gateway',
  neuron: 'neuron',
  synapse: 'synapse',
  focus: 'cerniq_focus',
} as const;

/** Valoare pentru `cerniq_focus` — panou explicație neuron în Overview. */
export const NEURON_EXPLANATION_FOCUS = 'neuron_explanation' as const;

export type BrainCrossEntityInput = Readonly<{
  traceId?: string;
  gatewayId?: string;
  neuronId?: string;
  synapseId?: string;
}>;

export function buildBrainSearchParams(
  entities: BrainCrossEntityInput,
  extra?: Readonly<Record<string, string>>,
): URLSearchParams {
  const q = new URLSearchParams();
  if (entities.traceId) q.set(BRAIN_QS.trace, entities.traceId);
  if (entities.gatewayId) q.set(BRAIN_QS.gateway, entities.gatewayId);
  if (entities.neuronId) q.set(BRAIN_QS.neuron, entities.neuronId);
  if (entities.synapseId) q.set(BRAIN_QS.synapse, entities.synapseId);
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v.length > 0) q.set(k, v);
    }
  }
  return q;
}

export function brainHref(
  basePath: string,
  entities: BrainCrossEntityInput,
  extra?: Readonly<Record<string, string>>,
): string {
  const q = buildBrainSearchParams(entities, extra);
  const s = q.toString();
  return s.length === 0 ? basePath : `${basePath}?${s}`;
}
