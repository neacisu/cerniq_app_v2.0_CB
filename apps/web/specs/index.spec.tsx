import './jest-runtime-globals';
import { describe, expect, it } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react';
import { BrainCanvas } from '../components/brain/brain-canvas';

describe('BrainCanvas', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrainCanvas gatewayLabel="g" neuronLabel="n" synapseLabel="s" />
    );
    expect(baseElement).toBeTruthy();
  });
});
