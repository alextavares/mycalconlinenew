import { test } from '@playwright/test';

test('Debug connection', async ({ page }) => {
    console.log('Attempting navigation to http://127.0.0.1:3005/en');
    try {
        const res = await page.goto('http://127.0.0.1:3005/en', { timeout: 10000 });
        console.log('Navigation success, status:', res?.status());
    } catch (e) {
        console.log('NAVIGATION_ERROR:', e);
        throw e;
    }
});
