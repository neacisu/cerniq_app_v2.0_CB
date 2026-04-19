import { synapsePing } from './synapse-ping.js';

describe('synapsePing', () => {
  it('should work', () => {
    expect(synapsePing()).toEqual('synapse-ping');
  })
})
