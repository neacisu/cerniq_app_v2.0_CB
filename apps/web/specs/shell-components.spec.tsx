import './jest-runtime-globals';
import { afterEach, describe, expect, it } from '@jest/globals';
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { CommandPalette } from '../components/shell/command-palette';
import { TelemetryTray } from '../components/shell/telemetry-tray';
import { useShellStore } from '../lib/shell-store';

describe('CommandPalette', () => {
  afterEach(() => {
    act(() => {
      useShellStore.setState({ telemetryOpen: true, commandOpen: false });
    });
  });

  it('nu randează dialog când paleta e închisă', () => {
    act(() => {
      useShellStore.setState({ commandOpen: false });
    });
    const { container } = render(<CommandPalette />);
    expect(container.querySelector('dialog')).toBeNull();
  });

  it('folosește dialog accesibil când paleta e deschisă', () => {
    act(() => {
      useShellStore.setState({ commandOpen: true });
    });
    render(<CommandPalette />);
    expect(
      screen.getByRole('dialog', { name: 'Command palette' }),
    ).toBeTruthy();
  });

  it('filtrează rezultatele după textul din căutare', () => {
    act(() => {
      useShellStore.setState({ commandOpen: true });
    });
    render(<CommandPalette />);
    const input = screen.getByPlaceholderText(/Caută rută/);
    fireEvent.change(input, { target: { value: 'Admin — Users' } });
    expect(screen.getByText('Admin — Users')).toBeTruthy();
    expect(screen.queryByText(/Brain — Overview/)).toBeNull();
  });
});

describe('TelemetryTray', () => {
  afterEach(() => {
    act(() => {
      useShellStore.setState({ telemetryOpen: true, commandOpen: false });
    });
  });

  it('randează secțiunea landmark când tray-ul e deschis', () => {
    render(
      <TelemetryTray>
        <span>conținut test</span>
      </TelemetryTray>,
    );
    expect(
      screen.getByRole('region', { name: 'Telemetry tray' }),
    ).toBeTruthy();
  });
});
