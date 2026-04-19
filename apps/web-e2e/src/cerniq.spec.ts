import { test, expect } from '@playwright/test';

test.describe('Cerniq v2 smoke', () => {
  test('home page has welcome title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Welcome');
  });

  test('Brain status panel connects SSE', async ({ page }) => {
    await page.goto('/');
    const panel = page.getByTestId('cerniq-brain-status');
    await expect(panel).toBeVisible();
    await expect(page.getByTestId('sse-state')).toContainText('open', {
      timeout: 15_000,
    });
    await expect(page.getByTestId('sse-last')).not.toHaveText('—', {
      timeout: 15_000,
    });
  });

  test('telemetry API returns JSON', async ({ request }) => {
    const res = await request.get('/api/telemetry');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toHaveProperty('service', 'cerniq-web');
  });
});
