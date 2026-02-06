import { test, expect } from '@playwright/test';

test.describe('Menu browsing', () => {
  test('browse menu and view product page', async ({ page }) => {
    await page.goto('/menu');
    await expect(page.getByRole('heading', { name: /menu/i })).toBeVisible();

    const firstItem = page.locator('[data-testid="menu-item"]').first();
    if (await firstItem.count()) {
      await firstItem.click();
      await expect(page).toHaveURL(/\/menu\//);
      await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible();
    } else {
      // Fallback: click first link in menu list
      const link = page.getByRole('link').first();
      await link.click();
      await expect(page).toHaveURL(/\/menu\//);
    }
  });
});
