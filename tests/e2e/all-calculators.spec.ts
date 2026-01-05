import { test, expect } from '@playwright/test';
import { calculators } from '@/config/calculators';

const slugs = Object.keys(calculators);

// Limit concurrency if needed, but Playwright handles it.
// We test each calculator page for basic health.

test.describe('Calculators Smoke Test', () => {
    for (const slug of slugs) {
        test(`Access ${slug}`, async ({ page }) => {
            try {
                // Navigate to the calculator page
                const response = await page.goto(`/en/calculator/${slug}`, { timeout: 30000 });

                if (response?.status() !== 200) {
                    console.error(`Error loading ${slug}: Status ${response?.status()}`);
                }
                // 1. Check HTTP Status
                expect(response?.status()).toBe(200);

                // 2. Check for H1 Title (SEO)
                const h1 = page.locator('h1');
                await expect(h1).toBeVisible();

                // 3. Check Engine Client Loaded (Configuration section)
                // The engine renders "Configuration" text in H2 or similar.
                await expect(page.getByText('Configuration')).toBeVisible();

                // 4. Check inputs
                const inputs = page.locator('input');
                const count = await inputs.count();
                expect(count).toBeGreaterThan(0);
            } catch (e) {
                console.error(`FAILED: ${slug}`, e);
                throw e;
            }
        });
    }
});
