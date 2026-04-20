import { onEvent } from '../src/lib/on-event.js';

describe('neuron-ping conventions (research §8)', () => {
  it('exports onEvent handler', async () => {
    const r = await onEvent({ ping: '1' });
    expect(r.ok).toBe(true);
    expect(r.label).toBe('neuron-ping');
    expect(r.event_field_count).toBe(1);
  });
});
