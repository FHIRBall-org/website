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

  test('should display contact section', async ({ page }) => {
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeVisible();
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

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all form fields', async ({ page }) => {
    const form = page.locator('#contact form');
    await expect(form.locator('input[name="email"]')).toBeVisible();
    await expect(form.locator('input[name="firstName"]')).toBeVisible();
    await expect(form.locator('input[name="lastName"]')).toBeVisible();
    await expect(form.locator('input[name="phone"]')).toBeVisible();
    await expect(form.locator('textarea[name="comment"]')).toBeVisible();
    await expect(form.locator('button[type="submit"]')).toBeVisible();
  });

  test('should have correct form action', async ({ page }) => {
    const form = page.locator('#contact form');
    await expect(form).toHaveAttribute('action', /formsubmit\.co/);
    await expect(form).toHaveAttribute('method', 'POST');
  });

  test('should have required fields marked as required', async ({ page }) => {
    const form = page.locator('#contact form');
    await expect(form.locator('input[name="email"]')).toHaveAttribute('required', '');
    await expect(form.locator('textarea[name="comment"]')).toHaveAttribute('required', '');
  });

  test('should have correct input types', async ({ page }) => {
    const form = page.locator('#contact form');
    await expect(form.locator('input[name="email"]')).toHaveAttribute('type', 'email');
    await expect(form.locator('input[name="phone"]')).toHaveAttribute('type', 'tel');
  });

  test('should display success message when submitted', async ({ page }) => {
    await page.goto('/?submitted=true#contact');
    const successMessage = page.getByText(/Thank you! Your message has been sent/i);
    await expect(successMessage).toBeVisible();
  });

  test('should not display success message by default', async ({ page }) => {
    const successMessage = page.getByText(/Thank you! Your message has been sent/i);
    await expect(successMessage).not.toBeVisible();
  });
});
