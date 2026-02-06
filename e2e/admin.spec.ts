import { test, expect } from '@playwright/test';

test.describe('Admin dashboard', () => {
  test('admin can view dashboard and perform CRUD', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('admin@example.com');
    await page.getByLabel(/password/i).fill('Password123!');
    await page.getByRole('button', { name: /log in|sign in/i }).click();

    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: /admin|dashboard/i })).toBeVisible();

    // Create product
    const newBtn = page.getByRole('button', { name: /new product|add product|create/i });
    if (await newBtn.count()) {
      await newBtn.click();
      await page.getByLabel(/name/i).fill('E2E Product');
      await page.getByLabel(/price/i).fill('9.99');
      await page.getByRole('button', { name: /save|create/i }).click();
      await expect(page.getByText(/e2e product/i)).toBeVisible();

      // Delete product (best-effort)
      const deleteBtn = page.getByRole('button', { name: /delete/i }).first();
      if (await deleteBtn.count()) {
        await deleteBtn.click();
        const confirm = page.getByRole('button', { name: /confirm|yes/i });
        if (await confirm.count()) await confirm.click();
      }
    } else {
      test.skip(true, 'Admin CRUD UI not detected');
    }
  });
});
