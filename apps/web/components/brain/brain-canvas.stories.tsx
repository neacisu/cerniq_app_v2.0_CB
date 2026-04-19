import type { Meta, StoryObj } from '@storybook/nextjs';
import { BrainCanvas } from './brain-canvas';

const meta: Meta<typeof BrainCanvas> = {
  title: 'Brain/BrainCanvas',
  component: BrainCanvas,
};

export default meta;

type Story = StoryObj<typeof BrainCanvas>;

export const Default: Story = {
  args: {
    gatewayLabel: 'gateway-hello',
    neuronLabel: 'neuron-ping',
    synapseLabel: 'synapse-ping',
  },
};
