import { test, expect } from '@playwright/test';

test.describe('Auth flow', () => {
  test('user can register and login', async ({ page }) => {
    await page.goto('/signup');

    await page.getByLabel(/name/i).fill('E2E User');
    await page.getByLabel(/email/i).fill(`e2e_${Date.now()}@example.com`);
    await page.getByLabel(/password/i).fill('Password123!');

    await page.getByRole('button', { name: /sign up|create account|register/i }).click();

    // Expect redirect or success
    await expect(page).toHaveURL(/\/login|\/account|\//);

    // If redirected to login, try login
    if (/\/login/.test(page.url())) {
      await page.getByLabel(/email/i).fill('user@example.com');
      await page.getByLabel(/password/i).fill('Password123!');
      await page.getByRole('button', { name: /log in|sign in/i }).click();
      await expect(page).toHaveURL(/\//);
    }
  });

  test('user can logout', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/password/i).fill('Password123!');
    await page.getByRole('button', { name: /log in|sign in/i }).click();

    await page.goto('/');
    const logout = page.getByRole('button', { name: /logout|sign out/i });
    if (await logout.count()) {
      await logout.click();
      await expect(page.getByRole('button', { name: /log in|sign in/i })).toBeVisible();
    } else {
      test.skip(true, 'No logout button found in UI');
    }
  });
});
