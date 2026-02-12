import { test, expect } from '@playwright/test';

test.describe('Events Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/events');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Industry Events/i);
  });

  test('should display banner heading', async ({ page }) => {
    await expect(page.locator('h1').first()).toContainText('INDUSTRY');
    await expect(page.locator('h1').first()).toContainText('EVENTS');
  });

  test('should display event cards', async ({ page }) => {
    const eventCards = page.locator('h2');
    const count = await eventCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should display event titles and dates', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /DMEA/ })).toBeVisible();
    await expect(page.getByText(/April \d+, 2023/).first()).toBeVisible();
  });

  test('should have Read More links that open in new tab', async ({ page }) => {
    const readMoreLinks = page.getByRole('link', { name: 'Read More' });
    const count = await readMoreLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
    for (let i = 0; i < count; i++) {
      await expect(readMoreLinks.nth(i)).toHaveAttribute('target', '_blank');
    }
  });

  test('should display event images', async ({ page }) => {
    const images = page.locator('img[src^="/images/events/"]');
    const count = await images.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
