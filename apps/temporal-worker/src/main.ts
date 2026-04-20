/**
 * Worker Temporal pentru gateway-uri — rulează pe host cu RAM adecvată (stacks-03), nu pe lxc-ci-worker.
 * Cluster: `TEMPORAL_ADDRESS` din CMDB/OpenBao (ex. host:7233).
 * Metrics Prometheus: `GET /metrics` pe `METRICS_HOST`:`METRICS_PORT` (stacks-02; bind implicit localhost).
 */
import { bundleWorkflowCode, NativeConnection, Worker } from '@temporalio/worker';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startPrometheusMetricsServer } from './metrics-server.js';
import { createTemporalWorkerRegistry } from './temporal-worker-metrics.js';

const temporalAddressRaw = process.env.TEMPORAL_ADDRESS;
if (!temporalAddressRaw) {
  console.error('TEMPORAL_ADDRESS lipsă');
  process.exit(1);
}
/** Adresă cluster după validare — tip `string` pentru metrici / NativeConnection. */
const temporalAddress: string = temporalAddressRaw;

const tq = process.env.TEMPORAL_TASK_QUEUE ?? 'cerniq-gateway-default';
const ns = process.env.TEMPORAL_NAMESPACE ?? 'default';
const metricsDisabled =
  process.env.METRICS_DISABLED === '1' || process.env.METRICS_DISABLED === 'true';
const metricsHost = process.env.METRICS_HOST ?? '127.0.0.1';
const metricsPort = Number.parseInt(process.env.METRICS_PORT ?? '25091', 10);

console.log(
  JSON.stringify({
    level: 'info',
    msg: 'temporal_worker_start',
    component: 'temporal-worker',
    temporal_address: temporalAddress,
    temporal_namespace: ns,
    temporal_task_queue: tq,
    trace_id: process.env.TRACE_ID,
    metrics_listen:
      !metricsDisabled && metricsPort > 0 ? `${metricsHost}:${metricsPort}` : 'disabled',
  })
);

const workflowsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'workflows.js');

async function run(): Promise<void> {
  if (!metricsDisabled && metricsPort > 0) {
    const register = createTemporalWorkerRegistry({
      namespace: ns,
      taskQueue: tq,
      temporalAddress,
    });
    startPrometheusMetricsServer(register, metricsHost, metricsPort);
    console.log(
      JSON.stringify({
        level: 'info',
        msg: 'temporal_worker_metrics_listen',
        host: metricsHost,
        port: metricsPort,
      })
    );
  }

  const { code } = await bundleWorkflowCode({ workflowsPath });
  const connection = await NativeConnection.connect({ address: temporalAddress });
  const worker = await Worker.create({
    connection,
    namespace: ns,
    taskQueue: tq,
    workflowBundle: { code },
    activities: {},
  });
  await worker.run();
}

try {
  await run();
} catch (err) {
  console.error(err);
  process.exit(1);
}
