import { useEffect } from 'react';
import { useBusinessStore } from '@core/data/store';
import { Tag } from 'lucide-react';

interface ServicePricerData {
  targetIncome: number;
  fixedCosts: number;
  hoursPerDay: number;
  daysPerMonth: number;
  projectHours: number;
  markup: number;
}

interface ServicePricerWidgetProps {
  mode: "macro" | "micro";
  widgetId: string;
}

const DEFAULT_DATA: ServicePricerData = {
  targetIncome: 0,
  fixedCosts: 0,
  hoursPerDay: 8,
  daysPerMonth: 20,
  projectHours: 10,
  markup: 0,
};

export function ServicePricerWidget({ mode, widgetId }: ServicePricerWidgetProps) {
  const { widgets, updateWidgetData } = useBusinessStore();
  const widget = widgets.find(w => w.id === widgetId);
  const data: ServicePricerData = widget?.data?.pricer || DEFAULT_DATA;

  useEffect(() => {
    if (!widget?.data?.pricer) {
      updateWidgetData(widgetId, { pricer: DEFAULT_DATA });
    }
  }, [widgetId, widget?.data?.pricer, updateWidgetData]);

  const updateData = (field: keyof ServicePricerData, value: string) => {
    updateWidgetData(widgetId, {
      pricer: {
        ...data,
        [field]: parseFloat(value) || 0,
      }
    });
  };

  const totalMonthlyHours = (data.hoursPerDay || 1) * (data.daysPerMonth || 1);
  const hourlyRate = (data.targetIncome + data.fixedCosts) / totalMonthlyHours;
  const projectBaseCost = hourlyRate * (data.projectHours || 0);
  const projectFinalPrice = projectBaseCost * (1 + (data.markup || 0) / 100);
  const projectProfit = projectFinalPrice - projectBaseCost;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (mode === "macro") {
    return (
      <div className="w-full h-full flex flex-col p-6 bg-black text-white relative shadow-[inset_0_0_0_2px_white] group/service">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-xirod text-white text-lg tracking-widest uppercase leading-tight">
            Serviços<br/>(Precificador)
          </h3>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase">Hora Técnica</span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tighter text-white mt-1">
            {formatCurrency(hourlyRate)}
          </h2>
          <div className="mt-2 flex items-center gap-2 text-gray-400">
            <Tag className="w-3 h-3" />
            <span className="font-mono text-[10px] tracking-wider uppercase">
              {totalMonthlyHours} HRS DISPONÍVEIS/MÊS
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
        <h3 className="font-xirod text-white text-lg tracking-widest uppercase leading-tight">
          Precificador<br/>de Serviços
        </h3>
      </div>

      {/* Grid de 2 Colunas */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* COLUNA 1: HORA TÉCNICA */}
        <div className="flex-1 flex flex-col border-r-2 border-border">
          <div className="p-4 bg-zinc-950 border-b-2 border-border">
             <span className="font-mono text-xs text-white uppercase tracking-widest font-bold">1. Base (Hora Técnica)</span>
          </div>
          
          <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col">
              <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">Pró-Labore / Meta de Ganhos</label>
              <input
                type="number"
                value={data.targetIncome}
                onChange={(e) => updateData('targetIncome', e.target.value)}
                className="bg-black border-2 border-border p-2 text-white font-mono text-sm focus:outline-none focus:border-white transition-colors"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">Custos Fixos Mensais (Negócio)</label>
              <input
                type="number"
                value={data.fixedCosts}
                onChange={(e) => updateData('fixedCosts', e.target.value)}
                className="bg-black border-2 border-border p-2 text-white font-mono text-sm focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">Horas/Dia</label>
                <input
                  type="number"
                  value={data.hoursPerDay}
                  onChange={(e) => updateData('hoursPerDay', e.target.value)}
                  className="bg-black border-2 border-border p-2 text-white font-mono text-sm focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">Dias/Mês</label>
                <input
                  type="number"
                  value={data.daysPerMonth}
                  onChange={(e) => updateData('daysPerMonth', e.target.value)}
                  className="bg-black border-2 border-border p-2 text-white font-mono text-sm focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t-2 border-border">
              <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">VALOR DA HORA TÉCNICA</span>
              <span className="font-display font-bold text-3xl text-white">{formatCurrency(hourlyRate)}/h</span>
            </div>
          </div>
        </div>

        {/* COLUNA 2: ORÇAMENTO DO PROJETO */}
        <div className="flex-1 flex flex-col bg-zinc-950">
          <div className="p-4 bg-zinc-900 border-b-2 border-border">
             <span className="font-mono text-xs text-white uppercase tracking-widest font-bold">2. Preço do Serviço Atual</span>
          </div>

          <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col">
              <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">Horas Estimadas p/ o Serviço</label>
              <input
                type="number"
                value={data.projectHours}
                onChange={(e) => updateData('projectHours', e.target.value)}
                className="bg-black border-2 border-border p-2 text-white font-mono text-xl text-center focus:outline-none focus:border-white transition-colors"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">Margem de Lucro Bruto (%)</label>
              <input
                type="number"
                value={data.markup}
                onChange={(e) => updateData('markup', e.target.value)}
                className="bg-black border-2 border-border p-2 text-white font-mono text-xl text-center focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="mt-4 p-4 border-2 border-white bg-black flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Custo Base (Horas):</span>
                <span className="font-mono text-xs text-white">{formatCurrency(projectBaseCost)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Lucro Bruto:</span>
                <span className="font-mono text-xs text-green-500">+{formatCurrency(projectProfit)}</span>
              </div>
              <div className="border-t-2 border-border my-2"></div>
              <div className="flex flex-col">
                 <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">PREÇO SUGERIDO (FINAL)</span>
                 <span className="font-display font-bold text-4xl text-white tracking-tighter">{formatCurrency(projectFinalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
