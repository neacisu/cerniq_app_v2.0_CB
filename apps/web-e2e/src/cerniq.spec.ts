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

  test('workbench flagship — legături Brain (ingest)', async ({ page }) => {
    await page.goto('/ingest/imports');
    await expect(page.getByRole('link', { name: 'Open in Brain' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /open related gateway/i }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /telemetrie live/i })).toBeVisible();
  });

  test('workbench flagship — Customer 360', async ({ page }) => {
    await page.goto('/customers/customer-360');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /open trace/i })).toBeVisible();
  });

  test('navigare capitol Sales — opportunity demo', async ({ page }) => {
    await page.goto('/sales/opportunity/demo');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('capitol Analytics — executive + drill-down Brain', async ({ page }) => {
    await page.goto('/analytics/executive');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Analytics');
    await page.getByRole('button', { name: /Revenue/i }).click();
    await expect(page.getByRole('link', { name: /open trace/i })).toBeVisible();
  });

  test('capitol Admin — users + dovezi Brain', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Admin');
    await expect(page.getByText(/auth-iam-implementation\.md/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /view neuron explanation/i })).toBeVisible();
  });

  test('deep-link explicație neuron din query', async ({ page }) => {
    await page.goto(
      '/brain/overview?neuron=neuron-ping&cerniq_focus=neuron_explanation',
    );
    await expect(page.getByRole('status')).toContainText(/explicație neuron/i);
  });

  test('viewport mobil — shell încă utilizabil', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/brain/overview');
    await expect(page.getByRole('navigation', { name: /navigare primară/i })).toBeVisible();
  });

  test('telemetry API returnează JSON (paritate OpenAPI / agregare API)', async ({
    request,
  }) => {
    const res = await request.get('/api/telemetry');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toHaveProperty('service', 'cerniq-web');
    expect(body).toHaveProperty('note');
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
