import { test, expect } from '@playwright/test';

test('Simple Visit', async ({ page }) => {
    console.log('Navigating...');
    const response = await page.goto('/en/calculator/kinetic-energy');
    console.log('Status:', response?.status());
    expect(response?.status()).toBe(200);
});
