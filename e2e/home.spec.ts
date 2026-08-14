import { test, expect } from '@playwright/test';

test('homepage loads and shows project title', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Marion Exclusive')).toBeVisible();
});
