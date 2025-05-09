import { test, expect } from '@playwright/test';
import path from 'path';

const authFilePath = (user: string) =>
  path.join(__dirname, `../playwright/.auth/${user}.json`);


test.use({
  storageState: authFilePath('user1'), // Load user1's authentication state
});


test('test', async ({ page }) => {
  await page.goto('localhost:3000');

  const yourListsHeader = await page.locator('[data-testid="your-lists-header"]');

  await expect(yourListsHeader).toHaveText('Your Lists');

});
