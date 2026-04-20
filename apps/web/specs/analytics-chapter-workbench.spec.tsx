import './jest-runtime-globals';
import { describe, expect, it } from '@jest/globals';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AnalyticsChapterWorkbench } from '../components/analytics/analytics-chapter-workbench';

describe('AnalyticsChapterWorkbench (§24.6)', () => {
  it('deschide drill-down și afișează legături Brain', () => {
    const { getByRole, getByLabelText } = render(
      <AnalyticsChapterWorkbench mode="executive" />,
    );
    fireEvent.click(getByRole('button', { name: /Revenue/i }));
    expect(getByLabelText('Drill-down analytics')).toBeTruthy();
    expect(getByRole('link', { name: /open trace/i })).toBeTruthy();
  });
});
