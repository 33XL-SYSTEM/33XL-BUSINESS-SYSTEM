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
}

interface BusinessState {
  workspaceName: string;
  setWorkspaceName: (name: string) => void;
  
  // Canvas Widgets
  widgets: Widget[];
  focusedWidgetId: string | null;
  setFocusedWidget: (id: string | null) => void;
  addWidget: (type: string, title: string, position: Position, size?: Size) => void;
  removeWidget: (id: string) => void;
  updateWidgetPosition: (id: string, position: Position) => void;
  updateWidgetSize: (id: string, size: Size) => void;
  updateWidgetData: (id: string, data: any) => void;
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      workspaceName: 'Meu Negócio',
      setWorkspaceName: (name) => set({ workspaceName: name }),

      widgets: [],
      focusedWidgetId: null,
      
      setFocusedWidget: (id) => set({ focusedWidgetId: id }),

      addWidget: (type, title, position, size) => set((state) => ({
        widgets: [
          ...state.widgets,
          {
            id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            title,
            position,
            size,
            data: {}
          }
        ]
      })),

      removeWidget: (id) => set((state) => ({
        widgets: state.widgets.filter(w => w.id !== id)
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

      updateWidgetData: (id, data) => set((state) => ({
        widgets: state.widgets.map(w => 
          w.id === id ? { ...w, data: { ...w.data, ...data } } : w
        )
      })),
    }),
    {
      name: '33xl-business-storage', // Nome da chave no localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
