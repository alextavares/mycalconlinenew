const puppeteer = require('puppeteer');

async function testFirstCalculator() {
  console.log('🚀 Iniciando teste da primeira calculadora...');
  
  const browser = await puppeteer.launch({
    headless: false, // Para ver o navegador
    defaultViewport: { width: 1280, height: 800 }
  });
  
  const page = await browser.newPage();
  
  try {
    // Navegar para a página principal
    console.log('📍 Navegando para http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Tirar screenshot da página principal
    await page.screenshot({ path: 'homepage.png' });
    console.log('📸 Screenshot da homepage salvo!');
    
    // Encontrar a primeira calculadora (de cima para baixo)
    console.log('🔍 Procurando primeira calculadora...');
    
    // Esperar os cards carregarem
    await page.waitForSelector('.calculator-card', { timeout: 5000 });
    
    // Clicar no primeiro botão de calculadora
    const firstButton = await page.$('.calculator-card:first-child .calculator-button');
    if (firstButton) {
      console.log('🖱️ Clicando na primeira calculadora...');
      await firstButton.click();
      
      // Esperar a navegação
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Tirar screenshot da calculadora
      const url = page.url();
      console.log(`✅ Navegou para: ${url}`);
      await page.screenshot({ path: 'first-calculator.png' });
      console.log('📸 Screenshot da calculadora salvo!');
      
      // Testar a calculadora (exemplo genérico)
      const input = await page.$('input[type="number"], input[type="text"]');
      if (input) {
        console.log('📝 Preenchendo input...');
        await input.type('10');
        
        // Procurar botão de calcular
        const calcButton = await page.$('button:contains("Calcular"), button:contains("Calculate")');
        if (calcButton) {
          console.log('🧮 Clicando em calcular...');
          await calcButton.click();
          
          // Esperar resultado
          await page.waitForTimeout(1000);
          
          // Screenshot do resultado
          await page.screenshot({ path: 'calculator-result.png' });
          console.log('📸 Screenshot do resultado salvo!');
        }
      }
    }
    
    console.log('✅ Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await browser.close();
  }
}

// Executar o teste
testFirstCalculator();