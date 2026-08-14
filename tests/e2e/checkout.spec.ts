import { test, expect } from '@playwright/test';

test('home page loads and can navigate to shop', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Marion Exclusive')).toHaveCount(1);
  await page.click('text=Shop');
  await expect(page).toHaveURL(/shop/);
});
