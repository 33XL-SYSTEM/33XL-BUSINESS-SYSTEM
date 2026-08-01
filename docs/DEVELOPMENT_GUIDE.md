# Guia de Desenvolvimento de Módulos

Este documento padroniza o fluxo de engenharia para a criação de novas ferramentas (Módulos) dentro do 33XL BUSINESS SYSTEM. Qualquer novo desenvolvimento deve seguir rigorosamente essas 4 etapas para evitar espaguete de código.

## Passo 1: Registro na Gaveta Central
Todo módulo nasce no `WorkspaceLayout.tsx`. 
* Encontre o array `toolboxCategories`.
* Adicione o objeto do módulo na categoria correta com `id`, `title` e `description`.
* Exemplo: `{ id: 'new_tool', title: 'Nova Ferramenta', description: 'Faz X e Y.' }`

## Passo 2: O Estado do Módulo (Zustand)
O Canvas já lida com o chassi do módulo (posição X/Y e tamanho). No entanto, os dados *internos* do módulo (ex: linhas de uma tabela) devem ser salvos na propriedade genérica `data` do `Widget`.
* Acesse `useBusinessStore`.
* Ao desenvolver o Módulo Micro, garanta que qualquer input do usuário atualize o `updateWidgetData(id, novosDados)`.
* **Regra de Ouro:** Nunca crie variáveis de estado (`useState`) para dados que o usuário não pode perder ao fechar a janela. Se importa, deve ir para o Zustand.

## Passo 3: Criação da View Macro (Resumo no Canvas)
O módulo na mesa nunca deve ser denso.
* Crie o arquivo base em `src/interface/components/tools/`.
* A visualização Macro deve ler o `widget.data` e exibir apenas um resumo estático ou KPIs.
* **Obrigatório:** Um botão enorme e contrastante de `[ ABRIR / EXPANDIR ]` que dispara a view Micro.

## Passo 4: Criação da View Micro (Focus Mode)
O Focus Mode é o coração operacional da ferramenta.
* Quando o usuário clica em expandir, a ferramenta passa a ser renderizada em um Modal/Overlay de tela cheia.
* A interface aqui deve ser brutalista, utilizando formulários em `monospace`, botões de ação pesados e grades organizadas.
* O componente de Focus Mode recebe acesso completo ao objeto do `Widget` via props, permitindo a edição agressiva dos dados.
