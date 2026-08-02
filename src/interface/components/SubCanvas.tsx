import React, { useState, useRef, useEffect } from "react";
import { useBusinessStore } from "@core/data/store";
import { getClusters } from "@core/utils/clustering";
import { WidgetCluster } from "@interface/components/WidgetCluster";
import { Plus, Minus, Move } from 'lucide-react';

export function SubCanvas({ folderId, layout = "free" }: { folderId: string, layout?: "smart" | "free" }) {
  const { widgets, connections, updateWidgetPosition } = useBusinessStore();
  const folderWidgets = widgets.filter(w => w.parentId === folderId);
  const clusters = getClusters(folderWidgets, connections);

  // Agrupamento para Smart Layout
  const groupedByType = folderWidgets.reduce((acc, w) => {
    acc[w.type] = acc[w.type] || [];
    acc[w.type].push(w);
    return acc;
  }, {} as Record<string, typeof folderWidgets>);

  // Auto-Layout Inteligente
  useEffect(() => {
    if (layout !== "smart" || folderWidgets.length === 0) return;

    let currentY = 100;
    
    // Para cada categoria, alinha os blocos horizontalmente
    Object.entries(groupedByType).forEach(([, widgetsOfType]) => {
       let currentX = 100;
       let maxRowHeight = 0;
       
       widgetsOfType.forEach(w => {
          const targetX = currentX;
          const targetY = currentY;
          
          if (w.position.x !== targetX || w.position.y !== targetY) {
            updateWidgetPosition(w.id, { x: targetX, y: targetY });
          }
          
          const wWidth = w.size?.width || 320;
          const wHeight = w.size?.height || 320;
          
          currentX += wWidth + 60; // Espaçamento horizontal
          if (wHeight > maxRowHeight) maxRowHeight = wHeight;
       });
       
       currentY += maxRowHeight + 120; // Espaçamento vertical para a próxima categoria
    });
  }, [folderWidgets.length, layout]);

  // Determine Theme Color
  const isLinked = folderId === "ENDER_DIMENSION_01";
  const parentFolder = isLinked ? null : widgets.find(w => w.id === folderId);
  const folderType = isLinked ? "folder_linked" : (parentFolder?.type || "folder_basic");
  
  let gridColor = "rgba(255,255,255,";
  let textColorClass = "text-white";
  let borderColorClass = "border-white";
  let bgHoverClass = "hover:bg-white hover:text-black";
  let smartCategoryColor = "text-white/30";
  let smartCategoryBorder = "border-white/10";

  if (folderType === "folder_linked") {
    gridColor = "rgba(168,85,247,"; // Purple 500
    textColorClass = "text-purple-400";
    borderColorClass = "border-purple-500";
    bgHoverClass = "hover:bg-purple-500 hover:text-black";
  } else if (folderType === "folder_smart") {
    gridColor = "rgba(59,130,246,"; // Blue 500
    textColorClass = "text-blue-400";
    borderColorClass = "border-blue-500";
    bgHoverClass = "hover:bg-blue-500 hover:text-black";
    smartCategoryColor = "text-blue-400/50";
    smartCategoryBorder = "border-blue-500/20";
  }

  // Camera State
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 });
  
  // Pan State
  const [isDragging, setIsDragging] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const cameraStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsSpacePressed(true);
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

  // Previne o zoom nativo do navegador ao dar ctrl+scroll
  useEffect(() => {
    const preventDefault = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    };
    document.addEventListener("wheel", preventDefault, { passive: false });
    return () => document.removeEventListener("wheel", preventDefault);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSpacePressed || isShiftPressed || e.button === 1 || e.target === e.currentTarget) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      cameraStart.current = { ...camera };
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setCamera({
      ...camera,
      x: cameraStart.current.x + dx,
      y: cameraStart.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSensitivity = 0.0005; // Zoom bem mais suave
    const delta = -e.deltaY * zoomSensitivity;
    const newScale = Math.min(Math.max(0.1, camera.scale + delta), 2);
    setCamera(prev => ({ ...prev, scale: newScale }));
  };

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
    >
      {(isSpacePressed || isShiftPressed) && (
        <div className="absolute inset-0 z-40 cursor-grab active:cursor-grabbing" />
      )}
      <div 
        className="absolute inset-0 z-0 bg-black pointer-events-none"
        style={{
          backgroundSize: `${40 * camera.scale}px ${40 * camera.scale}px`,
          backgroundImage: `
            linear-gradient(to right, ${gridColor}0.1) 1px, transparent 1px),
            linear-gradient(to bottom, ${gridColor}0.1) 1px, transparent 1px)
          `,
          backgroundPosition: `${camera.x}px ${camera.y}px`,
        }}
      />
      
      <div 
        className="absolute inset-0 pointer-events-none transform-gpu"
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
          transformOrigin: '0 0'
        }}
      >
        {layout === "smart" && (
          <div className="absolute inset-0 pointer-events-none">
            {Object.keys(groupedByType).map((type) => {
               // Calculate Y position based on previous rows to draw the label
               // We can just use the state directly if the effect has already run, 
               // but the effect updates positions of widgets, so we can just read the first widget's Y!
               const firstWidget = groupedByType[type][0];
               const yPos = firstWidget ? firstWidget.position.y - 60 : 0;
               return (
                 <div 
                   key={type} 
                   className={`absolute left-[100px] font-xirod ${smartCategoryColor} text-2xl uppercase tracking-widest border-b-2 ${smartCategoryBorder} pb-2 w-[800px]`}
                   style={{ top: `${yPos}px` }}
                 >
                   {type.replace('folder_', 'Pasta: ').replace('_', ' ')}
                 </div>
               );
            })}
          </div>
        )}

        <div className="pointer-events-auto w-full h-full">
          {clusters.map((cluster) => (
            <WidgetCluster key={cluster.id} cluster={cluster} scale={camera.scale} />
          ))}
        </div>
      </div>

      <div className={`absolute bottom-4 right-4 flex items-center bg-black border-2 ${borderColorClass} ${textColorClass} z-20`}>
        <button 
          onClick={() => setCamera(prev => ({ ...prev, scale: Math.max(0.1, prev.scale - 0.1) }))}
          className={`p-2 ${bgHoverClass} transition-colors border-r-2 ${borderColorClass}`}
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className={`px-3 font-mono text-xs w-16 text-center border-r-2 ${borderColorClass}`}>
          {Math.round(camera.scale * 100)}%
        </div>
        <button 
          onClick={() => setCamera(prev => ({ ...prev, scale: Math.min(2, prev.scale + 0.1) }))}
          className={`p-2 ${bgHoverClass} transition-colors border-r-2 ${borderColorClass}`}
        >
          <Plus className="w-4 h-4" />
        </button>
        <button 
          onClick={handleReset}
          className={`p-2 ${bgHoverClass} transition-colors`}
        >
          <Move className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
