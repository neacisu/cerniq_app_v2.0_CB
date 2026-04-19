import { FastifyPluginAsync } from 'fastify';

const health: FastifyPluginAsync = async (fastify) => {
  fastify.get('/health', async () => ({ status: 'ok' }));
  fastify.get('/ready', async () => ({ ready: true }));
};

export default health;
