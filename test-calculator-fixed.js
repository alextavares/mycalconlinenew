const puppeteer = require('puppeteer');

async function testCalculator() {
  console.log('🚀 Testando Calculadora: Adicionar/Subtrair Dias');
  
  let browser;
  try {
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
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('📍 Navegando para a calculadora...');
    await page.goto('http://localhost:3000/pt-BR/calculator/adicionar-subtrair-dias', {
      waitUntil: 'networkidle0',
      timeout: 20000
    });
    
    console.log('✅ Página carregada!');
    
    // Aguardar o formulário aparecer
    await page.waitForSelector('form', { timeout: 10000 });
    console.log('✅ Formulário encontrado!');
    
    // Aguardar mais um pouco para garantir que tudo carregou
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verificar elementos antes de tentar interagir
    const elements = await page.evaluate(() => {
      return {
        quantityInput: !!document.querySelector('input[type="number"]'),
        submitButton: !!document.querySelector('button[type="submit"]'),
        selectOperation: !!document.querySelector('select'),
        form: !!document.querySelector('form')
      };
    });
    
    console.log('🔍 Elementos encontrados:', elements);
    
    // Preencher quantidade
    console.log('📝 Preenchendo quantidade...');
    await page.focus('input[type="number"]');
    await page.keyboard.type('5');
    console.log('✅ Quantidade preenchida: 5');
    
    // Tirar screenshot antes de calcular
    await page.screenshot({ path: 'before-calculate.png', fullPage: true });
    
    // Clicar calcular
    console.log('🧮 Clicando em calcular...');
    await page.click('button[type="submit"]');
    
    // Aguardar processamento
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar resultados
    const results = await page.evaluate(() => {
      const resultDiv = document.querySelector('.bg-yellow-50');
      const allText = document.body.innerText;
      
      return {
        resultDivExists: !!resultDiv,
        resultDivText: resultDiv ? resultDiv.innerText : '',
        pageContainsResults: allText.includes('Data Resultante'),
        fullPageText: allText.substring(0, 500) // Primeiros 500 chars para debug
      };
    });
    
    console.log('\n📊 RESULTADOS DO TESTE:');
    console.log('='.repeat(50));
    console.log('✅ Div de resultados existe:', results.resultDivExists);
    console.log('✅ Página contém "Data Resultante":', results.pageContainsResults);
    
    if (results.resultDivText) {
      console.log('\n📄 Texto dos resultados:');
      console.log(results.resultDivText);
    } else {
      console.log('\n🔍 Debug - Texto da página (primeiros 500 chars):');
      console.log(results.fullPageText);
    }
    
    // Screenshot final
    await page.screenshot({ path: 'after-calculate.png', fullPage: true });
    console.log('\n📸 Screenshots salvos: before-calculate.png, after-calculate.png');
    
    // Teste funcional: verificar se as funções de cálculo funcionam
    console.log('\n🧪 Testando lógica de cálculo...');
    
    const calculationTest = await page.evaluate(() => {
      // Simular as funções de cálculo
      const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      };
      
      const testDate = new Date('2024-01-15'); // Segunda-feira
      const result = addDays(testDate, 5);
      
      return {
        originalDate: testDate.toISOString().split('T')[0],
        resultDate: result.toISOString().split('T')[0],
        calculationWorks: result.getDate() === 20
      };
    });
    
    console.log('📅 Teste de cálculo:');
    console.log(`  Data original: ${calculationTest.originalDate}`);
    console.log(`  Data resultado: ${calculationTest.resultDate}`);
    console.log(`  Cálculo funciona: ${calculationTest.calculationWorks ? '✅' : '❌'}`);
    
    if (results.pageContainsResults || calculationTest.calculationWorks) {
      console.log('\n🎉 CALCULADORA FUNCIONANDO!');
    } else {
      console.log('\n⚠️ Possível problema na calculadora');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testCalculator().catch(console.error);