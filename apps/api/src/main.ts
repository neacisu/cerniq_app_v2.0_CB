import Fastify from 'fastify';
import { randomUUID } from 'node:crypto';
import { app } from './app/app';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 25010;

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
  genReqId: (req) => {
    const h = req.headers['x-request-id'];
    return typeof h === 'string' && h.length > 0 ? h : randomUUID();
  },
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
