import { useState, useRef, useEffect } from "react";
import { useBusinessStore } from "@core/data/store";
import { getClusters } from "@core/utils/clustering";
import { WidgetCluster } from "@interface/components/WidgetCluster";
import { FocusOverlay } from "@interface/components/FocusOverlay";
import { TreeCanvas } from "@interface/components/TreeCanvas";
import { Plus, Minus, Move } from 'lucide-react';

export function MainBoard() {
  const { widgets, connections } = useBusinessStore();

  const rootWidgets = widgets.filter(w => !w.parentId);
  const clusters = getClusters(rootWidgets, connections);
  
  // Camera State
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 });
  
  // Pan State
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  
  // Modifiers
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(true);
      }
      if (e.key === 'Shift') setIsShiftPressed(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsSpacePressed(false);
      if (e.key === 'Shift') setIsShiftPressed(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only pan if holding Space or Shift
    if (isSpacePressed || isShiftPressed) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - camera.x, y: e.clientY - camera.y };
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      setCamera(prev => ({
        ...prev,
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Always Zoom with scroll wheel
    e.preventDefault();
    const zoomSensitivity = 0.0005; // Zoom bem mais suave
    const delta = -e.deltaY * zoomSensitivity;
    const newScale = Math.min(Math.max(0.1, camera.scale + delta), 2);
    setCamera(prev => ({ ...prev, scale: newScale }));
  };

  // Previne o zoom nativo do navegador ao dar ctrl+scroll
  useEffect(() => {
    const preventDefault = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    };
    document.addEventListener("wheel", preventDefault, { passive: false });
    return () => document.removeEventListener("wheel", preventDefault);
  }, []);

  const handleReset = () => {
    setCamera({ x: 0, y: 0, scale: 1 });
  };

  return (
    <div 
      className={`flex-1 w-full h-full relative overflow-hidden bg-black select-none ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      style={{
        // Matemática brutalista para o grid infinito
        backgroundPosition: `${camera.x}px ${camera.y}px`,
        backgroundSize: `${4 * camera.scale}rem ${4 * camera.scale}rem`,
        backgroundImage: `linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)`
      }}
    >
      
      {/* Workspace Watermark */}
      {widgets.length === 0 && (
        <div className="absolute bottom-4 left-4 pointer-events-none opacity-20">
          <div className="border-2 border-dashed border-white p-4 flex flex-col items-start">
            <h1 className="font-xirod text-sm tracking-widest text-white mb-2">CANVAS LIVRE</h1>
            <p className="font-mono text-[8px] uppercase tracking-widest text-left max-w-[200px]">
              Sua mesa de trabalho está vazia. Acesse o menu superior para instanciar ferramentas de modelagem no quadro.
            </p>
          </div>
        </div>
      )}

      {/* Camada de Interceptação para Panning (Quando Space ou Shift estão pressionados) */}
      {(isSpacePressed || isShiftPressed) && (
        <div className="absolute inset-0 z-40 cursor-grab active:cursor-grabbing" />
      )}

      {/* Camada de Transformação (A Câmera em si) */}
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none origin-top-left"
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
        }}
      >
        <div className="pointer-events-auto w-full h-full">
          {/* Renderização dos Clusters Arrastáveis */}
          {/* Camada das Conexões da Árvore */}
          <TreeCanvas />

          {/* Camada dos Blocos */}
          {clusters.map((cluster) => (
            <WidgetCluster key={cluster.id} cluster={cluster} scale={camera.scale} />
          ))}
        </div>
      </div>
      
      {/* Camera UI Controls */}
      <div className="absolute bottom-4 right-4 flex bg-black border-2 border-border text-white z-10">
        <button 
          onClick={() => setCamera(prev => ({ ...prev, scale: Math.max(0.1, prev.scale - 0.1) }))}
          className="p-3 hover:bg-white hover:text-black transition-colors border-r-2 border-border"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="px-4 py-2 flex items-center justify-center font-mono text-xs border-r-2 border-border min-w-[70px]">
          {Math.round(camera.scale * 100)}%
        </div>
        <button 
          onClick={() => setCamera(prev => ({ ...prev, scale: Math.min(2, prev.scale + 0.1) }))}
          className="p-3 hover:bg-white hover:text-black transition-colors border-r-2 border-border"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button 
          onClick={handleReset}
          className="p-3 hover:bg-white hover:text-black transition-colors"
          title="Reset Camera"
        >
          <Move className="w-4 h-4" />
        </button>
      </div>

      {/* Camada de Focus Mode (Micro) */}
      <FocusOverlay />
      
    </div>
  );
}
