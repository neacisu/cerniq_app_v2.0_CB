import './jest-runtime-globals';
import { describe, expect, it } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { FlagshipWorkbench } from '../components/workbench/flagship-workbench';
import { FLAGSHIP_WORKBENCHES } from '../lib/flagship-workbenches';

describe('A11y FlagshipWorkbench', () => {
  it('Ingest connectors workbench — fără violări axe', async () => {
    const copy = FLAGSHIP_WORKBENCHES['/ingest/connectors'];
    const { container } = render(
      <FlagshipWorkbench
        copy={copy}
        traceId="tr"
        gatewayId="gw"
        neuronId="n1"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
