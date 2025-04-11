import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Change Email', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the settings page
        await page.goto('http://localhost:3000/protected/settings');
    });

    test('should show email change form', async ({ page }) => {
        // Check if the email change form is visible
        const emailForm = await page.locator('[data-testid="change-email-form"]');
        await expect(emailForm).toBeVisible();

        // Check if the email input is visible
        const emailInput = await page.locator('[data-testid="new-email-input"]');
        await expect(emailInput).toBeVisible();

        // Check if the submit button is visible
        const submitButton = await page.locator('[data-testid="change-email-submit"]');
        await expect(submitButton).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
        const emailInput = await page.locator('[data-testid="new-email-input"]');
        const submitButton = await page.locator('[data-testid="change-email-submit"]');

        // Try invalid email format
        await emailInput.fill('invalid-email');
        await submitButton.click();

        // Wait for the form submission to complete
        await page.waitForTimeout(1000);

        // Check for error message
        const errorMessage = await page.locator('[data-testid="email-error"]');
        await expect(errorMessage).toBeVisible({ timeout: 10000 });
        await expect(errorMessage).toContainText('Invalid email address');
    });

    test('should successfully change email', async ({ page }) => {
        const emailInput = await page.locator('[data-testid="new-email-input"]');
        const submitButton = await page.locator('[data-testid="change-email-submit"]');

        // Enter new email
        const newEmail = 'newemail@example.com';
        await emailInput.fill(newEmail);
        await submitButton.click();

        // Check for success message
        const successMessage = await page.locator('[data-testid="email-success"]');
        await expect(successMessage).toBeVisible();
        await expect(successMessage).toContainText('Email updated successfully');
    });

    test('should handle server errors', async ({ page }) => {
        // Mock a server error response
        await page.route('**/api/change-email', async (route) => {
            await route.fulfill({
                status: 500,
                body: JSON.stringify({ error: 'Failed to update email' })
            });
        });

        const emailInput = await page.locator('[data-testid="new-email-input"]');
        const submitButton = await page.locator('[data-testid="change-email-submit"]');

        // Try to change email
        await emailInput.fill('newemail@example.com');
        await submitButton.click();

        // Check for error message
        const errorMessage = await page.locator('[data-testid="email-error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText('Failed to update email');
    });
}); 