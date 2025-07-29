const puppeteer = require('puppeteer');
const path = require('path');

async function navigateAndScreenshot() {
  console.log('Starting Puppeteer...');
  
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
    
    // Navigate to the main page
    console.log('Navigating to https://mycalconline.com...');
    await page.goto('https://mycalconline.com', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('Page loaded successfully');
    
    // Wait for calculator cards to load
    await page.waitForSelector('a[href*="/calculator/"]', { timeout: 10000 });
    
    // Get information about the first calculator
    const firstCalculatorInfo = await page.evaluate(() => {
      const firstLink = document.querySelector('a[href*="/calculator/"]');
      if (firstLink) {
        return {
          href: firstLink.href,
          text: firstLink.innerText || firstLink.textContent,
          title: firstLink.querySelector('h3')?.innerText || firstLink.innerText || 'Unknown Calculator'
        };
      }
      return null;
    });
    
    if (firstCalculatorInfo) {
      console.log('\nFirst calculator found:');
      console.log('- Title:', firstCalculatorInfo.title);
      console.log('- URL:', firstCalculatorInfo.href);
      console.log('- Full text:', firstCalculatorInfo.text);
      
      // Navigate directly to the calculator URL instead of clicking
      console.log('\nNavigating to the first calculator...');
      await page.goto(firstCalculatorInfo.href, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      // Wait a bit more for any dynamic content
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get current URL and page title
      const currentUrl = page.url();
      const pageTitle = await page.title();
      
      console.log('\nNavigated to calculator page:');
      console.log('- Current URL:', currentUrl);
      console.log('- Page title:', pageTitle);
      
      // Take screenshot
      const screenshotPath = path.join(__dirname, 'first-calculator-screenshot.png');
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      console.log('\nScreenshot saved to:', screenshotPath);
      
      // Get some information about the calculator interface
      const calculatorDetails = await page.evaluate(() => {
        const details = {
          inputs: [],
          buttons: [],
          headings: []
        };
        
        // Find input fields
        const inputs = document.querySelectorAll('input[type="text"], input[type="number"]');
        inputs.forEach(input => {
          details.inputs.push({
            id: input.id,
            name: input.name,
            placeholder: input.placeholder,
            label: input.getAttribute('aria-label') || document.querySelector(`label[for="${input.id}"]`)?.innerText
          });
        });
        
        // Find buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
          if (button.innerText && button.innerText.trim()) {
            details.buttons.push(button.innerText.trim());
          }
        });
        
        // Find headings
        const headings = document.querySelectorAll('h1, h2, h3');
        headings.forEach(heading => {
          if (heading.innerText && heading.innerText.trim()) {
            details.headings.push({
              level: heading.tagName,
              text: heading.innerText.trim()
            });
          }
        });
        
        return details;
      });
      
      console.log('\nCalculator interface elements:');
      console.log('- Input fields:', calculatorDetails.inputs.length);
      calculatorDetails.inputs.forEach((input, i) => {
        console.log(`  ${i + 1}. ${input.label || input.placeholder || input.name || input.id || 'Unnamed input'}`);
      });
      
      console.log('\n- Buttons found:', calculatorDetails.buttons.length);
      calculatorDetails.buttons.slice(0, 10).forEach((button, i) => {
        console.log(`  ${i + 1}. ${button}`);
      });
      if (calculatorDetails.buttons.length > 10) {
        console.log(`  ... and ${calculatorDetails.buttons.length - 10} more`);
      }
      
      console.log('\n- Headings:');
      calculatorDetails.headings.forEach(heading => {
        console.log(`  ${heading.level}: ${heading.text}`);
      });
      
    } else {
      console.log('No calculator links found on the page');
    }
    
  } catch (error) {
    console.error('Error occurred:', error.message);
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
navigateAndScreenshot().catch(console.error);