const puppeteer = require('puppeteer');
const path = require('path');

async function testLocalCalculator() {
  console.log('Starting Puppeteer for local testing...');
  
  let browser;
  try {
    // Launch browser with system Chromium
    browser = await puppeteer.launch({
      headless: true,
      executablePath: '/google/idx/builtins/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    
    console.log('Browser launched successfully');
    const page = await browser.newPage();
    
    // Set viewport for consistent screenshots
    await page.setViewport({ width: 1280, height: 800 });
    
    // Navigate to the local calculator
    const calculatorUrl = 'http://localhost:3000/pt-BR/calculator/adicionar-subtrair-dias';
    console.log(`Navigating to ${calculatorUrl}...`);
    
    await page.goto(calculatorUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('Calculator page loaded successfully');
    
    // Wait for the form to load
    await page.waitForSelector('form', { timeout: 10000 });
    
    // Get page title and basic info
    const pageTitle = await page.title();
    const pageUrl = page.url();
    
    console.log('- Page Title:', pageTitle);
    console.log('- Page URL:', pageUrl);
    
    // Test the calculator functionality
    console.log('\nTesting calculator functionality...');
    
    // Fill the form
    // Select operation (should default to "Adicionar")
    await page.select('select[name="operacao"]', 'Adicionar');
    
    // Fill quantity
    await page.fill('input[name="quantidade"]', '10');
    
    // Click calculate button
    await page.click('button[type="submit"]');
    
    // Wait for results
    await page.waitForTimeout(1000);
    
    // Check if results are displayed
    const results = await page.evaluate(() => {
      const resultDiv = document.querySelector('.bg-yellow-50');
      if (resultDiv) {
        return {
          visible: true,
          content: resultDiv.innerText
        };
      }
      return { visible: false, content: null };
    });
    
    console.log('\nTest Results:');
    console.log('- Results panel visible:', results.visible);
    if (results.visible) {
      console.log('- Results content:', results.content);
    }
    
    // Take screenshot
    const screenshotPath = path.join(__dirname, 'local-calculator-test.png');
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    console.log('\nScreenshot saved to:', screenshotPath);
    
    console.log('\n✅ Calculator test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error occurred:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  } finally {
    if (browser) {
      await browser.close();
      console.log('\nBrowser closed');
    }
  }
}

// Run the function
testLocalCalculator().catch(console.error);