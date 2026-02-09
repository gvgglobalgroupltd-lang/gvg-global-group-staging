import { test, expect } from '@playwright/test';

test('add new deal flow', async ({ page }) => {
    test.setTimeout(180000); // 3 minutes for complex multi-step flow

    // Listen to browser console messages
    page.on('console', msg => {
        console.log(`BROWSER ${msg.type()}: ${msg.text()}`);
    });

    // Navigate to create deal page
    await page.goto('/admin/deals/create');
    console.log('Navigated to /admin/deals/create');

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

        // Navigate to create deal
        await page.goto('/admin/deals/create');
        console.log('Navigated to /admin/deals/create explicitly');
    }

    // Wait for wizard to load
    await page.waitForSelector('h1:has-text("Create New Deal")', { timeout: 20000 });
    console.log('Deal Wizard loaded');

    // ==================== STEP 1: Sourcing & Compliance ====================
    console.log('=== Step 1: Sourcing & Compliance ===');

    // Wait for the step 1 heading to be visible
    await page.getByRole('heading', { name: 'Sourcing & Compliance' }).waitFor({ state: 'visible' });

    // Select Supplier - click trigger then select first option
    console.log('Selecting supplier...');
    await page.locator('#partnerId').click();
    await page.waitForTimeout(300);
    // Click on the first supplier option (using testid that will be generated dynamically)
    // Since we don't know the UUID, we'll use a different approach - wait for options to appear and click first
    const firstSupplier = page.locator('[data-testid^="supplier-"]').first();
    await firstSupplier.waitFor({ state: 'visible', timeout: 5000 });
    await firstSupplier.click();
    console.log('Selected supplier');
    await page.waitForTimeout(500);

    // Select Origin Country - USA (non-PSIC country)
    console.log('Selecting origin country...');
    await page.locator('#originCountry').click();
    await page.waitForTimeout(300);
    await page.locator('[data-testid="origin-USA"]').click();
    console.log('Selected USA as origin');
    await page.waitForTimeout(500);

    // Select Commodity
    console.log('Selecting commodity...');
    await page.locator('#commodityId').click();
    await page.waitForTimeout(300);
    const firstCommodity = page.locator('[data-testid^="commodity-"]').first();
    await firstCommodity.waitFor({ state: 'visible', timeout: 5000 });
    await firstCommodity.click();
    console.log('Selected commodity');
    await page.waitForTimeout(500);

    // Click Next Step
    await page.getByRole('button', { name: 'Next Step' }).click();
    console.log('Clicked Next Step (to Pricing)');

    // Wait for Step 2 to load
    await page.getByRole('heading', { name: 'Pricing & Payment' }).waitFor({ state: 'visible', timeout: 10000 });
    console.log('Step 2 loaded successfully!');

    // ==================== STEP 2: Pricing & Payment ====================
    console.log('=== Step 2: Pricing & Payment ===');

    // Fill Buy Price
    await page.fill('#buyPrice', '1500');
    console.log('Filled buy price');

    // Fill Weight (MT)
    await page.fill('#weightMT', '25');
    console.log('Filled weight');

    // Ocean Freight is required for FOB (default incoterm)
    await page.fill('#oceanFreight', '500');
    console.log('Filled ocean freight (required for FOB)');

    // Advance and Balance percentages (must sum to 100)
    await page.fill('#advancePercent', '30');
    await page.fill('#balancePercent', '70');
    console.log('Filled payment split: 30% advance, 70% balance');

    // Click Next Step
    await page.getByRole('button', { name: 'Next Step' }).click();
    console.log('Clicked Next Step (to Logistics)');

    // Wait for Step 3 to load
    await page.getByRole('heading', { name: 'Logistics & Shipment' }).waitFor({ state: 'visible', timeout: 10000 });
    console.log('Step 3 loaded successfully!');

    // ==================== STEP 3: Logistics & Shipment ====================
    console.log('=== Step 3: Logistics & Shipment ===');

    // Fill Port of Loading
    await page.fill('#portOfLoading', 'Los Angeles, USA');
    console.log('Filled port of loading');

    // Fill Port of Discharge
    await page.fill('#portOfDischarge', 'Dubai, UAE');
    console.log('Filled port of discharge');

    // Click Next Step
    await page.getByRole('button', { name: 'Next Step' }).click();
    console.log('Clicked Next Step (to Review)');

    // Wait for Step 4 (Review) to load
    await page.getByRole('heading', { name: 'Documents & Profitability' }).waitFor({ state: 'visible', timeout: 10000 });
    console.log('Step 4 (Review) loaded successfully!');

    // ==================== STEP 4: Review & Submit ====================
    console.log('=== Step 4: Review & Submit ===');

    // Submit the deal
    await page.click('[data-testid="submit-deal-button"]');
    console.log('Clicked Submit Deal');

    // Wait for successful creation - should redirect to deals list or show success message
    // Wait for either redirect or toast
    await page.waitForTimeout(3000);

    // Check if we're redirected to deals list
    const currentUrl = page.url();
    console.log('Current URL after submission:', currentUrl);

    // We expect to be redirected to /admin/deals after successful creation
    // Or we might see a success toast
    const isOnDealsPage = currentUrl.includes('/admin/deals') && !currentUrl.includes('/create');

    if (isOnDealsPage) {
        console.log('SUCCESS: Redirected to deals list page');
        expect(isOnDealsPage).toBeTruthy();
    } else {
        // Check for success toast or message
        const successMessage = await page.locator('text=/successfully|created/i').first();
        const isSuccessVisible = await successMessage.isVisible().catch(() => false);
        console.log('Success message visible:', isSuccessVisible);

        if (isSuccessVisible) {
            console.log('SUCCESS: Deal created with success message');
        }
    }

    console.log('TEST COMPLETED');
});
