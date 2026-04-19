import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    tenantId: string | null;
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', async (request) => {
    const raw = request.headers['x-tenant-id'];
    const v = typeof raw === 'string' ? raw.trim() : '';
    request.tenantId = UUID.test(v) ? v : null;
  });
};

export default fp(plugin, { name: 'tenant-context' });
