import '../../fastify-augment';
import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import { randomUUID } from 'node:crypto';
import { pickRequestIdHeader } from '../../lib/http-request-id';
import { parseTraceparent } from '../../lib/w3c-traceparent';

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', async (request, reply) => {
    const incoming = pickRequestIdHeader(request.headers['x-request-id']);
    const id = incoming ?? randomUUID();
    request.requestId = id;
    reply.header('X-Request-Id', id);

    const tp = parseTraceparent(request.headers.traceparent);
    if (tp) {
      request.traceId = tp.traceId;
      request.parentSpanId = tp.parentSpanId;
      request.log = request.log.child({ trace_id: tp.traceId });
    }
  });
};

export default fp(plugin, { name: 'request-meta' });
