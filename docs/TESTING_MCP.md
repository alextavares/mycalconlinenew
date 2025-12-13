# Testes via MCP Playwright

Este projeto inclui scripts de teste baseados em MCP (Model Context Protocol) usando o servidor Playwright como MCP. A abordagem evita instalar navegadores locais e bibliotecas do SO, comunicando-se com o servidor Playwright via JSON-RPC sobre stdio.

## Pré-requisitos

- App Next.js acessível em: http://localhost:3000
  - Ex.: `npm run dev`
- Servidor MCP Playwright compilado:
  - Já está versionado e compila para `mcp-playwright/dist/index.js`.
  - Se necessário: `cd mcp-playwright && npm ci --no-audit --no-fund || npm install --no-audit --no-fund && npm run build`

## Scripts disponíveis

Executar os testes MCP (não requer @modelcontextprotocol/sdk):

- Word Counter:
  - `npm run -s mcp:test:word-counter`
- Porcentagem:
  - `npm run -s mcp:test:porcentagem`
- Média Ponderada:
  - `npm run -s mcp:test:media-ponderada`

Os scripts estão em `scripts/` e utilizam um cliente MCP JSON-RPC via stdio vendorizado, que inicia `node mcp-playwright/dist/index.js` internamente.

## Estrutura dos testes

Cada script:
1. Inicia o servidor MCP Playwright (`node mcp-playwright/dist/index.js`)
2. Envia `initialize` (JSON-RPC 2.0)
3. Usa ferramentas (`tools/call`) expostas pelo servidor:
   - `playwright_navigate`, `playwright_fill`, `playwright_click`
   - `playwright_get_visible_html`, `playwright_get_visible_text`
   - `playwright_screenshot`, `playwright_close`
4. Executa verificações simples de UI (labels/indicadores)
5. Tira screenshot e fecha o browser

## Ajustando seletores/asserções

Os seletores nos scripts de Porcentagem e Média Ponderada são heurísticos. Para resultados mais robustos:
- Padronize `id` e/ou `data-testid` no DOM das calculadoras.
- Atualize os seletores nos scripts para usar esses identificadores estáveis.
- Ajuste regex/strings de verificação conforme o texto exibido.

## Execução em CI

- Garanta que a aplicação esteja acessível (ex.: iniciar o server no job e aguardar porta 3000).
- Execute os scripts `npm run -s mcp:test:*`.
- Opcional: salve as capturas de tela produzidas pelos scripts (o servidor retorna o caminho ou identificação do arquivo gerado).

## Solução de problemas

- Fica parado em "[MCP] Starting server...":
  - Compile `mcp-playwright`: `cd mcp-playwright && npm ci || npm install && npm run build`
- Erros de seletor (`Could not find`/`Timeout`):
  - Inspecione o DOM real e ajuste os seletores nos scripts.
- Conflitos de dependências do npm:
  - Os scripts não usam `@modelcontextprotocol/sdk`, então não é necessário instalá-lo.