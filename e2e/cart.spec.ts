import { test, expect } from '@playwright/test';

test.describe('Cart', () => {
  test('add to cart and update quantity', async ({ page }) => {
    await page.goto('/menu');

    // open first product
    const first = page.locator('[data-testid="menu-item"]').first();
    if (await first.count()) await first.click();

    const add = page.getByRole('button', { name: /add to cart/i });
    await add.click();

    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: /cart/i })).toBeVisible();

    const qty = page.getByLabel(/quantity/i).first();
    if (await qty.count()) {
      await qty.fill('2');
      await expect(qty).toHaveValue('2');
    } else {
      const plus = page.getByRole('button', { name: /increase|\+/i }).first();
      if (await plus.count()) await plus.click();
    }

    await expect(page.locator('[data-testid="cart-item"]').first()).toBeVisible();
  });
});
