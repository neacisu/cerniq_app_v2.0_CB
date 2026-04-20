import { FastifyPluginAsync } from 'fastify';
import { gatewayHello } from '@cerniq/gateway-hello';

const cognitive: FastifyPluginAsync = async (fastify) => {
  fastify.get('/cognitive/hello', async () => ({
    message: gatewayHello(),
    service: 'cerniq-api',
  }));
};

export default cognitive;
