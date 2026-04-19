import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Route Handler comandă Brain (blueprint §16) — stub; extinde cu auth + proxy API.
 */
export async function POST(request: Request) {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    /* ignore */
  }
  return NextResponse.json({
    ok: true,
    received: body,
    trace_hint: 'folosește X-Request-Id la apelul API Fastify',
  });
}
