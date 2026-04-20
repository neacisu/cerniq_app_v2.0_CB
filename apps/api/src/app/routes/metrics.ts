import { FastifyPluginAsync } from 'fastify';
import { cerniqRegistry, httpRequests } from '../lib/cerniq-metrics';

const metrics: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onResponse', async (request, reply) => {
    httpRequests.inc({
      method: request.method,
      status: String(reply.statusCode),
    });
  });

  fastify.get('/metrics', async (_, reply) => {
    reply.header('Content-Type', cerniqRegistry.contentType);
    return reply.send(await cerniqRegistry.metrics());
  });
};

export default metrics;
