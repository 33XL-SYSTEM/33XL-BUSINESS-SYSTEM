import { useBusinessStore } from "@core/data/store";
import { WidgetWindow } from "@interface/components/WidgetWindow";
import { FocusOverlay } from "@interface/components/FocusOverlay";

export function MainBoard() {
  const { widgets } = useBusinessStore();

  return (
    <div className="flex-1 w-full h-full relative overflow-hidden bg-black bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem]">
      
      {/* Workspace Watermark */}
      {widgets.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="border-2 border-dashed border-white p-12 flex flex-col items-center">
            <h1 className="font-xirod text-2xl tracking-widest text-white mb-4">CANVAS LIVRE</h1>
            <p className="font-mono text-xs uppercase tracking-widest text-center max-w-sm">
              Sua mesa de trabalho está vazia. Acesse o menu superior para instanciar ferramentas de modelagem no quadro.
            </p>
          </div>
        </div>
      )}

      {/* Renderização das Janelas Arrastáveis */}
      {widgets.map((widget) => (
        <WidgetWindow key={widget.id} widget={widget} />
      ))}
      
      {/* Camada de Focus Mode (Micro) */}
      <FocusOverlay />
      
    </div>
  );
}
