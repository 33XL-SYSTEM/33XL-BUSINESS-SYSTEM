import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Widget {
  id: string;
  type: string;
  title: string; // The UI title of the widget
  position: Position;
  size?: Size;
  data?: any; // To store internal data of the specific module
  parentId?: string; // If present, the widget lives inside a folder/sub-canvas
}

export interface Connection {
  id: string;
  source: string;
  target: string;
}

export interface TreeLink {
  id: string;
  parentId: string;
  childId: string;
}

interface BusinessState {
  workspaceName: string;
  setWorkspaceName: (name: string) => void;
  
  // Tool State
  activeTool: 'cursor' | 'stapler' | 'tree';
  setActiveTool: (tool: 'cursor' | 'stapler' | 'tree') => void;
  stapleSourceId: string | null;
  setStapleSourceId: (id: string | null) => void;
  linkingParentId: string | null;
  setLinkingParentId: (id: string | null) => void;

  // Connections (Clusters)
  connections: Connection[];
  addConnection: (source: string, target: string) => void;
  removeConnection: (id: string) => void;
  toggleConnection: (source: string, target: string) => void;

  // Logic Tree Links
  treeLinks: TreeLink[];
  toggleTreeLink: (parentId: string, childId: string) => void;

  // Canvas Widgets
  widgets: Widget[];
  focusedWidgetId: string | null;
  setFocusedWidget: (id: string | null) => void;
  addWidget: (type: string, title: string, position: Position, size?: Size, parentId?: string) => void;
  removeWidget: (id: string) => void;
  hoveredFolderId: string | null;
  setHoveredFolderId: (id: string | null) => void;
  moveWidgetToFolder: (widgetId: string, folderId?: string) => void;
  updateWidgetPosition: (id: string, position: Position) => void;
  updateWidgetSize: (id: string, size: Size) => void;
  updateWidgetTitle: (id: string, title: string) => void;
  updateWidgetData: (id: string, data: any) => void;
  wipeWorkspace: () => void;
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      workspaceName: 'Meu Negócio',
      setWorkspaceName: (name) => set({ workspaceName: name }),

      activeTool: 'cursor',
      setActiveTool: (tool) => set({ activeTool: tool, stapleSourceId: null, linkingParentId: null }),
      
      stapleSourceId: null,
      setStapleSourceId: (id) => set({ stapleSourceId: id }),

      linkingParentId: null,
      setLinkingParentId: (id) => set({ linkingParentId: id }),

      hoveredFolderId: null,
      setHoveredFolderId: (id) => set({ hoveredFolderId: id }),

      connections: [],
      addConnection: (source, target) => set((state) => {
        // Prevent duplicate connections or self-connections
        if (source === target) return state;
        const exists = state.connections.some(c => 
          (c.source === source && c.target === target) ||
          (c.source === target && c.target === source)
        );
        if (exists) return state;

        return {
          connections: [
            ...state.connections,
            { id: `conn_${Date.now()}`, source, target }
          ]
        };
      }),
      removeConnection: (id) => set((state) => ({
        connections: state.connections.filter(c => c.id !== id)
      })),
      toggleConnection: (source, target) => set((state) => {
        if (source === target) return state;
        const existingConnection = state.connections.find(c => 
          (c.source === source && c.target === target) ||
          (c.source === target && c.target === source)
        );
        if (existingConnection) {
          return {
            connections: state.connections.filter(c => c.id !== existingConnection.id)
          };
        }

        const targetWidget = state.widgets.find(w => w.id === target);
        const inheritSize = targetWidget?.size || { width: 320, height: 320 };

        return {
          connections: [
            ...state.connections,
            { id: `conn_${Date.now()}`, source, target }
          ],
          widgets: state.widgets.map(w => 
            w.id === source ? { ...w, size: inheritSize } : w
          )
        };
      }),

      treeLinks: [],
      toggleTreeLink: (parentId, childId) => set((state) => {
        if (parentId === childId) return state;
        const existingLink = state.treeLinks.find(
          l => l.parentId === parentId && l.childId === childId
        );
        
        if (existingLink) {
          // Remover link
          return {
            treeLinks: state.treeLinks.filter(l => l.id !== existingLink.id)
          };
        }
        
        // Adicionar link (garantir que não tem o mesmo inverso para evitar ciclos no UI, mas opcional. Vamos prevenir que A->B exista se B->A existe)
        const reverseLink = state.treeLinks.find(
          l => l.parentId === childId && l.childId === parentId
        );
        if (reverseLink) return state; // Ignore se tentar ligar B->A quando já existe A->B

        return {
          treeLinks: [
            ...state.treeLinks,
            { id: `treelink_${Date.now()}`, parentId, childId }
          ]
        };
      }),

      widgets: [],
      focusedWidgetId: null,
      
      setFocusedWidget: (id) => set({ focusedWidgetId: id }),

      addWidget: (type, title, position, size, parentId) => set((state) => ({
        widgets: [
          ...state.widgets,
          {
            id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            title,
            position,
            size,
            data: {},
            parentId
          }
        ]
      })),

      removeWidget: (id) => set((state) => ({
        widgets: state.widgets.filter(w => w.id !== id),
        connections: state.connections.filter(c => c.source !== id && c.target !== id),
        treeLinks: state.treeLinks.filter(l => l.parentId !== id && l.childId !== id)
      })),

      moveWidgetToFolder: (widgetId, folderId) => set((state) => ({
        widgets: state.widgets.map(w => 
          w.id === widgetId ? { ...w, parentId: folderId } : w
        )
      })),

      updateWidgetPosition: (id, position) => set((state) => ({
        widgets: state.widgets.map(w => 
          w.id === id ? { ...w, position } : w
        )
      })),

      updateWidgetSize: (id, size) => set((state) => ({
        widgets: state.widgets.map(w => 
          w.id === id ? { ...w, size } : w
        )
      })),

      updateWidgetTitle: (id, title) => set((state) => ({
        widgets: state.widgets.map(w => 
          w.id === id ? { ...w, title } : w
        )
      })),

      updateWidgetData: (id, data) => set((state) => ({
        widgets: state.widgets.map(w => 
          w.id === id ? { ...w, data: { ...w.data, ...data } } : w
        )
      })),

      wipeWorkspace: () => set({ widgets: [], connections: [], stapleSourceId: null, focusedWidgetId: null }),
    }),
    {
      name: '33xl-business-storage', // Nome da chave no localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
