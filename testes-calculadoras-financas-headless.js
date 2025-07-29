const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class TesteCalculadorasFinancasHeadless {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.resultados = {
      total: 0,
      passou: 0,
      falhou: 0,
      erros: []
    };
  }

  async iniciar() {
    console.log('🚀 Iniciando testes das calculadoras financeiras (headless)...');
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async testarJurosSimples() {
    console.log('\n📊 Testando Calculadora de Juros Simples...');
    await this.page.goto('http://localhost:3001/pt-BR/calculator/juros-simples');
    
    try {
      // Teste 1: Cálculo básico
      await this.page.fill('input[placeholder="1000"]', '5000');
      await this.page.fill('input[placeholder="5.5"]', '10');
      await this.page.fill('input[placeholder="3"]', '2');
      
      await this.page.click('button[type="submit"]');
      await this.page.waitForTimeout(2000);
      
      const jurosTexto = await this.page.textContent('text=💰 Juros gerados:');
      const capitalTexto = await this.page.textContent('text=🎯 Capital final:');
      
      const juros = parseFloat(jurosTexto.match(/R\$ ([\d,]+(?:\.\d{2})?)/)[1].replace(',', ''));
      const capitalFinal = parseFloat(capitalTexto.match(/R\$ ([\d,]+(?:\.\d{2})?)/)[1].replace(',', ''));
      
      const jurosEsperado = 5000 * 0.10 * 2; // 1000
      const capitalEsperado = 5000 + 1000; // 6000
      
      if (Math.abs(juros - jurosEsperado) < 0.01 && Math.abs(capitalFinal - capitalEsperado) < 0.01) {
        console.log('✅ Teste 1 - Juros Simples: PASSOU');
        this.resultados.passou++;
      } else {
        console.log('❌ Teste 1 - Juros Simples: FALHOU');
        this.resultados.erros.push({
          calculadora: 'Juros Simples',
          teste: 'Cálculo básico',
          esperado: `Juros: ${jurosEsperado}, Capital: ${capitalEsperado}`,
          obtido: `Juros: ${juros}, Capital: ${capitalFinal}`
        });
        this.resultados.falhou++;
      }
      
      this.resultados.total++;
      
    } catch (error) {
      console.log('❌ Erro no teste de Juros Simples:', error.message);
      this.resultados.erros.push({
        calculadora: 'Juros Simples',
        erro: error.message
      });
      this.resultados.falhou++;
      this.resultados.total++;
    }
  }

  async testarJurosCompostos() {
    console.log('\n💰 Testando Calculadora de Juros Compostos...');
    await this.page.goto('http://localhost:3001/pt-BR/calculator/juros-compostos');
    
    try {
      // Teste 1: Investimento inicial apenas
      await this.page.fill('input[type="number"]', '1000'); // initialInvestment
      await this.page.fill('input[type="number"] >> nth=1', '0'); // monthlyContribution
      await this.page.fill('input[type="number"] >> nth=2', '5'); // years
      await this.page.fill('input[type="number"] >> nth=3', '10'); // interestRate
      
      await this.page.click('button:has-text("Calcular")');
      await this.page.waitForTimeout(2000);
      
      const valorFuturoTexto = await this.page.textContent('text=Valor Futuro:');
      const valorFuturo = parseFloat(valorFuturoTexto.match(/R\$ ([\d,]+(?:\.\d{2})?)/)[1].replace(',', ''));
      
      // Fórmula: VF = P(1 + r)^t
      const valorEsperado = 1000 * Math.pow(1 + 0.10, 5); // ~1610.51
      
      if (Math.abs(valorFuturo - valorEsperado) < 1) {
        console.log('✅ Teste 1 - Juros Compostos: PASSOU');
        this.resultados.passou++;
      } else {
        console.log('❌ Teste 1 - Juros Compostos: FALHOU');
        this.resultados.erros.push({
          calculadora: 'Juros Compostos',
          teste: 'Investimento inicial',
          esperado: valorEsperado.toFixed(2),
          obtido: valorFuturo.toFixed(2)
        });
        this.resultados.falhou++;
      }
      
      this.resultados.total++;
      
    } catch (error) {
      console.log('❌ Erro no teste de Juros Compostos:', error.message);
      this.resultados.erros.push({
        calculadora: 'Juros Compostos',
        erro: error.message
      });
      this.resultados.falhou++;
      this.resultados.total++;
    }
  }

  async testarPorcentagem() {
    console.log('\n📈 Testando Calculadora de Porcentagem...');
    await this.page.goto('http://localhost:3001/pt-BR/calculator/porcentagem');
    
    try {
      // Teste 1: 20% de 500
      await this.page.fill('input[placeholder="Ex: 20"]', '20');
      await this.page.fill('input[placeholder="Ex: 500"]', '500');
      
      await this.page.click('button:has-text("Calcular")');
      await this.page.waitForTimeout(1000);
      
      const resultadoTexto = await this.page.textContent('text=/Resultado:/');
      const resultado = parseFloat(resultadoTexto.match(/Resultado: ([\d,]+(?:\.\d{2})?)/)[1].replace(',', ''));
      
      const esperado = 20 * 500 / 100; // 100
      
      if (Math.abs(resultado - esperado) < 0.01) {
        console.log('✅ Teste 1 - Porcentagem: PASSOU');
        this.resultados.passou++;
      } else {
        console.log('❌ Teste 1 - Porcentagem: FALHOU');
        this.resultados.erros.push({
          calculadora: 'Porcentagem',
          teste: 'Cálculo básico',
          esperado: esperado.toString(),
          obtido: resultado.toString()
        });
        this.resultados.falhou++;
      }
      
      this.resultados.total++;
      
    } catch (error) {
      console.log('❌ Erro no teste de Porcentagem:', error.message);
      this.resultados.erros.push({
        calculadora: 'Porcentagem',
        erro: error.message
      });
      this.resultados.falhou++;
      this.resultados.total++;
    }
  }

  async testarGastoGasolina() {
    console.log('\n⛽ Testando Calculadora de Gasto de Gasolina...');
    await this.page.goto('http://localhost:3001/pt-BR/calculator/gasto-gasolina');
    
    try {
      // Teste 1: Cálculo básico
      await this.page.fill('input[placeholder="0.0"] >> nth=0', '300'); // distância
      await this.page.fill('input[placeholder="0.0"] >> nth=1', '12'); // eficiência
      await this.page.fill('input[placeholder="0.0"] >> nth=2', '5.50'); // preço
      
      await this.page.click('button:has-text("Calcular")');
      await this.page.waitForTimeout(1000);
      
      const resultadoTexto = await this.page.textContent('text=/Custo total:/');
      const resultado = parseFloat(resultadoTexto.match(/([\d,]+(?:\.\d{2})?)/)[1].replace(',', ''));
      
      const esperado = (300 / 12) * 5.50; // 137.50
      
      if (Math.abs(resultado - esperado) < 0.01) {
        console.log('✅ Teste 1 - Gasto Gasolina: PASSOU');
        this.resultados.passou++;
      } else {
        console.log('❌ Teste 1 - Gasto Gasolina: FALHOU');
        this.resultados.erros.push({
          calculadora: 'Gasto Gasolina',
          teste: 'Cálculo básico',
          esperado: esperado.toFixed(2),
          obtido: resultado.toFixed(2)
        });
        this.resultados.falhou++;
      }
      
      this.resultados.total++;
      
    } catch (error) {
      console.log('❌ Erro no teste de Gasto Gasolina:', error.message);
      this.resultados.erros.push({
        calculadora: 'Gasto Gasolina',
        erro: error.message
      });
      this.resultados.falhou++;
      this.resultados.total++;
    }
  }

  async executarTodosTestes() {
    try {
      await this.iniciar();
      
      // Aguardar servidor iniciar
      console.log('⏳ Aguardando servidor iniciar...');
      await this.page.waitForTimeout(5000);
      
      await this.testarJurosSimples();
      await this.testarJurosCompostos();
      await this.testarPorcentagem();
      await this.testarGastoGasolina();
      
      this.gerarRelatorio();
      
    } catch (error) {
      console.error('Erro durante os testes:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  gerarRelatorio() {
    console.log('\n📊 RELATÓRIO DE TESTES DAS CALCULADORAS FINANCEIRAS');
    console.log('================================================');
    console.log(`Total de testes: ${this.resultados.total}`);
    console.log(`✅ Testes passaram: ${this.resultados.passou}`);
    console.log(`❌ Testes falharam: ${this.resultados.falhou}`);
    console.log(`Taxa de sucesso: ${((this.resultados.passou / this.resultados.total) * 100).toFixed(1)}%`);
    
    if (this.resultados.erros.length > 0) {
      console.log('\n🚨 ERROS ENCONTRADOS:');
      this.resultados.erros.forEach((erro, index) => {
        console.log(`\n${index + 1}. ${erro.calculadora}`);
        if (erro.teste) console.log(`   Teste: ${erro.teste}`);
        if (erro.esperado) console.log(`   Esperado: ${erro.esperado}`);
        if (erro.obtido) console.log(`   Obtido: ${erro.obtido}`);
        if (erro.erro) console.log(`   Erro: ${erro.erro}`);
      });
      
      // Salvar relatório em arquivo
      const relatorioPath = path.join(process.cwd(), 'relatorio-testes-financas.json');
      fs.writeFileSync(relatorioPath, JSON.stringify(this.resultados, null, 2));
      console.log(`\n📄 Relatório detalhado salvo em: ${relatorioPath}`);
    } else {
      console.log('\n🎉 Todos os testes passaram com sucesso!');
    }
  }
}

// Executar os testes
if (require.main === module) {
  const testes = new TesteCalculadorasFinancasHeadless();
  testes.executarTodosTestes();
}

module.exports = TesteCalculadorasFinancasHeadless;
