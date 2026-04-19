import Fastify from 'fastify';
import { randomUUID } from 'node:crypto';
import { app } from './app/app';
import { pickRequestIdHeader } from './lib/http-request-id';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 25010;

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
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
