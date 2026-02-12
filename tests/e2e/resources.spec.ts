import { test, expect } from '@playwright/test';

test.describe('Resources Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/resources');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Resources/i);
  });

  test('should display hero section', async ({ page }) => {
    await expect(page.locator('h1').first()).toContainText('Resources');
  });

  test('should display external resource links', async ({ page }) => {
    await expect(page.getByRole('link', { name: /FHIR Standard/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /HL7 International/i })).toBeVisible();
  });

  test('should display article cards', async ({ page }) => {
    const articleCards = page.locator('a[href^="/resources/"]');
    await expect(articleCards.first()).toBeVisible();
  });

  test('should navigate to article detail page', async ({ page }) => {
    const firstArticleLink = page.locator('a[href^="/resources/"]').first();
    await firstArticleLink.click();
    await expect(page.url()).toMatch(/\/resources\/.+/);
  });
});

test.describe('Article Detail Page', () => {
  test('should display article content', async ({ page }) => {
    await page.goto('/resources/fhirball-focused-on-business-use-cases');
    await expect(page.locator('h1')).toContainText('Business Use Cases');
    await expect(page.getByText('By Duncan Weatherston')).toBeVisible();
  });

  test('should display related posts', async ({ page }) => {
    await page.goto('/resources/fhirball-focused-on-business-use-cases');
    await expect(page.getByText('Related Posts')).toBeVisible();
  });

  test('should have back to resources link', async ({ page }) => {
    await page.goto('/resources/fhirball-focused-on-business-use-cases');
    await expect(page.getByRole('link', { name: /Back to Resources/i })).toBeVisible();
  });
});
