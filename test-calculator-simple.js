const puppeteer = require('puppeteer');

async function testCalculator() {
  console.log('🚀 Iniciando teste da primeira calculadora...');
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true, // Modo headless para ambiente sem display
      executablePath: '/google/idx/builtins/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Navegar para a calculadora
    console.log('📍 Navegando para a calculadora...');
    await page.goto('http://localhost:3000/pt-BR/calculator/adicionar-subtrair-dias', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    console.log('✅ Página carregada!');
    
    // Aguardar elementos carregarem
    await page.waitForSelector('form', { timeout: 10000 });
    console.log('✅ Formulário encontrado!');
    
    // Preencher o formulário
    console.log('📝 Preenchendo formulário...');
    
    // Preencher quantidade de dias
    await page.type('input[name="quantidade"]', '10');
    console.log('✅ Quantidade preenchida: 10 dias');
    
    // Clicar no botão calcular
    console.log('🧮 Clicando em calcular...');
    await page.click('button[type="submit"]');
    
    // Aguardar resultados
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verificar se os resultados apareceram
    const results = await page.evaluate(() => {
      const resultDiv = document.querySelector('.bg-yellow-50');
      if (resultDiv) {
        const text = resultDiv.innerText;
        return {
          visible: true,
          hasAllDays: text.includes('Data Resultante (todos os dias)'),
          hasWorkdays: text.includes('Data Resultante (apenas dias úteis)'),
          hasWorkdaysWithSat: text.includes('Data Resultante (dias úteis + sábados)'),
          content: text
        };
      }
      return { visible: false };
    });
    
    console.log('\n📊 RESULTADOS DO TESTE:');
    console.log('='.repeat(50));
    
    if (results.visible) {
      console.log('✅ Painel de resultados visível');
      console.log('✅ Cálculo todos os dias:', results.hasAllDays ? 'OK' : 'FALHA');
      console.log('✅ Cálculo dias úteis:', results.hasWorkdays ? 'OK' : 'FALHA');
      console.log('✅ Cálculo dias úteis + sábados:', results.hasWorkdaysWithSat ? 'OK' : 'FALHA');
      console.log('\n📄 Conteúdo dos resultados:');
      console.log(results.content);
    } else {
      console.log('❌ Painel de resultados não encontrado');
    }
    
    // Tirar screenshot
    await page.screenshot({ 
      path: 'calculator-test-result.png',
      fullPage: true 
    });
    console.log('\n📸 Screenshot salvo: calculator-test-result.png');
    
    // Teste adicional: mudar operação para "Subtrair"
    console.log('\n🔄 Testando operação "Subtrair"...');
    
    // Selecionar "Subtrair"
    await page.select('select', 'Subtrair');
    
    // Clicar calcular novamente
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const subtractResults = await page.evaluate(() => {
      const resultDiv = document.querySelector('.bg-yellow-50');
      return resultDiv ? resultDiv.innerText : 'Nenhum resultado';
    });
    
    console.log('✅ Teste subtração:', subtractResults.includes('Data Resultante') ? 'OK' : 'FALHA');
    
    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  } finally {
    if (browser) {
      // Aguardar um pouco antes de fechar para ver os resultados
      await new Promise(resolve => setTimeout(resolve, 3000));
      await browser.close();
    }
  }
}

testCalculator().catch(console.error);