import { test, expect } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

test.describe('Quote and Contact Inquiry Flow', () => {
    let uniqueEmail: string
    let uniqueContactEmail: string

    test.beforeAll(async () => {
        uniqueEmail = `test.quote.${Date.now()}@example.com`
        uniqueContactEmail = `test.contact.${Date.now()}@example.com`
    })

    test('1. Submit Quote and Verify as Admin', async ({ page }) => {
        page.on('console', msg => console.log(`BROWSER: ${msg.text()}`));

        // Submit Quote
        await page.goto('/tech')
        await page.fill('input[name="company_name"]', 'Test Company Inc')
        await page.fill('input[name="contact_person"]', 'John Tester')
        await page.fill('input[name="email"]', uniqueEmail)

        // Select Service
        await page.locator('button[role="combobox"]').first().click()
        await page.getByRole('option', { name: "IT Consulting" }).click()

        await page.fill('textarea[name="project_description"]', 'This is a test project description for E2E testing.')
        await page.click('button[type="submit"]')

        // Wait for success
        await expect(page.locator('#success-heading')).toBeVisible({ timeout: 30000 })

        // Login and Verify
        await page.goto('/login')

        // Check if we are already clogged in or redirected
        try {
            const emailInput = page.locator('input[name="email"]')
            if (await emailInput.isVisible({ timeout: 5000 })) {
                await emailInput.fill('gvgglobalgroupltd@gmail.com')
                await page.fill('input[name="password"]', 'Vivaan@2412')
                await page.click('button[type="submit"]')
            }
        } catch (e) {
            console.log('Login form not found, assuming already logged in')
        }

        await page.waitForURL(url => url.pathname.includes('/admin'), { timeout: 30000 })

        await page.goto('/admin/quotes')
        await page.waitForSelector('table', { timeout: 30000 })

        // Retry logic for data visibility
        await expect(async () => {
            const refreshBtn = page.getByRole('button', { name: 'Refresh' })
            if (await refreshBtn.isVisible()) await refreshBtn.click()
            await expect(page.getByText(uniqueEmail).first()).toBeVisible({ timeout: 5000 })
        }).toPass({ timeout: 30000 })

        // Update status
        const row = page.locator('tr', { hasText: uniqueEmail }).first()
        await row.locator('select').selectOption('Contacted')
        await expect(page.getByText('Status Updated')).toBeVisible({ timeout: 15000 })
    })

    test('2. Submit Contact Form and Verify as Admin', async ({ page }) => {
        page.on('console', msg => console.log(`BROWSER: ${msg.text()}`));

        // Submit Contact Form
        await page.goto('/contact')
        await page.fill('input[name="fullName"]', 'Contact Tester')
        await page.fill('input[name="email"]', uniqueContactEmail)

        // Select Subject
        await page.locator('button[role="combobox"]').first().click()
        await page.getByRole('option', { name: "General Inquiry" }).click()

        await page.fill('textarea[name="message"]', 'This is a general inquiry test message.')
        await page.click('button:has-text("Send Message")')

        // Wait for success
        await expect(page.getByText('Message Sent!')).toBeVisible({ timeout: 30000 })

        // Re-navigate to admin (should still be logged in)
        await page.goto('/admin/inquiries')
        await page.waitForSelector('table', { timeout: 30000 })

        // Retry logic for data visibility
        await expect(async () => {
            const refreshBtn = page.getByRole('button', { name: 'Refresh' })
            if (await refreshBtn.isVisible()) await refreshBtn.click()
            await expect(page.getByText(uniqueContactEmail).first()).toBeVisible({ timeout: 5000 })
        }).toPass({ timeout: 30000 })

        // Update status
        const row = page.locator('tr', { hasText: uniqueContactEmail }).first()
        await row.locator('select').selectOption('In Progress')
        await expect(page.getByText('Status Updated')).toBeVisible({ timeout: 15000 })
    })
})
