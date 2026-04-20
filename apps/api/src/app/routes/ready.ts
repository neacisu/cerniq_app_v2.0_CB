import type { FastifyPluginAsync } from 'fastify';

/**
 * Readiness — extensibil cu verificări DB/Redis (stacks-02) fără a bloca liveness /health.
 * Verificări suplimentare: vezi `impl-apps-api-fastify-core`, `infra-phase0`.
 */
const ready: FastifyPluginAsync = async (fastify) => {
  fastify.get('/ready', async (_request, reply) => reply.send({ ready: true }));
};

export default ready;
