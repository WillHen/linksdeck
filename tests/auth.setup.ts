import { test as setup } from '@playwright/test';
import path from 'path';

const authFilePath = (user: string) =>
  path.join(__dirname, `../playwright/.auth/${user}.json`);

async function authenticateUser(page, email: string, password: string, user: string) {
  try {
    // Perform authentication steps
    await page.goto('http://localhost:3000');

    // Wait for and click sign in link
    const signInLink = await page.locator('[data-testid="sign-in-link"]');
    await signInLink.waitFor({ state: 'visible' });
    await signInLink.click();

    // Fill in credentials
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);

    // Submit the form
    const submitButton = await page.locator('[data-testid="submit-button-sign-in"]');
    await submitButton.waitFor({ state: 'visible' });
    await submitButton.click();

    // Wait for successful authentication
    await page.waitForURL('http://localhost:3000/protected', { timeout: 30000 });

    // Save authentication state
    await page.context().storageState({ path: authFilePath(user) });
  } catch (error) {
    console.error(`Authentication failed for user ${email}:`, error);
    throw error;
  }
}

setup('authenticate as user1', async ({ page }) => {
  await authenticateUser(page, 'testemail123@example.com', 'password123', 'user1');
});

setup('authenticate as user2', async ({ page }) => {
  await authenticateUser(page, 'testemail1234@example.com', 'password123', 'user2');
});