import React from 'react';
import { render } from '@testing-library/react';
import Page from '../app/page';

jest.mock('../components/brain-status-panel', () => ({
  BrainStatusPanel: () => <div data-testid="cerniq-brain-status-mock" />,
}));

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });
});
