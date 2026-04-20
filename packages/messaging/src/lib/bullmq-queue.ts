import { Queue, Worker, type JobsOptions } from 'bullmq';
import { Redis } from 'ioredis';

/** Prefix cozi BullMQ pe redis-shared — evită coliziuni între servicii. */
export const CERNIQ_BULLMQ_PREFIX = 'cerniq:bullmq:';

export function qualifyQueueName(name: string): string {
  return name.startsWith(CERNIQ_BULLMQ_PREFIX)
    ? name
    : `${CERNIQ_BULLMQ_PREFIX}${name}`;
}

/** Coadă DLQ logică (aceeași instanță Redis; worker separat). */
export function dlqQueueName(baseName: string): string {
  return `${qualifyQueueName(baseName)}:dlq`;
}

/** Valori implicite: retry exponential, retenție job-uri complete. */
export const DEFAULT_BULLMQ_JOB_OPTIONS: JobsOptions = {
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 },
  removeOnComplete: 1000,
  removeOnFail: false,
};

function connectionFromEnv(): Redis {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error('REDIS_URL required for BullMQ');
  return new Redis(url, { maxRetriesPerRequest: null });
}

export function createDelayQueue(name: string): Queue {
  const connection = connectionFromEnv();
  const qn = qualifyQueueName(name);
  return new Queue(qn, {
    connection,
    defaultJobOptions: DEFAULT_BULLMQ_JOB_OPTIONS,
  });
}

export async function enqueueDelayed(
  queue: Queue,
  jobName: string,
  payload: Record<string, unknown>,
  delayMs: number,
  opts?: JobsOptions
): Promise<void> {
  await queue.add(jobName, payload, {
    delay: delayMs,
    ...DEFAULT_BULLMQ_JOB_OPTIONS,
    ...opts,
  });
}

export function createWorker(
  name: string,
  processor: (data: Record<string, unknown>) => Promise<void>
): Worker {
  const connection = connectionFromEnv();
  const qn = qualifyQueueName(name);
  return new Worker(
    qn,
    async (job) => {
      await processor(job.data as Record<string, unknown>);
    },
    { connection }
  );
}
