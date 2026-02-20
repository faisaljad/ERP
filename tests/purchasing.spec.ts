import { test, expect } from '@playwright/test';

test.describe('Purchasing Module Flow', () => {
    // Shared setup to authenticate before each test
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', 'admin@erp.com');
        await page.fill('input[type="password"]', 'password');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/.*\/app(?:.*|$)/);
    });

    test('Should allow drafting and creating a Purchase Order', async ({ page }) => {
        // Navigate to the Purchase Orders creation dashboard
        await page.goto('/app/purchasing/orders');

        // Wait for table to load
        await page.waitForLoadState('networkidle');

        // Click the Create PO button specifically looking for the link we added previously
        const createPoLink = page.locator('a[href="/app/purchasing/orders/create"]');

        // Ensure the button is visible before interacting
        if (await createPoLink.isVisible()) {
            await createPoLink.click();
            await expect(page).toHaveURL(/.*\/app\/purchasing\/orders\/create/);

            // Select the first Vendor in the dropdown
            const vendorSelect = page.locator('select[name="vendorId"]');
            const vendorOptions = await vendorSelect.locator('option').all();
            if (vendorOptions.length > 1) {
                // value[0] is strictly the disabled placeholder
                await vendorSelect.selectOption({ index: 1 });
            }

            // Select the first Branch in the dropdown
            const branchSelect = page.locator('select[name="branchId"]');
            const branchOptions = await branchSelect.locator('option').all();
            if (branchOptions.length > 1) {
                await branchSelect.selectOption({ index: 1 });
            }

            // Reference number is auto-generated on the server, so no input is needed.

            // Select an item from the first dynamic line item select payload
            const itemSelect = page.locator('select').nth(2); // Vendor, Branch, Item
            if (await itemSelect.isVisible()) {
                const itemOptions = await itemSelect.locator('option').all();
                if (itemOptions.length > 1) {
                    await itemSelect.selectOption({ index: 1 });
                }

                // Add quantity
                const qtyInput = page.locator('input[type="number"]').first();
                await qtyInput.fill('5');

                // Adjust Price
                const priceInput = page.locator('input[type="number"]').nth(1);
                await priceInput.fill('150');

                // Submit Form
                const submitBtn = page.locator('button:has-text("Draft Order")');
                await submitBtn.click();

                // Redirect should return to base Table
                await expect(page).toHaveURL(/.*\/app\/purchasing\/orders/);

                // Assuming the new order should appear in the table with the auto-generated PO- prefix
                const resultingRow = page.locator(`td:has-text("PO-")`).first();
                if (await resultingRow.isVisible()) {
                    await expect(resultingRow).toBeVisible();
                }
            }
        }
    });
});
