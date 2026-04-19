import { test, expect } from '@playwright/test';

test.describe('Cerniq v2 smoke', () => {
  test('redirect / către home workspace', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/home\/workspace/);
    await expect(
      page.getByRole('heading', { level: 1 })
    ).toContainText('Welcome');
  });

  test('Brain status panel (SSE) în tray', async ({ page }) => {
    await page.goto('/home/workspace');
    const panel = page.getByTestId('cerniq-brain-status');
    await expect(panel).toBeVisible();
    await expect(page.getByTestId('sse-state')).toContainText('open', {
      timeout: 15_000,
    });
    await expect(page.getByTestId('sse-last')).not.toHaveText('—', {
      timeout: 15_000,
    });
  });

  test('navigare capitol Brain overview', async ({ page }) => {
    await page.goto('/brain/overview');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Brain');
  });

  test('workbench flagship — legături Brain', async ({ page }) => {
    await page.goto('/ingest/imports');
    await expect(page.getByRole('link', { name: 'Open in Brain' })).toBeVisible();
  });

  test('telemetry API returnează JSON', async ({ request }) => {
    const res = await request.get('/api/telemetry');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toHaveProperty('service', 'cerniq-web');
  });

  test('command API acceptă POST', async ({ request }) => {
    const res = await request.post('/api/command', {
      data: { action: 'noop' },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toHaveProperty('ok', true);
  });
});
