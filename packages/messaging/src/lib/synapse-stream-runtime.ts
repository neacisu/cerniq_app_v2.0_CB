import type { Redis } from 'ioredis';
import {
  DEFAULT_STREAM_BLOCK_MS,
  SynapseStreamConsumer,
  type StreamConsumerOptions,
} from './redis-streams.js';

/** Stream DLQ: `<streamKey>:dlq` — convenție orchestration-matrix. */
export function dlqStreamKey(streamKey: string): string {
  return streamKey.endsWith(':dlq') ? streamKey : `${streamKey}:dlq`;
}

export type StreamEntry = { id: string; fields: Record<string, string> };

function parseFieldPairs(fieldList: unknown): Record<string, string> {
  const fields: Record<string, string> = {};
  if (!Array.isArray(fieldList)) {
    return fields;
  }
  for (let i = 0; i < fieldList.length; i += 2) {
    fields[String(fieldList[i])] = String(fieldList[i + 1] ?? '');
  }
  return fields;
}

function parseOneEntryRow(row: unknown): StreamEntry | undefined {
  if (!Array.isArray(row) || row.length < 2) {
    return undefined;
  }
  const id = String(row[0]);
  const fieldList = row[1];
  return { id, fields: parseFieldPairs(fieldList) };
}

function parseEntriesBlock(rawEntries: unknown): StreamEntry[] {
  const entries: StreamEntry[] = [];
  if (!Array.isArray(rawEntries)) {
    return entries;
  }
  for (const row of rawEntries) {
    const parsed = parseOneEntryRow(row);
    if (parsed) {
      entries.push(parsed);
    }
  }
  return entries;
}

/** Parsează răspuns XREADGROUP (formă Redis: stream → [[id, [k,v,...]]]). */
export function parseXReadGroupReply(reply: unknown): Array<{
  stream: string;
  entries: StreamEntry[];
}> {
  const out: Array<{ stream: string; entries: StreamEntry[] }> = [];
  if (!Array.isArray(reply)) {
    return out;
  }
  for (const streamBlock of reply) {
    if (!Array.isArray(streamBlock) || streamBlock.length < 2) {
      continue;
    }
    const streamName = String(streamBlock[0]);
    const entries = parseEntriesBlock(streamBlock[1]);
    out.push({ stream: streamName, entries });
  }
  return out;
}

/** Backoff exponențial (ms), plafon 60s — retry înainte de DLQ. */
export function streamRetryBackoffMs(attemptIndex: number): number {
  return Math.min(1000 * 2 ** attemptIndex, 60_000);
}

export interface ProcessStreamBatchOptions {
  readonly streamKey: string;
  readonly group: string;
  readonly consumer: string;
  readonly maxAttempts: number;
  readonly blockMs?: number;
}

const RETRY_META_KEYS = new Set(['_last_error', '_retry_attempt']);

function fieldsToReplayPairs(fields: Record<string, string>): string[] {
  const flat: string[] = [];
  for (const [k, v] of Object.entries(fields)) {
    if (RETRY_META_KEYS.has(k)) {
      continue;
    }
    flat.push(k, v);
  }
  return flat;
}

async function routeFailedMessageToDlqOrRetry(
  redis: Redis,
  opts: {
    streamKey: string;
    dlq: string;
    maxAttempts: number;
    entryId: string;
  },
  fields: Record<string, string>,
  err: unknown
): Promise<void> {
  const msg = err instanceof Error ? err.message : String(err);
  const attempt = Number(fields._retry_attempt ?? '0') + 1;
  const flat = fieldsToReplayPairs(fields);
  if (attempt >= opts.maxAttempts) {
    await redis.xadd(
      opts.dlq,
      '*',
      ...flat,
      '_error',
      msg,
      '_original_id',
      opts.entryId,
      '_attempts',
      String(attempt)
    );
  } else {
    flat.push('_retry_attempt', String(attempt), '_last_error', msg);
    await redis.xadd(opts.streamKey, '*', ...flat);
  }
}

/**
 * Un ciclu: XREADGROUP → handler per mesaj → XACK sau DLQ după maxAttempts.
 * Fără instanță Redis paralelă — folosește clientul din consumer.
 */
export async function processOneReadGroupCycle(
  consumer: SynapseStreamConsumer,
  opts: ProcessStreamBatchOptions,
  handler: (fields: Record<string, string>) => Promise<void>
): Promise<number> {
  const redis = consumer.getClient();
  const readOpts: StreamConsumerOptions = {
    streamKey: opts.streamKey,
    group: opts.group,
    consumer: opts.consumer,
    blockMs: opts.blockMs ?? DEFAULT_STREAM_BLOCK_MS,
  };
  const raw = await consumer.readOnce(readOpts);
  const streams = parseXReadGroupReply(raw);
  let processed = 0;
  const dlq = dlqStreamKey(opts.streamKey);

  for (const { stream, entries } of streams) {
    if (stream !== opts.streamKey) {
      continue;
    }
    for (const { id, fields } of entries) {
      try {
        await handler(fields);
        await consumer.ack(opts.streamKey, opts.group, id);
        processed += 1;
      } catch (err: unknown) {
        await routeFailedMessageToDlqOrRetry(
          redis,
          {
            streamKey: opts.streamKey,
            dlq,
            maxAttempts: opts.maxAttempts,
            entryId: id,
          },
          fields,
          err
        );
        await consumer.ack(opts.streamKey, opts.group, id);
        processed += 1;
      }
    }
  }
  return processed;
}

/** Helper test: XADD pe DLQ cu câmpuri plate. */
export async function xaddDlq(
  redis: Redis,
  streamKey: string,
  originalId: string,
  error: string,
  fields: Record<string, string>
): Promise<string> {
  const dlq = dlqStreamKey(streamKey);
  const flat: string[] = [];
  for (const [k, v] of Object.entries(fields)) {
    flat.push(k, v);
  }
  const added = await redis.xadd(
    dlq,
    '*',
    ...flat,
    '_error',
    error,
    '_original_id',
    originalId
  );
  if (typeof added !== 'string' || added.length === 0) {
    throw new Error('synapse-stream-runtime: xadd dlq did not return stream id');
  }
  return added;
}
