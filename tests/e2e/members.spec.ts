import { test, expect } from '@playwright/test';

test.describe('Members Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/members');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Members/i);
  });

  test('should display members list', async ({ page }) => {
    const memberCards = page.locator('a[href^="/members/"]');
    await expect(memberCards.first()).toBeVisible();
  });

  test('should navigate to member detail page', async ({ page }) => {
    const firstMemberLink = page.locator('a[href^="/members/"]').first();
    await firstMemberLink.click();
    await expect(page.url()).toMatch(/\/members\/.+/);
  });
});

test.describe('Member Detail Page', () => {
  test('should display member information', async ({ page }) => {
    await page.goto('/members/1uphealth');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText(/Website/i)).toBeVisible();
  });

  test('should have back link to members list', async ({ page }) => {
    await page.goto('/members/1uphealth');
    const backLink = page.getByRole('link', { name: /Back to/i });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL(/\/members$/);
  });
});
