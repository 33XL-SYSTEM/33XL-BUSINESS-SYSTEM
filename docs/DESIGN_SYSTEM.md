# Sistema de Design Brutalista (33XL)

Este guia estabelece os tokens e as regras visuais rigorosas para garantir a concordância da interface e prevenir poluição visual.

## 1. Cores Base (Tokens)

A paleta de cores é estritamente de alto contraste. Tons pastéis, gradientes coloridos e cinzas suaves são **proibidos**.

*   **Fundo Principal (Canvas/Mesa):** Preto Absoluto (`#000000`)
*   **Texto Principal e Linhas de Grade:** Branco (`#FFFFFF`) e Cinzas Neutros Escuros (para divisórias e placeholders).
*   **Bordas:** Brancas ou Cinzas bem definidos, com traços fortes (`border-2`).
*   **Hover States (Estado de Foco):** As interações devem ser evidentes. Botões e caixas que recebem foco devem inverter a cor (fundo branco, texto preto) ou adicionar uma sombra grossa e dura (sem *blur* excessivo).

## 2. Tipografia

Duas fontes regem o sistema, separando função estética de função técnica.

1.  **Títulos e Identidade (Xirod):**
    *   Usada **exclusivamente** para o Logo, nomes de grandes blocos na mesa e títulos de cabeçalhos.
    *   Sempre em CAIXA ALTA (Uppercase).
2.  **Dados e Leitura Técnica (Monospace):**
    *   Todo número, tabela, texto digitado pelo usuário, e interface de botões operacionais deve usar fonte monoespaçada (`font-mono`).
    *   Garante alinhamento perfeito de colunas matemáticas e reforça o aspecto "terminal/industrial".
3.  **Apoio (Sans/Display):**
    *   Usada pontualmente em botões pequenos quando a Monospace se torna ilegível por falta de espaço.

## 3. Elementos de Interface (UI)

*   **Janelas (Widgets):** Cantos predominantemente secos ou com raio extremamente pequeno (`rounded-sm`). Sombras duras (`shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`).
*   **Transições:** Rápidas e diretas (`duration-200`). Sem efeitos de fade longos que pareçam "mágicos". O sistema deve parecer elétrico e responsivo.
*   **Ícones:** Uso de ícones vetoriais da biblioteca `lucide-react` com `strokeWidth` elevado (`stroke-[2]` ou `stroke-[3]`) para acompanhar o peso do Brutalismo.
