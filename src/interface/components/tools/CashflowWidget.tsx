import { useState } from 'react';
import { useBusinessStore } from '@core/data/store';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface CashflowEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
}

interface CashflowWidgetProps {
  mode: "macro" | "micro";
  widgetId: string;
}

export function CashflowWidget({ mode, widgetId }: CashflowWidgetProps) {
  const { widgets, updateWidgetData } = useBusinessStore();
  const widget = widgets.find(w => w.id === widgetId);
  const entries: CashflowEntry[] = widget?.data?.entries || [];

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');

  const handleAdd = () => {
    if (!description || !amount) return;
    
    const newEntry: CashflowEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date,
      description,
      amount: parseFloat(amount),
      type
    };

    updateWidgetData(widgetId, {
      entries: [newEntry, ...entries]
    });

    setDescription('');
    setAmount('');
  };

  const handleDelete = (id: string) => {
    updateWidgetData(widgetId, {
      entries: entries.filter(e => e.id !== id)
    });
  };

  const totalIncome = entries.filter(e => e.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = entries.filter(e => e.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (mode === "macro") {
    return (
      <div className="w-full h-full flex flex-col bg-black text-white p-6 border-t-2 border-white relative shadow-[inset_0_0_0_2px_white] group/cashflow">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-xirod text-white text-lg tracking-widest uppercase leading-tight">
            Fluxo de<br/>Caixa
          </h3>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-1">Saldo Atual</span>
          <span className={`font-mono text-3xl font-bold truncate ${balance < 0 ? 'text-white' : 'text-white'}`}>
            {balance < 0 ? '-' : '+'}{formatCurrency(Math.abs(balance))}
          </span>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-4 border-t-2 border-white pt-4">
          <div>
            <div className="flex items-center gap-1 text-gray-400 mb-1">
              <ArrowUpRight className="w-3 h-3" />
              <span className="font-mono text-[8px] uppercase tracking-widest">Entradas</span>
            </div>
            <span className="font-mono text-xs font-bold truncate block">{formatCurrency(totalIncome)}</span>
          </div>
          <div>
            <div className="flex items-center gap-1 text-gray-400 mb-1">
              <ArrowDownRight className="w-3 h-3" />
              <span className="font-mono text-[8px] uppercase tracking-widest">Saídas</span>
            </div>
            <span className="font-mono text-xs font-bold truncate block">{formatCurrency(totalExpense)}</span>
          </div>
        </div>
      </div>
    );
  }

  // MICRO MODE
  return (
    <div className="w-full h-full flex flex-col bg-black text-white p-8 relative">
      <h2 className="font-xirod text-2xl tracking-widest uppercase mb-8 border-b-2 border-white pb-4">
        Fluxo de Caixa
      </h2>

      {/* DASHBOARD HEADER */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="border-2 border-white p-6 flex flex-col justify-center items-center">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">Total Entradas</span>
          <span className="font-mono text-2xl font-bold">+{formatCurrency(totalIncome)}</span>
        </div>
        <div className="border-2 border-white p-6 flex flex-col justify-center items-center">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">Total Saídas</span>
          <span className="font-mono text-2xl font-bold">-{formatCurrency(totalExpense)}</span>
        </div>
        <div className="border-2 border-white p-6 flex flex-col justify-center items-center bg-white text-black">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-600 mb-2">Saldo Atual</span>
          <span className="font-mono text-3xl font-bold">{balance < 0 ? '-' : '+'}{formatCurrency(Math.abs(balance))}</span>
        </div>
      </div>

      {/* INPUT FORM */}
      <div className="flex gap-4 mb-8 bg-black border-2 border-white p-4 items-end">
        <div className="flex-1">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">Data</label>
          <input 
            type="date" 
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-transparent border-b-2 border-white text-white font-mono text-sm p-2 outline-none focus:bg-white/10"
          />
        </div>
        <div className="flex-[2]">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">Descrição</label>
          <input 
            type="text" 
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Ex: Pagamento Cliente X"
            className="w-full bg-transparent border-b-2 border-white text-white font-mono text-sm p-2 outline-none focus:bg-white/10"
          />
        </div>
        <div className="flex-1">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">Valor (R$)</label>
          <input 
            type="number" 
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-transparent border-b-2 border-white text-white font-mono text-sm p-2 outline-none focus:bg-white/10"
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setType('INCOME')}
            className={`px-4 py-2 font-mono text-xs font-bold border-2 border-white transition-colors ${type === 'INCOME' ? 'bg-white text-black' : 'bg-transparent text-white hover:bg-white/10'}`}
          >
            + ENTRADA
          </button>
          <button 
            onClick={() => setType('EXPENSE')}
            className={`px-4 py-2 font-mono text-xs font-bold border-2 border-white transition-colors ${type === 'EXPENSE' ? 'bg-white text-black' : 'bg-transparent text-white hover:bg-white/10'}`}
          >
            - SAÍDA
          </button>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-white text-black px-6 py-2 font-display uppercase tracking-widest font-bold border-2 border-white hover:bg-gray-300 transition-colors h-[42px] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Lançar
        </button>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-auto border-2 border-white">
        <table className="w-full text-left font-mono text-sm">
          <thead className="bg-white text-black sticky top-0">
            <tr>
              <th className="p-4 font-bold uppercase tracking-widest text-xs">Data</th>
              <th className="p-4 font-bold uppercase tracking-widest text-xs">Descrição</th>
              <th className="p-4 font-bold uppercase tracking-widest text-xs text-right">Valor</th>
              <th className="p-4 font-bold uppercase tracking-widest text-xs text-center">Ação</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500 uppercase tracking-widest">Nenhum lançamento registrado</td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="border-b border-white/20 hover:bg-white/5 transition-colors">
                  <td className="p-4">{new Date(entry.date).toLocaleDateString('pt-BR')}</td>
                  <td className="p-4">{entry.description}</td>
                  <td className={`p-4 text-right font-bold ${entry.type === 'INCOME' ? 'text-white' : 'text-gray-400'}`}>
                    {entry.type === 'INCOME' ? '+' : '-'}{formatCurrency(entry.amount)}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 hover:bg-white hover:text-black transition-colors rounded-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
