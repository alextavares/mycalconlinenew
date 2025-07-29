const puppeteer = require('puppeteer');

async function testCalculator(page, url, testName, testFunction) {
  console.log(`\n🧪 Testando ${testName}...`);
  console.log(`📍 URL: ${url}`);
  
  try {
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });
    
    console.log('✅ Página carregada');
    
    // Screenshot inicial
    const fileName = testName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    await page.screenshot({ 
      path: `${fileName}-after-corrections.png`,
      fullPage: true 
    });
    
    // Executar teste específico
    const result = await testFunction(page);
    
    return result;
    
  } catch (error) {
    console.error(`❌ Erro em ${testName}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function testPorcentagem(page) {
  const inputs = await page.$$('input');
  console.log(`📊 Inputs encontrados: ${inputs.length}`);
  
  if (inputs.length >= 2) {
    // Teste: 20% de 100 = 20
    await page.focus('input:first-of-type');
    await page.keyboard.type('20');
    
    await page.focus('input:nth-of-type(2)');
    await page.keyboard.type('100');
    
    const button = await page.$('button');
    if (button) {
      await button.click();
      console.log('✅ Botão clicado');
      
      await page.waitForTimeout(2000);
      
      // Verificar se resultado apareceu
      const resultText = await page.evaluate(() => {
        const resultDiv = document.querySelector('[class*="result"], .text-2xl, .font-bold');
        return resultDiv ? resultDiv.textContent : null;
      });
      
      console.log(`📋 Texto resultado: "${resultText}"`);
      
      if (resultText && resultText.includes('20')) {
        console.log('✅ Resultado correto apareceu!');
        return { success: true, result: resultText };
      } else {
        console.log('⚠️ Resultado não apareceu ou incorreto');
        return { success: false, result: resultText };
      }
    }
  }
  
  return { success: false, error: 'Elementos insuficientes' };
}

async function testDiasEntreDatas(page) {
  // Verificar se traduções foram corrigidas
  const textContent = await page.evaluate(() => document.body.textContent);
  
  if (textContent.includes('Calculators.dias-entre-datas')) {
    console.log('❌ Ainda tem chaves de tradução visíveis');
    return { success: false, error: 'Traduções não carregadas' };
  }
  
  // Verificar se elementos estão presentes
  const buttons = await page.$$('button');
  console.log(`📊 Botões encontrados: ${buttons.length}`);
  
  if (buttons.length > 0) {
    console.log('✅ Interface carregou sem erros de tradução');
    return { success: true, translationsOk: true };
  }
  
  return { success: false, error: 'Interface não carregou' };
}

async function testAreaQuadrado(page) {
  const inputs = await page.$$('input');
  console.log(`📊 Inputs encontrados: ${inputs.length}`);
  
  if (inputs.length >= 1) {
    // Teste: lado 5, área = 25
    await page.focus('input');
    await page.keyboard.type('5');
    
    const button = await page.$('button');
    if (button) {
      await button.click();
      console.log('✅ Botão clicado');
      
      await page.waitForTimeout(2000);
      
      // Verificar se resultado apareceu
      const resultText = await page.evaluate(() => {
        const resultElements = [
          ...document.querySelectorAll('[class*="result"]'),
          ...document.querySelectorAll('.bg-yellow-100'),
          ...document.querySelectorAll('.bg-amber-100'),
          ...document.querySelectorAll('.text-2xl'),
          ...document.querySelectorAll('.font-bold')
        ];
        
        for (let el of resultElements) {
          if (el.textContent && el.textContent.includes('25')) {
            return el.textContent;
          }
        }
        return null;
      });
      
      console.log(`📋 Texto resultado: "${resultText}"`);
      
      if (resultText && resultText.includes('25')) {
        console.log('✅ Resultado correto apareceu!');
        return { success: true, result: resultText };
      } else {
        console.log('⚠️ Resultado não apareceu');
        return { success: false, result: resultText };
      }
    }
  }
  
  return { success: false, error: 'Elementos insuficientes' };
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  console.log('🚀 INICIANDO TESTES PÓS-CORREÇÕES...\n');
  
  const tests = [
    {
      name: 'Calculadora Porcentagem',
      url: 'http://localhost:3000/pt-BR/calculator/porcentagem',
      testFn: testPorcentagem
    },
    {
      name: 'Dias Entre Datas',
      url: 'http://localhost:3000/pt-BR/calculator/dias-entre-datas', 
      testFn: testDiasEntreDatas
    },
    {
      name: 'Area Quadrado',
      url: 'http://localhost:3000/pt-BR/calculator/area-quadrado',
      testFn: testAreaQuadrado
    }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testCalculator(page, test.url, test.name, test.testFn);
    results.push({ name: test.name, ...result });
  }
  
  console.log('\n📊 RESUMO DOS TESTES:');
  console.log('='.repeat(50));
  
  let fixed = 0;
  let total = results.length;
  
  results.forEach(result => {
    const status = result.success ? '✅ FUNCIONANDO' : '❌ AINDA COM PROBLEMA';
    console.log(`${result.name}: ${status}`);
    if (result.error) console.log(`   Erro: ${result.error}`);
    if (result.result) console.log(`   Resultado: ${result.result}`);
    if (result.success) fixed++;
  });
  
  console.log('='.repeat(50));
  console.log(`📈 Taxa de correção: ${fixed}/${total} (${(fixed/total*100).toFixed(1)}%)`);
  
  if (fixed === total) {
    console.log('🎉 TODAS AS CORREÇÕES FUNCIONARAM!');
  } else {
    console.log(`⚠️ ${total - fixed} calculadoras ainda precisam de ajustes`);
  }
  
  await browser.close();
})();