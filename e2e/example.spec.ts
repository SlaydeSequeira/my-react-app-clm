import { test, expect } from '@playwright/test';
const BASE_URL = 'http://localhost:5173';

test.describe('Google Form Clone - Main Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/main`);
  });

  test('should display the main page with correct title and elements', async ({ page }) => {
    await expect(page).toHaveURL(`${BASE_URL}/main`);
    await expect(page.locator('h1')).toHaveText('Welcome to Google Form Clone');   
    await expect(page.locator('button:has-text("Create Form")')).toBeVisible();
    await expect(page.locator('button:has-text("Get Form")')).toBeVisible();
  });
  test('should navigate to create form page when Create Form button is clicked', async ({ page }) => {
    await page.click('button:has-text("Create Form")');
        await expect(page).toHaveURL(`${BASE_URL}/createForm`);
  });

  test('should navigate to get form page when Get Form button is clicked', async ({ page }) => {
    await page.click('button:has-text("Get Form")');
        await expect(page).toHaveURL(`${BASE_URL}/getForm`);
  });

  test('should have accessible button elements', async ({ page }) => {
    const createFormButton = page.locator('button:has-text("Create Form")');
    const getFormButton = page.locator('button:has-text("Get Form")');
    await createFormButton.focus();
    await expect(createFormButton).toBeFocused();
    
    await getFormButton.focus();
    await expect(getFormButton).toBeFocused();
    await createFormButton.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(`${BASE_URL}/createForm`);
    await page.goBack();
    await getFormButton.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(`${BASE_URL}/getForm`);
  });

  test('should handle button hover states', async ({ page }) => {
    const createFormButton = page.locator('button:has-text("Create Form")');
    const getFormButton = page.locator('button:has-text("Get Form")');
    await createFormButton.hover();
    await getFormButton.hover();
  });

  test('should have proper button text content', async ({ page }) => {
    await expect(page.locator('button').first()).toHaveText('Create Form');
    await expect(page.locator('button').last()).toHaveText('Get Form');
    await expect(page.locator('button')).toHaveCount(2);
  });

  test('should work with different viewport sizes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('button:has-text("Create Form")')).toBeVisible();
    await expect(page.locator('button:has-text("Get Form")')).toBeVisible();
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('button:has-text("Create Form")')).toBeVisible();
    await expect(page.locator('button:has-text("Get Form")')).toBeVisible();
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('button:has-text("Create Form")')).toBeVisible();
    await expect(page.locator('button:has-text("Get Form")')).toBeVisible();
  });

  test('should load page within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(`${BASE_URL}/main`);
    await expect(page.locator('h1')).toBeVisible();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });
});

test.describe('Navigation Flow Tests', () => {
  test('should allow back and forth navigation between pages', async ({ page }) => {
    await page.goto(`${BASE_URL}/main`);
    await page.click('button:has-text("Create Form")');
    await expect(page).toHaveURL(`${BASE_URL}/createForm`);
    await page.goBack();
    await expect(page).toHaveURL(`${BASE_URL}/main`);
    await page.click('button:has-text("Get Form")');
    await expect(page).toHaveURL(`${BASE_URL}/getForm`);
    await page.goBack();
    await expect(page).toHaveURL(`${BASE_URL}/main`);
  });
});

test.describe('Error Handling', () => {
  test('should handle navigation errors gracefully', async ({ page }) => {
    await page.goto(`${BASE_URL}/main`);
    
    await expect(page.locator('h1')).toBeVisible();
  });
});