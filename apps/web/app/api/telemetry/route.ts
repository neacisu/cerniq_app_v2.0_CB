import { NextResponse } from 'next/server';

/**
 * Stub telemetrie — agregare reală OTel/Prometheus în Faza următoare.
 */
export async function GET() {
  return NextResponse.json({
    service: 'cerniq-web',
    redis: process.env.REDIS_URL ? 'configured' : 'external-redis-shared',
    temporal: process.env.TEMPORAL_ADDRESS ? 'configured' : 'cluster-env',
    note: 'Conectați la serviciile stacks-02; fără Redis în compose proiect.',
  });
}
