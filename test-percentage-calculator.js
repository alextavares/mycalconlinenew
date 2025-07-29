const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  console.log('🧪 Testando Calculadora de Porcentagem...');
  
  try {
    await page.goto('http://localhost:3000/pt-BR/calculator/porcentagem', { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });
    
    console.log('✅ Página carregada com sucesso');
    
    // Screenshot inicial
    await page.screenshot({ 
      path: 'percentage-calculator-initial.png',
      fullPage: true 
    });
    
    // Verificar elementos na página
    const inputs = await page.$$('input');
    const buttons = await page.$$('button');
    const selects = await page.$$('select');
    
    console.log(`📊 Elementos encontrados: ${inputs.length} inputs, ${buttons.length} buttons, ${selects.length} selects`);
    
    // Tentar diferentes cenários de teste
    if (inputs.length >= 2) {
      console.log('🧮 Teste 1: 20% de 100');
      await page.focus('input:first-of-type');
      await page.keyboard.type('20');
      
      if (inputs.length >= 2) {
        await page.focus('input:nth-of-type(2)');
        await page.keyboard.type('100');
      }
      
      // Procurar botão calcular
      const calculateButton = await page.$('button[type="button"]') || await page.$('button');
      if (calculateButton) {
        await calculateButton.click();
        console.log('✅ Botão calcular clicado');
        
        await page.waitForTimeout(2000);
        
        // Screenshot após cálculo
        await page.screenshot({ 
          path: 'percentage-calculator-test.png',
          fullPage: true 
        });
        
        // Verificar se resultado apareceu
        const resultElements = await page.$$('[class*="result"], .bg-yellow, .bg-amber');
        console.log(`📋 Elementos de resultado encontrados: ${resultElements.length}`);
        
        if (resultElements.length > 0) {
          console.log('✅ Resultado apareceu na interface');
        } else {
          console.log('⚠️ Resultado não apareceu visualmente');
        }
      }
      
      console.log('\n🧮 Teste 2: Quanto é 15% de 200');
      await page.reload({ waitUntil: 'networkidle0' });
      
      await page.focus('input:first-of-type');
      await page.keyboard.type('15');
      
      if (inputs.length >= 2) {
        await page.focus('input:nth-of-type(2)');
        await page.keyboard.type('200');
      }
      
      const calculateButton2 = await page.$('button[type="button"]') || await page.$('button');
      if (calculateButton2) {
        await calculateButton2.click();
        await page.waitForTimeout(2000);
        
        await page.screenshot({ 
          path: 'percentage-calculator-test2.png',
          fullPage: true 
        });
      }
    }
    
    console.log('✅ Testes concluídos com sucesso');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  } finally {
    await browser.close();
  }
})();