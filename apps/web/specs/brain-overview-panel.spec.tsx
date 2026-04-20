import './jest-runtime-globals';
import { describe, expect, it } from '@jest/globals';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrainOverviewPanel } from '../components/brain/brain-overview-panel';

describe('BrainOverviewPanel (ui-ms02)', () => {
  it('randează canvas și inspector cu date mock', () => {
    render(<BrainOverviewPanel />);
    expect(screen.getByRole('region', { name: /brain canvas/i })).toBeTruthy();
    expect(screen.getByRole('complementary', { name: /inspector neuron/i })).toBeTruthy();
  });

  it('permite selecție nod (eveniment research)', () => {
    render(<BrainOverviewPanel />);
    fireEvent.click(screen.getByRole('button', { name: /neuron b/i }));
    expect(screen.getByRole('complementary').textContent).toContain('n-demo-2');
  });

  it('deep-link neuron (query) selectează nod determinist', () => {
    render(<BrainOverviewPanel crossRefNeuronId="neuron-any" crossRefExplanation />);
    expect(screen.getByRole('complementary').textContent).toContain('n-demo-2');
    const out = screen.getByText('neuron-any');
    expect(out.textContent ?? '').toContain('neuron-any');
  });
});
