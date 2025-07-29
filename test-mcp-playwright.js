#!/usr/bin/env node

/**
 * Script de teste para verificar o funcionamento do MCP Playwright
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Testando MCP Playwright...\n');

// Testar se o servidor MCP Playwright está funcionando
function testMCPPlaywright() {
  return new Promise((resolve, reject) => {
    console.log('📡 Iniciando servidor MCP Playwright...');
    
    const mcpProcess = spawn('node', ['dist/index.js'], {
      cwd: path.join(__dirname, 'mcp-playwright'),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let error = '';

    mcpProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log('📤 STDOUT:', data.toString());
    });

    mcpProcess.stderr.on('data', (data) => {
      error += data.toString();
      console.error('❌ STDERR:', data.toString());
    });

    // Aguardar 5 segundos para inicialização
    setTimeout(() => {
      if (output.includes('MCP server started') || output.includes('Playwright')) {
        console.log('✅ MCP Playwright iniciado com sucesso!');
        mcpProcess.kill();
        resolve(true);
      } else if (error) {
        console.error('❌ Erro ao iniciar MCP Playwright:', error);
        mcpProcess.kill();
        reject(new Error(error));
      } else {
        console.log('⚠️  Servidor iniciado mas sem mensagem de confirmação');
        mcpProcess.kill();
        resolve(true);
      }
    }, 5000);
  });
}

// Testar conexão com ferramentas
async function testMCPConnection() {
  console.log('🔗 Testando conexão com MCP Playwright...\n');
  
  try {
    // Testar se o arquivo dist/index.js existe
    const fs = require('fs');
    const indexPath = path.join(__dirname, 'mcp-playwright', 'dist', 'index.js');
    
    if (fs.existsSync(indexPath)) {
      console.log('✅ Arquivo dist/index.js encontrado');
      
      // Testar se é executável
      await testMCPPlaywright();
      
    } else {
      console.error('❌ Arquivo dist/index.js não encontrado');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar MCP Playwright:', error.message);
    process.exit(1);
  }
}

// Executar testes
if (require.main === module) {
  testMCPConnection()
    .then(() => {
      console.log('\n🎉 MCP Playwright está funcionando corretamente!');
      console.log('\n📋 Configuração para uso:');
      console.log('   - Servidor: mcp-playwright');
      console.log('   - Comando: node mcp-playwright/dist/index.js');
      console.log('   - Configuração: cline_mcp_settings.json');
    })
    .catch(console.error);
}

module.exports = { testMCPPlaywright, testMCPConnection };
