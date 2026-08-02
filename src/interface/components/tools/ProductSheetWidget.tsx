import { useState, useEffect } from 'react';
import { useBusinessStore } from '@core/data/store';
import { Package, Plus, Trash2 } from 'lucide-react';

interface ProductMaterial {
  id: string;
  name: string;
  qty: number;
  unitCost: number;
}

interface ProductSheetData {
  productName: string;
  materials: ProductMaterial[];
  margin: number;
}

interface ProductSheetWidgetProps {
  mode: "macro" | "micro";
  widgetId: string;
}

const DEFAULT_DATA: ProductSheetData = {
  productName: 'NOVO PRODUTO',
  materials: [],
  margin: 50,
};

export function ProductSheetWidget({ mode, widgetId }: ProductSheetWidgetProps) {
  const { widgets, updateWidgetData } = useBusinessStore();
  const widget = widgets.find(w => w.id === widgetId);
  const data: ProductSheetData = widget?.data?.productSheet || DEFAULT_DATA;

  const [matName, setMatName] = useState('');
  const [matQty, setMatQty] = useState('');
  const [matCost, setMatCost] = useState('');

  useEffect(() => {
    if (!widget?.data?.productSheet) {
      updateWidgetData(widgetId, { productSheet: DEFAULT_DATA });
    }
  }, [widgetId, widget?.data?.productSheet, updateWidgetData]);

  const updateData = (field: keyof ProductSheetData, value: any) => {
    updateWidgetData(widgetId, {
      productSheet: {
        ...data,
        [field]: value,
      }
    });
  };

  const handleAddMaterial = () => {
    if (!matName || !matQty || !matCost) return;
    
    const newMaterial: ProductMaterial = {
      id: crypto.randomUUID(),
      name: matName,
      qty: parseFloat(matQty),
      unitCost: parseFloat(matCost),
    };

    updateData('materials', [...data.materials, newMaterial]);
    setMatName('');
    setMatQty('');
    setMatCost('');
  };

  const handleDeleteMaterial = (id: string) => {
    updateData('materials', data.materials.filter(m => m.id !== id));
  };

  const totalCost = data.materials.reduce((acc, curr) => acc + (curr.qty * curr.unitCost), 0);
  const suggestedPrice = totalCost * (1 + (data.margin || 0) / 100);
  const grossProfit = suggestedPrice - totalCost;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (mode === "macro") {
    return (
      <div className="w-full h-full flex flex-col p-6 bg-black text-white relative shadow-[inset_0_0_0_2px_white] group/product">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-xirod text-white text-lg tracking-widest uppercase leading-tight">
            Ficha de<br/>Produto
          </h3>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase max-w-full truncate">{data.productName}</span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tighter text-white mt-1">
            {formatCurrency(suggestedPrice)}
          </h2>
          <div className="mt-2 flex items-center gap-2 text-gray-400">
            <Package className="w-3 h-3" />
            <span className="font-mono text-[10px] tracking-wider uppercase">
              PREÇO SUGERIDO (MARGEM {data.margin}%)
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b-2 border-border flex-shrink-0 bg-black z-10 relative flex justify-between items-center gap-4">
        <div className="flex flex-col">
          <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">NOME DO PRODUTO (BOM)</span>
          <input
            type="text"
            value={data.productName}
            onChange={(e) => updateData('productName', e.target.value)}
            className="bg-transparent font-display font-bold text-2xl uppercase tracking-widest text-white focus:outline-none w-full"
          />
        </div>
        <Package className="w-8 h-8 text-gray-600" />
      </div>

      {/* Input Materials */}
      <div className="p-4 border-b-2 border-border bg-zinc-950 flex-shrink-0">
        <div className="grid grid-cols-12 gap-2">
          <input 
            type="text" 
            placeholder="INSUMO"
            value={matName}
            onChange={(e) => setMatName(e.target.value)}
            className="col-span-12 sm:col-span-5 bg-black border-2 border-border p-2 text-white font-mono text-xs uppercase focus:outline-none focus:border-white transition-colors"
          />
          <input 
            type="number" 
            placeholder="QTD"
            value={matQty}
            onChange={(e) => setMatQty(e.target.value)}
            className="col-span-4 sm:col-span-3 bg-black border-2 border-border p-2 text-white font-mono text-xs text-center uppercase focus:outline-none focus:border-white transition-colors"
          />
          <input 
            type="number" 
            placeholder="R$ UNIT"
            value={matCost}
            onChange={(e) => setMatCost(e.target.value)}
            className="col-span-5 sm:col-span-3 bg-black border-2 border-border p-2 text-white font-mono text-xs uppercase focus:outline-none focus:border-white transition-colors"
          />
          <button 
            onClick={handleAddMaterial}
            className="col-span-3 sm:col-span-1 bg-white text-black flex items-center justify-center p-2 hover:bg-gray-300 transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Materials List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-black">
        {data.materials.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <span className="font-mono text-xs text-gray-600 uppercase tracking-widest text-center">
              RECEITA VAZIA<br/>ADICIONE OS INSUMOS ACIMA
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {data.materials.map((mat) => {
              const rowTotal = mat.qty * mat.unitCost;
              return (
                <div key={mat.id} className="flex items-center justify-between p-3 border-2 border-border group hover:border-gray-500 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-white text-sm uppercase">{mat.name}</span>
                    <span className="font-mono text-[10px] text-gray-500 tracking-widest uppercase">
                      {mat.qty}x {formatCurrency(mat.unitCost)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-white font-bold">{formatCurrency(rowTotal)}</span>
                    <button 
                      onClick={() => handleDeleteMaterial(mat.id)}
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

      {/* Footer / Results */}
      <div className="p-4 border-t-2 border-border bg-zinc-950 flex-shrink-0 grid grid-cols-2 gap-4">
        
        <div className="flex flex-col border-r-2 border-border pr-4 justify-between">
           <div className="flex justify-between items-center mb-2">
             <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">CUSTO FÍSICO TOTAL</span>
             <span className="font-mono text-sm text-white font-bold">{formatCurrency(totalCost)}</span>
           </div>
           
           <div className="flex flex-col mt-2">
              <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1 flex justify-between">
                Margem Desejada (%)
              </label>
              <input
                type="number"
                value={data.margin}
                onChange={(e) => updateData('margin', parseFloat(e.target.value) || 0)}
                className="bg-black border-2 border-border p-2 text-white font-mono text-sm focus:outline-none focus:border-white transition-colors w-full"
              />
           </div>
        </div>

        <div className="flex flex-col justify-end pl-2">
           <div className="flex justify-between items-center mb-1">
             <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">LUCRO BRUTO</span>
             <span className="font-mono text-[10px] text-green-500 font-bold">+{formatCurrency(grossProfit)}</span>
           </div>
           <div className="flex flex-col mt-2">
             <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">PREÇO SUGERIDO (VENDA)</span>
             <span className="font-display font-bold text-3xl text-white tracking-tighter leading-none">{formatCurrency(suggestedPrice)}</span>
           </div>
        </div>
      </div>

    </div>
  );
}
