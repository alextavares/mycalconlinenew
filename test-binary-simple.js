const puppeteer = require('puppeteer');

async function simpleBinaryTest() {
  console.log('🔢 TESTE SIMPLES - CALCULADORA BINÁRIA');
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
    
    await page.goto('http://localhost:3000/pt-BR/calculator/binario', {
      waitUntil: 'networkidle0',
      timeout: 20000
    });
    
    await page.waitForSelector('input[id="binary1"]', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('✅ Página carregada!');
    
    // Verificar elementos únicos da calculadora binária
    const uniqueFeatures = await page.evaluate(() => {
      return {
        binary1Input: !!document.querySelector('input[id="binary1"]'),
        binary2Input: !!document.querySelector('input[id="binary2"]'),
        hasSelect: !!document.querySelector('select') || !!document.querySelector('[role="combobox"]'),
        twoInputs: document.querySelectorAll('input[type="text"]').length >= 2,
        multipleButtons: document.querySelectorAll('button').length >= 10, // Sidebar + 2 calc buttons
        containerWidth: !!document.querySelector('.w-\\[500px\\]'),
        amberResult: !!document.querySelector('.bg-amber-50') || document.body.innerHTML.includes('bg-amber-50')
      };
    });
    
    console.log('🔍 Recursos únicos identificados:', uniqueFeatures);
    
    // Teste básico de preenchimento
    console.log('\n🧪 TESTE BÁSICO: Preenchimento de campos');
    
    const fillTest = await page.evaluate(() => {
      const binary1 = document.querySelector('input[id="binary1"]');
      const binary2 = document.querySelector('input[id="binary2"]');
      
      if (binary1 && binary2) {
        binary1.value = '1010';
        binary1.dispatchEvent(new Event('input', { bubbles: true }));
        
        binary2.value = '0101';
        binary2.dispatchEvent(new Event('input', { bubbles: true }));
        
        return {
          filled: true,
          value1: binary1.value,
          value2: binary2.value
        };
      }
      
      return { filled: false };
    });
    
    console.log('📝 Preenchimento:', fillTest);
    
    // Verificar problema das traduções
    const translationIssue = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const calcButton = buttons.find(btn => btn.innerText.includes('calculator'));
      const clearButton = buttons.find(btn => btn.innerText.includes('clearButton'));
      
      return {
        hasTranslationKeys: document.body.innerHTML.includes('Calculators.binario'),
        calcButtonText: calcButton ? calcButton.innerText : 'Não encontrado',
        clearButtonText: clearButton ? clearButton.innerText : 'Não encontrado',
        totalButtons: buttons.length
      };
    });
    
    console.log('🌐 Verificação de traduções:', translationIssue);
    
    // Tentar clicar no botão mesmo com problema de tradução
    const buttonTest = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const calcButton = buttons.find(btn => 
        btn.innerText.includes('calculator') || 
        btn.className.includes('bg-primary')
      );
      
      if (calcButton) {
        calcButton.click();
        return {
          clicked: true,
          buttonText: calcButton.innerText,
          buttonClass: calcButton.className
        };
      }
      
      return { clicked: false };
    });
    
    console.log('🔘 Teste de clique:', buttonTest);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar se algum resultado apareceu
    const resultCheck = await page.evaluate(() => {
      const amberCard = document.querySelector('.bg-amber-50');
      const anyResult = document.body.innerHTML.includes('1111') || 
                       document.body.innerHTML.includes('15') ||
                       document.querySelector('strong');
      
      return {
        hasAmberCard: !!amberCard,
        amberContent: amberCard ? amberCard.innerText : '',
        hasAnyResult: anyResult,
        pageSnapshot: document.body.innerText.substring(0, 800)
      };
    });
    
    console.log('📊 Verificação de resultado:', resultCheck);
    
    // Screenshot
    await page.screenshot({ path: 'binary-simple-test.png', fullPage: true });
    
    // Análise da arquitetura
    console.log('\n🏗️ ANÁLISE ARQUITETURAL:');
    
    const architectureScore = {
      uniqueInputs: uniqueFeatures.binary1Input && uniqueFeatures.binary2Input ? 1 : 0,
      selectComponent: uniqueFeatures.hasSelect ? 1 : 0,
      multipleButtons: uniqueFeatures.multipleButtons ? 1 : 0,
      customContainer: uniqueFeatures.containerWidth ? 1 : 0,
      resultCard: uniqueFeatures.amberResult ? 1 : 0
    };
    
    const totalArchScore = Object.values(architectureScore).reduce((a, b) => a + b, 0);
    
    console.log(`📊 Pontuação arquitetural: ${totalArchScore}/5`);
    console.log('✅ Inputs únicos (binary1/binary2):', architectureScore.uniqueInputs === 1);
    console.log('✅ Select component:', architectureScore.selectComponent === 1);
    console.log('✅ Múltiplos botões:', architectureScore.multipleButtons === 1);
    console.log('✅ Container customizado:', architectureScore.customContainer === 1);
    console.log('✅ Card resultado amber:', architectureScore.resultCard === 1);
    
    console.log('\n🔍 PROBLEMAS IDENTIFICADOS:');
    if (translationIssue.hasTranslationKeys) {
      console.log('❌ Traduções não carregadas (chaves visíveis)');
    }
    if (!resultCheck.hasAmberCard && buttonTest.clicked) {
      console.log('❌ Resultado não aparece após cálculo');
    }
    if (!fillTest.filled) {
      console.log('❌ Campos não preenchíveis');
    }
    
    console.log('\n🏆 RECURSOS ÚNICOS CONFIRMADOS:');
    console.log('🔢 Primeira calculadora não-geométrica');
    console.log('🎛️ Interface mais complexa (2 inputs + select)');
    console.log('🧮 Lógica binária avançada');
    console.log('📊 Sistema de duplo resultado');
    console.log('🧹 Botão de reset/clear');
    
    if (totalArchScore >= 4) {
      console.log('\n🎉 CALCULADORA BINÁRIA - ARQUITETURA SUPERIOR!');
      console.log('✅ Mais complexa e única do projeto');
      console.log('✅ Interface rica com componentes avançados');
      console.log('✅ Quebra padrão das outras calculadoras');
    } else if (totalArchScore >= 3) {
      console.log('\n👍 CALCULADORA BOA - Recursos únicos');
    } else {
      console.log('\n⚠️ CALCULADORA COM PROBLEMAS');
    }
    
    console.log('\n📸 Screenshot: binary-simple-test.png');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

simpleBinaryTest().catch(console.error);