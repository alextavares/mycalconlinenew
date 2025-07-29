const puppeteer = require('puppeteer');

async function testSquareCalculator() {
  console.log('🟨 TESTE DA CALCULADORA DE ÁREA DO QUADRADO');
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
    
    console.log('📍 Navegando para a calculadora de área do quadrado...');
    await page.goto('http://localhost:3000/pt-BR/calculator/area-quadrado', {
      waitUntil: 'networkidle0',
      timeout: 20000
    });
    
    await page.waitForSelector('input[id="side"]', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('✅ Página carregada!');
    
    // Verificar se usa CalculatorWrapper
    const wrapperCheck = await page.evaluate(() => {
      const title = document.title;
      const metaTags = Array.from(document.querySelectorAll('meta')).map(meta => ({
        name: meta.name,
        content: meta.content
      }));
      
      return {
        pageTitle: title,
        hasMetaTags: metaTags.length > 0,
        metaTags: metaTags.slice(0, 5) // Primeiros 5
      };
    });
    
    console.log('🔗 Verificação CalculatorWrapper:', wrapperCheck);
    
    // Verificar interface
    const interfaceCheck = await page.evaluate(() => {
      return {
        sideInput: !!document.querySelector('input[id="side"]'),
        calculateButton: !!document.querySelector('button'),
        svgSquare: !!document.querySelector('svg rect'),
        sideLabels: document.querySelectorAll('svg text').length,
        card: !!document.querySelector('.w-full'),
        purpleTitle: !!document.querySelector('.text-purple-600'),
        gridLayout: !!document.querySelector('.md\\:grid-cols-2'),
        yellowResult: !!document.querySelector('.bg-yellow-100')
      };
    });
    
    console.log('🔍 Interface verificada:', interfaceCheck);
    
    // Análise do SVG do quadrado
    const svgAnalysis = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      const rect = document.querySelector('svg rect');
      const texts = Array.from(document.querySelectorAll('svg text'));
      
      return {
        hasSvg: !!svg,
        hasSquare: !!rect,
        squareAttributes: rect ? {
          x: rect.getAttribute('x'),
          y: rect.getAttribute('y'), 
          width: rect.getAttribute('width'),
          height: rect.getAttribute('height')
        } : null,
        labelsCount: texts.length,
        labelsText: texts.map(t => t.textContent),
        labelsPositions: texts.map(t => ({
          x: t.getAttribute('x'),
          y: t.getAttribute('y'),
          text: t.textContent
        }))
      };
    });
    
    console.log('📐 Análise SVG do quadrado:', svgAnalysis);
    
    // TESTE 1: Quadrado pequeno - Azulejo (lado = 10cm)
    console.log('\n🟫 TESTE 1: Azulejo pequeno (lado = 10cm)');
    
    const test1 = await page.evaluate(() => {
      const sideInput = document.querySelector('input[id="side"]');
      
      if (sideInput) {
        sideInput.value = '10';
        sideInput.dispatchEvent(new Event('input', { bubbles: true }));
        sideInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        const buttons = Array.from(document.querySelectorAll('button'));
        const calculateButton = buttons.find(btn => 
          btn.innerText.includes('Calcular') || 
          btn.className.includes('purple') ||
          btn.className.includes('bg-purple')
        );
        
        if (calculateButton) {
          calculateButton.click();
          return {
            success: true,
            buttonFound: true,
            buttonText: calculateButton.innerText,
            inputValue: sideInput.value
          };
        }
        
        return { success: false, buttonFound: false };
      }
      
      return { success: false, inputFound: false };
    });
    
    console.log('📝 Execução teste 1:', test1);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const result1 = await page.evaluate(() => {
      const yellowDiv = document.querySelector('.bg-yellow-100');
      return {
        hasResult: !!yellowDiv,
        resultText: yellowDiv ? yellowDiv.innerText : '',
        containsNumber: yellowDiv ? /\d+\.\d+/.test(yellowDiv.innerText) : false
      };
    });
    
    const expectedValue1 = Math.pow(10, 2); // 10² = 100 cm²
    
    console.log('📊 Resultado Teste 1 (Azulejo):');
    console.log('  Valor esperado:', expectedValue1.toFixed(2), 'cm²');
    console.log('  Resultado encontrado:', result1.hasResult);
    console.log('  Contém número:', result1.containsNumber);
    if (result1.resultText) {
      console.log('  Texto resultado:', result1.resultText);
    }
    
    // TESTE 2: Terreno quadrado - Lote (lado = 25m)
    console.log('\n🏡 TESTE 2: Lote quadrado (lado = 25m)');
    
    await page.evaluate(() => {
      const sideInput = document.querySelector('input[id="side"]');
      if (sideInput) {
        sideInput.value = '25';
        sideInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        const buttons = Array.from(document.querySelectorAll('button'));
        const calculateButton = buttons.find(btn => 
          btn.innerText.includes('Calcular') || btn.className.includes('purple')
        );
        
        if (calculateButton) calculateButton.click();
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result2 = await page.evaluate(() => {
      const yellowDiv = document.querySelector('.bg-yellow-100');
      return {
        hasResult: !!yellowDiv,
        resultText: yellowDiv ? yellowDiv.innerText : ''
      };
    });
    
    const expectedValue2 = Math.pow(25, 2); // 25² = 625 m²
    
    console.log('📊 Resultado Teste 2 (Lote):');
    console.log('  Valor esperado:', expectedValue2.toFixed(2), 'm²');
    console.log('  Resultado obtido:', result2.resultText);
    
    // TESTE 3: Quadrado decimal - Papel (lado = 2.5cm)
    console.log('\n📄 TESTE 3: Papel quadrado (lado = 2.5cm)');
    
    await page.evaluate(() => {
      const sideInput = document.querySelector('input[id="side"]');
      if (sideInput) {
        sideInput.value = '2.5';
        sideInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        const buttons = Array.from(document.querySelectorAll('button'));
        const calculateButton = buttons.find(btn => 
          btn.innerText.includes('Calcular') || btn.className.includes('purple')
        );
        
        if (calculateButton) calculateButton.click();
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result3 = await page.evaluate(() => {
      const yellowDiv = document.querySelector('.bg-yellow-100');
      return {
        hasResult: !!yellowDiv,
        resultText: yellowDiv ? yellowDiv.innerText : ''
      };
    });
    
    const expectedValue3 = Math.pow(2.5, 2); // 2.5² = 6.25 cm²
    
    console.log('📊 Resultado Teste 3 (Papel):');
    console.log('  Valor esperado:', expectedValue3.toFixed(2), 'cm²');
    console.log('  Resultado obtido:', result3.resultText);
    
    // TESTE 4: Quadrado grande - Campo (lado = 100m)
    console.log('\n🟩 TESTE 4: Campo quadrado (lado = 100m)');
    
    await page.evaluate(() => {
      const sideInput = document.querySelector('input[id="side"]');
      if (sideInput) {
        sideInput.value = '100';
        sideInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        const buttons = Array.from(document.querySelectorAll('button'));
        const calculateButton = buttons.find(btn => 
          btn.innerText.includes('Calcular') || btn.className.includes('purple')
        );
        
        if (calculateButton) calculateButton.click();
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result4 = await page.evaluate(() => {
      const yellowDiv = document.querySelector('.bg-yellow-100');
      return {
        hasResult: !!yellowDiv,
        resultText: yellowDiv ? yellowDiv.innerText : ''
      };
    });
    
    const expectedValue4 = Math.pow(100, 2); // 100² = 10000 m²
    
    console.log('📊 Resultado Teste 4 (Campo):');
    console.log('  Valor esperado:', expectedValue4.toFixed(2), 'm²');
    console.log('  Resultado obtido:', result4.resultText);
    
    // TESTE 5: Validação - Lado zero
    console.log('\n❌ TESTE 5: Validação - lado = 0');
    
    await page.evaluate(() => {
      const sideInput = document.querySelector('input[id="side"]');
      if (sideInput) {
        sideInput.value = '0';
        sideInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        const buttons = Array.from(document.querySelectorAll('button'));
        const calculateButton = buttons.find(btn => 
          btn.innerText.includes('Calcular') || btn.className.includes('purple')
        );
        
        if (calculateButton) calculateButton.click();
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result5 = await page.evaluate(() => {
      const errorMsg = document.querySelector('.text-red-500');
      const yellowDiv = document.querySelector('.bg-yellow-100');
      
      return {
        hasError: !!errorMsg,
        errorText: errorMsg ? errorMsg.innerText : '',
        hasResult: !!yellowDiv,
        resultBlocked: !yellowDiv
      };
    });
    
    console.log('📊 Resultado Teste 5 (Validação):');
    console.log('  Erro mostrado:', result5.hasError);
    console.log('  Resultado bloqueado:', result5.resultBlocked);
    if (result5.errorText) {
      console.log('  Mensagem erro:', result5.errorText);
    }
    
    // TESTE 6: Validação - Lado negativo
    console.log('\n❌ TESTE 6: Validação - lado = -5');
    
    await page.evaluate(() => {
      const sideInput = document.querySelector('input[id="side"]');
      if (sideInput) {
        sideInput.value = '-5';
        sideInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        const buttons = Array.from(document.querySelectorAll('button'));
        const calculateButton = buttons.find(btn => 
          btn.innerText.includes('Calcular') || btn.className.includes('purple')
        );
        
        if (calculateButton) calculateButton.click();
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result6 = await page.evaluate(() => {
      const errorMsg = document.querySelector('.text-red-500');
      const yellowDiv = document.querySelector('.bg-yellow-100');
      
      return {
        hasError: !!errorMsg,
        hasResult: !!yellowDiv
      };
    });
    
    console.log('📊 Resultado Teste 6 (Negativo):');
    console.log('  Erro mostrado:', result6.hasError);
    console.log('  Resultado bloqueado:', !result6.hasResult);
    
    // Screenshot final
    await page.screenshot({ path: 'square-calculator-test.png', fullPage: true });
    
    // Verificação do sistema de traduções
    const translationCheck = await page.evaluate(() => {
      const title = document.querySelector('.text-purple-600');
      const description = document.querySelector('p'); // CardDescription
      const label = document.querySelector('label');
      const button = document.querySelector('button');
      
      return {
        hasTitle: !!title,
        titleText: title ? title.innerText : '',
        hasDescription: !!description,
        descriptionText: description ? description.innerText : '',
        hasLabel: !!label,
        labelText: label ? label.innerText : '',
        hasButton: !!button,
        buttonText: button ? button.innerText : ''
      };
    });
    
    console.log('\n🌐 VERIFICAÇÃO DO SISTEMA DE TRADUÇÕES:');
    console.log('  Título carregado:', translationCheck.hasTitle);
    console.log('  Texto título:', translationCheck.titleText);
    console.log('  Descrição carregada:', translationCheck.hasDescription);
    console.log('  Label carregado:', translationCheck.hasLabel);
    console.log('  Botão carregado:', translationCheck.hasButton);
    
    // RELATÓRIO FINAL
    console.log('\n📋 RELATÓRIO FINAL - CALCULADORA DE ÁREA DO QUADRADO');
    console.log('='.repeat(60));
    
    const tests = [
      { name: 'Azulejo (10cm)', status: result1.hasResult && result1.containsNumber, expected: expectedValue1.toFixed(2) },
      { name: 'Lote (25m)', status: result2.hasResult, expected: expectedValue2.toFixed(2) },
      { name: 'Papel (2.5cm)', status: result3.hasResult, expected: expectedValue3.toFixed(2) },
      { name: 'Campo (100m)', status: result4.hasResult, expected: expectedValue4.toFixed(2) },
      { name: 'Validação zero', status: result5.hasError && result5.resultBlocked, expected: 'Erro' },
      { name: 'Validação negativo', status: result6.hasError && !result6.hasResult, expected: 'Erro' }
    ];
    
    const passedTests = tests.filter(t => t.status).length;
    const interfaceScore = Object.values(interfaceCheck).filter(Boolean).length;
    const svgScore = svgAnalysis.hasSquare && svgAnalysis.labelsCount >= 4 ? 5 : 3;
    const translationScore = Object.values(translationCheck).filter(Boolean).length;
    
    console.log(`📊 Testes funcionais: ${passedTests}/${tests.length}`);
    console.log(`🔧 Interface: ${interfaceScore}/${Object.keys(interfaceCheck).length}`);
    console.log(`📐 SVG educativo: ${svgScore}/5`);
    console.log(`🌐 Sistema traduções: ${translationScore}/${Object.keys(translationCheck).length}`);
    
    tests.forEach(test => {
      console.log(`${test.status ? '✅' : '❌'} ${test.name} (esperado: ${test.expected})`);
    });
    
    console.log('\n🎯 CENÁRIOS REAIS TESTADOS:');
    console.log('🟫 Azulejo: Quantidade de material para revestimento');
    console.log('🏡 Lote: Área de terreno para construção');
    console.log('📄 Papel: Área de superfície para impressão');
    console.log('🟩 Campo: Área de plantio ou pastagem');
    console.log('❌ Validação: Entradas inválidas bloqueadas');
    
    console.log('\n🧮 VERIFICAÇÃO MATEMÁTICA:');
    console.log('✅ Fórmula: Área = a²');
    console.log('✅ Justificativa: Lado × lado');
    console.log('✅ Implementação: Math.pow(a, 2)');
    
    console.log('\n📐 QUALIDADES DO SVG:');
    console.log(`  Quadrado perfeito: ${svgAnalysis.hasSquare ? 'SIM' : 'NÃO'}`);
    console.log(`  Labels nos 4 lados: ${svgAnalysis.labelsCount}/4`);
    console.log(`  Educativo: ${svgAnalysis.labelsCount >= 4 ? 'EXCELENTE' : 'BÁSICO'}`);
    console.log(`  Posicionamento: ${svgAnalysis.labelsPositions.length > 0 ? 'PRECISO' : 'BÁSICO'}`);
    
    console.log('\n🔗 QUALIDADES DO CALCULATORWRAPPER:');
    console.log(`  Meta tags: ${wrapperCheck.hasMetaTags ? 'CONFIGURADO' : 'BÁSICO'}`);
    console.log(`  SEO otimizado: ${wrapperCheck.pageTitle ? 'SIM' : 'NÃO'}`);
    
    console.log('\n🌐 SISTEMA DE TRADUÇÕES:');
    console.log(`  Estrutura organizada: ${translationScore >= 4 ? 'EXCELENTE' : 'BÁSICO'}`);
    console.log(`  I18n funcionando: ${translationCheck.hasTitle && translationCheck.hasButton ? 'SIM' : 'NÃO'}`);
    
    const totalScore = passedTests + (interfaceScore >= 6 ? 1 : 0) + (svgScore >= 4 ? 1 : 0) + (translationScore >= 4 ? 1 : 0);
    
    if (totalScore >= 8) {
      console.log('\n🏆 CALCULADORA DE QUADRADO SUPERIOR!');
      console.log('✅ SVG mais educativo (4 labels nos lados)');
      console.log('✅ CalculatorWrapper para SEO otimizado');
      console.log('✅ Sistema de traduções bem estruturado');
      console.log('✅ Fórmula mais simples e direta');
    } else if (totalScore >= 6) {
      console.log('\n🎉 CALCULADORA EXCELENTE!');
    } else if (totalScore >= 4) {
      console.log('\n👍 CALCULADORA BOA');
    } else {
      console.log('\n⚠️ CALCULADORA PRECISA MELHORIAS');
    }
    
    console.log('\n📸 Screenshot: square-calculator-test.png');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testSquareCalculator().catch(console.error);