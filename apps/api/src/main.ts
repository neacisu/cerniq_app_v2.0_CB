import { startNodeOtel } from './otel-init.js';
startNodeOtel();
import './fastify-augment.js';
import Fastify from 'fastify';
import { randomUUID } from 'node:crypto';
import { app } from './app/app.js';
import { pickRequestIdHeader } from './lib/http-request-id.js';
import { headersForLog } from './lib/safe-req-log.js';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 25010;

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
    serializers: {
      req(request) {
        return {
          method: request.method,
          url: request.url,
          headers: headersForLog(request.headers),
          remoteAddress: request.socket?.remoteAddress,
        };
      },
    },
  },
  genReqId: (req) => pickRequestIdHeader(req.headers['x-request-id']) ?? randomUUID(),
  disableRequestLogging: false,
});

server.register(app);

server.listen({ port, host }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  } else {
    server.log.info({ port, host }, 'api ready');
  }
});
