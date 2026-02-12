import { test, expect } from '@playwright/test';

test.describe('Why FHIR Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/why-fhir');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Why FHIR/i);
  });

  test('should display banner heading and subtitle', async ({ page }) => {
    await expect(page.locator('h1').first()).toContainText('WHY');
    await expect(page.locator('h1').first()).toContainText('FHIR');
    await expect(page.getByText('We are building FHIR-based products')).toBeVisible();
  });

  test('should display banner CTA buttons', async ({ page }) => {
    const banner = page.locator('section').first();
    await expect(banner.getByRole('link', { name: 'Find FHIR Expert' })).toBeVisible();
    await expect(banner.getByRole('link', { name: 'Join FHIRBall' })).toBeVisible();
  });

  test('should display The Problem section with 4 list items', async ({ page }) => {
    await expect(page.getByText('The problem', { exact: false })).toBeVisible();
    const problemSection = page.locator('section').filter({ hasText: 'The problem' });
    const listItems = problemSection.locator('ol li');
    await expect(listItems).toHaveCount(4);
  });

  test('should display How FHIR Solves It section', async ({ page }) => {
    await expect(page.getByText('How FHIR solves it', { exact: false })).toBeVisible();
  });

  test('should display game-changer heading', async ({ page }) => {
    await expect(page.getByText("Here's how FHIR is a")).toBeVisible();
    await expect(page.getByText('real game-changer for Health IT')).toBeVisible();
  });

  test('should display Patients in Control section', async ({ page }) => {
    await expect(page.getByText('patients in control', { exact: false })).toBeVisible();
  });

  test('should display Data Transparency section', async ({ page }) => {
    await expect(page.getByText('data transparency', { exact: false })).toBeVisible();
  });

  test('should display AI and Data Analytics section', async ({ page }) => {
    await expect(page.getByText('AI and data analytics', { exact: false })).toBeVisible();
  });

  test('should display World on FHIR section with 4 list items', async ({ page }) => {
    await expect(page.getByText('Imagine a world on FHIR', { exact: false })).toBeVisible();
    const worldSection = page.locator('section').filter({ hasText: 'Imagine a world on FHIR' });
    const listItems = worldSection.locator('ol li');
    await expect(listItems).toHaveCount(4);
  });

  test('should display bottom CTA section', async ({ page }) => {
    await expect(page.getByText('Ready to join the movement?')).toBeVisible();
  });

  test('bottom CTA buttons should have correct links', async ({ page }) => {
    const ctaSection = page.locator('section').filter({ hasText: 'Ready to join the movement?' });
    await expect(ctaSection.getByRole('link', { name: 'Find a FHIR Expert' })).toHaveAttribute('href', '/members');
    await expect(ctaSection.getByRole('link', { name: 'Join FHIRBall' })).toHaveAttribute('href', '/contact');
  });
});
