import { X, Trash2, HardDriveDownload, HardDriveUpload } from 'lucide-react';
import { useConfigStore } from '@core/data/configStore';
import { useBusinessStore } from '@core/data/store';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const config = useConfigStore();
  const { widgets, connections, wipeWorkspace } = useBusinessStore(); // We'll need to add wipeWorkspace

  if (!isOpen) return null;

  const handleExport = () => {
    const dataStr = JSON.stringify({ widgets, connections }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `33xl_workspace_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    // Implementation left for a more robust import logic
    alert('Importação de Workspace será implementada na v2.');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-black border-2 border-border shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-border p-4">
          <h2 className="font-xirod text-lg text-white uppercase tracking-widest">Configurações Globais</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Section 1: Financial */}
          <section className="space-y-4">
            <h3 className="font-display font-bold text-white uppercase tracking-widest border-b-2 border-neutral-800 pb-2">
              Parâmetros Financeiros
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-400 uppercase">Moeda Base</label>
                <select 
                  value={config.currency}
                  onChange={(e) => config.setCurrency(e.target.value as any)}
                  className="w-full bg-neutral-900 border-2 border-neutral-700 text-white p-2 font-mono text-sm focus:border-white outline-none"
                >
                  <option value="BRL">R$ (BRL)</option>
                  <option value="USD">$ (USD)</option>
                  <option value="EUR">€ (EUR)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-400 uppercase">Imposto Padrão (%)</label>
                <input 
                  type="number"
                  value={config.defaultTaxRate}
                  onChange={(e) => config.setDefaultTaxRate(Number(e.target.value))}
                  className="w-full bg-neutral-900 border-2 border-neutral-700 text-white p-2 font-mono text-sm focus:border-white outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-400 uppercase">Markup Padrão (%)</label>
                <input 
                  type="number"
                  value={config.defaultMarkup}
                  onChange={(e) => config.setDefaultMarkup(Number(e.target.value))}
                  className="w-full bg-neutral-900 border-2 border-neutral-700 text-white p-2 font-mono text-sm focus:border-white outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-400 uppercase">Carga Horária (Mensal)</label>
                <input 
                  type="number"
                  value={config.workHoursPerMonth}
                  onChange={(e) => config.setWorkHoursPerMonth(Number(e.target.value))}
                  className="w-full bg-neutral-900 border-2 border-neutral-700 text-white p-2 font-mono text-sm focus:border-white outline-none"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Workspace Engineering */}
          <section className="space-y-4">
            <h3 className="font-display font-bold text-white uppercase tracking-widest border-b-2 border-neutral-800 pb-2">
              Engenharia do Workspace
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 flex items-center justify-between bg-neutral-900 p-3 border-2 border-neutral-800">
                <span className="text-xs font-mono text-neutral-400 uppercase">Snap to Grid</span>
                <input 
                  type="checkbox"
                  checked={config.magneticSnap}
                  onChange={(e) => config.setMagneticSnap(e.target.checked)}
                  className="w-5 h-5 accent-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-400 uppercase">Fator de Zoom</label>
                <select 
                  value={config.zoomSensitivity}
                  onChange={(e) => config.setZoomSensitivity(e.target.value as any)}
                  className="w-full bg-neutral-900 border-2 border-neutral-700 text-white p-2 font-mono text-sm focus:border-white outline-none"
                >
                  <option value="low">Lento</option>
                  <option value="normal">Normal</option>
                  <option value="high">Rápido</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 3: Data Management */}
          <section className="space-y-4">
            <h3 className="font-display font-bold text-white uppercase tracking-widest border-b-2 border-neutral-800 pb-2">
              Gerenciamento de Dados
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleExport}
                className="flex-1 flex items-center justify-center gap-2 bg-neutral-900 border-2 border-border p-3 text-white hover:bg-white hover:text-black transition-colors font-mono text-sm uppercase tracking-widest"
              >
                <HardDriveDownload className="w-4 h-4" /> Exportar
              </button>
              
              <label className="flex-1 flex items-center justify-center gap-2 bg-neutral-900 border-2 border-border p-3 text-white hover:bg-white hover:text-black transition-colors font-mono text-sm uppercase tracking-widest cursor-pointer">
                <HardDriveUpload className="w-4 h-4" /> Importar
                <input type="file" accept=".json" className="hidden" onChange={handleImport} />
              </label>

              <button 
                onClick={() => {
                  if (confirm("ATENÇÃO: Isso destruirá todas as janelas do canvas. Deseja prosseguir?")) {
                    wipeWorkspace?.();
                    onClose();
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-red-950 border-2 border-red-500 p-3 text-red-500 hover:bg-red-500 hover:text-white transition-colors font-mono text-sm uppercase tracking-widest"
              >
                <Trash2 className="w-4 h-4" /> Limpar Mesa
              </button>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
