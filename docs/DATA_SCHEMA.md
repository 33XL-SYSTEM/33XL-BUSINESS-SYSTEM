# Estrutura e Contrato de Dados (Zustand + LocalStorage)

Este documento dita como a propriedade genérica `data: {}` de cada Widget deve ser estruturada dependendo do seu `type`. Isso impede que módulos desenvolvidos no futuro armazenem dados de forma anômala, quebrando o banco de dados local.

## 1. Módulo: Fluxo de Caixa (`cashflow`)
O Fluxo de Caixa armazena uma lista de transações e saldo calculado.
```json
{
  "transactions": [
    {
      "id": "t_123",
      "date": "2024-01-01",
      "description": "Pagamento Software",
      "type": "out", // 'in' ou 'out'
      "amount": 150.00,
      "status": "paid" // 'paid' ou 'pending'
    }
  ]
}
```

## 2. Módulo: Custos Fixos (`fixed_costs`)
Uma lista simples de itens recorrentes mensais.
```json
{
  "items": [
    {
      "id": "c_123",
      "name": "Aluguel",
      "amount": 2500.00,
      "dueDate": 5 // Dia do vencimento
    }
  ]
}
```

## 3. Módulo: Bloco de Anotação (`raw_note`)
Armazena puramente um bloco de texto.
```json
{
  "content": "Lembrar de revisar a margem de lucro na quarta-feira."
}
```

## 4. Regras de Mutabilidade
- Toda mutação no objeto `data` deve ser feita através da action `updateWidgetData(widgetId, partialData)` do `useBusinessStore`.
- Os módulos não devem mutar os dados diretamente via referências de memória locais para não quebrar a reatividade do React.
