import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('localhost:3000');

  const listContainer = await page.locator('[data-testid="create-list-link"]');
  listContainer.click();
  const listLink = await page.locator('[data-testid="create-list-header"]');
  await expect(listLink).toBeVisible();

  const listTitleInput = await page.locator('[data-testid="list-title-input"]');
  await listTitleInput.fill('My Favorite Sports Websites');

  const listDescriptionInput = await page.locator(
    '[data-testid="list-description-input"]'
  );
  await listDescriptionInput.fill('Sports websites I read a lot');

  const linkSet0 = await page.locator('[data-testid="link-set-0"]');
  await expect(linkSet0).toBeVisible();

  // Fill in the link title input within link-set-0
  const linkTitleInput = await linkSet0.locator(
    '[data-testid="link-title-input"]'
  );
  await linkTitleInput.fill('ESPN soccer');

  const linkUrlInput = await linkSet0.locator('[data-testid="link-url-input"]');

  linkUrlInput.fill('https://www.espn.com/soccer');

  const createListButton = await page.locator(
    '[data-testid="create-list-button"]'
  );

  createListButton.click();

  const viewListHeader = await page.locator('[data-testid="view-list-header"]');
  await expect(viewListHeader).toBeVisible();

  const homeLink = await page.locator('[data-testid="home-header-link"]');

  await homeLink.click();

  await expect(listContainer).toBeVisible();

});
