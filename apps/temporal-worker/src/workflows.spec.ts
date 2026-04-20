import { gatewayHelloWorkflow } from './workflows.js';

describe('gatewayHelloWorkflow', () => {
  it('returnează marker final fără server Temporal (logică izolată)', async () => {
    await expect(gatewayHelloWorkflow()).resolves.toBe('gateway-hello-complete');
  });
});
