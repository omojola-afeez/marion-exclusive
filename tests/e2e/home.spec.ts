import { test, expect } from '@playwright/test';

test.describe('Public site', () => {
  test('homepage loads and shows title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Marion Exclusive/i);
    await expect(page.locator('text=Marion Exclusive')).toBeVisible();
  });
});
