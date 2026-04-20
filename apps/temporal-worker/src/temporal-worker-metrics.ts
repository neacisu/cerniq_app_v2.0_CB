import { Gauge, Registry, collectDefaultMetrics } from 'prom-client';

/** Registry Prometheus — scrape către stack observability orchestrator (stacks-02). */
export function createTemporalWorkerRegistry(opts: {
  namespace: string;
  taskQueue: string;
  temporalAddress: string;
}): Registry {
  const register = new Registry();
  collectDefaultMetrics({ register, prefix: 'cerniq_temporal_node_' });
  const info = new Gauge({
    name: 'cerniq_temporal_worker_build_info',
    help: 'Worker Temporal: namespace, task queue, adresă cluster (CMDB / env).',
    labelNames: ['namespace', 'task_queue', 'temporal_address'],
    registers: [register],
  });
  info.set(
    {
      namespace: opts.namespace,
      task_queue: opts.taskQueue,
      temporal_address: opts.temporalAddress,
    },
    1
  );
  return register;
}
