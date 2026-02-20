import { test, expect } from '@playwright/test';

test.describe('Authentication System', () => {
    test('Should not allow access to protected dashboard without auth', async ({ page }) => {
        // Attempt to go to dashboard directly
        const response = await page.goto('/app');

        // Redirects to login
        await expect(page).toHaveURL(/.*login/);
    });

    test('Should show error on invalid credentials', async ({ page }) => {
        await page.goto('/login');

        // Fill credentials
        await page.fill('input[type="email"]', 'wrong@example.com');
        await page.fill('input[type="password"]', 'badpassword');

        // Click login
        await page.click('button[type="submit"]');

        // Expect an error visible on page
        const errorMessage = page.locator('text=Invalid credentials');
        await expect(errorMessage).toBeVisible();
    });

    test('Should login successfully with correct credentials and redirect to setup or dashboard', async ({ page }) => {
        await page.goto('/login');

        // Fill correct seeded credentials (configured from core db setup)
        await page.fill('input[type="email"]', 'admin@erp.com');
        await page.fill('input[type="password"]', 'password');

        await page.click('button[type="submit"]');

        // After successful login, app either goes to /app/setup or /app depending on company state
        await expect(page).toHaveURL(/.*\/app(?:.*|$)/);
    });
});
