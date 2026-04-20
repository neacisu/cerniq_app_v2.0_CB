import type { Redis } from 'ioredis';
import type { SynapseStreamConsumer } from './redis-streams.js';
import {
  dlqStreamKey,
  parseXReadGroupReply,
  processOneReadGroupCycle,
  streamRetryBackoffMs,
} from './synapse-stream-runtime.js';

describe('synapse-stream-runtime', () => {
  it('dlqStreamKey adaugă sufix :dlq', () => {
    expect(dlqStreamKey('brain:ping:events')).toBe('brain:ping:events:dlq');
    expect(dlqStreamKey('x:dlq')).toBe('x:dlq');
  });

  it('streamRetryBackoffMs este exponențial plafonat', () => {
    expect(streamRetryBackoffMs(0)).toBe(1000);
    expect(streamRetryBackoffMs(10)).toBe(60_000);
  });

  it('parseXReadGroupReply parsează răspuns Redis', () => {
    const reply = [
      [
        's1',
        [['173-0', ['a', '1', 'b', '2']]],
      ],
    ];
    expect(parseXReadGroupReply(reply)).toEqual([
      {
        stream: 's1',
        entries: [{ id: '173-0', fields: { a: '1', b: '2' } }],
      },
    ]);
    expect(parseXReadGroupReply(null)).toEqual([]);
  });

  it('processOneReadGroupCycle: succes → handler + ACK (mock ioredis — fără XGROUP în mock)', async () => {
    const ack = jest.fn().mockResolvedValue(1);
    const redis = { xadd: jest.fn() } as unknown as Redis;
    const consumer = {
      readOnce: jest
        .fn()
        .mockResolvedValue([[ 'sk', [['1-0', ['payload', 'ok']]]]]),
      ack,
      getClient: () => redis,
    } as unknown as SynapseStreamConsumer;
    const handler = jest.fn().mockResolvedValue(undefined);
    const n = await processOneReadGroupCycle(
      consumer,
      {
        streamKey: 'sk',
        group: 'g',
        consumer: 'c',
        maxAttempts: 3,
      },
      handler
    );
    expect(handler).toHaveBeenCalledWith({ payload: 'ok' });
    expect(ack).toHaveBeenCalledWith('sk', 'g', '1-0');
    expect(n).toBe(1);
    expect(redis.xadd).not.toHaveBeenCalled();
  });

  it('processOneReadGroupCycle: eșec sub maxAttempts → re-XADD + ACK', async () => {
    const ack = jest.fn().mockResolvedValue(1);
    const redis = { xadd: jest.fn().mockResolvedValue('2-0') } as unknown as Redis;
    const consumer = {
      readOnce: jest
        .fn()
        .mockResolvedValue([[ 'sk2', [['1-0', ['payload', 'x']]]]]),
      ack,
      getClient: () => redis,
    } as unknown as SynapseStreamConsumer;
    const n = await processOneReadGroupCycle(
      consumer,
      {
        streamKey: 'sk2',
        group: 'g2',
        consumer: 'c2',
        maxAttempts: 3,
      },
      async () => {
        throw new Error('boom');
      }
    );
    expect(n).toBe(1);
    expect(redis.xadd).toHaveBeenCalled();
    expect(ack).toHaveBeenCalledWith('sk2', 'g2', '1-0');
  });

  it('processOneReadGroupCycle: eșec la ultima încercare → DLQ + ACK', async () => {
    const ack = jest.fn().mockResolvedValue(1);
    const redis = { xadd: jest.fn().mockResolvedValue('2-0') } as unknown as Redis;
    const consumer = {
      readOnce: jest.fn().mockResolvedValue([
        [
          'sk3',
          [['1-0', ['payload', 'x', '_retry_attempt', '2']]],
        ],
      ]),
      ack,
      getClient: () => redis,
    } as unknown as SynapseStreamConsumer;
    const n = await processOneReadGroupCycle(
      consumer,
      {
        streamKey: 'sk3',
        group: 'g3',
        consumer: 'c3',
        maxAttempts: 3,
      },
      async () => {
        throw new Error('final');
      }
    );
    expect(n).toBe(1);
    const xadd = redis.xadd as jest.Mock;
    expect(xadd.mock.calls[0][0]).toBe('sk3:dlq');
    expect(ack).toHaveBeenCalled();
  });
});
