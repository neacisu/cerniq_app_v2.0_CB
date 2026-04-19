import { FastifyPluginAsync } from 'fastify';
import { Registry, Counter } from 'prom-client';

const registry = new Registry();
const httpRequests = new Counter({
  name: 'cerniq_http_requests_total',
  help: 'HTTP requests',
  labelNames: ['method', 'status'],
  registers: [registry],
});

const metrics: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onResponse', async (request, reply) => {
    httpRequests.inc({
      method: request.method,
      status: String(reply.statusCode),
    });
  });

  fastify.get('/metrics', async (_, reply) => {
    reply.header('Content-Type', registry.contentType);
    return reply.send(await registry.metrics());
  });
};

export default metrics;
