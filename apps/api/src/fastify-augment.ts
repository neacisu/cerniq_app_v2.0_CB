/** Augmentări `FastifyRequest` partajate (request id + W3C trace fără SDK OTel). */
import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    requestId: string;
    traceId?: string;
    parentSpanId?: string;
  }
}

export {};
