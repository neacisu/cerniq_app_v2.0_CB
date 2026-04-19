import fp from 'fastify-plugin';
import type { FastifyError, FastifyPluginAsync } from 'fastify';

function isFastifyError(err: unknown): err is FastifyError {
  return typeof err === 'object' && err !== null && 'statusCode' in err;
}

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler((err: unknown, request, reply) => {
    const status = isFastifyError(err) ? (err.statusCode ?? 500) : 500;
    const message =
      err instanceof Error ? err.message : typeof err === 'string' ? err : 'Error';
    const code =
      isFastifyError(err) && typeof err.code === 'string'
        ? err.code
        : status === 500
          ? 'INTERNAL'
          : 'ERROR';
    const requestId = request.requestId ?? 'unknown';
    request.log.error({ err, requestId, url: request.url }, message);
    if (reply.sent) return;
    reply.status(status).send({
      error: {
        code,
        message: status === 500 ? 'Internal error' : message,
        request_id: requestId,
      },
    });
  });
};

export default fp(plugin, { name: 'error-envelope' });
