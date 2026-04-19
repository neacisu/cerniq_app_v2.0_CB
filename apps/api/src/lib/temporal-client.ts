import { Connection, Client } from '@temporalio/client';

let cached: Client | null = null;

export async function getTemporalClient(): Promise<Client> {
  if (cached) return cached;
  const address = process.env.TEMPORAL_ADDRESS;
  if (!address) {
    throw new Error('TEMPORAL_ADDRESS not set');
  }
  const connection = await Connection.connect({ address });
  cached = new Client({ connection, namespace: process.env.TEMPORAL_NAMESPACE ?? 'default' });
  return cached;
}
