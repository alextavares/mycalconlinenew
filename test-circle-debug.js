const puppeteer = require('puppeteer');

async function debugCircleCalculator() {
  console.log('🔍 DEBUG - CALCULADORA DE ÁREA DO CÍRCULO');
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
    await page.goto('http://localhost:3000/pt-BR/calculator/area-circulo', {
      waitUntil: 'networkidle0',
      timeout: 20000
    });
    
    await page.waitForSelector('input[id="radius"]', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Análise detalhada da página
    const pageAnalysis = await page.evaluate(() => {
      const radiusInput = document.querySelector('input[id="radius"]');
      const button = document.querySelector('button');
      const allDivs = Array.from(document.querySelectorAll('div')).map(div => ({
        className: div.className,
        id: div.id,
        hasText: !!div.innerText.trim(),
        text: div.innerText.trim().substring(0, 50)
      }));
      
      return {
        inputExists: !!radiusInput,
        inputId: radiusInput ? radiusInput.id : null,
        buttonExists: !!button,
        buttonText: button ? button.innerText : null,
        pageTitle: document.title,
        bodyText: document.body.innerText.substring(0, 500),
        allDivs: allDivs.filter(div => div.hasText).slice(0, 10)
      };
    });
    
    console.log('🔍 Análise da página:');
    console.log('  Input existe:', pageAnalysis.inputExists);
    console.log('  Button existe:', pageAnalysis.buttonExists);
    console.log('  Texto do botão:', pageAnalysis.buttonText);
    console.log('  Título da página:', pageAnalysis.pageTitle);
    
    // Teste simples
    console.log('\n🧪 TESTE SIMPLES: Raio = 10');
    
    // Inserir valor e clicar
    const testResult = await page.evaluate(() => {
      const radiusInput = document.querySelector('input[id="radius"]');
      const button = document.querySelector('button');
      
      if (radiusInput && button) {
        // Inserir valor
        radiusInput.value = '10';
        radiusInput.dispatchEvent(new Event('input', { bubbles: true }));
        radiusInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Clicar botão
        button.click();
        
        // Aguardar um pouco e verificar resultado
        setTimeout(() => {
          const resultDiv = document.querySelector('.bg-yellow-100');
          return {
            success: true,
            inputValue: radiusInput.value,
            resultExists: !!resultDiv,
            resultText: resultDiv ? resultDiv.innerText : 'Sem resultado'
          };
        }, 1000);
        
        return {
          clicked: true,
          inputValue: radiusInput.value
        };
      }
      return { clicked: false };
    });
    
    console.log('📝 Ação executada:', testResult);
    
    // Aguardar processamento
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar resultado após aguardar
    const finalResult = await page.evaluate(() => {
      const resultDiv = document.querySelector('.bg-yellow-100');
      const allYellowElements = Array.from(document.querySelectorAll('[class*="yellow"]'));
      const allResultElements = Array.from(document.querySelectorAll('div')).filter(div => 
        div.innerText && (/\d+\.\d+/.test(div.innerText) || /result/i.test(div.className))
      );
      
      return {
        resultDiv: !!resultDiv,
        resultText: resultDiv ? resultDiv.innerText : '',
        yellowElements: allYellowElements.length,
        yellowTexts: allYellowElements.map(el => el.innerText.substring(0, 50)),
        possibleResults: allResultElements.map(el => ({
          className: el.className,
          text: el.innerText.substring(0, 100)
        })),
        pageSnapshot: document.body.innerText.substring(0, 1000)
      };
    });
    
    console.log('\n📊 RESULTADO FINAL:');
    console.log('  Div resultado encontrada:', finalResult.resultDiv);
    console.log('  Texto do resultado:', finalResult.resultText);
    console.log('  Elementos amarelos:', finalResult.yellowElements);
    if (finalResult.yellowTexts.length > 0) {
      console.log('  Textos amarelos:', finalResult.yellowTexts);
    }
    if (finalResult.possibleResults.length > 0) {
      console.log('  Possíveis resultados:', finalResult.possibleResults.slice(0, 3));
    }
    
    // Calcular valor esperado
    const expectedValue = Math.PI * Math.pow(10, 2); // π × 10² ≈ 314.16
    console.log('  Valor esperado:', expectedValue.toFixed(2));
    
    // Screenshot para análise visual
    await page.screenshot({ path: 'circle-debug.png', fullPage: true });
    
    // Teste de interatividade manual
    console.log('\n🔧 TESTE DE INTERATIVIDADE:');
    
    const interactivityTest = await page.evaluate(() => {
      const radiusInput = document.querySelector('input[id="radius"]');
      const button = document.querySelector('button');
      
      if (!radiusInput || !button) {
        return { success: false, error: 'Elementos não encontrados' };
      }
      
      // Tentar diferentes valores
      const testValues = ['5', '2.5', '100'];
      const results = [];
      
      for (const value of testValues) {
        radiusInput.value = value;
        radiusInput.dispatchEvent(new Event('input', { bubbles: true }));
        button.click();
        
        // Verificar se algo mudou na página
        const resultDiv = document.querySelector('.bg-yellow-100');
        results.push({
          value: value,
          hasResult: !!resultDiv,
          resultText: resultDiv ? resultDiv.innerText : 'Sem resultado'
        });
      }
      
      return { success: true, results: results };
    });
    
    console.log('  Teste múltiplos valores:', interactivityTest);
    
    // Conclusão do debug
    console.log('\n📋 CONCLUSÃO DO DEBUG:');
    
    if (finalResult.resultDiv && finalResult.resultText) {
      console.log('✅ Calculadora funciona - resultado encontrado');
    } else if (finalResult.yellowElements > 0) {
      console.log('⚠️ Elementos amarelos existem mas resultado não detectado');
    } else {
      console.log('❌ Calculadora não está retornando resultados visíveis');
      console.log('🔍 Snapshot da página:');
      console.log(finalResult.pageSnapshot);
    }
    
    console.log('\n📸 Screenshot de debug salvo: circle-debug.png');
    
  } catch (error) {
    console.error('❌ Erro no debug:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

debugCircleCalculator().catch(console.error);