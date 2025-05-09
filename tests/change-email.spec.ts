import { test, expect } from '@playwright/test';
import path from 'path';

const authFilePath = (user: string) =>
    path.join(__dirname, `../playwright/.auth/${user}.json`);

test.use({
    storageState: authFilePath('user1'),
});

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

    test('should successfully change email', async ({ page }) => {
        const emailInput = await page.locator('[data-testid="new-email-input"]');
        const submitButton = await page.locator('[data-testid="change-email-submit"]');

        // Enter new email
        const newEmail = 'newemail@example.com';
        await emailInput.fill(newEmail);
        await submitButton.click();
        // Also check for the toast notification
        const toast = await page.locator('.toast-success');
        await expect(toast).toBeVisible();
        await expect(toast).toContainText('Email updated successfully! Please check your inbox to confirm.');
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

    test('should show warning for invalid email format', async ({ page }) => {
        const emailInput = await page.locator('[data-testid="new-email-input"]');
        const submitButton = await page.locator('[data-testid="change-email-submit"]');

        // Try different invalid email formats
        const invalidEmails = [
            'invalid-email',          // No @ symbol
            'invalid@',               // No domain
            '@example.com',           // No username
            'invalid@example',        // No TLD
            'invalid@.com',           // No domain name
            'invalid@example.com.',   // Trailing dot
        ];

        for (const email of invalidEmails) {
            // Fill in invalid email
            await emailInput.fill(email);
            await submitButton.click();

            // Wait for the error message to appear
            const errorMessage = page.locator('[data-testid="email-error"]');
            await expect(errorMessage).toBeVisible({ timeout: 5000 });
            await expect(errorMessage).toContainText('Invalid email address');

            // Clear the input for next test
            await emailInput.clear();
        }
    });
}); 