# Arquitetura do Sistema (33XL BUSINESS SYSTEM)

Este documento descreve a estrutura técnica e os padrões arquiteturais estabelecidos para o projeto. O foco é manter o código leve, escalável e fácil de manter.

## 1. Stack Tecnológico

*   **Core:** React (via Vite)
*   **Estilização:** Tailwind CSS v4
*   **Gerenciamento de Estado:** Zustand (com persistência via LocalStorage)
*   **Física do Canvas:** `react-rnd` (para janelas arrastáveis e redimensionáveis)
*   **Ícones:** `lucide-react`

## 2. Paradigma do "Single Board App"

Ao contrário de aplicações web tradicionais baseadas em roteamento (ex: `react-router-dom` com `/dashboard`, `/config`, etc), o 33XL opera como um **Single Board App**.

1.  A casca do sistema (`WorkspaceLayout.tsx`) gerencia a barra de ferramentas superior e os botões de ação rápida.
2.  O conteúdo principal (`MainBoard.tsx`) é um espaço infinito (Canvas livre) onde a interação ocorre espacialmente.
3.  As janelas (`WidgetWindow.tsx`) são instanciadas sobre o Canvas, lendo e escrevendo seu estado no Zustand.

## 3. Estrutura de Estado (Zustand)

O `useBusinessStore` é o coração do banco de dados local.

*   `widgets`: Array de objetos que representam os módulos ativos na mesa.
*   **Estrutura de um Widget:**
    *   `id`: Identificador único da instância (permitindo múltiplos módulos iguais).
    *   `type`: Identificador de qual componente renderizar (ex: `cashflow`, `raw_note`).
    *   `position`: Coordenadas X e Y na mesa.
    *   `size`: Largura e altura da janela macro.
    *   `data`: Objeto genérico para armazenar os dados internos salvos pelo usuário naquele módulo específico.

## 4. O Sistema Macro vs Micro (Focus Mode)

*   **Macro (Canvas Level):** O `WidgetWindow.tsx` exibe apenas um preview ou o componente genérico de "capa" da ferramenta.
*   **Micro (Focus Level - A Implementar):** Ao interagir com o botão "Entrar" no Widget, o sistema deve despachar um evento que eleva aquele componente para tela cheia (Overlay), montando o verdadeiro painel complexo de dados daquela ferramenta. Todo cálculo profundo ocorre no estado Micro, e ao sair, o resultado é resumido e persistido no estado Macro.
