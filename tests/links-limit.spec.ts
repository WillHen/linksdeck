import { test, expect } from '@playwright/test';
import path from 'path';

test.describe.configure({ mode: 'serial' });

const authFilePath = (user: string) =>
    path.join(__dirname, `../playwright/.auth/${user}.json`);

test.use({
    storageState: authFilePath('user3'),
});


test.describe('List links', async () => {
    test('List Limit', async ({ page }) => {
        await page.goto('localhost:3000');
        await page.getByTestId('create-list-link').click();

        await page.getByTestId('new-list-header').waitFor({ state: 'visible' });

        const titleInput = await page.getByTestId('list-title-input');
        await titleInput.fill('My Favorite Websites');

        const addLinkButton = await page.getByTestId('add-link-button');
        await addLinkButton.click();

        for (let i = 0; i < 10; i++) {
            const linkTitle = await page.getByTestId(`link-title-${i}`);
            const linkUrl = await page.getByTestId(`link-url-${i}`);

            await linkTitle.fill(`Link Title ${i}`);
            await linkUrl.fill(`https://example.com/${i}`);

            if (i < 9) {
                // Click the "Add Link" button for the first 9 links
                await addLinkButton.click();
            }

        }

        // Verify the "Add Link" button is disabled after 10 links
        await expect(addLinkButton).toBeDisabled();
        const errorMessage = await page.getByTestId('link-limit-error');
        await expect(errorMessage).toBeVisible();

        await expect(errorMessage).toHaveText('You can only add a maximum of 10 links.');


    })




});
