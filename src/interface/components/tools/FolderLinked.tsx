import { Box } from 'lucide-react';
import { useBusinessStore } from '@core/data/store';
import { SubCanvas } from '@interface/components/SubCanvas';

export function FolderLinked({ mode, widgetId }: { mode: "macro" | "micro", widgetId: string }) {
  const { hoveredFolderId } = useBusinessStore();
  const isHovered = hoveredFolderId === widgetId;

  if (mode === "macro") {
    // Todas as pastas "Linked" acessam o mesmo folderId hardcoded
    return <SubCanvas folderId="ENDER_DIMENSION_01" />;
  }
  
  return (
    <div className={`w-full h-full flex flex-col pt-2 transition-transform duration-200 group ${isHovered ? 'scale-105' : 'hover:-translate-y-1'}`} style={{ perspective: '1000px' }}>
      
      {/* Aba Traseira */}
      <div 
        className={`w-[45%] h-6 border-2 border-purple-500 border-b-0 transition-colors duration-300 z-0 relative ${
          isHovered ? 'bg-purple-900/50' : 'bg-black group-hover:bg-purple-950'
        }`} 
        style={{ marginBottom: '-2px' }}
      ></div>

      {/* Corpo da Pasta */}
      <div className="flex-1 relative z-10">
        
        {/* PARTE DE TRÁS E CONTEÚDO (Fundo da pasta) */}
        <div className={`absolute inset-0 border-2 border-purple-500 flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
          isHovered ? 'bg-purple-900/50 shadow-[0px_0px_20px_5px_rgba(168,85,247,0.5)]' : 'bg-black group-hover:bg-purple-950 shadow-[4px_4px_0px_0px_rgba(168,85,247,1)]'
        }`}>
          <Box className="w-8 h-8 text-purple-400 mb-2" strokeWidth={1.5} />
          <span className="text-[10px] font-xirod uppercase tracking-widest text-purple-400 text-center">Pasta<br/>Interligada</span>
        </div>

        {/* CAPA DA FRENTE (Animação 3D) */}
        <div 
          className="absolute inset-0 border-2 border-purple-500 pointer-events-none transition-all duration-300 origin-bottom flex flex-col items-center justify-center"
          style={{ 
             backgroundColor: isHovered ? 'transparent' : 'black',
             transform: isHovered ? 'rotateX(-60deg)' : 'rotateX(0deg)',
             transformStyle: 'preserve-3d'
          }}
        >
          {/* Decalque na capa para textura */}
          <div 
            className="absolute inset-0 bg-black transition-opacity duration-300 flex flex-col items-center justify-center"
            style={{ opacity: isHovered ? 0.8 : 1 }}
          >
            <Box className="w-8 h-8 text-purple-400 mb-2 opacity-50" strokeWidth={1.5} />
            <span className="text-[10px] font-xirod uppercase tracking-widest text-purple-400 text-center opacity-50">Pasta<br/>Interligada</span>
          </div>
        </div>

      </div>
    </div>
  );
}
