/**
 * Worker Temporal pentru gateway-uri — rulează pe host cu RAM adecvată (stacks-03), nu pe lxc-ci-worker.
 * Pornire: TEMPORAL_ADDRESS=host:7233 TEMPORAL_NAMESPACE=default node dist/main.js
 */
import { bundleWorkflowCode, NativeConnection, Worker } from '@temporalio/worker';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const address = process.env.TEMPORAL_ADDRESS;
if (!address) {
  console.error('TEMPORAL_ADDRESS lipsă');
  process.exit(1);
}

const workflowsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'workflows.js');

async function run(): Promise<void> {
  const { code } = await bundleWorkflowCode({ workflowsPath });
  const connection = await NativeConnection.connect({ address });
  const worker = await Worker.create({
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE ?? 'default',
    taskQueue: process.env.TEMPORAL_TASK_QUEUE ?? 'cerniq-gateway-default',
    workflowBundle: { code },
    activities: {},
  });
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
