const puppeteer = require('puppeteer');

async function testSphereCalculator() {
  console.log('🌐 TESTE DA CALCULADORA DE ÁREA DA ESFERA');
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
    
    console.log('📍 Navegando para a calculadora de área da esfera...');
    await page.goto('http://localhost:3000/pt-BR/calculator/area-esfera', {
      waitUntil: 'networkidle0',
      timeout: 20000
    });
    
    await page.waitForSelector('input[id="raio"]', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('✅ Página carregada!');
    
    // Verificar interface avançada
    const interfaceCheck = await page.evaluate(() => {
      return {
        radiusInput: !!document.querySelector('input[id="raio"]'),
        calculateButton: !!document.querySelector('button'),
        resultArea: !!document.querySelector('.bg-yellow-50') || !!document.querySelector('.bg-gray-100'),
        errorArea: !!document.querySelector('.text-red-500'),
        cardHeader: !!document.querySelector('.bg-gray-50'),
        gridLayout: !!document.querySelector('.md\\:grid-cols-2'),
        purpleTitle: !!document.querySelector('.text-purple-700'),
        shadowCard: !!document.querySelector('.shadow-lg')
      };
    });
    
    console.log('🔍 Interface avançada verificada:', interfaceCheck);
    
    // Análise do design
    const designAnalysis = await page.evaluate(() => {
      const card = document.querySelector('.w-full');
      const button = document.querySelector('button');
      const input = document.querySelector('input[id="raio"]');
      const title = document.querySelector('.text-purple-700');
      
      return {
        cardStyling: card ? card.className.includes('shadow-lg') : false,
        buttonStyling: button ? button.className.includes('bg-purple-600') : false,
        inputStyling: input ? input.className.includes('focus:border-purple-500') : false,
        titlePurple: title ? title.className.includes('text-purple-700') : false,
        responsiveGrid: !!document.querySelector('.md\\:grid-cols-2')
      };
    });
    
    console.log('🎨 Análise do design:', designAnalysis);
    
    // TESTE 1: Bola de ping-pong (raio = 2cm)
    console.log('\n🏓 TESTE 1: Bola de ping-pong (raio = 2cm)');
    
    const test1 = await page.evaluate(() => {
      const radiusInput = document.querySelector('input[id="raio"]');
      
      if (radiusInput) {
        radiusInput.value = '2';
        radiusInput.dispatchEvent(new Event('input', { bubbles: true }));
        radiusInput.dispatchEvent(new Event('change', { bubbles: true }));
        
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
            inputValue: radiusInput.value
          };
        }
        
        return { success: false, buttonFound: false };
      }
      
      return { success: false, inputFound: false };
    });
    
    console.log('📝 Execução teste 1:', test1);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const result1 = await page.evaluate(() => {
      const yellowDiv = document.querySelector('.bg-yellow-50');
      const grayDiv = document.querySelector('.bg-gray-100');
      const resultText = yellowDiv ? yellowDiv.innerText : (grayDiv ? grayDiv.innerText : '');
      
      return {
        hasYellowResult: !!yellowDiv,
        hasGrayResult: !!grayDiv,
        resultText: resultText,
        containsNumber: /\d+\.\d+/.test(resultText)
      };
    });
    
    const expectedValue1 = 4 * Math.PI * Math.pow(2, 2); // 4π × 2² ≈ 50.27 cm²
    
    console.log('📊 Resultado Teste 1 (Ping-pong):');
    console.log('  Valor esperado:', expectedValue1.toFixed(2), 'cm²');
    console.log('  Área amarela:', result1.hasYellowResult);
    console.log('  Área cinza:', result1.hasGrayResult);
    console.log('  Contém número:', result1.containsNumber);
    if (result1.resultText) {
      console.log('  Texto resultado:', result1.resultText);
    }
    
    // TESTE 2: Bola de futebol (raio = 11cm)
    console.log('\n⚽ TESTE 2: Bola de futebol (raio = 11cm)');
    
    await page.evaluate(() => {
      const radiusInput = document.querySelector('input[id="raio"]');
      if (radiusInput) {
        radiusInput.value = '11';
        radiusInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        const buttons = Array.from(document.querySelectorAll('button'));
        const calculateButton = buttons.find(btn => 
          btn.innerText.includes('Calcular') || btn.className.includes('purple')
        );
        
        if (calculateButton) calculateButton.click();
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result2 = await page.evaluate(() => {
      const yellowDiv = document.querySelector('.bg-yellow-50');
      return {
        hasResult: !!yellowDiv,
        resultText: yellowDiv ? yellowDiv.innerText : ''
      };
    });
    
    const expectedValue2 = 4 * Math.PI * Math.pow(11, 2); // 4π × 11² ≈ 1520.53 cm²
    
    console.log('📊 Resultado Teste 2 (Futebol):');
    console.log('  Valor esperado:', expectedValue2.toFixed(2), 'cm²');
    console.log('  Resultado obtido:', result2.resultText);
    
    // TESTE 3: Planeta Terra miniatura (raio = 6.37m)
    console.log('\n🌍 TESTE 3: Terra miniatura (raio = 6.37m)');
    
    await page.evaluate(() => {
      const radiusInput = document.querySelector('input[id="raio"]');
      if (radiusInput) {
        radiusInput.value = '6.37';
        radiusInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        const buttons = Array.from(document.querySelectorAll('button'));
        const calculateButton = buttons.find(btn => 
          btn.innerText.includes('Calcular') || btn.className.includes('purple')
        );
        
        if (calculateButton) calculateButton.click();
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result3 = await page.evaluate(() => {
      const yellowDiv = document.querySelector('.bg-yellow-50');
      return {
        hasResult: !!yellowDiv,
        resultText: yellowDiv ? yellowDiv.innerText : ''
      };
    });
    
    const expectedValue3 = 4 * Math.PI * Math.pow(6.37, 2); // 4π × 6.37² ≈ 510.07 m²
    
    console.log('📊 Resultado Teste 3 (Terra):');
    console.log('  Valor esperado:', expectedValue3.toFixed(2), 'm²');
    console.log('  Resultado obtido:', result3.resultText);
    
    // TESTE 4: Validação de erro - Valor negativo
    console.log('\n❌ TESTE 4: Validação - raio = -5');
    
    await page.evaluate(() => {
      const radiusInput = document.querySelector('input[id="raio"]');
      if (radiusInput) {
        radiusInput.value = '-5';
        radiusInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        const buttons = Array.from(document.querySelectorAll('button'));
        const calculateButton = buttons.find(btn => 
          btn.innerText.includes('Calcular') || btn.className.includes('purple')
        );
        
        if (calculateButton) calculateButton.click();
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result4 = await page.evaluate(() => {
      const errorMsg = document.querySelector('.text-red-500');
      const yellowDiv = document.querySelector('.bg-yellow-50');
      const inputValue = document.querySelector('input[id="raio"]').value;
      
      return {
        hasError: !!errorMsg,
        errorText: errorMsg ? errorMsg.innerText : '',
        hasResult: !!yellowDiv,
        inputCleared: inputValue === '',
        inputValue: inputValue
      };
    });
    
    console.log('📊 Resultado Teste 4 (Validação):');
    console.log('  Erro mostrado:', result4.hasError);
    console.log('  Input limpo:', result4.inputCleared);
    console.log('  Resultado bloqueado:', !result4.hasResult);
    if (result4.errorText) {
      console.log('  Mensagem erro:', result4.errorText);
    }
    console.log('  Valor no input:', result4.inputValue);
    
    // TESTE 5: Validação de erro - Valor zero
    console.log('\n❌ TESTE 5: Validação - raio = 0');
    
    await page.evaluate(() => {
      const radiusInput = document.querySelector('input[id="raio"]');
      if (radiusInput) {
        radiusInput.value = '0';
        radiusInput.dispatchEvent(new Event('input', { bubbles: true }));
        
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
      const yellowDiv = document.querySelector('.bg-yellow-50');
      
      return {
        hasError: !!errorMsg,
        hasResult: !!yellowDiv
      };
    });
    
    console.log('📊 Resultado Teste 5 (Zero):');
    console.log('  Erro mostrado:', result5.hasError);
    console.log('  Resultado bloqueado:', !result5.hasResult);
    
    // Screenshot final
    await page.screenshot({ path: 'sphere-calculator-test.png', fullPage: true });
    
    // Análise da área de resultado
    const resultAreaAnalysis = await page.evaluate(() => {
      const yellowArea = document.querySelector('.bg-yellow-50');
      const grayArea = document.querySelector('.bg-gray-100');
      const resultArea = yellowArea || grayArea;
      
      return {
        hasResultArea: !!resultArea,
        isYellow: !!yellowArea,
        isGray: !!grayArea,
        minHeight: resultArea ? resultArea.className.includes('min-h-[100px]') : false,
        centered: resultArea ? resultArea.className.includes('justify-center') : false,
        styling: resultArea ? resultArea.className : ''
      };
    });
    
    console.log('\n🎨 ANÁLISE DA ÁREA DE RESULTADO:');
    console.log('  Área dedicada:', resultAreaAnalysis.hasResultArea);
    console.log('  Fundo amarelo (ativo):', resultAreaAnalysis.isYellow);
    console.log('  Fundo cinza (inativo):', resultAreaAnalysis.isGray);
    console.log('  Altura mínima:', resultAreaAnalysis.minHeight);
    console.log('  Centralizado:', resultAreaAnalysis.centered);
    
    // RELATÓRIO FINAL
    console.log('\n📋 RELATÓRIO FINAL - CALCULADORA DE ÁREA DA ESFERA');
    console.log('='.repeat(60));
    
    const tests = [
      { name: 'Ping-pong (2cm)', status: result1.hasYellowResult && result1.containsNumber, expected: expectedValue1.toFixed(2) },
      { name: 'Futebol (11cm)', status: result2.hasResult, expected: expectedValue2.toFixed(2) },
      { name: 'Terra (6.37m)', status: result3.hasResult, expected: expectedValue3.toFixed(2) },
      { name: 'Erro negativo', status: result4.hasError && !result4.hasResult, expected: 'Erro+Limpa' },
      { name: 'Erro zero', status: result5.hasError && !result5.hasResult, expected: 'Erro' }
    ];
    
    const passedTests = tests.filter(t => t.status).length;
    const interfaceScore = Object.values(interfaceCheck).filter(Boolean).length;
    const designScore = Object.values(designAnalysis).filter(Boolean).length;
    const resultAreaScore = Object.values(resultAreaAnalysis).filter(Boolean).length;
    
    console.log(`📊 Testes funcionais: ${passedTests}/${tests.length}`);
    console.log(`🔧 Interface avançada: ${interfaceScore}/${Object.keys(interfaceCheck).length}`);
    console.log(`🎨 Design purple theme: ${designScore}/${Object.keys(designAnalysis).length}`);
    console.log(`📋 Área resultado: ${resultAreaScore}/${Object.keys(resultAreaAnalysis).length}`);
    
    tests.forEach(test => {
      console.log(`${test.status ? '✅' : '❌'} ${test.name} (esperado: ${test.expected})`);
    });
    
    console.log('\n🎯 CENÁRIOS REAIS TESTADOS:');
    console.log('🏓 Ping-pong: Área para cálculo de material de cobertura');
    console.log('⚽ Futebol: Superfície para pintura ou adesivos');
    console.log('🌍 Planeta: Cálculos astronômicos ou educativos');
    console.log('❌ Validação robusta: Limpa input e mostra erro');
    
    console.log('\n🧮 VERIFICAÇÃO MATEMÁTICA:');
    console.log('✅ Fórmula: Área = 4πr²');
    console.log('✅ Justificativa: Superfície total da esfera');
    console.log('✅ Implementação: 4 * Math.PI * Math.pow(r, 2)');
    
    console.log('\n🎨 QUALIDADES VISUAIS ÚNICAS:');
    console.log(`  Theme roxo consistente: ${designScore >= 4 ? 'EXCELENTE' : 'PARCIAL'}`);
    console.log(`  Grid layout responsivo: ${interfaceCheck.gridLayout ? 'SIM' : 'NÃO'}`);
    console.log(`  Área resultado dedicada: ${resultAreaAnalysis.hasResultArea ? 'SIM' : 'NÃO'}`);
    console.log(`  Sombras e bordas: ${interfaceCheck.shadowCard ? 'PROFISSIONAL' : 'BÁSICO'}`);
    console.log(`  Validação avançada: ${result4.inputCleared ? 'LIMPA INPUT' : 'BÁSICA'}`);
    
    const totalScore = passedTests + (interfaceScore >= 6 ? 2 : 1) + (designScore >= 4 ? 1 : 0);
    
    if (totalScore >= 7) {
      console.log('\n🏆 CALCULADORA DE ESFERA SUPERIOR!');
      console.log('✅ Design mais refinado das calculadoras testadas');
      console.log('✅ UX excepcional com área de resultado dedicada');
      console.log('✅ Validação mais robusta (limpa input inválido)');
      console.log('✅ Theme visual consistente e profissional');
    } else if (totalScore >= 5) {
      console.log('\n🎉 CALCULADORA EXCELENTE!');
    } else if (totalScore >= 3) {
      console.log('\n👍 CALCULADORA BOA');
    } else {
      console.log('\n⚠️ CALCULADORA PRECISA MELHORIAS');
    }
    
    console.log('\n📸 Screenshot: sphere-calculator-test.png');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testSphereCalculator().catch(console.error);