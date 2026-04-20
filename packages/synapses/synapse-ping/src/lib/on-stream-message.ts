import { synapsePing } from './synapse-ping.js';

/**
 * Procesare mesaj din Redis Stream după XREADGROUP (research §8).
 * Loop-ul I/O (XREADGROUP, ACK, DLQ) stă în `@cerniq/messaging` — aici doar logica sinapsei.
 */
export async function onStreamMessage(fields: Record<string, string>): Promise<void> {
  await Promise.resolve({
    synapse: synapsePing(),
    receivedKeys: Object.keys(fields).length,
  });
}
