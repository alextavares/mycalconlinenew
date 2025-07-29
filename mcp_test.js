
const { chromium } = require('playwright');

(async () => {
  try {
    const wsEndpoint = 'ws://0.0.0.0:8899'; // Make sure the port matches your MCP server
    const browser = await chromium.connect(wsEndpoint, {
      headers: {
        'x-mcp-token': 'REPLACE_WITH_YOUR_TOKEN', // Replace with a valid token if required
      },
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://www.google.com');
    console.log('Page title:', await page.title());
    await browser.close();
    console.log('Test passed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
})();
