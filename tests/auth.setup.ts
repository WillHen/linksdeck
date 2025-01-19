import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('localhost:3000');
  const signInLink = await page.locator('[data-testid="sign-in-link"]');
  await signInLink.click();
  await page.fill('input[name="email"]', 'whenshaw87@outlook.com');
  await page.fill('input[name="password"]', 'password123');

  const submitButton = await page.locator(
    '[data-testid="submit-button-sign-in"]'
  );
  await submitButton.click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL('http://localhost:3000/protected');
  // Alternatively, you can wait until the page reaches a state where all cookies are set.

  await page.context().storageState({ path: authFile });
});
