import { X, Calculator, AlignLeft, LineChart, GripHorizontal, Maximize2, Coins, TrendingUp, Tag, Package, Paperclip, LogOut } from 'lucide-react';
import { useBusinessStore, Widget } from '@core/data/store';
import { RawNote } from './tools/RawNote';
import { CalculatorWidget } from './tools/CalculatorWidget';
import { CashflowWidget } from './tools/CashflowWidget';
import { FixedCostsWidget } from './tools/FixedCostsWidget';
import { RevenueProjWidget } from './tools/RevenueProjWidget';
import { ServicePricerWidget } from './tools/ServicePricerWidget';
import { ProductSheetWidget } from './tools/ProductSheetWidget';
import { FolderBasic } from './tools/FolderBasic';
import { FolderLinked } from './tools/FolderLinked';
import { FolderSmart } from './tools/FolderSmart';

// Mapeia o "type" do widget para o ícone real
const getWidgetIcon = (type: string) => {
  switch (type) {
    case 'raw_note': return <AlignLeft className="w-4 h-4" />;
    case 'calculator': return <Calculator className="w-4 h-4" />;
    case 'cashflow': return <LineChart className="w-4 h-4" />;
    case 'fixed_costs': return <Coins className="w-4 h-4" />;
    case 'revenue_proj': return <TrendingUp className="w-4 h-4" />;
    case 'service_pricer': return <Tag className="w-4 h-4" />;
    case 'product_sheet': return <Package className="w-4 h-4" />;
    case 'folder_basic': return <Package className="w-4 h-4" />; // Or Folder, but we don't have it imported here. Let's just use Package or Grip.
    case 'folder_linked': return <Package className="w-4 h-4" />;
    case 'folder_smart': return <Package className="w-4 h-4" />;
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
    case 'fixed_costs':
      return <FixedCostsWidget mode={mode} widgetId={widgetId} />;
    case 'revenue_proj':
      return <RevenueProjWidget mode={mode} widgetId={widgetId} />;
    case 'service_pricer':
      return <ServicePricerWidget mode={mode} widgetId={widgetId} />;
    case 'product_sheet':
      return <ProductSheetWidget mode={mode} widgetId={widgetId} />;
    case 'folder_basic':
      return <FolderBasic mode={mode} widgetId={widgetId} />;
    case 'folder_linked':
      return <FolderLinked mode={mode} widgetId={widgetId} />;
    case 'folder_smart':
      return <FolderSmart mode={mode} widgetId={widgetId} />;
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
  scale?: number;
}

  export function WidgetWindow({ widget }: WidgetWindowProps) {
  const { 
    removeWidget, setFocusedWidget, moveWidgetToFolder,
    activeTool, stapleSourceId, setStapleSourceId, toggleConnection, connections,
    linkingParentId, setLinkingParentId, toggleTreeLink
  } = useBusinessStore();

  const handlePointerDownCapture = (e: React.PointerEvent) => {
    if (activeTool === 'stapler') {
      e.stopPropagation(); // Previne Rnd drag
      e.preventDefault();

      if (!stapleSourceId) {
        setStapleSourceId(widget.id);
      } else if (stapleSourceId === widget.id) {
        setStapleSourceId(null); // Cancela o grampo se clicar nele mesmo
      } else {
        toggleConnection(stapleSourceId, widget.id);
        setStapleSourceId(null);
      }
    } else if (activeTool === 'tree') {
      e.stopPropagation(); // Previne Rnd drag
      e.preventDefault();

      if (!linkingParentId) {
        setLinkingParentId(widget.id);
      } else if (linkingParentId === widget.id) {
        setLinkingParentId(null); // Cancela o link se clicar nele mesmo
      } else {
        toggleTreeLink(linkingParentId, widget.id);
        setLinkingParentId(null);
      }
    }
  };

  const isStapleSource = stapleSourceId === widget.id;
  const isLinkingParent = linkingParentId === widget.id;
  const hasConnections = connections.some(c => c.source === widget.id || c.target === widget.id);
  const isFolder = widget.type.startsWith('folder_');

  if (isFolder) {
    return (
      <div 
        className={`w-full h-full relative group drag-handle cursor-pointer transition-transform hover:scale-105 ${activeTool !== 'cursor' ? 'cursor-crosshair' : ''}`}
        onDoubleClick={() => setFocusedWidget(widget.id)}
        onPointerDownCapture={handlePointerDownCapture}
      >
        <div className="absolute top-2 right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setFocusedWidget(widget.id);
            }}
            className="bg-black border-2 border-white text-white hover:bg-white hover:text-black rounded-none p-1 transition-colors"
            title="Expandir (Micro Mode)"
          >
            <Maximize2 className="h-3 w-3" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              removeWidget(widget.id);
            }}
            className="bg-black border-2 border-white text-white hover:bg-red-500 hover:border-red-500 rounded-none p-1 transition-colors"
            title="Excluir Pasta"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        {renderTool(widget.type, "micro", widget.id)}
      </div>
    );
  }

  return (
    <div 
      className={`flex flex-col h-full w-full border-2 transition-colors duration-200 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] group ${
        isStapleSource 
          ? 'border-yellow-400 bg-yellow-400/10' 
          : isLinkingParent
            ? 'border-green-400 bg-green-400/10'
            : activeTool === 'stapler'
              ? 'border-neutral-700 bg-black hover:border-yellow-400/50 cursor-crosshair'
              : activeTool === 'tree'
                ? 'border-neutral-700 bg-black hover:border-green-400/50 cursor-crosshair'
                : 'border-border bg-black hover:border-white'
      }`}
      onPointerDownCapture={handlePointerDownCapture}
    >
      
      {/* Header - Drag Handle */}
      <div className={`drag-handle flex items-center justify-between transition-colors px-3 py-1 select-none ${
        isStapleSource 
          ? 'bg-yellow-400 text-black' 
          : isLinkingParent
            ? 'bg-green-400 text-black'
            : (activeTool === 'stapler' || activeTool === 'tree')
              ? 'bg-border text-white'
              : 'bg-border group-hover:bg-white text-white group-hover:text-black cursor-move'
      }`}>
        <div className={`flex items-center gap-2 drag-handle w-full ${activeTool === 'cursor' ? 'cursor-move' : ''}`}>
          {hasConnections && <Paperclip className="w-4 h-4" />}
          {!hasConnections && getWidgetIcon(widget.type)}
          <span className="font-display font-bold uppercase tracking-widest text-[10px] w-full truncate">
            {widget.title}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {widget.parentId && (
            <button 
              onClick={() => moveWidgetToFolder(widget.id, undefined)}
              className="hover:bg-blue-500 hover:text-white rounded-sm transition-colors p-1"
              title="Ejetar para a Mesa Principal"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
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
  );
}
