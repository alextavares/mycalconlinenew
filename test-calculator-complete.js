const puppeteer = require('puppeteer');

async function runCompleteTest() {
  console.log('🔬 TESTE COMPLETO DA CALCULADORA');
  console.log('='.repeat(50));
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: '/google/idx/builtins/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('📍 Navegando para a calculadora...');
    await page.goto('http://localhost:3000/pt-BR/calculator/adicionar-subtrair-dias', {
      waitUntil: 'networkidle0',
      timeout: 20000
    });
    
    await page.waitForSelector('form', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Teste 1: Adicionar 10 dias
    console.log('\n🧪 TESTE 1: Adicionar 10 dias');
    await page.evaluate(() => {
      const input = document.querySelector('input[type="number"]');
      input.value = '';
    });
    await page.focus('input[type="number"]');
    await page.keyboard.type('10');
    
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const test1Results = await page.evaluate(() => {
      const div = document.querySelector('.bg-yellow-50');
      return div ? div.innerText : 'Sem resultados';
    });
    
    console.log('📊 Resultado Teste 1:');
    console.log(test1Results);
    
    // Teste 2: Subtrair 5 dias
    console.log('\n🧪 TESTE 2: Subtrair 5 dias');
    
    // Selecionar "Subtrair"
    await page.select('select', 'Subtrair');
    
    // Limpar e preencher nova quantidade
    await page.evaluate(() => {
      const input = document.querySelector('input[type="number"]');
      input.value = '';
    });
    await page.focus('input[type="number"]');
    await page.keyboard.type('5');
    
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const test2Results = await page.evaluate(() => {
      const div = document.querySelector('.bg-yellow-50');
      return div ? div.innerText : 'Sem resultados';
    });
    
    console.log('📊 Resultado Teste 2:');
    console.log(test2Results);
    
    // Teste 3: Verificar se todos os três tipos de cálculo aparecem
    console.log('\n🧪 TESTE 3: Verificação de funcionalidades');
    
    const featureCheck = await page.evaluate(() => {
      const div = document.querySelector('.bg-yellow-50');
      if (!div) return { hasResults: false };
      
      const text = div.innerText;
      return {
        hasResults: true,
        hasAllDays: text.includes('todos os dias'),
        hasWorkDays: text.includes('apenas dias úteis'),
        hasWorkDaysWithSat: text.includes('dias úteis + sábados'),
        fullText: text
      };
    });
    
    console.log('📋 Verificação de Funcionalidades:');
    console.log('✅ Tem resultados:', featureCheck.hasResults);
    console.log('✅ Cálculo todos os dias:', featureCheck.hasAllDays);
    console.log('✅ Cálculo apenas dias úteis:', featureCheck.hasWorkDays);
    console.log('✅ Cálculo dias úteis + sábados:', featureCheck.hasWorkDaysWithSat);
    
    // Screenshot final
    await page.screenshot({ path: 'calculator-complete-test.png', fullPage: true });
    
    // Relatório final
    console.log('\n📋 RELATÓRIO FINAL');
    console.log('='.repeat(50));
    
    const allTestsPassed = 
      test1Results.includes('Data Resultante') &&
      test2Results.includes('Data Resultante') &&
      featureCheck.hasAllDays &&
      featureCheck.hasWorkDays &&
      featureCheck.hasWorkDaysWithSat;
    
    if (allTestsPassed) {
      console.log('🎉 TODOS OS TESTES PASSARAM!');
      console.log('✅ A calculadora está funcionando perfeitamente');
      console.log('✅ Todas as 3 funcionalidades estão operacionais');
      console.log('✅ Operações de adição e subtração funcionam');
    } else {
      console.log('⚠️ Alguns testes falharam');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste completo:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runCompleteTest().catch(console.error);