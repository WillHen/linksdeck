import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('localhost:3000');

  const yourListsHeader = await page.locator('[data-testid="your-lists-header"]');

  await expect(yourListsHeader).toHaveText('Your Lists');

});
