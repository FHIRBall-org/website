import { test, expect } from '@playwright/test';

test.describe('Purpose Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/purpose');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Purpose/i);
  });

  test('should display banner heading', async ({ page }) => {
    await expect(page.locator('h1').first()).toContainText('OUR');
    await expect(page.locator('h1').first()).toContainText('PURPOSE');
  });

  test('should display purpose intro text', async ({ page }) => {
    await expect(page.getByText('The FHIR Business Alliance (FHIRBall) is a global partnership')).toBeVisible();
  });

  test('should display founding member links', async ({ page }) => {
    await expect(page.getByRole('link', { name: '1upHealth' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'AEGIS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Firely' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Smile Digital Health' })).toBeVisible();
  });

  test('should display Our Values section with 7 list items', async ({ page }) => {
    await expect(page.getByText('Our values')).toBeVisible();
    const listItems = page.locator('ol li');
    await expect(listItems).toHaveCount(7);
  });

  test('should display values image', async ({ page }) => {
    const img = page.locator('img[src="/images/purpose-values.jpg"]');
    await expect(img).toBeVisible();
  });

  test('should display CTA section with 3 buttons', async ({ page }) => {
    await expect(page.getByText('Do you want to drive the future of healthcare?')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Become a Member' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Find FHIR Professionals' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'FHIR Expertise' })).toBeVisible();
  });

  test('CTA buttons should have correct links', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Become a Member' })).toHaveAttribute('href', '/contact');
    await expect(page.getByRole('link', { name: 'Find FHIR Professionals' })).toHaveAttribute('href', '/members');
    await expect(page.getByRole('link', { name: 'FHIR Expertise' })).toHaveAttribute('href', '/resources');
  });
});
