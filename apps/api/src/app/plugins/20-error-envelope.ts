import fp from 'fastify-plugin';
import type { FastifyError, FastifyPluginAsync } from 'fastify';

function isFastifyError(err: unknown): err is FastifyError {
  return typeof err === 'object' && err !== null && 'statusCode' in err;
}

function resolveStatusCode(err: unknown): number {
  if (!isFastifyError(err)) {
    return 500;
  }
  return err.statusCode ?? 500;
}

function getRawErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  return 'Error';
}

function getErrorCode(err: unknown, status: number): string {
  if (isFastifyError(err) && typeof err.code === 'string') {
    return err.code;
  }
  if (status === 500) {
    return 'INTERNAL';
  }
  return 'ERROR';
}

function getClientFacingMessage(rawMessage: string, status: number): string {
  return status === 500 ? 'Internal error' : rawMessage;
}

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler((err: unknown, request, reply) => {
    const status = resolveStatusCode(err);
    const rawMessage = getRawErrorMessage(err);
    const code = getErrorCode(err, status);
    const requestId = request.requestId ?? 'unknown';
    request.log.error({ err, requestId, url: request.url }, rawMessage);
    if (reply.sent) return;
    reply.status(status).send({
      error: {
        code,
        message: getClientFacingMessage(rawMessage, status),
        request_id: requestId,
      },
    });
  });
};

export default fp(plugin, { name: 'error-envelope' });
