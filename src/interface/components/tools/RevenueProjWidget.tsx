import { useState, useEffect } from 'react';
import { useBusinessStore } from '@core/data/store';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface RevenueScenario {
  id: string;
  name: string;
  averageTicket: number;
  monthlySales: number;
  growthRate: number;
}

interface RevenueProjWidgetProps {
  mode: "macro" | "micro";
  widgetId: string;
}

const DEFAULT_SCENARIOS: RevenueScenario[] = [
  { id: '1', name: 'PESSIMISTA', averageTicket: 0, monthlySales: 0, growthRate: 0 },
  { id: '2', name: 'REALISTA', averageTicket: 0, monthlySales: 0, growthRate: 0 },
  { id: '3', name: 'OTIMISTA', averageTicket: 0, monthlySales: 0, growthRate: 0 },
];

export function RevenueProjWidget({ mode, widgetId }: RevenueProjWidgetProps) {
  const { widgets, updateWidgetData } = useBusinessStore();
  const widget = widgets.find(w => w.id === widgetId);
  const scenarios: RevenueScenario[] = widget?.data?.scenarios || DEFAULT_SCENARIOS;

  // Sync default scenarios if first boot
  useEffect(() => {
    if (!widget?.data?.scenarios) {
      updateWidgetData(widgetId, { scenarios: DEFAULT_SCENARIOS });
    }
  }, [widgetId, widget?.data?.scenarios, updateWidgetData]);

  const updateScenario = (id: string, field: keyof RevenueScenario, value: string | number) => {
    const updated = scenarios.map(s => {
      if (s.id === id) {
        return { ...s, [field]: typeof value === 'string' && field !== 'name' ? parseFloat(value) || 0 : value };
      }
      return s;
    });
    updateWidgetData(widgetId, { scenarios: updated });
  };

  const calculate12MonthRevenue = (ticket: number, sales: number, growth: number) => {
    let total = 0;
    for (let i = 0; i < 12; i++) {
      const currentSales = sales * Math.pow(1 + growth / 100, i);
      total += currentSales * ticket;
    }
    return total;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  // Encontra o maior cenário para destaque
  const highestScenario = [...scenarios].sort((a, b) => 
    calculate12MonthRevenue(b.averageTicket, b.monthlySales, b.growthRate) - 
    calculate12MonthRevenue(a.averageTicket, a.monthlySales, a.growthRate)
  )[0];

  if (mode === "macro") {
    const highestTotal = highestScenario ? calculate12MonthRevenue(highestScenario.averageTicket, highestScenario.monthlySales, highestScenario.growthRate) : 0;
    
    return (
      <div className="w-full h-full flex flex-col p-6 bg-black text-white relative shadow-[inset_0_0_0_2px_white] group/rev">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-xirod text-white text-lg tracking-widest uppercase leading-tight">
            Projeção<br/>Receita
          </h3>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase">Potencial Máximo (12M)</span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tighter text-white mt-1">
            {formatCurrency(highestTotal)}
          </h2>
          <div className="mt-2 flex items-center gap-2 text-gray-400">
            <TrendingUp className="w-3 h-3" />
            <span className="font-mono text-[10px] tracking-wider uppercase">
              CENÁRIO: {highestScenario?.name || 'N/A'}
            </span>
          </div>
          <div className="mt-4 w-full overflow-hidden">
            <span className="font-mono text-[10px] tracking-widest text-zinc-700 whitespace-nowrap opacity-50">
              _ ▃ ▅ ▆ ▇ █ █ █ ▇ ▆ ▅ ▃ _ _ ▃ ▅ ▆ ▇ █
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b-2 border-border flex-shrink-0 bg-black z-10 relative">
        <div className="flex justify-between items-start">
          <h3 className="font-xirod text-white text-lg tracking-widest uppercase leading-tight">
            Projeção<br/>Receita
          </h3>
          <div className="text-right flex flex-col items-end">
             <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest mb-1">
              MODELO DE CRESCIMENTO
            </span>
            <span className="font-display font-bold text-xs text-white uppercase tracking-wider">
              Juros Compostos
            </span>
          </div>
        </div>
      </div>

      {/* Grid de Cenários Paralelos */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar bg-black">
        <div className="flex h-full min-w-max">
          {scenarios.map((scenario, index) => {
            const total12M = calculate12MonthRevenue(scenario.averageTicket, scenario.monthlySales, scenario.growthRate);
            const isHighest = highestScenario?.id === scenario.id;

            return (
              <div 
                key={scenario.id} 
                className={`flex flex-col flex-1 min-w-[280px] p-6 border-r-2 ${isHighest ? 'border-white' : 'border-border'} transition-colors`}
              >
                {/* Título do Cenário */}
                <div className="mb-8">
                  <input
                    type="text"
                    value={scenario.name}
                    onChange={(e) => updateScenario(scenario.id, 'name', e.target.value)}
                    className={`bg-transparent font-display font-bold text-xl uppercase tracking-widest w-full focus:outline-none focus:border-b-2 border-b-2 border-transparent focus:border-white transition-all pb-1 ${isHighest ? 'text-white' : 'text-gray-500'}`}
                  />
                  {isHighest && (
                    <span className="font-mono text-[8px] text-white bg-white/10 px-2 py-1 uppercase tracking-widest mt-2 inline-block">
                      ALTO POTENCIAL
                    </span>
                  )}
                </div>

                {/* Variáveis */}
                <div className="flex flex-col gap-6 flex-1">
                  
                  {/* Ticket Médio */}
                  <div className="flex flex-col">
                    <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                      Ticket Médio
                      <span className="text-gray-700">R$</span>
                    </label>
                    <input
                      type="number"
                      value={scenario.averageTicket}
                      onChange={(e) => updateScenario(scenario.id, 'averageTicket', e.target.value)}
                      className="bg-black border-2 border-border p-3 text-white font-mono text-lg focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  {/* Vendas Base */}
                  <div className="flex flex-col">
                    <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                      Vendas (Mês 1)
                      <span className="text-gray-700">QTD</span>
                    </label>
                    <input
                      type="number"
                      value={scenario.monthlySales}
                      onChange={(e) => updateScenario(scenario.id, 'monthlySales', e.target.value)}
                      className="bg-black border-2 border-border p-3 text-white font-mono text-lg focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  {/* Crescimento Mensal */}
                  <div className="flex flex-col">
                    <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                      Crescimento
                      <span className="text-gray-700">% a.m.</span>
                    </label>
                    <input
                      type="number"
                      value={scenario.growthRate}
                      onChange={(e) => updateScenario(scenario.id, 'growthRate', e.target.value)}
                      className="bg-black border-2 border-border p-3 text-white font-mono text-lg focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                </div>

                {/* Resultado */}
                <div className="mt-8 pt-6 border-t-2 border-border">
                  <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">
                    ACUMULADO (12 MESES)
                  </span>
                  <div className={`font-display font-bold text-3xl tracking-tighter ${isHighest ? 'text-white' : 'text-gray-400'}`}>
                    {formatCurrency(total12M)}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
