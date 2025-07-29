# **App Name**: Calculadora Rápida PT

## Core Features:

- Homepage Introduction: Display a welcoming landing page with a brief description of the website's purpose.
- Calculator Search: Implement a prominent search bar for users to find calculators by name.
- Categorized Calculators: Organize calculators into categories (Financeira, Saúde e Bem-Estar, etc.) with clear visual representation.
- Individual Calculator Pages: Design individual calculator pages with input fields, a 'Calculate' button, and a result display area.
- Interactive Forms: Implement client-side calculation logic (placeholder values) using Javascript to provide immediate feedback. Note: The real calculation should be implemented manually.

## Style Guidelines:

- Use a clean, modern color palette with shades of blue and green.
- Ensure good text contrast for readability.
- Accent color: A vibrant teal (#008080) to highlight key interactive elements.
- Design a responsive layout that adapts to different screen sizes (desktops, tablets, smartphones).
- Use clear and appropriately sized typography for easy reading.
- Incorporate icons to visually represent calculator categories.

## Original User Request:
Instruções para o Firebase App Hosting Studio:
1. Objetivo Principal:
"Crie um site em português do Brasil (pt-BR) que funcione como um portal de calculadoras online gratuitas, similar em conceito ao calculatodo.com/pt. O site deve ser fácil de usar, rápido e organizado."
2. Estrutura e Páginas:
"O site deve ter as seguintes seções principais:
* Página Inicial: Apresenta o site, talvez com uma barra de busca e categorias de calculadoras.
* Páginas de Categoria (implícito): Ao clicar numa categoria na home, deve levar a uma página (ou filtrar na home) mostrando apenas as calculadoras daquela categoria.
* Páginas de Calculadora Individual: Cada calculadora terá sua própria página dedicada com o formulário de entrada e a exibição do resultado."
3. Página Inicial (Homepage):
"A página inicial deve ter:
* Um cabeçalho simples com o nome do site (ex: 'Calculadora Total PT') e talvez um slogan (ex: 'Suas calculadoras online').
* Uma seção de boas-vindas curta explicando o propósito do site.
* Uma barra de busca proeminente para que os usuários possam pesquisar calculadoras pelo nome.
* Uma seção de categorias de calculadoras, como: 'Financeira', 'Saúde e Bem-Estar', 'Matemática', 'Construção', 'Dia a Dia'. Apresente essas categorias de forma clara (talvez com ícones).
* Uma grade ou lista de calculadoras populares ou recentes. Cada item na grade/lista deve mostrar o nome da calculadora, uma breve descrição e um link para a página da calculadora individual. Use um design de 'cards' para cada calculadora."
4. Página da Calculadora Individual:
"Crie um modelo de página para as calculadoras individuais. Este modelo deve incluir:
* O nome da calculadora como título principal (H1).
* Uma breve descrição do que a calculadora faz e como usá-la.
* Um formulário com campos de entrada claramente rotulados. Use os tipos de input apropriados (número, texto, data, etc.).
* Um botão claro para 'Calcular' (ou similar).
* Uma área designada para exibir o resultado do cálculo de forma clara e destacada após o clique no botão.
* (Opcional) Uma seção para mostrar a fórmula usada ou informações adicionais relevantes."
5. Exemplo de Calculadora (para guiar a IA):
"Como exemplo, detalhe a estrutura de uma Calculadora de IMC (Índice de Massa Corporal):
* Título: Calculadora de IMC
* Descrição: Calcule seu Índice de Massa Corporal para avaliar seu peso.
* Campos de Entrada:
* 'Peso (em kg):' (Input numérico)
* 'Altura (em cm ou m):' (Input numérico - escolha um padrão, ex: metros com casa decimal)
* Botão: 'Calcular IMC'
* Área de Resultado: Deve mostrar o valor do IMC calculado e, idealmente, a classificação (ex: Abaixo do peso, Peso normal, Sobrepeso, Obesidade)."
* Observação para a IA: A lógica de cálculo real (Peso / Altura²) pode precisar ser implementada manualmente depois, mas gere a estrutura da interface."
6. Outro Exemplo de Calculadora:
"Detalhe também uma Calculadora de Porcentagem Simples:
* Título: Calculadora de Porcentagem
* Descrição: Calcule porcentagens facilmente.
* Campos de Entrada:
* 'Quanto é []% de []?' (Dois inputs numéricos)
* Botão: 'Calcular Porcentagem'
* Área de Resultado: Mostrar o valor resultante."
7. Design e Usabilidade:
"O design deve ser:
* Limpo (clean), moderno e profissional.
* Focado na usabilidade: fácil de navegar e usar as calculadoras.
* Responsivo: O site deve funcionar bem em desktops, tablets e smartphones.
* Use uma paleta de cores agradável e legível (ex: tons de azul, verde ou cinza, com bom contraste para texto).
* Tipografia clara e de bom tamanho."
8. Navegação:
"Inclua um menu de navegação simples no cabeçalho (se fizer sentido além das categorias na home) e talvez um rodapé com informações básicas (ex: 'Sobre nós', 'Política de Privacidade' - mesmo que sejam links vazios por enquanto)."
9. Interatividade:
"Garanta que os formulários das calculadoras sejam interativos. Ao clicar no botão 'Calcular', a página deve (idealmente, via JavaScript básico gerado pela IA) processar as entradas (mesmo que com lógica de placeholder) e exibir um resultado na área designada, sem precisar recarregar a página inteira."
  