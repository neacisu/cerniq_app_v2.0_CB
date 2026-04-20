import { Redis } from 'ioredis';

/** BLOCK implicit XREADGROUP (ms) — override în `readOnce`. */
export const DEFAULT_STREAM_BLOCK_MS = 5000;

export interface StreamConsumerOptions {
  readonly streamKey: string;
  readonly group: string;
  readonly consumer: string;
  readonly blockMs?: number;
}

/**
 * Runtime sinapse: XREADGROUP + XACK. Folosește redis-shared (stacks-02).
 */
export interface SynapseStreamConsumerOptions {
  /** Test / injectare client (ex. ioredis-mock) — fără a deschide conexiune paralelă. */
  readonly redis?: Redis;
}

export class SynapseStreamConsumer {
  private readonly redis: Redis;

  /** Acces la client pentru XADD DLQ / contor retry (același redis-shared). */
  getClient(): Redis {
    return this.redis;
  }

  constructor(connectionUrl?: string, opts?: SynapseStreamConsumerOptions) {
    if (opts?.redis) {
      this.redis = opts.redis;
      return;
    }
    const url = connectionUrl ?? process.env.REDIS_URL;
    if (!url) {
      throw new Error('REDIS_URL required for SynapseStreamConsumer');
    }
    this.redis = new Redis(url, { maxRetriesPerRequest: null });
  }

  async ensureGroup(stream: string, group: string): Promise<void> {
    try {
      await this.redis.xgroup('CREATE', stream, group, '0', 'MKSTREAM');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!msg.includes('BUSYGROUP')) throw e;
    }
  }

  /** XREADGROUP — returnează răspunsul brut Redis (formă stream-id + câmpuri). */
  async readOnce(opts: StreamConsumerOptions): Promise<unknown> {
    return this.redis.xreadgroup(
      'GROUP',
      opts.group,
      opts.consumer,
      'COUNT',
      '10',
      'BLOCK',
      String(opts.blockMs ?? DEFAULT_STREAM_BLOCK_MS),
      'STREAMS',
      opts.streamKey,
      '>'
    );
  }

  async ack(stream: string, group: string, id: string): Promise<number> {
    return this.redis.xack(stream, group, id);
  }

  async disconnect(): Promise<void> {
    await this.redis.quit();
  }
}
