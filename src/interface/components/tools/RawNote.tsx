import { useBusinessStore } from '@core/data/store';
import { useState, useRef } from 'react';

interface RawNoteProps {
  mode: "macro" | "micro";
  widgetId: string;
}

export function RawNote({ mode, widgetId }: RawNoteProps) {
  const { widgets, updateWidgetData, updateWidgetTitle } = useBusinessStore();
  const widget = widgets.find(w => w.id === widgetId);
  const text = widget?.data?.content || '';
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (mode === "macro") {
    return (
      <div className="w-full h-full flex flex-col bg-black text-white p-6 border-t-2 border-border relative group/note shadow-[inset_0_0_0_2px_white]">
        <input 
          type="text"
          value={widget?.title || ""}
          onChange={(e) => updateWidgetTitle(widgetId, e.target.value)}
          className="font-xirod text-white text-lg sm:text-xl tracking-widest uppercase mb-4 z-10 bg-transparent border-none outline-none p-0 w-full truncate focus:ring-0 focus:border-b-2 focus:border-white"
          placeholder="TÍTULO"
        />
        
        <div className="flex-1 relative mt-2 mb-4">
          {/* Background de Linhas de Caderno Brutalista Escuro */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_90%,#fff_90%)] bg-[size:100%_1.5rem]" />
          
          {/* Drag Overlay (Duplo clique para editar) */}
          {!isEditing && (
            <div 
              className="absolute inset-0 z-20 cursor-move drag-handle bg-transparent"
              onDoubleClick={() => {
                setIsEditing(true);
                setTimeout(() => textareaRef.current?.focus(), 10);
              }}
              title="Segure para Arrastar (Duplo clique para escrever)"
            />
          )}

          <textarea
            ref={textareaRef}
            className="w-full h-full bg-transparent text-white border-0 focus:ring-0 resize-none font-mono text-xs leading-[1.5rem] outline-none relative z-10 font-bold"
            placeholder="Digite algo aqui..."
            value={text}
            onBlur={() => setIsEditing(false)}
            onChange={(e) => updateWidgetData(widgetId, { content: e.target.value })}
          />
        </div>

        <div className="mt-4 flex items-center justify-between border-t-2 border-white pt-4 z-10">
          <span className="font-mono text-[10px] font-bold text-white">
            {text.length} CARACTERES
          </span>
        </div>
      </div>
    );
  }

  // MICRO MODE (Full Editor)
  return (
    <div className="w-full h-full flex flex-col bg-black p-8 relative shadow-[inset_0_0_0_2px_white]">
      {/* Margem Esquerda de Caderno Escuro */}
      <div className="absolute left-12 top-0 bottom-0 w-[2px] bg-white opacity-20 pointer-events-none z-0" />
      
      {/* Background de Linhas de Caderno Brutalista Escuro */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_95%,#fff_95%)] bg-[size:100%_2rem] z-0" />

      <textarea
        className="w-full h-full bg-transparent text-white border-0 focus:ring-0 resize-none font-mono text-base leading-[2rem] outline-none relative z-10 pl-8 font-bold"
        placeholder="Digite suas anotações livres aqui. O salvamento é automático..."
        value={text}
        onChange={(e) => updateWidgetData(widgetId, { content: e.target.value })}
      />
    </div>
  );
}
