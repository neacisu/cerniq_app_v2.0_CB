import { FastifyPluginAsync } from 'fastify';
import { Readable } from 'node:stream';

/**
 * SSE Brain — aliniat doc-enterprise-contracts-api-events.
 */
const cognitiveStream: FastifyPluginAsync = async (fastify) => {
  fastify.get('/cognitive/stream', async (request, reply) => {
    const rid = request.requestId;
    const stream = Readable.from(
      (async function* () {
        yield `event: telemetry\n`;
        yield `data: ${JSON.stringify({ type: 'connected', request_id: rid, ts: Date.now() })}\n\n`;
        for (let i = 0; i < 3; i++) {
          await new Promise((r) => setTimeout(r, 1500));
          yield `event: telemetry\n`;
          yield `data: ${JSON.stringify({ type: 'tick', seq: i, ts: Date.now() })}\n\n`;
        }
      })()
    );
    return reply
      .header('Content-Type', 'text/event-stream; charset=utf-8')
      .header('Cache-Control', 'no-cache, no-transform')
      .header('Connection', 'keep-alive')
      .send(stream);
  });
};

export default cognitiveStream;
