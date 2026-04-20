import { neuronPing } from './neuron-ping.js';

/** Câmpuri stream Redis (string → string) — intrare tipică după XREADGROUP. */
export type NeuronEventFields = Record<string, string>;

/**
 * Handler neuron pentru evenimente din stream (research §8).
 * Runtime-ul `@cerniq/messaging` livrează `fields`; logica de business rămâne aici.
 */
export async function onEvent(
  fields: NeuronEventFields
): Promise<{ ok: true; label: string; event_field_count: number }> {
  return {
    ok: true,
    label: neuronPing(),
    event_field_count: Object.keys(fields).length,
  };
}
