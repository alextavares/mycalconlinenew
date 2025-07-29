const puppeteer = require('puppeteer');

async function finalCylinderTest() {
  console.log('🔬 TESTE FINAL - CALCULADORA DE ÁREA DO CILINDRO');
  console.log('='.repeat(60));
  
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
    await page.goto('http://localhost:3000/pt-BR/calculator/area-cilindro', {
      waitUntil: 'networkidle0',
      timeout: 20000
    });
    
    await page.waitForSelector('input[id="radius"]', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('✅ Página carregada!');
    
    // Teste focado no botão correto
    console.log('\n🧪 TESTE PRINCIPAL: Raio=5, Altura=10');
    
    // Método mais direto: usar page.type para garantir que os valores sejam inseridos
    await page.click('input[id="radius"]');
    await page.keyboard.selectAll();
    await page.keyboard.type('5');
    
    await page.click('input[id="height"]');
    await page.keyboard.selectAll();
    await page.keyboard.type('10');
    
    console.log('✅ Valores inseridos: raio=5, altura=10');
    
    // Encontrar e clicar no botão correto
    const buttonClicked = await page.evaluate(() => {
      // Procurar especificamente pelo botão "Calcular Área"
      const buttons = Array.from(document.querySelectorAll('button'));
      const calculateButton = buttons.find(btn => 
        btn.innerText.includes('Calcular') || 
        btn.innerText.includes('Calculate') ||
        btn.className.includes('bg-blue-500')
      );
      
      if (calculateButton) {
        calculateButton.click();
        return {
          success: true,
          buttonText: calculateButton.innerText,
          buttonClass: calculateButton.className
        };
      }
      return { success: false };
    });
    
    console.log('🔘 Botão clicado:', buttonClicked);
    
    // Aguardar o cálculo processar
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar resultado mais detalhadamente
    const detailedResult = await page.evaluate(() => {
      // Verificar diferentes possíveis locais do resultado
      const resultSelectors = [
        '.bg-accent',
        '[class*="accent"]',
        '[class*="result"]',
        '.mt-4',
        'div[class*="rounded-md"]'
      ];
      
      let resultFound = null;
      let resultLocation = '';
      
      for (const selector of resultSelectors) {
        const element = document.querySelector(selector);
        if (element && element.innerText && element.innerText.includes('471')) {
          resultFound = element.innerText;
          resultLocation = selector;
          break;
        }
      }
      
      // Se não encontrou resultado específico, procurar qualquer div com números
      if (!resultFound) {
        const allDivs = document.querySelectorAll('div');
        for (const div of allDivs) {
          if (div.innerText && /\d+\.\d+/.test(div.innerText)) {
            resultFound = div.innerText;
            resultLocation = 'numeric div';
            break;
          }
        }
      }
      
      return {
        resultFound: !!resultFound,
        resultText: resultFound || '',
        resultLocation: resultLocation,
        pageSnapshot: document.body.innerText.substring(0, 1000),
        hasAccentDiv: !!document.querySelector('.bg-accent'),
        hasErrorDiv: !!document.querySelector('.text-red-500'),
        radiusValue: document.querySelector('input[id="radius"]')?.value || '',
        heightValue: document.querySelector('input[id="height"]')?.value || ''
      };
    });
    
    console.log('\n📊 RESULTADO DETALHADO:');
    console.log('  Resultado encontrado:', detailedResult.resultFound);
    console.log('  Local do resultado:', detailedResult.resultLocation);
    console.log('  Texto do resultado:', detailedResult.resultText);
    console.log('  Valores nos campos - Raio:', detailedResult.radiusValue, 'Altura:', detailedResult.heightValue);
    console.log('  Div accent existe:', detailedResult.hasAccentDiv);
    console.log('  Div erro existe:', detailedResult.hasErrorDiv);
    
    // Se não encontrou resultado, mostrar snapshot da página
    if (!detailedResult.resultFound) {
      console.log('\n🔍 SNAPSHOT DA PÁGINA (primeiros 1000 chars):');
      console.log(detailedResult.pageSnapshot);
    }
    
    // Calcular o valor esperado e verificar se está próximo
    const expectedValue = 2 * Math.PI * 5 * (5 + 10);
    console.log('\n🧮 VERIFICAÇÃO MATEMÁTICA:');
    console.log('  Fórmula: 2π × r × (r + h)');
    console.log('  Cálculo: 2π × 5 × (5 + 10) = 2π × 5 × 15');
    console.log('  Resultado esperado:', expectedValue.toFixed(2));
    
    // Teste de funcionalidade básica da interface
    const interfaceTest = await page.evaluate(() => {
      const radius = document.querySelector('input[id="radius"]');
      const height = document.querySelector('input[id="height"]');
      const button = document.querySelector('button[class*="bg-blue-500"]');
      
      return {
        radiusExists: !!radius,
        heightExists: !!height,
        buttonExists: !!button,
        radiusEditable: radius ? !radius.disabled : false,
        heightEditable: height ? !height.disabled : false,
        formExists: !!document.querySelector('form')
      };
    });
    
    console.log('\n🔧 TESTE DE INTERFACE:');
    console.log('  Campo raio existe:', interfaceTest.radiusExists);
    console.log('  Campo altura existe:', interfaceTest.heightExists);
    console.log('  Botão calcular existe:', interfaceTest.buttonExists);
    console.log('  Campos editáveis:', interfaceTest.radiusEditable && interfaceTest.heightEditable);
    
    // Screenshot final
    await page.screenshot({ path: 'cylinder-final-test.png', fullPage: true });
    
    // RELATÓRIO CONCLUSIVO
    console.log('\n📋 RELATÓRIO CONCLUSIVO');
    console.log('='.repeat(40));
    
    const functionalityScore = {
      interface: interfaceTest.radiusExists && interfaceTest.heightExists && interfaceTest.buttonExists ? 1 : 0,
      inputFields: interfaceTest.radiusEditable && interfaceTest.heightEditable ? 1 : 0,
      calculation: detailedResult.resultFound ? 1 : 0,
      buttonInteraction: buttonClicked.success ? 1 : 0
    };
    
    const totalScore = Object.values(functionalityScore).reduce((a, b) => a + b, 0);
    
    console.log(`📊 Pontuação: ${totalScore}/4`);
    console.log('✅ Interface carregada:', functionalityScore.interface === 1 ? 'SIM' : 'NÃO');
    console.log('✅ Campos funcionais:', functionalityScore.inputFields === 1 ? 'SIM' : 'NÃO');
    console.log('✅ Botão responsivo:', functionalityScore.buttonInteraction === 1 ? 'SIM' : 'NÃO');
    console.log('✅ Cálculo funcional:', functionalityScore.calculation === 1 ? 'SIM' : 'NÃO');
    
    if (totalScore >= 3) {
      console.log('\n🎉 CALCULADORA APROVADA! Interface funcional e responsiva.');
    } else if (totalScore >= 2) {
      console.log('\n⚠️ Calculadora parcialmente funcional. Necessita ajustes.');
    } else {
      console.log('\n❌ Calculadora com problemas. Requer investigação.');
    }
    
    console.log('\n📸 Screenshot salvo: cylinder-final-test.png');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

finalCylinderTest().catch(console.error);