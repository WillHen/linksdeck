import { test, expect } from '@playwright/test';
import path from 'path';

test.describe.configure({ mode: 'serial' });

const authFilePath = (user: string) =>
  path.join(__dirname, `../playwright/.auth/${user}.json`);

test.use({
  storageState: authFilePath('user1'),
});

test.describe('Create and Edit Lists', () => {

  test('Create List', async ({ page }) => {
    await page.goto('localhost:3000');

    const listContainer = await page.locator('[data-testid="create-list-link"]');
    listContainer.click();
    const listLink = await page.locator('[data-testid="new-list-header"]');
    await expect(listLink).toBeVisible();

    const listTitleInput = await page.locator('[data-testid="list-title-input"]');
    await listTitleInput.fill('My Favorite Sports Websites');

    const listDescriptionInput = await page.locator(
      '[data-testid="list-description-input"]'
    );
    await listDescriptionInput.fill('Sports websites I read a lot');

    const addLinkButton = await page.locator('[data-testid="add-link-button"]');

    addLinkButton.click();
    const linkSet0 = await page.locator('[data-testid="link-0"]');
    await expect(linkSet0).toBeVisible();

    // Fill in the link title input within link-set-0
    const linkTitleInput = await linkSet0.locator(
      '[data-testid="link-title-0"]'
    );
    await linkTitleInput.fill('ESPN soccer');

    const linkUrlInput = await linkSet0.locator('[data-testid="link-url-0"]');

    linkUrlInput.fill('https://www.espn.com/soccer');

    const createListButton = await page.locator(
      '[data-testid="create-list-button"]'
    );

    createListButton.click();

    const listHeader = await page.locator('[data-testid="view-list-header"]');
    await expect(listHeader).toBeVisible();

    const homeLink = await page.locator('[data-testid="home-header-link"]');

    await homeLink.click();

    await expect(listContainer).toBeVisible();

    const editList = await page.locator('[data-testid="edit-list-0"]');

    editList.click();

    const editHeader = await page.locator('[data-testid="edit-list-header"]');
    await expect(editHeader).toBeVisible();
  });

  test('Edit List', async ({ page }) => {
    await page.goto('localhost:3000');

    const listEditLink = await page.locator('[data-testid="edit-list-0"]');
    listEditLink.click();
    const listLink = await page.locator('[data-testid="edit-list-header"]');
    await expect(listLink).toBeVisible();

    const listTitleInput = await page.locator('[data-testid="list-title-input"]');
    await listTitleInput.fill('News websites');

    const listDescriptionInput = await page.locator(
      '[data-testid="list-description-input"]'
    );
    await listDescriptionInput.fill('I use these for the news');

    const addLinkButton = await page.locator('[data-testid="add-link-button"]');

    addLinkButton.click();
    const linkSet1 = await page.locator('[data-testid="link-1"]');
    await expect(linkSet1).toBeVisible();

    // Fill in the link title input within link-set-0
    const linkTitleInput = await linkSet1.locator(
      '[data-testid="link-title-1"]'
    );
    await linkTitleInput.fill('BBC');

    const linkUrlInput = await linkSet1.locator('[data-testid="link-url-1"]');

    linkUrlInput.fill('bbc.com');

    const updateListButton = await page.locator(
      '[data-testid="update-list-button"]'
    );

    updateListButton.click();

    const listHeader = await page.locator('[data-testid="view-list-header"]');
    await expect(listHeader).toBeVisible();

    const homeLink = await page.locator('[data-testid="home-header-link"]');

    await homeLink.click();


    const editAnchor = await page.locator('[data-testid="edit-list-0"]');
    await expect(editAnchor).toBeVisible();

    editAnchor.click();

    const editHeader = await page.locator('[data-testid="edit-list-header"]');
    await expect(editHeader).toBeVisible();

    const addLinkButtonEdit = await page.locator('[data-testid="add-link-button"]');
    await expect(addLinkButtonEdit).toBeVisible();
    addLinkButtonEdit.click();

    const newLinkTitle = await page.locator('[data-testid="link-title-1"]');
    await expect(newLinkTitle).toBeVisible();

    const savebutton = await page.locator('[data-testid="update-list-button"]');
    await expect(savebutton).toBeVisible();
    await savebutton.click();

    const titleError = await page.locator('[data-testid="link-title-2-error"]');
    await expect(titleError).toBeVisible();

    // Wait for the URL error to appear
    await page.waitForSelector('[data-testid="link-url-2-error"]', { state: 'visible', timeout: 5000 });
    const urlError = await page.locator('[data-testid="link-url-2-error"]');
    await expect(urlError).toBeVisible();

  });

});
