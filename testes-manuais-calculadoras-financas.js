const fs = require('fs');
const path = require('path');

class TesteManualCalculadorasFinancas {
  constructor() {
    this.resultados = {
      total: 0,
      passou: 0,
      falhou: 0,
      erros: [],
      calculadoras: {
        'juros-simples': {
          nome: 'Calculadora de Juros Simples',
          url: 'http://localhost:3001/pt-BR/calculator/juros-simples',
          testes: [
            {
              descricao: 'Cálculo básico de juros simples',
              entrada: { capital: 5000, taxa: 10, tempo: 2 },
              esperado: { juros: 1000, capitalFinal: 6000 }
            },
            {
              descricao: 'Cálculo com tempo em meses',
              entrada: { capital: 1000, taxa: 12, tempo: 6, periodo: 'Meses' },
              esperado: { juros: 60, capitalFinal: 1060 }
            }
          ]
        },
        'juros-compostos': {
          nome: 'Calculadora de Juros Compostos',
          url: 'http://localhost:3001/pt-BR/calculator/juros-compostos',
          testes: [
            {
              descricao: 'Investimento inicial apenas',
              entrada: { inicial: 1000, contribuicao: 0, anos: 5, taxa: 10 },
              esperado: { valorFuturo: 1610.51 }
            },
            {
              descricao: 'Com contribuição mensal',
              entrada: { inicial: 1000, contribuicao: 100, anos: 2, taxa: 8 },
              esperado: { valorFuturo: 3708.64 }
            }
          ]
        },
        'porcentagem': {
          nome: 'Calculadora de Porcentagem',
          url: 'http://localhost:3001/pt-BR/calculator/porcentagem',
          testes: [
            {
              descricao: 'Porcentagem básica',
              entrada: { percentual: 20, valor: 500 },
              esperado: { resultado: 100 }
            },
            {
              descricao: 'Porcentagem decimal',
              entrada: { percentual: 7.5, valor: 1000 },
              esperado: { resultado: 75 }
            }
          ]
        },
        'gasto-gasolina': {
          nome: 'Calculadora de Gasto de Gasolina',
          url: 'http://localhost:3001/pt-BR/calculator/gasto-gasolina',
          testes: [
            {
              descricao: 'Viagem simples',
              entrada: { distancia: 300, eficiencia: 12, preco: 5.50 },
              esperado: { custo: 137.50 }
            },
            {
              descricao: 'Viagem longa',
              entrada: { distancia: 1000, eficiencia: 15, preco: 6.20 },
              esperado: { custo: 413.33 }
            }
          ]
        },
        'currency-converter': {
          nome: 'Conversor de Moeda',
          url: 'http://localhost:3001/pt-BR/calculator/currency-converter',
          testes: [
            {
              descricao: 'Conversão USD para EUR',
              entrada: { valor: 100, de: 'USD', para: 'EUR' },
              esperado: { resultado: 'verificar taxa atual' }
            }
          ]
        }
      }
    };
  }

  executarTestesManuais() {
    console.log('📊 RELATÓRIO DE TESTES MANUAIS - CALCULADORAS FINANCEIRAS');
    console.log('========================================================');
    console.log('\n🎯 Calculadoras identificadas para teste:');
    
    Object.keys(this.resultados.calculadoras).forEach(key => {
      const calc = this.resultados.calculadoras[key];
      console.log(`\n📋 ${calc.nome}`);
      console.log(`   URL: ${calc.url}`);
      console.log(`   Testes: ${calc.testes.length}`);
      
      calc.testes.forEach((teste, index) => {
        console.log(`   ${index + 1}. ${teste.descricao}`);
        console.log(`      Entrada: ${JSON.stringify(teste.entrada)}`);
        console.log(`      Esperado: ${JSON.stringify(teste.esperado)}`);
      });
    });

    // Gerar arquivo HTML para testes manuais
    this.gerarHTMLTestes();
    
    // Gerar relatório JSON
    const relatorioPath = path.join(process.cwd(), 'relatorio-testes-manuais-financas.json');
    fs.writeFileSync(relatorioPath, JSON.stringify(this.resultados, null, 2));
    
    console.log(`\n📄 Relatório salvo em: ${relatorioPath}`);
    console.log('\n🚀 Para executar os testes:');
    console.log('1. Certifique-se que o servidor está rodando: npm run dev -- -p 3001');
    console.log('2. Abra o arquivo: testes-manuais-calculadoras-financas.html');
    console.log('3. Siga as instruções para cada calculadora');
  }

  gerarHTMLTestes() {
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Testes Manuais - Calculadoras Financeiras</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .calculadora {
            background: white;
            margin: 20px 0;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .teste {
            background: #f9f9f9;
            margin: 10px 0;
            padding: 15px;
            border-left: 4px solid #007bff;
            border-radius: 4px;
        }
        .entrada, .esperado {
            background: #e9ecef;
            padding: 10px;
            margin: 5px 0;
            border-radius: 4px;
            font-family: monospace;
        }
        .link {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
            margin: 10px 0;
        }
        .status {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            margin: 5px;
        }
        .status.pendente { background: #ffc107; color: #000; }
        .status.passou { background: #28a745; color: white; }
        .status.falhou { background: #dc3545; color: white; }
        .instrucoes {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>📊 Testes Manuais - Calculadoras Financeiras</h1>
    
    <div class="instrucoes">
        <h3>🎯 Instruções para Teste Manual</h3>
        <ol>
            <li>Certifique-se que o servidor está rodando: <code>npm run dev -- -p 3001</code></li>
            <li>Clique nos links abaixo para abrir cada calculadora</li>
            <li>Execute os testes conforme descrito</li>
            <li>Marque o status de cada teste</li>
            <li>Salve o relatório final</li>
        </ol>
    </div>

    <div id="calculadoras">
        ${Object.entries(this.resultados.calculadoras).map(([key, calc]) => `
            <div class="calculadora">
                <h2>${calc.nome}</h2>
                <a href="${calc.url}" target="_blank" class="link">Abrir Calculadora</a>
                
                ${calc.testes.map((teste, index) => `
                    <div class="teste">
                        <h3>Teste ${index + 1}: ${teste.descricao}</h3>
                        <div class="entrada"><strong>Entrada:</strong> ${JSON.stringify(teste.entrada, null, 2)}</div>
                        <div class="esperado"><strong>Esperado:</strong> ${JSON.stringify(teste.esperado, null, 2)}</div>
                        
                        <div>
                            <label>Status: </label>
                            <select id="${key}-teste-${index}" class="status">
                                <option value="pendente" class="status pendente">Pendente</option>
                                <option value="passou" class="status passou">Passou</option>
                                <option value="falhou" class="status falhou">Falhou</option>
                            </select>
                        </div>
                        
                        <div>
                            <label>Observações: </label>
                            <textarea id="${key}-obs-${index}" rows="2" style="width: 100%; margin-top: 5px;"></textarea>
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('')}
    </div>

    <button onclick="gerarRelatorio()" style="background: #28a745; color: white; padding: 15px 30px; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; margin: 20px 0;">
        📄 Gerar Relatório Final
    </button>

    <div id="relatorio-final" style="display: none; background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📋 Relatório Final</h3>
        <pre id="relatorio-texto"></pre>
    </div>

    <script>
        function gerarRelatorio() {
            const resultado = {
                data: new Date().toISOString(),
                calculadoras: {}
            };

            Object.entries(${JSON.stringify(this.resultados.calculadoras)}).forEach(([key, calc]) => {
                resultado.calculadoras[key] = {
                    nome: calc.nome,
                    testes: calc.testes.map((teste, index) => {
                        const status = document.getElementById(\`\${key}-teste-\${index}\`).value;
                        const observacoes = document.getElementById(\`\${key}-obs-\${index}\`).value;
                        return {
                            descricao: teste.descricao,
                            entrada: teste.entrada,
                            esperado: teste.esperado,
                            status: status,
                            observacoes: observacoes
                        };
                    })
                };
            });

            const relatorioTexto = JSON.stringify(resultado, null, 2);
            document.getElementById('relatorio-texto').textContent = relatorioTexto;
            document.getElementById('relatorio-final').style.display = 'block';
            
            // Download do relatório
            const blob = new Blob([relatorioTexto], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'relatorio-testes-manuais-financas.json';
            a.click();
        }
    </script>
</body>
</html>`;

    const htmlPath = path.join(process.cwd(), 'testes-manuais-calculadoras-financas.html');
    fs.writeFileSync(htmlPath, html);
    console.log(`📄 HTML de testes salvo em: ${htmlPath}`);
  }
}

// Executar os testes manuais
const teste = new TesteManualCalculadorasFinancas();
teste.executarTestesManuais();