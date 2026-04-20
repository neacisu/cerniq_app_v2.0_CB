import { Counter, Gauge, Registry, collectDefaultMetrics } from 'prom-client';

export function createBullmqWorkerRegistry(opts: {
  queueBaseName: string;
  redisUrlPresent: boolean;
}): { register: Registry; jobsProcessed: Counter; jobsFailed: Counter } {
  const register = new Registry();
  collectDefaultMetrics({ register, prefix: 'cerniq_bullmq_node_' });
  new Gauge({
    name: 'cerniq_bullmq_worker_build_info',
    help: 'Worker BullMQ: coadă logică și prezență REDIS_URL (fără valori secrete).',
    labelNames: ['queue_base', 'redis_configured'],
    registers: [register],
  }).set(
    {
      queue_base: opts.queueBaseName,
      redis_configured: opts.redisUrlPresent ? 'true' : 'false',
    },
    1
  );
  const jobsProcessed = new Counter({
    name: 'cerniq_bullmq_jobs_processed_total',
    help: 'Job-uri procesate cu succes de worker.',
    labelNames: ['queue'],
    registers: [register],
  });
  const jobsFailed = new Counter({
    name: 'cerniq_bullmq_jobs_failed_total',
    help: 'Job-uri eșuate în processor.',
    labelNames: ['queue'],
    registers: [register],
  });
  return { register, jobsProcessed, jobsFailed };
}
