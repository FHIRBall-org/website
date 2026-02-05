import { test, expect } from '@playwright/test';

test.describe('Search Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search');
  });

  test('should display search input', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await expect(searchInput).toBeVisible();
  });

  test('should show no results initially', async ({ page }) => {
    await expect(page.getByText(/No matching results/i)).toBeVisible();
  });

  test('should perform incremental search', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await searchInput.fill('health');

    // Wait for search results to update
    await page.waitForTimeout(500);

    // Should show results or "Found X results"
    const resultsText = page.locator('#search-results');
    await expect(resultsText).toBeVisible();
  });

  test('should accept query parameter', async ({ page }) => {
    await page.goto('/search?query=fhir');
    const searchInput = page.locator('#search-input');
    await expect(searchInput).toHaveValue('fhir');
  });
});
