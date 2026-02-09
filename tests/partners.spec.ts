import { test, expect } from '@playwright/test';

test('add new partner flow', async ({ page }) => {
    test.setTimeout(90000); // Increase test timeout significantly for login

    // Navigate to login page first (or direct to admin/partners and handle redirect)
    await page.goto('/admin/partners');
    console.log('Navigated to /admin/partners');

    // Check if we are redirected to login
    if (await page.getByRole('heading', { name: 'Sign In' }).isVisible()) {
        console.log('Redirected to Login. Performing login...');

        // Use more robust selectors based on input types
        await page.fill('input[type="email"]', 'gvgglobalgroupltd@gmail.com');
        await page.fill('input[type="password"]', 'Vivaan@2412');

        await page.getByRole('button', { name: 'Sign In' }).click();
        console.log('Clicked Sign In');

        // Wait for navigation to Dashboard (/admin)
        await page.waitForURL('**/admin', { timeout: 30000 });
        console.log('Navigated to Dashboard after login');

        // Now explicit navigation to partners to be safe
        await page.goto('/admin/partners');
        console.log('Navigated to /admin/partners explicitely');
    }

    // Open the Add Partner modal - Try text selector if role fails
    // Wait for button to be attached to DOM first
    await page.waitForSelector('button:has-text("Add Partner")', { state: 'attached', timeout: 10000 });

    const addPartnerButton = page.getByRole('button', { name: 'Add Partner' }).first();
    if (await addPartnerButton.isVisible()) {
        await addPartnerButton.click();
    } else {
        console.log('Button by role not found, trying text...');
        await page.getByText('Add Partner').first().click();
    }
    console.log('Clicked Add Partner button');

    // Fill in the form
    await page.getByLabel('Company Name *').fill('Test Partner Company');

    // Select partner type
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Customer' }).click();

    await page.getByLabel('Contact Person').fill('John Doe');
    await page.getByLabel('Email').fill('test@gvg.com'); // Using a more specific email domain just in case validation checks
    await page.getByLabel('Phone').fill('1234567890');
    await page.getByLabel('Country *').fill('Test Country');
    await page.getByLabel('Address').fill('123 Test St');
    console.log('Form filled');

    // Submit the form
    const submitButton = page.getByRole('dialog').getByRole('button', { name: 'Add Partner' });
    await submitButton.click();
    console.log('Submit button clicked');

    // Verify success
    const successToast = page.getByText('Customer added successfully').first();
    await expect(successToast).toBeVisible({ timeout: 15000 });
    console.log('Success message found');

    // Verify the modal closes
    await expect(page.getByRole('dialog')).not.toBeVisible();
});
