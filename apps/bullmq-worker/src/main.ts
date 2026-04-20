/**
 * Proces worker BullMQ — conectare obligatorie la **redis-shared** (`REDIS_URL` din CMDB),
 * nu Redis paralel în compose proiect (stacks-02, ADR-0004).
 * Plasament: host cu RAM adecvată (stacks-03), nu `lxc-ci-worker` pentru sarcini grele.
 */
import { createWorker } from '@cerniq/messaging';
import { startPrometheusMetricsServer } from './metrics-server.js';
import { createBullmqWorkerRegistry } from './bullmq-worker-metrics.js';

const redisUrl = process.env.REDIS_URL?.trim();
if (!redisUrl) {
  console.error('REDIS_URL lipsă — folosiți URL-ul redis-shared (ex. redis://10.0.0.2:6379)');
  process.exit(1);
}

const queueBase = process.env.BULLMQ_QUEUE_NAME ?? 'default-jobs';
const metricsDisabled =
  process.env.METRICS_DISABLED === '1' || process.env.METRICS_DISABLED === 'true';
const metricsHost = process.env.METRICS_HOST ?? '127.0.0.1';
const metricsPort = Number.parseInt(process.env.METRICS_PORT ?? '25092', 10);

const { register, jobsProcessed, jobsFailed } = createBullmqWorkerRegistry({
  queueBaseName: queueBase,
  redisUrlPresent: true,
});

console.log(
  JSON.stringify({
    level: 'info',
    msg: 'bullmq_worker_start',
    component: 'bullmq-worker',
    queue: queueBase,
    metrics_listen:
      !metricsDisabled && metricsPort > 0 ? `${metricsHost}:${metricsPort}` : 'disabled',
  })
);

if (!metricsDisabled && metricsPort > 0) {
  startPrometheusMetricsServer(register, metricsHost, metricsPort);
  console.log(
    JSON.stringify({
      level: 'info',
      msg: 'bullmq_worker_metrics_listen',
      host: metricsHost,
      port: metricsPort,
    })
  );
}

createWorker(queueBase, async (data: Record<string, unknown>) => {
  try {
    console.log(
      JSON.stringify({
        level: 'info',
        msg: 'bullmq_job_received',
        queue: queueBase,
        job_keys: Object.keys(data),
      })
    );
    jobsProcessed.inc({ queue: queueBase });
  } catch (err) {
    jobsFailed.inc({ queue: queueBase });
    throw err;
  }
});
