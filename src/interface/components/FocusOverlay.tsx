import { useBusinessStore } from "@core/data/store";
import { X, Blocks } from "lucide-react";
import { renderTool } from "./WidgetWindow";

export function FocusOverlay() {
  const { focusedWidgetId, setFocusedWidget, widgets } = useBusinessStore();

  if (!focusedWidgetId) return null;

  const widget = widgets.find(w => w.id === focusedWidgetId);
  if (!widget) return null;

  return (
    <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex flex-col p-4 sm:p-8 animate-in fade-in duration-200">
      
      {/* Container Principal do Modo Foco */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col border-2 border-white bg-black shadow-[0_0_50px_rgba(255,255,255,0.1)]">
        
        {/* Cabeçalho Brutalista do Modo Foco */}
        <div className="flex items-center justify-between border-b-2 border-white bg-white text-black px-4 py-3">
          <div className="flex items-center gap-3">
            <Blocks className="h-6 w-6" />
            <h2 className="font-xirod text-sm sm:text-base tracking-widest uppercase">
              {widget.title} <span className="text-gray-400">| FOCUS MODE</span>
            </h2>
          </div>
          
          <button 
            onClick={() => setFocusedWidget(null)}
            className="flex items-center gap-2 px-4 py-1 bg-black text-white hover:bg-gray-800 transition-colors font-mono text-xs uppercase tracking-wider"
          >
            Voltar para a Mesa
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Área de Trabalho do Módulo (Micro Mode) */}
        <div className="flex-1 bg-black overflow-hidden relative">
          {renderTool(widget.type, "micro", widget.id)}
        </div>

      </div>
    </div>
  );
}
