import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

    await page.goto('localhost:3000');

    const listContainer = await page.locator('[data-testid="create-list-link"]');
    listContainer.click();
    const listLink = await page.locator('[data-testid="create-list-header"]');
    await expect(listLink).toBeVisible();

    const listTitleInput = await page.locator('[data-testid="list-title-input"]');
    await listTitleInput.fill('News websites');

    const listDescriptionInput = await page.locator(
        '[data-testid="list-description-input"]'
    );
    await listDescriptionInput.fill('I use these for the news');

    const addLinkButton = await page.locator('[data-testid="add-link-button"]');

    addLinkButton.click();
    const linkSet0 = await page.locator('[data-testid="link-0"]');
    await expect(linkSet0).toBeVisible();

    // Fill in the link title input within link-set-0
    const linkTitleInput = await linkSet0.locator(
        '[data-testid="link-title-0"]'
    );
    await linkTitleInput.fill('BBC');

    const linkUrlInput = await linkSet0.locator('[data-testid="link-url-0"]');

    linkUrlInput.fill('bbc.com');

    const createListButton = await page.locator(
        '[data-testid="create-list-button"]'
    );

    createListButton.click();

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

    const titleError = await page.locator('[data-testid="link-title-1-error"]');
    await expect(titleError).toBeVisible();

    // Wait for the URL error to appear
    await page.waitForSelector('[data-testid="link-url-1-error"]', { state: 'visible', timeout: 5000 });
    const urlError = await page.locator('[data-testid="link-url-1-error"]');
    await expect(urlError).toBeVisible();
});