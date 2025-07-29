const puppeteer = require('puppeteer');

async function cubeFinalCheck() {
  console.log('🎲 VERIFICAÇÃO FINAL - CALCULADORA ÁREA DO CUBO');
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
    
    await page.goto('http://localhost:3000/pt-BR/calculator/area-cubo', {
      waitUntil: 'networkidle0',
      timeout: 20000
    });
    
    await page.waitForSelector('input[id="edge"]', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verificação final da interface
    const finalCheck = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      const rect = document.querySelector('svg rect');
      const paths = Array.from(document.querySelectorAll('svg path'));
      const texts = Array.from(document.querySelectorAll('svg text'));
      const button = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.innerText.includes('CubeAreaCalculator') || 
        btn.className.includes('purple')
      );
      
      return {
        svgExists: !!svg,
        svgDimensions: svg ? { 
          width: svg.getAttribute('width'), 
          height: svg.getAttribute('height'),
          viewBox: svg.getAttribute('viewBox')
        } : null,
        frontFace: !!rect,
        facesCount: paths.length,
        edgeLabels: texts.map(t => t.textContent),
        buttonExists: !!button,
        buttonText: button ? button.innerText : 'N/A',
        inputExists: !!document.querySelector('input[id="edge"]')
      };
    });
    
    console.log('📊 VERIFICAÇÃO COMPLETA:');
    console.log('✅ SVG existe:', finalCheck.svgExists);
    console.log('📐 Dimensões SVG:', finalCheck.svgDimensions);
    console.log('🎲 Face frontal:', finalCheck.frontFace);
    console.log('📦 Número de faces:', finalCheck.facesCount);
    console.log('🏷️ Labels das arestas:', finalCheck.edgeLabels);
    console.log('🔘 Botão existe:', finalCheck.buttonExists);
    console.log('📝 Input aresta:', finalCheck.inputExists);
    
    // Teste simples de funcionalidade
    console.log('\n🧪 TESTE FUNCIONAL SIMPLES:');
    
    const testResult = await page.evaluate(() => {
      const edgeInput = document.querySelector('input[id="edge"]');
      if (edgeInput) {
        edgeInput.value = '5';
        edgeInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Tentar diferentes seletores para o botão
        const possibleButtons = [
          ...Array.from(document.querySelectorAll('button')).filter(btn => 
            btn.className.includes('purple') || 
            btn.innerText.includes('Calcular') ||
            btn.innerText.includes('Calculate')
          )
        ];
        
        if (possibleButtons.length > 0) {
          possibleButtons[0].click();
          return {
            inputSet: true,
            inputValue: edgeInput.value,
            buttonClicked: true,
            buttonText: possibleButtons[0].innerText
          };
        }
        
        return { inputSet: true, inputValue: edgeInput.value, buttonClicked: false };
      }
      
      return { inputSet: false };
    });
    
    console.log('🔄 Ação executada:', testResult);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar resultado
    const resultCheck = await page.evaluate(() => {
      const yellowDiv = document.querySelector('.bg-yellow-100');
      const allDivs = Array.from(document.querySelectorAll('div')).filter(div => 
        div.innerText && /\d+\.\d+/.test(div.innerText)
      );
      
      return {
        hasYellowDiv: !!yellowDiv,
        yellowDivText: yellowDiv ? yellowDiv.innerText : '',
        numericDivs: allDivs.length,
        numericTexts: allDivs.map(div => div.innerText.substring(0, 50))
      };
    });
    
    console.log('📊 Verificação resultado:', resultCheck);
    
    // Screenshot final
    await page.screenshot({ path: 'cube-final-check.png', fullPage: true });
    
    // Cálculo esperado
    const expectedValue = 6 * Math.pow(5, 2); // 6 × 5² = 150
    console.log('🧮 Valor esperado para aresta=5:', expectedValue);
    
    console.log('\n📋 RESUMO FINAL:');
    
    const scores = {
      interface: finalCheck.inputExists && finalCheck.buttonExists ? 1 : 0,
      svg3d: finalCheck.svgExists && finalCheck.frontFace && finalCheck.facesCount >= 2 ? 1 : 0,
      labels: finalCheck.edgeLabels.length >= 3 ? 1 : 0,
      interaction: testResult.buttonClicked ? 1 : 0,
      results: resultCheck.hasYellowDiv || resultCheck.numericDivs > 0 ? 1 : 0
    };
    
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    
    console.log(`🏆 Pontuação final: ${totalScore}/5`);
    console.log('✅ Interface básica:', scores.interface === 1 ? 'OK' : 'FALHA');
    console.log('✅ SVG 3D:', scores.svg3d === 1 ? 'OK' : 'FALHA');
    console.log('✅ Labels educativos:', scores.labels === 1 ? 'OK' : 'FALHA');
    console.log('✅ Interação:', scores.interaction === 1 ? 'OK' : 'FALHA');
    console.log('✅ Resultados:', scores.results === 1 ? 'OK' : 'FALHA');
    
    if (totalScore >= 4) {
      console.log('\n🎉 CALCULADORA DE CUBO EXCELENTE!');
    } else if (totalScore >= 3) {
      console.log('\n👍 CALCULADORA BOA');
    } else {
      console.log('\n⚠️ CALCULADORA PRECISA MELHORIAS');
    }
    
    console.log('\n📸 Screenshot: cube-final-check.png');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

cubeFinalCheck().catch(console.error);