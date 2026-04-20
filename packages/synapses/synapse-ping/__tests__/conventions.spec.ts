import { onStreamMessage } from '../src/lib/on-stream-message.js';

describe('synapse-ping conventions (research §8)', () => {
  it('exports stream consumer handler', async () => {
    await expect(onStreamMessage({ x: 'y' })).resolves.toBeUndefined();
  });
});
