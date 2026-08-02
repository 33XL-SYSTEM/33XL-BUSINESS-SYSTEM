import { useState } from 'react';
import { useBusinessStore } from '@core/data/store';
import { Plus, Trash2, PieChart } from 'lucide-react';

interface FixedCostEntry {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  category: 'INFRA' | 'SOFTWARE' | 'PAYROLL' | 'OTHER';
}

interface FixedCostsWidgetProps {
  mode: "macro" | "micro";
  widgetId: string;
}

export function FixedCostsWidget({ mode, widgetId }: FixedCostsWidgetProps) {
  const { widgets, updateWidgetData } = useBusinessStore();
  const widget = widgets.find(w => w.id === widgetId);
  const entries: FixedCostEntry[] = widget?.data?.entries || [];

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState('1');
  const [category, setCategory] = useState<'INFRA' | 'SOFTWARE' | 'PAYROLL' | 'OTHER'>('INFRA');

  const handleAdd = () => {
    if (!name || !amount || !dueDay) return;
    
    const newEntry: FixedCostEntry = {
      id: crypto.randomUUID(),
      name,
      amount: parseFloat(amount),
      dueDay: parseInt(dueDay, 10),
      category
    };

    updateWidgetData(widgetId, {
      entries: [...entries, newEntry]
    });

    setName('');
    setAmount('');
  };

  const handleDelete = (id: string) => {
    updateWidgetData(widgetId, {
      entries: entries.filter(e => e.id !== id)
    });
  };

  // Sort by due day
  const sortedEntries = [...entries].sort((a, b) => a.dueDay - b.dueDay);
  
  const totalCost = entries.reduce((acc, curr) => acc + curr.amount, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (mode === "macro") {
    return (
      <div className="w-full h-full flex flex-col p-6 bg-black text-white relative shadow-[inset_0_0_0_2px_white] group/fixed">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-xirod text-white text-lg tracking-widest uppercase leading-tight">
            Custos<br/>Fixos
          </h3>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase">Buraco Mensal</span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tighter mt-1">
            {formatCurrency(totalCost)}
          </h2>
          <div className="mt-2 flex items-center gap-2 text-gray-400">
            <PieChart className="w-3 h-3" />
            <span className="font-mono text-[10px] tracking-wider uppercase">
              {entries.length} ATIVOS
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden">
      
      {/* Header & Totals */}
      <div className="p-6 border-b-2 border-border flex-shrink-0 bg-black z-10 relative">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-xirod text-white text-lg tracking-widest uppercase leading-tight">
            Custos<br/>Fixos
          </h3>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">
              BURACO MENSAL
            </span>
            <span className="font-display font-bold text-3xl text-white tracking-tighter">
              {formatCurrency(totalCost)}
            </span>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="p-4 border-b-2 border-border bg-zinc-950 flex-shrink-0">
        <div className="grid grid-cols-12 gap-2">
          <input 
            type="text" 
            placeholder="NOME"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-12 sm:col-span-4 bg-black border-2 border-border p-2 text-white font-mono text-xs uppercase focus:outline-none focus:border-white transition-colors"
          />
          <input 
            type="number" 
            placeholder="VALOR"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="col-span-4 sm:col-span-3 bg-black border-2 border-border p-2 text-white font-mono text-xs uppercase focus:outline-none focus:border-white transition-colors"
          />
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="col-span-5 sm:col-span-2 bg-black border-2 border-border p-2 text-white font-mono text-xs uppercase focus:outline-none focus:border-white transition-colors"
          >
            <option value="INFRA">INFRA</option>
            <option value="SOFTWARE">SOFTW</option>
            <option value="PAYROLL">EQUIPE</option>
            <option value="OTHER">OUTROS</option>
          </select>
          <input 
            type="number" 
            placeholder="DIA"
            min="1" max="31"
            value={dueDay}
            onChange={(e) => setDueDay(e.target.value)}
            className="col-span-3 sm:col-span-2 bg-black border-2 border-border p-2 text-white font-mono text-xs text-center uppercase focus:outline-none focus:border-white transition-colors"
          />
          <button 
            onClick={handleAdd}
            className="col-span-12 sm:col-span-1 bg-white text-black flex items-center justify-center p-2 hover:bg-gray-300 transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-black">
        {sortedEntries.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <span className="font-mono text-xs text-gray-600 uppercase tracking-widest text-center">
              NENHUM CUSTO<br/>CADASTRADO
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {sortedEntries.map((entry) => {
              const weight = totalCost > 0 ? (entry.amount / totalCost) * 100 : 0;
              return (
                <div key={entry.id} className="flex items-center justify-between p-3 border-2 border-border group hover:border-gray-500 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-8 h-8 bg-zinc-900 border border-zinc-800">
                      <span className="font-mono text-[8px] text-gray-500 uppercase">DIA</span>
                      <span className="font-display font-bold text-white text-sm">{entry.dueDay}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-display font-bold text-white text-sm uppercase">{entry.name}</span>
                      <span className="font-mono text-[10px] text-gray-500 tracking-widest uppercase">{entry.category}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-sm text-white font-bold">{formatCurrency(entry.amount)}</span>
                      <span className="font-mono text-[9px] text-gray-500 tracking-widest">{weight.toFixed(1)}%</span>
                    </div>
                    <button 
                      onClick={() => handleDelete(entry.id)}
                      className="text-gray-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
