import type { Meta, StoryObj } from '@storybook/nextjs';
import { FlagshipWorkbench } from './flagship-workbench';
import { FLAGSHIP_WORKBENCHES } from '../../lib/flagship-workbenches';

const meta: Meta<typeof FlagshipWorkbench> = {
  title: 'Workbench/FlagshipWorkbench',
  component: FlagshipWorkbench,
};
export default meta;

type Story = StoryObj<typeof FlagshipWorkbench>;

export const IngestConnectors: Story = {
  args: {
    copy: FLAGSHIP_WORKBENCHES['/ingest/connectors'],
    traceId: 'trace-1',
    gatewayId: 'gateway-hello',
    neuronId: 'neuron-ping',
  },
};

export const Customer360: Story = {
  args: {
    copy: FLAGSHIP_WORKBENCHES['/customers/customer-360'],
    traceId: 'trace-1',
    gatewayId: 'gateway-hello',
    neuronId: 'neuron-ping',
  },
};
