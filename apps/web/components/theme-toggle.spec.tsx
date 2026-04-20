import '../lib/testing/jest-runtime-globals';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  const origMatchMedia = globalThis.matchMedia;

  afterEach(() => {
    globalThis.matchMedia = origMatchMedia;
    document.documentElement.classList.remove('dark');
    try {
      globalThis.localStorage.removeItem('cerniq-theme');
    } catch {
      /* ignore */
    }
    jest.restoreAllMocks();
  });

  it('comută clasa dark pe documentElement', () => {
    globalThis.matchMedia = () =>
      ({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }) as unknown as MediaQueryList;

    render(<ThemeToggle />);
    const btn = screen.getByRole('button');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => {
      btn.click();
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
