import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { useBusinessStore } from '@core/data/store';
import { Cluster } from '@core/utils/clustering';
import { WidgetWindow } from './WidgetWindow';

interface WidgetClusterProps {
  cluster: Cluster;
  scale?: number;
}

export function WidgetCluster({ cluster, scale = 1 }: WidgetClusterProps) {
  const { updateWidgetPosition, updateWidgetSize, activeTool, setHoveredFolderId } = useBusinessStore();
  const [dragScale, setDragScale] = useState(1);

  // O Cluster usa a posição do seu "root" widget
  const rootWidget = cluster.widgets[0];
  
  if (!rootWidget) return null;

  // Calcula tamanho total do grid (aproximado para o Rnd ter uma dimensão base, 
  // embora o CSS Grid empurre o tamanho naturalmente se deixarmos default flexível)
  const widgetCount = cluster.widgets.length;
  const cols = Math.ceil(Math.sqrt(widgetCount));
  const rows = Math.ceil(widgetCount / cols);
  const baseWidth = rootWidget.size?.width || 320;
  const baseHeight = rootWidget.size?.height || 320;
  
  // Width e Height calculados para o grid
  const clusterWidth = cols * baseWidth; 
  const clusterHeight = rows * baseHeight;

  return (
    <Rnd
      scale={scale}
      default={{
        x: rootWidget.position.x,
        y: rootWidget.position.y,
        width: clusterWidth,
        height: clusterHeight,
      }}
      size={{
        width: clusterWidth,
        height: clusterHeight,
      }}
      enableResizing={activeTool !== 'stapler'}
      onResizeStop={(_e, _dir, ref) => {
        const newBaseWidth = parseInt(ref.style.width, 10) / cols;
        const newBaseHeight = parseInt(ref.style.height, 10) / rows;
        cluster.widgets.forEach(w => {
          updateWidgetSize(w.id, { width: newBaseWidth, height: newBaseHeight });
        });
      }}
      dragHandleClassName="drag-handle"
      cancel="input, textarea, button, .cancel-drag"
      onDrag={(_e, d) => {
        // Se já está dentro da pasta ou se está arrastando uma pasta, ignora atração gravitacional
        if (rootWidget.parentId || cluster.widgets.some(w => w.type.startsWith('folder_'))) return;
        
        const state = useBusinessStore.getState();
        const draggedCenterX = d.x + clusterWidth / 2;
        const draggedCenterY = d.y + clusterHeight / 2;

        let closestFolderId: string | null = null;
        let minDistance = 250; // Suction radius

        state.widgets.forEach(w => {
          if (!w.type.startsWith('folder_') || w.parentId) return;
          if (cluster.widgets.some(cw => cw.id === w.id)) return; // Ignorar self

          const folderX = w.position.x;
          const folderY = w.position.y;
          const folderW = w.size?.width || 320;
          const folderH = w.size?.height || 320;
          
          const folderCenterX = folderX + folderW / 2;
          const folderCenterY = folderY + folderH / 2;

          const dist = Math.sqrt(
            Math.pow(draggedCenterX - folderCenterX, 2) + 
            Math.pow(draggedCenterY - folderCenterY, 2)
          );

          if (dist < minDistance) {
            minDistance = dist;
            closestFolderId = w.id;
          }
        });

        if (closestFolderId) {
          const newScale = Math.max(0.2, (minDistance / 250));
          setDragScale(newScale);
          setHoveredFolderId(closestFolderId);
        } else {
          setDragScale(1);
          setHoveredFolderId(null);
        }
      }}
      onDragStop={(_e, d) => {
        setDragScale(1);
        setHoveredFolderId(null);
        
        if (rootWidget.parentId) {
          // Se já está dentro de uma pasta, apenas atualiza a posição local e aborta colisão com outras pastas
          cluster.widgets.forEach(w => {
            updateWidgetPosition(w.id, { x: d.x, y: d.y });
          });
          return;
        }

        const state = useBusinessStore.getState();
        
        // Calcular o centro do item sendo arrastado
        const draggedCenterX = d.x + clusterWidth / 2;
        const draggedCenterY = d.y + clusterHeight / 2;

        // Procurar alguma pasta que colida com esse centro
        const targetFolder = state.widgets.find(w => {
          if (!w.type.startsWith('folder_') || w.parentId) return false;
          
          // Ignorar se o próprio cluster em arrasto for a mesma pasta
          if (cluster.widgets.some(cw => cw.id === w.id)) return false;

          const folderX = w.position.x;
          const folderY = w.position.y;
          const folderW = w.size?.width || 320;
          const folderH = w.size?.height || 320;

          return draggedCenterX >= folderX && draggedCenterX <= folderX + folderW &&
                 draggedCenterY >= folderY && draggedCenterY <= folderY + folderH;
        });

        if (targetFolder) {
          // Se soltou em cima da pasta, envia todos os itens deste cluster para ela
          cluster.widgets.forEach(w => {
            // Regra: Nenhuma pasta pode entrar dentro de outra pasta (evitar inception)
            if (w.type.startsWith('folder_')) {
               updateWidgetPosition(w.id, { x: d.x, y: d.y }); // Deixa onde caiu (fora)
               return;
            }
            const finalTargetId = targetFolder.type === 'folder_linked' ? 'ENDER_DIMENSION_01' : targetFolder.id;
            state.moveWidgetToFolder(w.id, finalTargetId);
          });
          return;
        }

        // Se não soltou em nenhuma pasta, atualiza a posição normal no grid
        cluster.widgets.forEach(w => {
          updateWidgetPosition(w.id, { x: d.x, y: d.y });
        });
      }}
      className={cluster.widgets.some(w => w.type.startsWith('folder_')) ? "z-0" : "z-10"}
      disableDragging={activeTool === 'stapler'}
    >
      <div 
        className="w-full h-full grid gap-0 transition-all duration-300"
        style={{ 
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          transform: `scale(${dragScale})`,
          transition: 'transform 0.1s ease-out',
          transformOrigin: 'center center'
        }}
      >
        {cluster.widgets.map((widget) => (
          <div key={widget.id} className="w-full h-full">
            <WidgetWindow widget={widget} scale={1} />
          </div>
        ))}
      </div>
    </Rnd>
  );
}
