import { useBusinessStore } from "@core/data/store";
import { X, Blocks } from "lucide-react";
import { renderTool } from "./WidgetWindow";

export function FocusOverlay() {
  const { focusedWidgetId, setFocusedWidget, widgets, updateWidgetTitle } = useBusinessStore();

  if (!focusedWidgetId) return null;

  const widget = widgets.find(w => w.id === focusedWidgetId);
  if (!widget) return null;

  let headerBg = "bg-white text-black";
  let headerBorder = "border-white";
  let containerBorder = "border-white";
  let containerShadow = "shadow-[0_0_50px_rgba(255,255,255,0.1)]";

  if (widget.type === "folder_linked") {
    headerBg = "bg-purple-500 text-white";
    headerBorder = "border-purple-500";
    containerBorder = "border-purple-500";
    containerShadow = "shadow-[0_0_50px_rgba(168,85,247,0.15)]";
  } else if (widget.type === "folder_smart") {
    headerBg = "bg-blue-500 text-white";
    headerBorder = "border-blue-500";
    containerBorder = "border-blue-500";
    containerShadow = "shadow-[0_0_50px_rgba(59,130,246,0.15)]";
  }

  return (
    <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex flex-col p-4 sm:p-8 animate-in fade-in duration-200">
      
      {/* Container Principal do Modo Foco */}
      <div className={`flex-1 w-full max-w-7xl mx-auto flex flex-col border-2 ${containerBorder} bg-black ${containerShadow}`}>
        
        {/* Cabeçalho Brutalista do Modo Foco */}
        <div className={`flex items-center justify-between border-b-2 ${headerBorder} ${headerBg} px-4 py-3 transition-colors`}>
          <div className="flex items-center gap-3">
            <Blocks className="h-6 w-6" />
            <div className="flex items-center gap-2">
              <input 
                type="text"
                value={widget.title}
                onChange={(e) => updateWidgetTitle(widget.id, e.target.value)}
                className="font-xirod text-sm sm:text-base tracking-widest uppercase bg-transparent border-none outline-none focus:border-b-2 focus:border-current w-[400px] truncate"
              />
              <span className="font-xirod text-sm sm:text-base tracking-widest uppercase opacity-50">| FOCUS MODE</span>
            </div>
          </div>
          
          <button 
            onClick={() => setFocusedWidget(null)}
            className="flex items-center gap-2 px-4 py-1 bg-black text-white hover:bg-gray-800 transition-colors font-mono text-xs uppercase tracking-wider"
          >
            Voltar para a Mesa
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Área de Trabalho do Módulo (Macro Mode) */}
        <div className="flex-1 bg-black overflow-hidden relative">
          {renderTool(widget.type, "macro", widget.id)}
        </div>

      </div>
    </div>
  );
}
