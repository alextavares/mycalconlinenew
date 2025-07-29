#!/usr/bin/env node

const { chromium } = require('playwright');

async function testCalculadoras() {
  console.log('🧪 Iniciando testes automatizados das calculadoras...');
  
  // Lançar navegador
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Test 1: Calculadora de Área do Círculo
    console.log('📊 Testando calculadora de área do círculo...');
    await page.goto('https://www.calculator.net/circle-calculator.html');
    await page.waitForLoadState('networkidle');
    
    // Tirar screenshot inicial
    await page.screenshot({ path: 'circle-calculator-initial.png', fullPage: true });
    
    // Inserir valor do raio
    await page.fill('input[name="radius"]', '5');
    
    // Clicar em calcular
    await page.click('input[type="submit"][value*="Calculate"]');
    
    // Esperar pelo resultado
    await page.waitForSelector('.verybigtext', { timeout: 5000 });
    
    // Tirar screenshot do resultado
    await page.screenshot({ path: 'circle-calculator-result.png', fullPage: true });
    
    // Obter resultado
    const circleResult = await page.textContent('.verybigtext');
    console.log('✅ Área do círculo:', circleResult);
    
    // Test 2: Calculadora de conversão
    console.log('📏 Testando calculadora de conversão...');
    await page.goto('https://www.calculator.net/length-calculator.html');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: 'length-calculator-initial.png', fullPage: true });
    
    // Inserir valor
    await page.fill('input[name="value"]', '10');
    
    // Selecionar unidades
    await page.selectOption('select[name="from"]', 'm');
    await page.selectOption('select[name="to"]', 'ft');
    
    // Clicar em converter
    await page.click('input[type="submit"][value*="Convert"]');
    
    // Esperar resultado
    await page.waitForSelector('.verybigtext', { timeout: 5000 });
    
    await page.screenshot({ path: 'length-conversion-result.png', fullPage: true });
    
    const conversionResult = await page.textContent('.verybigtext');
    console.log('✅ Conversão metros para pés:', conversionResult);
    
    // Test 3: Calculadora básica
    console.log('🧮 Testando calculadora básica...');
    await page.goto('https://www.calculator.net/basic-calculator.html');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: 'basic-calculator-initial.png', fullPage: true });
    
    // Realizar operação 7 + 3
    await page.click('button:has-text("7")');
    await page.click('button:has-text("+")');
    await page.click('button:has-text("3")');
    await page.click('button:has-text("=")');
    
    // Esperar resultado
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: 'basic-calculator-result.png', fullPage: true });
    
    // Obter resultado da calculadora
    const calculatorResult = await page.inputValue('#display');
    console.log('✅ Cálculo básico 7+3:', calculatorResult);
    
    // Test 4: Calculadora de IMC
    console.log('⚖️ Testando calculadora de IMC...');
    await page.goto('https://www.calculator.net/bmi-calculator.html');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: 'bmi-calculator-initial.png', fullPage: true });
    
    // Preencher dados
    await page.fill('input[name="cage"]', '30');
    await page.selectOption('select[name="csex"]', 'm');
    await page.fill('input[name="cheightmeter"]', '1.75');
    await page.fill('input[name="ckg"]', '70');
    
    // Clicar em calcular
    await page.click('input[type="submit"][value*="Calculate"]');
    
    // Esperar resultado
    await page.waitForSelector('.verybigtext', { timeout: 5000 });
    
    await page.screenshot({ path: 'bmi-calculation-result.png', fullPage: true });
    
    const bmiResult = await page.textContent('.verybigtext');
    console.log('✅ Cálculo de IMC:', bmiResult);
    
    console.log('🎉 Todos os testes concluídos com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

// Executar testes
testCalculadoras().catch(console.error);