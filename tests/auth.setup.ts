import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  try {
    // Perform authentication steps
    await page.goto('http://localhost:3000');

    // Wait for and click sign in link
    const signInLink = await page.locator('[data-testid="sign-in-link"]');
    await signInLink.waitFor({ state: 'visible' });
    await signInLink.click();

    // Fill in credentials
    await page.fill('input[name="email"]', 'whenshaw87@outlook.com');
    await page.fill('input[name="password"]', 'password123');

    // Submit the form
    const submitButton = await page.locator('[data-testid="submit-button-sign-in"]');
    await submitButton.waitFor({ state: 'visible' });
    await submitButton.click();

    // Wait for successful authentication
    await page.waitForURL('http://localhost:3000/protected', { timeout: 30000 });

    // Save authentication state
    await page.context().storageState({ path: authFile });
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
});
