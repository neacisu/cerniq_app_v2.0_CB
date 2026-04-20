import { gatewayHello } from '../src/lib/gateway-hello.js';

describe('gateway-hello conventions (research §8)', () => {
  it('exports gateway entry', () => {
    expect(gatewayHello()).toBe('gateway-hello');
  });
});
