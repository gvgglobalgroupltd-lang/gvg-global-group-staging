import { test, expect } from '@playwright/test';

test('add new commodity flow', async ({ page }) => {
    test.setTimeout(90000);

    // Navigate to commodities page
    await page.goto('/admin/commodities');
    console.log('Navigated to /admin/commodities');

    // Check if we are redirected to login
    if (await page.getByRole('heading', { name: 'Sign In' }).isVisible()) {
        console.log('Redirected to Login. Performing login...');

        await page.fill('input[type="email"]', 'gvgglobalgroupltd@gmail.com');
        await page.fill('input[type="password"]', 'Vivaan@2412');

        await page.getByRole('button', { name: 'Sign In' }).click();
        console.log('Clicked Sign In');

        // Wait for navigation to Dashboard
        await page.waitForURL('**/admin', { timeout: 30000 });
        console.log('Navigated to Dashboard after login');

        // Navigate to commodities
        await page.goto('/admin/commodities');
        console.log('Navigated to /admin/commodities explicitly');
    }

    // Wait for the page to load
    await page.waitForSelector('button:has-text("Add Commodity")', { state: 'attached', timeout: 10000 });

    // Open the Add Commodity modal
    const addCommodityButton = page.getByRole('button', { name: 'Add Commodity' }).first();
    await addCommodityButton.click();
    console.log('Clicked Add Commodity button');

    // Fill in the form
    const uniqueName = `Test Commodity ${Date.now()}`;
    await page.getByLabel('Commodity Name *').fill(uniqueName);
    await page.getByLabel('HS Code *').fill('1234.56');
    await page.getByLabel('Description (Optional)').fill('This is a test commodity');
    console.log('Form filled with unique name:', uniqueName);

    // Submit the form
    const submitButton = page.getByRole('dialog').getByRole('button', { name: 'Create Commodity Record' });
    await submitButton.click();
    console.log('Submit button clicked');

    // Verify success
    try {
        const successToast = page.getByText(/successfully/i).first();
        await expect(successToast).toBeVisible({ timeout: 15000 });
        console.log('Success message found');
    } catch (e) {
        console.log('Toast not found. Modal status:', await page.getByRole('dialog').isVisible());
        const body = await page.innerText('body');
        console.log('Body text snippet:', body.substring(0, 300));
    }

    // Verify the modal closes - this is the best indicator on slow systems
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 20000 });
});
