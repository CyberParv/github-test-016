import { test, expect } from '@playwright/test';

test.describe('Checkout', () => {
  test('complete checkout flow', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/password/i).fill('Password123!');
    await page.getByRole('button', { name: /log in|sign in/i }).click();

    await page.goto('/menu');
    const first = page.locator('[data-testid="menu-item"]').first();
    if (await first.count()) await first.click();
    await page.getByRole('button', { name: /add to cart/i }).click();

    await page.goto('/checkout');
    await expect(page.getByRole('heading', { name: /checkout/i })).toBeVisible();

    const placeOrder = page.getByRole('button', { name: /place order|pay|complete/i });
    await placeOrder.click();

    await expect(page).toHaveURL(/\/orders|\/order\//);
  });
});
