import './jest-runtime-globals';
import { describe, expect, it } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react';
import { BrainCrossLinks } from '../components/shell/brain-cross-links';

describe('BrainCrossLinks', () => {
  it('construiește href-uri cu query fără ? gol când nu există filtre', () => {
    const { getByRole } = render(<BrainCrossLinks />);
    const traceLink = getByRole('link', { name: /open trace/i }) as HTMLAnchorElement;
    const overviewLink = getByRole('link', { name: /open in brain/i }) as HTMLAnchorElement;
    const gatewayLink = getByRole('link', {
      name: /open related gateway/i,
    }) as HTMLAnchorElement;
    const liveLink = getByRole('link', { name: /telemetrie live/i }) as HTMLAnchorElement;
    expect(traceLink.getAttribute('href')).toBe('/brain/traces');
    expect(overviewLink.getAttribute('href')).toBe('/brain/overview');
    expect(gatewayLink.getAttribute('href')).toBe('/brain/gateways');
    expect(liveLink.getAttribute('href')).toBe('/brain/live');
  });

  it('propagă trace și gateway în query string', () => {
    const { getByRole } = render(
      <BrainCrossLinks traceId="t-1" gatewayId="g-9" neuronId="neuron-ping" />
    );
    const traceLink = getByRole('link', { name: /open trace/i }) as HTMLAnchorElement;
    const liveLink = getByRole('link', { name: /telemetrie live/i }) as HTMLAnchorElement;
    const neuronExplain = getByRole('link', {
      name: /view neuron explanation/i,
    }) as HTMLAnchorElement;
    expect(traceLink.getAttribute('href')).toBe(
      '/brain/traces?trace=t-1&gateway=g-9&neuron=neuron-ping',
    );
    expect(liveLink.getAttribute('href')).toBe(
      '/brain/live?trace=t-1&gateway=g-9&neuron=neuron-ping',
    );
    expect(neuronExplain.getAttribute('href')).toBe(
      '/brain/overview?trace=t-1&gateway=g-9&neuron=neuron-ping&cerniq_focus=neuron_explanation',
    );
  });
});
