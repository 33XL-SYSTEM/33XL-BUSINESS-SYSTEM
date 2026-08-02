import { useBusinessStore } from '@core/data/store';

export function TreeCanvas() {
  const { widgets, treeLinks } = useBusinessStore();

  if (treeLinks.length === 0) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
      {treeLinks.map((link) => {
        const parent = widgets.find(w => w.id === link.parentId);
        const child = widgets.find(w => w.id === link.childId);
        
        if (!parent || !child) return null;
        
        const parentWidth = parent.size?.width || 320;
        const parentHeight = parent.size?.height || 320;
        const childWidth = child.size?.width || 320;

        // Origin at bottom center of parent
        const startX = parent.position.x + parentWidth / 2;
        const startY = parent.position.y + parentHeight;
        
        // Target at top center of child
        const endX = child.position.x + childWidth / 2;
        const endY = child.position.y;

        // Curved line path (Bezier)
        const path = `M ${startX} ${startY} C ${startX} ${startY + 100}, ${endX} ${endY - 100}, ${endX} ${endY}`;

        return (
          <g key={link.id}>
            <path 
              d={path}
              fill="none"
              stroke="#4ade80"
              strokeWidth="2"
              className="opacity-75"
            />
            {/* Seta/Ponto no alvo */}
            <circle cx={endX} cy={endY} r="4" fill="#4ade80" />
            <circle cx={startX} cy={startY} r="4" fill="#4ade80" />
          </g>
        );
      })}
    </svg>
  );
}
