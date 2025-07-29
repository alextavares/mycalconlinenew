const { chromium } = require('playwright');

async function testCalculadoras() {
  console.log('🧪 Iniciando testes das calculadoras...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Test 1: Calculadora de Área do Círculo
    console.log('📊 Testando área do círculo...');
    await page.goto('https://www.calculator.net/circle-calculator.html');
    await page.fill('input[name="radius"]', '5');
    await page.click('input[type="submit"]');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'circle-result.png' });
    
    // Test 2: Conversão de metros para pés
    console.log('📏 Testando conversão...');
    await page.goto('https://www.calculator.net/length-calculator.html');
    await page.fill('input[name="value"]', '10');
    await page.selectOption('select[name="from"]', 'm');
    await page.selectOption('select[name="to"]', 'ft');
    await page.click('input[type="submit"]');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'conversion-result.png' });
    
    // Test 3: Calculadora básica
    console.log('🧮 Testando calculadora básica...');
    await page.goto('https://www.calculator.net/basic-calculator.html');
    await page.click('button:has-text("7")');
    await page.click('button:has-text("+")');
    await page.click('button:has-text("3")');
    await page.click('button:has-text("=")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'basic-calc-result.png' });
    
    console.log('✅ Todos os testes concluídos!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
}

testCalculadoras();