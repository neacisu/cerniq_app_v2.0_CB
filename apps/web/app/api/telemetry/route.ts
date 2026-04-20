import { NextResponse } from 'next/server';

/**
 * Agregare telemetrie / health — aliniat `ui-api-routes-sse-telemetry` + OpenAPI.
 * Cu `CERNIQ_API_INTERNAL_URL`, citește `/v1/cognitive/hello` de la API (același contract).
 */
export async function GET() {
  const apiBase = process.env.CERNIQ_API_INTERNAL_URL?.replace(/\/$/, '');
  if (apiBase) {
    try {
      const upstream = await fetch(`${apiBase}/v1/cognitive/hello`, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (upstream.ok) {
        const cognitiveHello = await upstream.json();
        return NextResponse.json({
          service: 'cerniq-web',
          upstream: 'api',
          cognitive_hello: cognitiveHello,
          redis: process.env.REDIS_URL ? 'configured' : 'external-redis-shared',
          temporal: process.env.TEMPORAL_ADDRESS ? 'configured' : 'cluster-env',
          note: 'Agregat din API Fastify; ingress Traefik stacks-02 în prod.',
        });
      }
    } catch {
      /* fallthrough */
    }
  }

  return NextResponse.json({
    service: 'cerniq-web',
    upstream: null,
    cognitive_hello: null,
    redis: process.env.REDIS_URL ? 'configured' : 'external-redis-shared',
    temporal: process.env.TEMPORAL_ADDRESS ? 'configured' : 'cluster-env',
    note: 'Setează CERNIQ_API_INTERNAL_URL (ex. http://127.0.0.1:25010) pentru paritate OpenAPI.',
  });
}
