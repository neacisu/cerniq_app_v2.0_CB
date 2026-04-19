import { Queue, Worker, type JobsOptions } from 'bullmq';
import { Redis } from 'ioredis';

function connectionFromEnv(): Redis {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error('REDIS_URL required for BullMQ');
  return new Redis(url, { maxRetriesPerRequest: null });
}

export function createDelayQueue(name: string): Queue {
  const connection = connectionFromEnv();
  return new Queue(name, { connection });
}

export async function enqueueDelayed(
  queue: Queue,
  jobName: string,
  payload: Record<string, unknown>,
  delayMs: number,
  opts?: JobsOptions
): Promise<void> {
  await queue.add(jobName, payload, { delay: delayMs, ...opts });
}

export function createWorker(
  name: string,
  processor: (data: Record<string, unknown>) => Promise<void>
): Worker {
  const connection = connectionFromEnv();
  return new Worker(
    name,
    async (job) => {
      await processor(job.data as Record<string, unknown>);
    },
    { connection }
  );
}
