import './jest-runtime-globals';
import { describe, expect, it } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChapterPageBody } from '../components/chapters/chapter-page-body';

describe('ChapterPageBody', () => {
  it('randează panou Home workspace', () => {
    render(
      <ChapterPageBody chapterId="home" fullPath="/home/workspace" />,
    );
    expect(screen.getByText(/Workspace Home/i)).toBeTruthy();
  });

  it('randează workbench suite pentru CRM accounts', () => {
    render(
      <ChapterPageBody chapterId="customers" fullPath="/customers/accounts" />,
    );
    expect(screen.getByRole('heading', { name: /Accounts/i })).toBeTruthy();
  });

  it('Brain traces acceptă highlight din query', () => {
    render(
      <ChapterPageBody
        chapterId="brain"
        fullPath="/brain/traces"
        traceQuery="trace-demo-1"
      />,
    );
    const out = document.getElementById('brain-traces-highlight');
    expect(out?.textContent ?? '').toContain('trace-demo-1');
  });
});
