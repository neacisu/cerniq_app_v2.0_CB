export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * SSE minimal pentru telemetrie Brain (blueprint §14 / §16).
 * În producție poate face proxy către apps/api + Redis streams.
 */
export async function GET() {
  const enc = new TextEncoder();
  let interval: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: Record<string, unknown>) => {
        controller.enqueue(enc.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };
      send({ type: 'connected', channel: 'brain-live', ts: Date.now() });
      interval = setInterval(
        () => send({ type: 'tick', ts: Date.now() }),
        3000
      );
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
