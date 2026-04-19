export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * SSE telemetrie Brain — proxy opțional către API Fastify (`CERNIQ_API_INTERNAL_URL`).
 */
export async function GET() {
  const apiBase = process.env.CERNIQ_API_INTERNAL_URL?.replace(/\/$/, '');
  if (apiBase) {
    const upstream = await fetch(`${apiBase}/v1/cognitive/stream`, {
      headers: { Accept: 'text/event-stream' },
      cache: 'no-store',
    });
    if (upstream.ok && upstream.body) {
      return new Response(upstream.body, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      });
    }
  }

  const enc = new TextEncoder();
  let interval: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: Record<string, unknown>) => {
        controller.enqueue(enc.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };
      send({ type: 'connected', channel: 'brain-live', ts: Date.now(), mode: 'local' });
      interval = setInterval(() => send({ type: 'tick', ts: Date.now() }), 3000);
    },
    cancel() {
      if (interval) clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
