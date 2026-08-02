import { Folder } from 'lucide-react';
import { useBusinessStore } from '@core/data/store';
import { SubCanvas } from '@interface/components/SubCanvas';

export function FolderBasic({ mode, widgetId }: { mode: "macro" | "micro", widgetId: string }) {
  const { hoveredFolderId } = useBusinessStore();
  const isHovered = hoveredFolderId === widgetId;

  if (mode === "macro") {
    return <SubCanvas folderId={widgetId} />;
  }
  return (
    <div className={`w-full h-full flex flex-col pt-2 transition-transform duration-200 group ${isHovered ? 'scale-105' : 'hover:-translate-y-1'}`} style={{ perspective: '1000px' }}>
      
      {/* Aba Traseira */}
      <div 
        className={`w-[45%] h-6 border-2 border-white border-b-0 transition-colors duration-300 z-0 relative ${
          isHovered ? 'bg-zinc-800' : 'bg-black group-hover:bg-zinc-900'
        }`} 
        style={{ marginBottom: '-2px' }}
      ></div>

      {/* Corpo da Pasta */}
      <div className="flex-1 relative z-10">
        
        {/* PARTE DE TRÁS E CONTEÚDO (Fundo da pasta) */}
        <div className={`absolute inset-0 border-2 border-white flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
          isHovered ? 'bg-zinc-800 shadow-[0px_0px_20px_5px_rgba(255,255,255,0.4)]' : 'bg-black group-hover:bg-zinc-900 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]'
        }`}>
          <Folder className="w-8 h-8 text-white mb-2" strokeWidth={1.5} />
          <span className="text-[10px] font-xirod uppercase tracking-widest text-white text-center">Pasta<br/>Comum</span>
        </div>

        {/* CAPA DA FRENTE (Animação 3D) */}
        <div 
          className="absolute inset-0 border-2 border-white pointer-events-none transition-all duration-300 origin-bottom flex flex-col items-center justify-center"
          style={{ 
             backgroundColor: isHovered ? 'transparent' : 'black', // Fica transparente ao abrir para não tapar o conteúdo de trás 
             transform: isHovered ? 'rotateX(-60deg)' : 'rotateX(0deg)',
             transformStyle: 'preserve-3d'
          }}
        >
          {/* Um decalque na capa para dar textura */}
          <div 
            className="absolute inset-0 bg-black transition-opacity duration-300 flex flex-col items-center justify-center"
            style={{ opacity: isHovered ? 0.8 : 1 }}
          >
            <Folder className="w-8 h-8 text-white mb-2 opacity-50" strokeWidth={1.5} />
            <span className="text-[10px] font-xirod uppercase tracking-widest text-white text-center opacity-50">Pasta<br/>Comum</span>
          </div>
        </div>

      </div>
    </div>
  );
}
