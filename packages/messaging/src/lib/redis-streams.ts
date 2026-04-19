import { Redis } from 'ioredis';

export interface StreamConsumerOptions {
  readonly streamKey: string;
  readonly group: string;
  readonly consumer: string;
  readonly blockMs?: number;
}

/**
 * Runtime sinapse: XREADGROUP + XACK. Folosește redis-shared (stacks-02).
 */
export class SynapseStreamConsumer {
  private readonly redis: Redis;

  constructor(connectionUrl?: string) {
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
      String(opts.blockMs ?? 5000),
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
