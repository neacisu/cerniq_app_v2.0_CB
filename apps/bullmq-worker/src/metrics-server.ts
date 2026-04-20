import { createServer } from 'node:http';
import type { Registry } from 'prom-client';

export function startPrometheusMetricsServer(
  register: Registry,
  host: string,
  port: number
): import('node:http').Server {
  const server = createServer((req, res) => {
    const u = req.url ?? '';
    if (u === '/metrics' || u.startsWith('/metrics?')) {
      void register.metrics().then(
        (body) => {
          res.setHeader('Content-Type', register.contentType);
          res.statusCode = 200;
          res.end(body);
        },
        (err: unknown) => {
          res.statusCode = 500;
          res.end(err instanceof Error ? err.message : 'metrics error');
        }
      );
      return;
    }
    res.statusCode = 404;
    res.end();
  });
  server.listen(port, host);
  return server;
}
