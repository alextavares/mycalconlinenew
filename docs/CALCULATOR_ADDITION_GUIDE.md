# Guia de Adição de Calculadoras

Este documento descreve a metodologia completa para adicionar calculadoras ao projeto de forma sistemática, evitando duplicatas e erros.

## 📋 Visão Geral

O site [Omni Calculator](https://www.omnicalculator.com/all) possui milhares de calculadoras organizadas em 14 categorias principais. Nosso objetivo é replicar as calculadoras mais úteis de forma gradual e organizada.

## 🗂️ Estrutura de Categorias do Omni

| Categoria Omni | Categoria Local | Subcategorias |
|----------------|-----------------|---------------|
| Biology | science | Lab, Genetics, Animals, Gardening |
| Chemistry | science | General, Stoichiometry, Solutions |
| Construction | construction | Materials, Roofing, Home |
| Conversion | conversion | Length, Volume, Weight, Time |
| Ecology | ecology | Footprint, Renewable Energy |
| Everyday life | everyday | Transportation, Home, Time |
| Finance | finance | Business, Investment, Tax, Mortgage |
| Food | food | Cooking, Drinks, Party |
| Health | health | BMI, Dietary, Cardiovascular |
| Math | math | Percentages, Algebra, Geometry |
| Physics | physics | Kinematics, Optics, Electronics |
| Sports | sports | Calories, Running, Cycling |
| Statistics | statistics | Probability, Distributions |
| Other | other | Education, Tech, Photo |

## 🔧 Arquivos de Infraestrutura

| Arquivo | Propósito |
|---------|-----------|
| `calculator-registry.json` | Registro central de todas as calculadoras e progresso |
| `templates/calculator-template.ts` | Template padrão para novas calculadoras |
| `scripts/validate-new-calculator.js` | Valida se um ID já existe |
| `scripts/update-registry.js` | Atualiza o registro após adicionar |
| `scripts/log-session.js` | Registra o progresso de cada sessão |
| `.agent/workflows/add-calculators.md` | Workflow para a IA seguir |

## 📝 Prompt Padrão para Novas Sessões

**Copie e cole este prompt no início de cada sessão de IA:**

---

```
Preciso adicionar calculadoras ao meu projeto. Siga rigorosamente o workflow em `.agent/workflows/add-calculators.md`.

ANTES DE COMEÇAR:
1. Leia o arquivo `calculator-registry.json` para ver o progresso anterior
2. Verifique `lastAddedId` e `lastAddedCategory` para saber onde paramos
3. Identifique a próxima categoria ou subcategoria do Omni a trabalhar

REGRAS OBRIGATÓRIAS:
- Adicione NO MÁXIMO 10 calculadoras por sessão
- SEMPRE rode `node scripts/validate-new-calculator.js <id>` antes de adicionar
- Use o template em `templates/calculator-template.ts` como base
- Adicione SEMPRE no FINAL do objeto `calculators` em `src/config/calculators.ts`
- SEMPRE rode `npm run calc:check` após cada adição
- Atualize o registro com `node scripts/update-registry.js <id> <category> omni`
- NO FINAL da sessão, rode `node scripts/log-session.js "<resumo>" <quantidade>`

CATEGORIA PARA ESTA SESSÃO: [ESPECIFIQUE AQUI - ex: "math/percentages", "finance/business", etc.]

Comece verificando o registry e me informe onde paramos na última sessão.
```

---

## 🚀 Como Iniciar

### Primeira Sessão
Se esta é a primeira vez usando o sistema:
1. A IA vai ler o `calculator-registry.json` e ver que está vazio
2. Comece pela categoria `math/percentages` (Omni URL: https://www.omnicalculator.com/math)
3. Adicione as primeiras 10 calculadoras de porcentagem

### Sessões Subsequentes
1. A IA vai ler o `lastAddedId` do registry
2. Continue de onde parou na mesma categoria
3. Quando terminar uma categoria, passe para a próxima

## ✅ Checklist de Qualidade

Para cada calculadora adicionada, verifique:

- [ ] ID é único (validado pelo script)
- [ ] ID está em kebab-case (ex: `compound-interest`)
- [ ] Categoria é válida (`math`, `finance`, etc.)
- [ ] Todos os inputs têm `id`, `label`, `type`
- [ ] Função `calculate` usa `(inputs: Record<string, any>) =>`
- [ ] Função `calculate` retorna `string | number`, nunca `null`
- [ ] Meta keywords é um array `['keyword1', 'keyword2']`
- [ ] TypeScript compila sem erros

## 📊 Rastreamento de Progresso

O arquivo `calculator-registry.json` rastreia:

```json
{
  "metadata": {
    "lastUpdated": "2026-01-13",
    "totalCalculators": 671,
    "lastAddedId": "percentage-increase",
    "lastAddedCategory": "math"
  },
  "sessions": [
    {
      "date": "2026-01-13T...",
      "summary": "Added 10 math calculators",
      "calculatorsAdded": 10
    }
  ],
  "calculators": {
    "percentage-increase": { "status": "done", "category": "math" }
  }
}
```

## ⚠️ Erros Comuns a Evitar

| Erro | Solução |
|------|---------|
| ID duplicado | Sempre rodar `validate-new-calculator.js` antes |
| `primaryUnit` inválido | Usar `unit` em vez de `primaryUnit` |
| `width` nas inputs | Remover - não é suportado |
| `return null` em calculate | Usar `return 0` ou `return '---'` |
| Keywords como string | Usar array: `['keyword1', 'keyword2']` |
| Categoria com maiúscula | Usar lowercase: `'physics'` não `'Physics'` |

## 🔄 Fluxo de Trabalho Visual

```
┌─────────────────┐
│ Início Sessão   │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Ler Registry    │
│ (lastAddedId)   │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Validar ID      │──── Se falhar ──→ Pular
└────────┬────────┘
         ▼
┌─────────────────┐
│ Adicionar Calc  │
└────────┬────────┘
         ▼
┌─────────────────┐
│ npm run check   │──── Se falhar ──→ Corrigir
└────────┬────────┘
         ▼
┌─────────────────┐
│ Update Registry │
└────────┬────────┘
         ▼
    Repetir (max 10x)
         ▼
┌─────────────────┐
│ Log Session     │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Git Commit      │
└─────────────────┘
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs de erro do TypeScript
2. Revise o template em `templates/calculator-template.ts`
3. Consulte calculadoras existentes em `src/config/calculators.ts` como referência
