# 33XL BUSINESS SYSTEM

## Manifesto e Filosofia de Engenharia

Este documento serve como a âncora filosófica e técnica do projeto. Qualquer nova funcionalidade, alteração de escopo ou decisão de interface deve obrigatoriamente passar pelo crivo destas diretrizes. Se uma ideia fere o que está escrito aqui, ela deve ser descartada ou o manifesto deve ser reescrito.

---

## 1. Visão Central
O 33XL BUSINESS SYSTEM não é um software tradicional de gestão (ERP) e não tem a intenção de sê-lo. É uma **plataforma modular de organização, processamento e modelagem de negócios**.
Seu objetivo é ser uma "mesa de trabalho infinita" onde o usuário joga as ferramentas que precisa e as organiza espacialmente, criando o seu próprio sistema mental e lógico de acompanhamento. 

### Princípios Base:
- **Local-First:** Os dados vivem primeiro com o usuário. A persistência inicial e principal ocorre no próprio navegador (Local Storage) e em disco local. Nuvem/Backend é uma camada opcional futura para sincronização, não o motor de arranque.
- **Utilidade Absoluta:** O sistema deve resolver problemas reais matemáticos, de gestão e de registro antes de tentar ser "inteligente" ou conectado.

---

## 2. A Estética Brutalista (Forma segue a Função)
O sistema abraça o **Brutalismo Tecnológico**. A interface não deve tentar ser amigável através de arredondamentos excessivos, cores pasteis ou animações lentas. Ela deve passar a sensação de um equipamento industrial de alta precisão.

### Diretrizes Visuais:
- **Contraste Máximo:** O ambiente é dominado pelo Preto Absoluto (`#000000`) e Branco (`#FFFFFF`). Sem tons cinzas desnecessários.
- **Tipografia:** Uso mandatório da fonte *Xirod* para títulos, menus estruturais e identidade visual. Fontes Monospace (`font-mono`) para leitura de dados técnicos e números.
- **Sem Perfumaria:** Sombras pesadas de alto contraste, bordas afiadas (`border-2 border-white`), botões óbvios e estados de *hover* que invertem cores imediatamente. 

---

## 3. Arquitetura Espacial: A Teoria dos "Universos"
O sistema abandona o conceito de "Páginas" (Home, Sobre, Configurações). Existe apenas o **Canvas** (A Mesa).

### A Mesa (Main Board)
- O plano de fundo é uma malha (grid) infinita. É o chão de fábrica.
- Não existem fios (nodes/wires) conectando as ferramentas visualmente. A modelagem de negócios ocorre pela **proximidade e contexto espacial**. Se a tabela de "Custos Fixos" está perto da "Projeção de Receita", essa é a estrutura mental do usuário.

### O Modelo Macro/Micro
Cada ferramenta (bloco) inserida na mesa funciona em dois estados absolutos:
1. **Macro (Modo Bloco/Pasta):** 
   Na mesa de trabalho, a ferramenta é apenas um quadrado arrastável e livre. Ela funciona como uma capa de pasta, exibindo apenas um **Resumo Crítico** (ex: o total do Fluxo de Caixa). 
   Neste modo, o bloco não serve para interação complexa (não se digita 50 linhas em uma janela pequena). Ele serve para organização espacial e visualização de resultados de alto nível.
2. **Micro (Modo Foco/Mergulho):** 
   Ao clicar para "entrar" na ferramenta, ocorre o *Focus Mode*. Aquele universo singular engole a tela inteira (o restante da mesa é ofuscado). É dentro deste mergulho que a interface rica acontece (tabelas densas, formulários, cálculos pesados). Ao finalizar, o usuário "sai" deste universo e volta para a mesa com o resumo atualizado.

---

## 4. Escopo Técnico e de Crescimento
Para evitar o "Feature Creep" (inchaço de funcionalidades), o projeto adotará a seguinte barreira de crescimento:

- **Frontend Limitado:** React + Tailwind CSS + Zustand. Nenhuma biblioteca visual gigante (como Material UI ou Ant Design) deve ser introduzida. Construímos nossos próprios primitivos brutalistas em cima do Shadcn/Radix.
- **Isolamento de Domínio:** Cada ferramenta da gaveta (ex: "Precificador", "Fluxo de Caixa") deve ser tratada como um micro-aplicativo. O código do Precificador não deve ter amarras profundas com o código do Fluxo de Caixa. Eles compartilham apenas o estado global do Canvas (posição, tamanho e visibilidade).
- **Abstração Lógica Oculta:** O usuário não constrói lógicas visuais (como programação em blocos). Ele insere as calculadoras prontas e preenche os dados. O 33XL faz a matemática subjacente.

---

> *"A tecnologia deve servir à operação humana, transformando processos repetitivos e informações dispersas em sistemas estruturados, oferecendo uma base lógica simples, duradoura e escalável."*
