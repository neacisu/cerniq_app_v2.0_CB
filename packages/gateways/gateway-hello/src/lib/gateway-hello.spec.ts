import { gatewayHello } from './gateway-hello.js';

describe('gatewayHello', () => {
  it('should work', () => {
    expect(gatewayHello()).toEqual('gateway-hello');
  })
})
