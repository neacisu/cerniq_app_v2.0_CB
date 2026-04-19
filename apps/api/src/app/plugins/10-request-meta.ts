import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import { randomUUID } from 'crypto';

declare module 'fastify' {
  interface FastifyRequest {
    requestId: string;
  }
}

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', async (request, reply) => {
    const incoming = request.headers['x-request-id'];
    const id =
      typeof incoming === 'string' && incoming.length > 0 ? incoming : randomUUID();
    request.requestId = id;
    reply.header('X-Request-Id', id);
  });
};

export default fp(plugin, { name: 'request-meta' });
