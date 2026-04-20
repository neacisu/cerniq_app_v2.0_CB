import { Registry } from 'prom-client';
import { startPrometheusMetricsServer } from './metrics-server.js';

function closeServer(
  server: import('node:http').Server
): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
}

describe('startPrometheusMetricsServer', () => {
  it('servește GET /metrics', async () => {
    const register = new Registry();
    const server = startPrometheusMetricsServer(register, '127.0.0.1', 0);
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.once('listening', () => resolve());
    });
    const addr = server.address();
    if (addr === null || typeof addr === 'string') {
      await closeServer(server);
      throw new Error('expected AddressInfo');
    }
    const res = await fetch(`http://127.0.0.1:${addr.port}/metrics`);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text.length).toBeGreaterThan(0);
    await closeServer(server);
  });
});
