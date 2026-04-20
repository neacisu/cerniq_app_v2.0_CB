import { describe, expect, it } from '@jest/globals';
import {
  BRAIN_QS,
  NEURON_EXPLANATION_FOCUS,
  brainHref,
  buildBrainSearchParams,
} from './brain-cross-entity';

describe('brain-cross-entity (contract §25 / OpenAPI BrainCrossEntityRefs)', () => {
  it('construiește href fără query dacă nu există entități', () => {
    expect(brainHref('/brain/traces', {})).toBe('/brain/traces');
  });

  it('propagă toți parametrii documentați', () => {
    const q = buildBrainSearchParams(
      {
        traceId: 't1',
        gatewayId: 'g1',
        neuronId: 'n1',
        synapseId: 's1',
      },
      { [BRAIN_QS.focus]: NEURON_EXPLANATION_FOCUS },
    );
    expect(q.get('trace')).toBe('t1');
    expect(q.get('gateway')).toBe('g1');
    expect(q.get('neuron')).toBe('n1');
    expect(q.get('synapse')).toBe('s1');
    expect(q.get(BRAIN_QS.focus)).toBe(NEURON_EXPLANATION_FOCUS);
  });

  it('omite chei goale din extra', () => {
    const q = buildBrainSearchParams({}, { [BRAIN_QS.focus]: '' });
    expect(q.toString()).toBe('');
  });
});
