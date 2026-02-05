import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/FHIRBall/);
  });

  test('should display hero section', async ({ page }) => {
    const heroHeading = page.locator('.hero-heading');
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toContainText('BETTER DATA FOR BETTER HEALTH');
  });

  test('should display navigation links', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: /Purpose/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /Why FHIR/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /Members/i })).toBeVisible();
  });

  test('should display member cards', async ({ page }) => {
    const memberSection = page.locator('section').filter({ hasText: /Our members are leaders/i });
    await expect(memberSection).toBeVisible();
  });

  test('should display contact form', async ({ page }) => {
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeVisible();
    await expect(page.locator('.contact-form-input').first()).toBeVisible();
  });

  test('should have working navigation to Purpose page', async ({ page }) => {
    await page.locator('nav').getByRole('link', { name: /Purpose/i }).click();
    await expect(page).toHaveURL(/\/purpose/);
    await expect(page.locator('h1').first()).toContainText(/Purpose/i);
  });
});

test.describe('Footer', () => {
  test('should display footer with links', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.getByRole('link', { name: /Contact/i })).toBeVisible();
  });

  test('should display social media links', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer.locator('a[href*="linkedin"]')).toBeVisible();
  });
});
