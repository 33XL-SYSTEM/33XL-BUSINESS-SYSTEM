import { useState } from 'react';
import { useBusinessStore } from '@core/data/store';
import { Trash2, History, FlaskConical } from 'lucide-react';

interface CalculatorProps {
  mode: "macro" | "micro";
  widgetId: string;
}

interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
}

export function CalculatorWidget({ mode, widgetId }: CalculatorProps) {
  const { widgets, updateWidgetData } = useBusinessStore();
  const widget = widgets.find(w => w.id === widgetId);
  const screen = widget?.data?.screen || '0';
  const memory = widget?.data?.memory || '';
  const history: HistoryEntry[] = widget?.data?.history || [];

  const [isScientific, setIsScientific] = useState(false);

  const handleInput = (val: string) => {
    if (val === 'C') {
      updateWidgetData(widgetId, { screen: '0', memory: '' });
      return;
    }
    if (val === 'DEL') {
      if (screen !== '0' && screen !== 'ERROR') {
        const newScreen = screen.slice(0, -1) || '0';
        updateWidgetData(widgetId, { screen: newScreen });
      }
      return;
    }
    if (val === '=') {
      try {
        const expression = screen;
        
        // Parsing científico
        let parsedExpression = expression
          .replace(/√\(/g, 'Math.sqrt(')
          .replace(/√/g, 'Math.sqrt') // Fallback if no paren
          .replace(/\^/g, '**')
          .replace(/%/g, '/100')
          .replace(/π/g, 'Math.PI')
          .replace(/E/g, 'Math.E');
        
        // Auto-close parentesis for Math.sqrt if missing
        if (parsedExpression.includes('Math.sqrt') && !parsedExpression.includes('Math.sqrt(')) {
             parsedExpression = parsedExpression.replace(/Math\.sqrt(\d+)/g, 'Math.sqrt($1)');
        }

        const func = new Function(`return ${parsedExpression}`);
        let result = func();
        
        // Format to avoid extremely long decimals
        if (typeof result === 'number' && !Number.isInteger(result)) {
           result = parseFloat(result.toFixed(10)).toString();
        } else {
           result = result.toString();
        }
        
        const newHistoryEntry: HistoryEntry = {
          id: Math.random().toString(36).substr(2, 9),
          expression,
          result
        };

        updateWidgetData(widgetId, { 
          screen: result, 
          memory: expression,
          history: [...history, newHistoryEntry] 
        });
      } catch (e) {
        updateWidgetData(widgetId, { screen: 'ERROR' });
      }
      return;
    }

    // Handle √ to add parens automatically
    let inputVal = val;
    if (val === '√') inputVal = '√(';
    
    let newScreen = screen;
    if (screen === 'ERROR' || (memory !== '' && screen === '0')) {
      newScreen = inputVal;
    } else if (screen === '0' && inputVal !== '.' && inputVal !== '%' && inputVal !== '^') {
      newScreen = inputVal;
    } else {
      newScreen += inputVal;
    }
    
    if (memory !== '' && screen !== 'ERROR') {
      if (['+', '-', '*', '/', '^', '%'].includes(inputVal)) {
        // Continua
      } else if (newScreen.length > 1 && newScreen.startsWith(screen)) {
        newScreen = inputVal;
      }
      updateWidgetData(widgetId, { memory: '' });
    }

    updateWidgetData(widgetId, { screen: newScreen });
  };

  const clearHistory = () => {
    updateWidgetData(widgetId, { history: [] });
  };

  const restoreFromHistory = (entry: HistoryEntry) => {
    updateWidgetData(widgetId, { screen: entry.result, memory: entry.expression });
  };

  const buttonsMacro = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    'C', '0', '.', '+'
  ];

  const buttonsRow1 = isScientific ? ['(', ')', '7', '8', '9', '/'] : ['7', '8', '9', '/'];
  const buttonsRow2 = isScientific ? ['√', '^', '4', '5', '6', '*'] : ['4', '5', '6', '*'];
  const buttonsRow3 = isScientific ? ['%', 'π', '1', '2', '3', '-'] : ['1', '2', '3', '-'];
  const buttonsRow4 = isScientific ? ['DEL', 'E', 'C', '0', '.', '+'] : ['C', '0', '.', '+'];

  const totalHistorySum = history.reduce((acc, curr) => {
    const val = parseFloat(curr.result);
    return isNaN(val) ? acc : acc + val;
  }, 0);

  if (mode === "macro") {
    return (
      <div className="w-full h-full flex flex-col bg-black text-white p-4 relative group/calc shadow-[inset_0_0_0_2px_white]">
        <div className="bg-white text-black p-2 mb-4 h-16 flex flex-col justify-end items-end shadow-[inset_0_0_0_2px_black]">
          <span className="font-mono text-[10px] text-gray-500">{memory}</span>
          <span className="font-mono text-xl font-bold truncate w-full text-right">{screen}</span>
        </div>
        <div className="flex-1 grid grid-cols-4 gap-1">
          {buttonsMacro.map((btn) => (
            <button
              key={btn}
              onClick={() => handleInput(btn)}
              className="bg-black text-white border-2 border-white font-mono font-bold text-sm hover:bg-white hover:text-black transition-colors"
            >
              {btn}
            </button>
          ))}
          <button
              onClick={() => handleInput('=')}
              className="col-span-4 bg-black text-white border-2 border-white font-mono font-bold text-sm hover:bg-white hover:text-black transition-colors"
            >
              =
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex bg-black p-8 relative gap-8">
      
      {/* LADO ESQUERDO: Máquina de Calcular */}
      <div className="flex-1 flex flex-col bg-black text-white p-8 relative shadow-[0_0_0_4px_white]">
        
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-xirod text-white text-xl tracking-widest uppercase">
            Calculadora
          </h3>
          <button 
            onClick={() => setIsScientific(!isScientific)}
            className={`flex items-center gap-2 px-4 py-2 border-2 transition-colors font-mono text-xs uppercase tracking-widest font-bold ${isScientific ? 'border-white bg-white text-black' : 'border-gray-600 text-gray-400 hover:border-white hover:text-white'}`}
          >
            <FlaskConical className="w-4 h-4" />
            MODO CIENTÍFICO : {isScientific ? 'ON' : 'OFF'}
          </button>
        </div>
        
        {/* Screen */}
        <div className="bg-white text-black p-4 mb-8 h-32 flex flex-col justify-end items-end shadow-[inset_0_0_0_4px_black]">
          <span className="font-mono text-sm text-gray-500 mb-2">{memory}</span>
          <span className="font-mono text-5xl font-bold truncate w-full text-right">{screen}</span>
        </div>

        {/* Buttons Grid */}
        <div className={`flex-1 grid ${isScientific ? 'grid-cols-6' : 'grid-cols-4'} gap-2`}>
          {[...buttonsRow1, ...buttonsRow2, ...buttonsRow3, ...buttonsRow4].map((btn, i) => (
            <button
              key={`${btn}-${i}`}
              onClick={() => handleInput(btn)}
              className={`bg-black text-white border-[4px] border-white font-mono font-bold text-3xl hover:bg-white hover:text-black transition-colors ${btn === 'DEL' ? 'text-xl' : ''}`}
            >
              {btn}
            </button>
          ))}
           <button
              onClick={() => handleInput('=')}
              className={`${isScientific ? 'col-span-6' : 'col-span-4'} bg-black text-white border-[4px] border-white font-mono font-bold text-3xl hover:bg-white hover:text-black transition-colors py-4 mt-2`}
            >
              =
          </button>
        </div>
      </div>

      {/* LADO DIREITO: Fita de Histórico */}
      <div className="w-96 flex flex-col bg-black border-4 border-white">
        <div className="p-4 border-b-4 border-white flex justify-between items-center bg-white text-black">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5" />
            <h3 className="font-xirod text-sm tracking-widest uppercase">
              Fita
            </h3>
          </div>
          <button 
            onClick={clearHistory}
            className="p-1 hover:bg-black hover:text-white transition-colors"
            title="Limpar Fita"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {history.length === 0 ? (
            <div className="text-center font-mono text-xs text-gray-500 uppercase tracking-widest mt-10">
              A fita está vazia.
            </div>
          ) : (
            history.map((entry) => (
              <button 
                key={entry.id}
                onClick={() => restoreFromHistory(entry)}
                className="w-full text-right p-3 border-2 border-transparent hover:border-white hover:bg-white/5 transition-colors font-mono flex flex-col group"
              >
                <span className="text-xs text-gray-500 group-hover:text-gray-300">{entry.expression}</span>
                <span className="text-lg font-bold text-white">= {entry.result}</span>
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t-4 border-white bg-white text-black flex flex-col">
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-600 mb-1">
            Soma Geral da Fita
          </span>
          <span className="font-mono text-2xl font-bold text-right truncate">
            {totalHistorySum.toLocaleString('pt-BR', { maximumFractionDigits: 4 })}
          </span>
        </div>
      </div>
    </div>
  );
}
