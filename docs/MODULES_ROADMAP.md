# Roadmap de Módulos (33XL)

Este documento mapeia o ecossistema de ferramentas que populam o 33XL. Cada ferramenta é injetada na mesa de trabalho, possuindo um estado Macro (resumo/pasta) e um estado Micro (Focus Mode para cálculo).

## Categoria 1: Financeiro
Ferramentas base para monitoramento do fluxo de dinheiro da operação.

*   **Fluxo de Caixa:** Tabela mestre de registro de Entradas e Saídas diárias/mensais. No estado macro exibe apenas o saldo atual e pendências. No micro, exibe a tabela densa de lançamentos.
*   **Custos Fixos:** Mapeamento de todos os custos recorrentes da estrutura (aluguel, software, salários).
*   **Projeção de Receita:** Calculadora para simular diferentes cenários de faturamento futuro baseado em variáveis.

## Categoria 2: Orçamentos
Ferramentas para precificar serviços, produtos e criar propostas.

*   **Precificador de Serviços:** Calculadora baseada em horas técnicas. Cruzando os "Custos Fixos" do usuário com o valor desejado de lucro, entrega o valor real da hora e o preço final de um job.
*   **Ficha de Produto (BOM - Bill of Materials):** Calculadora focada em fabricação. Lista de insumos com seus respectivos custos e margem aplicada para compor o preço de um produto físico.
*   **Proposta Comercial:** Consolidador de dados. Puxa os custos estruturados nas outras calculadoras e gera uma página elegante e brutalista pronta para apresentação ou envio ao cliente.

## Categoria 3: Modelagem & Texto
Apoio lógico e documentação de processos.

*   **Bloco de Anotação (Raw Note):** O bloco mestre de escrita. Texto livre para rascunhos mentais e ideias de fluxo de trabalho.
*   **Diagrama de Processos:** Em construção (substituto simples de node-wiring visando checklist de fluxos lógicos ao invés de conexões desenhadas).
*   **Tabela Bruta:** Uma planilha vazia, sem lógica atrelada, útil apenas para organizar listas de dados não classificados.

## Categoria 4: Análise
Visão consolidada para decisões empresariais.

*   **Painel de KPIs:** Consolidado numérico de metas. Exibe indicadores como Taxa de Conversão, MRR, Churn.
*   **Ponto de Equilíbrio (Break-Even):** Calculadora que cruza Custos Fixos com a margem de contribuição média para dizer ao usuário quanto ele precisa faturar apenas para "empatar" no mês.
*   **DRE Simplificado:** Demonstrativo de Resultado do Exercício. Um painel que subtrai os custos totais da receita global para apresentar o lucro líquido de forma crua e brutal.

## Categoria 5: Sistemas
Ferramentas de integração e saída de dados.

*   **Conector API:** Permite puxar dados de sistemas externos via requisições HTTP (GET/POST) para dentro da mesa.
*   **Porta Lógica:** Ferramenta para criar condicionais simples baseadas nos números de outras calculadoras (ex: Se Lucro < 0, Alerta Vermelho).
*   **Exportador de Dados:** O motor de saída. Puxa as consolidações da mesa e gera documentos (PDFs brutalistas e arquivos CSV) para entrega externa ou contabilidade.

---
*Nota de Arquitetura: Nenhum destes módulos obriga o usuário a conectar "fios". Eles trabalham de forma independente. O usuário joga eles na mesa e monta a inteligência contextualmente.*
