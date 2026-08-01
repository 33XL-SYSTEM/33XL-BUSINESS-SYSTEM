import { Rnd } from 'react-rnd';
import { X, Calculator, AlignLeft, LineChart, GripHorizontal, Maximize2 } from 'lucide-react';
import { useBusinessStore, Widget } from '@core/data/store';
import { RawNote } from './tools/RawNote';
import { CalculatorWidget } from './tools/CalculatorWidget';
import { CashflowWidget } from './tools/CashflowWidget';

// Mapeia o "type" do widget para o ícone real
const getWidgetIcon = (type: string) => {
  switch (type) {
    case 'raw_note': return <AlignLeft className="w-4 h-4" />;
    case 'calculator': return <Calculator className="w-4 h-4" />;
    case 'cashflow': return <LineChart className="w-4 h-4" />;
    default: return <GripHorizontal className="w-4 h-4" />;
  }
};

// Mapeia o "type" do widget para o componente real
export const renderTool = (type: string, mode: "macro" | "micro", widgetId: string) => {
  switch (type) {
    case 'raw_note':
      return <RawNote mode={mode} widgetId={widgetId} />;
    case 'calculator':
      return <CalculatorWidget mode={mode} widgetId={widgetId} />;
    case 'cashflow':
      return <CashflowWidget mode={mode} widgetId={widgetId} />;
    default:
      return (
        <div className="flex items-center justify-center h-full w-full bg-neutral-900 text-neutral-500 font-mono text-sm">
          [Módulo em Construção: {type}]
        </div>
      );
  }
};

interface WidgetWindowProps {
  widget: Widget;
}

export function WidgetWindow({ widget }: WidgetWindowProps) {
  const { removeWidget, updateWidgetPosition, updateWidgetSize, setFocusedWidget } = useBusinessStore();

  return (
    <Rnd
      default={{
        x: widget.position.x,
        y: widget.position.y,
        width: widget.size?.width || 320,
        height: widget.size?.height || 320,
      }}
      minWidth={200}
      minHeight={150}
      bounds="parent" // Não deixa sair da tela (do main board)
      dragHandleClassName="drag-handle" // Só arrasta se clicar na classe .drag-handle
      onDragStop={(_e, d) => {
        updateWidgetPosition(widget.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        updateWidgetSize(widget.id, {
          width: parseInt(ref.style.width, 10),
          height: parseInt(ref.style.height, 10),
        });
        updateWidgetPosition(widget.id, position);
      }}
      className="z-10 group"
    >
      <div className="flex flex-col h-full w-full border-2 border-border bg-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:border-white transition-colors duration-200">
        
        {/* Header - Drag Handle */}
        <div className="drag-handle flex items-center justify-between bg-border group-hover:bg-white text-white group-hover:text-black transition-colors px-3 py-1 cursor-move select-none">
          <div className="flex items-center gap-2 drag-handle cursor-move w-full" onPointerDown={(e) => e.stopPropagation()}>
            {getWidgetIcon(widget.type)}
            <span className="font-display font-bold uppercase tracking-widest text-[10px]">
              {widget.title}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setFocusedWidget(widget.id)}
              className="hover:bg-black hover:text-white rounded-sm transition-colors p-1"
              title="Expandir (Micro Mode)"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <button 
              onClick={() => removeWidget(widget.id)}
              className="hover:bg-red-500 hover:text-white rounded-sm transition-colors p-1"
              title="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Inner Content */}
        <div className="flex-1 overflow-hidden relative bg-black">
          {renderTool(widget.type, "macro", widget.id)}
        </div>
        
      </div>
    </Rnd>
  );
}
