import './jest-runtime-globals';
import { describe, expect, it } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { BrainCrossLinks } from '../components/shell/brain-cross-links';

describe('A11y BrainCrossLinks (jest-axe)', () => {
  it('nu raportează încălcări axe pe set complet de dovezi', async () => {
    const { container } = render(
      <BrainCrossLinks traceId="t-1" gatewayId="gw-1" neuronId="neuron-ping" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('nu raportează încălcări fără opționale', async () => {
    const { container } = render(<BrainCrossLinks />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
