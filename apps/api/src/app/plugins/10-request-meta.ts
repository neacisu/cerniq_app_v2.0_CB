import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import { randomUUID } from 'node:crypto';
import { pickRequestIdHeader } from '../../lib/http-request-id';

declare module 'fastify' {
  interface FastifyRequest {
    requestId: string;
  }
}

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', async (request, reply) => {
    const incoming = pickRequestIdHeader(request.headers['x-request-id']);
    const id = incoming ?? randomUUID();
    request.requestId = id;
    reply.header('X-Request-Id', id);
  });
};

export default fp(plugin, { name: 'request-meta' });
