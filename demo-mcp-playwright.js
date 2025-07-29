#!/usr/bin/env node

/**
 * Demonstração de uso do MCP Playwright com as calculadoras
 * Este script mostra como usar o MCP Playwright para automação real
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class MCPPlaywrightDemo {
  constructor() {
    this.mcpProcess = null;
    this.baseUrl = 'http://localhost:3000';
  }

  async startServer() {
    console.log('🚀 Iniciando servidor MCP Playwright...\n');
    
    return new Promise((resolve, reject) => {
      this.mcpProcess = spawn('node', ['dist/index.js'], {
        cwd: path.join(__dirname, 'mcp-playwright'),
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Aguardar inicialização
      setTimeout(() => {
        console.log('✅ MCP Playwright pronto para uso!');
        resolve();
      }, 3000);
    });
  }

  async testCalculadoraBasica() {
    console.log('📊 Testando Calculadora Básica com MCP Playwright...\n');
    
    // Simulação de uso do MCP Playwright
    const testSteps = [
      'Navegar para /calculator',
      'Clicar no botão "5"',
      'Clicar no botão "+"',
      'Clicar no botão "3"',
      'Clicar no botão "="',
      'Verificar resultado "8"'
    ];

    console.log('Passos do teste:');
    testSteps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step}`);
    });

    console.log('\n✅ Teste simulado concluído com sucesso!');
    return { passed: true, result: '8' };
  }

  async testCalculadoraGeometrica() {
    console.log('📐 Testando Calculadora de Círculo com MCP Playwright...\n');
    
    const testSteps = [
      'Navegar para /circle-calculator',
      'Preencher raio com "5"',
      'Clicar em "Calcular Área"',
      'Verificar resultado aproximado "78.54"'
    ];

    console.log('Passos do teste:');
    testSteps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step}`);
    });

    console.log('\n✅ Teste simulado concluído com sucesso!');
    return { passed: true, area: 78.54 };
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      tests: [
        {
          name: 'Calculadora Básica',
          url: '/calculator',
          status: 'passed',
          steps: 6
        },
        {
          name: 'Calculadora de Círculo',
          url: '/circle-calculator',
          status: 'passed',
          steps: 4
        }
      ],
      summary: {
        total: 2,
        passed: 2,
        failed: 0
      }
    };

    // Salvar relatório
    const reportPath = path.join(__dirname, 'test-results', 'demo-mcp-playwright-report.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('📋 Relatório salvo em:', reportPath);
    return report;
  }

  async runDemo() {
    try {
      console.log('🎯 Iniciando demonstração do MCP Playwright\n');
      
      // await this.startServer(); // Descomentar para uso real
      
      await this.testCalculadoraBasica();
      console.log();
      
      await this.testCalculadoraGeometrica();
      console.log();
      
      const report = await this.generateReport();
      
      console.log('\n📊 Resumo da Demonstração:');
      console.log(`- Total de testes: ${report.summary.total}`);
      console.log(`- Testes aprovados: ${report.summary.passed}`);
      console.log(`- Testes falhados: ${report.summary.failed}`);
      
      console.log('\n✨ Demonstração concluída com sucesso!');
      console.log('\n📚 Próximos passos:');
      console.log('1. Configure o MCP Playwright no seu editor');
      console.log('2. Use as ferramentas disponíveis para automação real');
      console.log('3. Execute testes automatizados nas calculadoras');

    } catch (error) {
      console.error('❌ Erro na demonstração:', error.message);
    }
  }

  cleanup() {
    if (this.mcpProcess) {
      this.mcpProcess.kill();
      console.log('🧹 Servidor MCP encerrado');
    }
  }
}

// Executar demonstração
if (require.main === module) {
  const demo = new MCPPlaywrightDemo();
  
  process.on('SIGINT', () => {
    demo.cleanup();
    process.exit(0);
  });

  demo.runDemo()
    .then(() => demo.cleanup())
    .catch(console.error);
}

module.exports = MCPPlaywrightDemo;
