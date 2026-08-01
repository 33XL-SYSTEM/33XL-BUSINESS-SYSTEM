import { useState } from "react";
import { Receipt, Calculator, ChevronDown, ChevronUp, Boxes, Settings, Save, User, BarChart, Network, PenTool, AlignLeft, LineChart, Coins, TrendingUp, Tag, Package, FileText, GitMerge, Table, Activity, Scale, BarChart2, Plug, Cpu, Download } from "lucide-react";
import { useBusinessStore } from "@core/data/store";
import { Button } from "@interface/components/button";
import { MainBoard } from "./MainBoard";
import { cn } from "@interface/components/utils";

// Estrutura de Categorias e Componentes
const toolboxCategories = [
  {
    id: "tools",
    title: "Ferramentas",
    icon: PenTool,
    components: [
      { id: "raw_note", title: "Bloco de Anotação", description: "Texto livre genérico.", icon: AlignLeft },
      { id: "calculator", title: "Calculadora", description: "Calculadora brutalista de mesa.", icon: Calculator },
    ]
  },
  {
    id: "finance",
    title: "Financeiro",
    icon: Receipt,
    components: [
      { id: "cashflow", title: "Fluxo de Caixa", description: "Tabela base de entradas e saídas.", icon: LineChart },
      { id: "fixed_costs", title: "Custos Fixos", description: "Mapeamento de custos recorrentes.", icon: Coins },
      { id: "revenue_proj", title: "Projeção de Receita", description: "Cálculo simulado de receitas.", icon: TrendingUp },
    ]
  },
  {
    id: "budgets",
    title: "Orçamentos",
    icon: Calculator,
    components: [
      { id: "service_pricer", title: "Precificador de Serviços", description: "Cálculo de hora técnica.", icon: Tag },
      { id: "product_sheet", title: "Ficha de Produto", description: "Custo de produção física.", icon: Package },
      { id: "commercial_proposal", title: "Proposta Comercial", description: "Consolidado final para o cliente.", icon: FileText },
    ]
  },
  {
    id: "modeling",
    title: "Modelagem",
    icon: Boxes,
    components: [
      { id: "process_diagram", title: "Diagrama", description: "Nó de fluxo de processos.", icon: GitMerge },
      { id: "data_table", title: "Tabela Bruta", description: "Tabela de dados livre.", icon: Table },
    ]
  },
  {
    id: "analytics",
    title: "Análise",
    icon: BarChart,
    components: [
      { id: "kpi_board", title: "Painel de KPIs", description: "Indicadores chave de performance.", icon: Activity },
      { id: "break_even", title: "Ponto de Equilíbrio", description: "Cálculo de Break-even point.", icon: Scale },
      { id: "profit_report", title: "DRE Simplificado", description: "Demonstrativo de Resultado e Lucro.", icon: BarChart2 },
    ]
  },
  {
    id: "systems",
    title: "Sistemas",
    icon: Network,
    components: [
      { id: "api_connector", title: "Conector API", description: "Integração de dados externos.", icon: Plug },
      { id: "logic_gate", title: "Porta Lógica", description: "Condicionais e regras de negócio.", icon: Cpu },
      { id: "data_exporter", title: "Exportador de Dados", description: "Geração de PDFs e CSVs.", icon: Download },
    ]
  },
];

export function WorkspaceLayout() {
  const { workspaceName } = useBusinessStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Fecha tudo
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) setActiveCategory(null);
  };

  // Alterna a gaveta individual da categoria
  const toggleCategory = (id: string) => {
    if (activeCategory === id) {
      setActiveCategory(null); // recolhe se já estiver aberta
    } else {
      setActiveCategory(id);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground selection:bg-white selection:text-black">
      
      {/* Top Navigation Panel */}
      <header className="sticky top-0 z-50 flex flex-col border-b-2 border-border bg-black">
        <div className="flex items-center justify-between px-6 h-14 relative z-50 bg-black">
          
          {/* Logo (Left) */}
          <div className="flex items-center">
            <span className="font-xirod font-bold text-lg md:text-xl tracking-widest text-white uppercase hidden sm:block mt-1">
              33XL BUSINESS SYSTEM
            </span>
            <span className="font-xirod font-bold text-lg tracking-widest text-white uppercase sm:hidden mt-1">
              33XL
            </span>
          </div>

          {/* Center Toggle Button */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <button 
              className="flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 transition-all h-8 w-8 cursor-pointer shadow-[0_0_10px_rgba(255,255,255,0.2)]"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <ChevronUp className="h-5 w-5 stroke-[3]" /> : <ChevronDown className="h-5 w-5 stroke-[3]" />}
            </button>
          </div>

          {/* Quick Access Tools (Right) */}
          <div className="flex items-center gap-2 h-full">
            <div className="flex items-center border-l-2 border-r-2 border-border h-full px-2 hidden sm:flex">
              <Button variant="ghost" size="icon" className="rounded-none hover:bg-white hover:text-black text-muted-foreground hover:text-black">
                <Save className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-none hover:bg-white hover:text-black text-muted-foreground hover:text-black">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-none hover:bg-white hover:text-black text-muted-foreground hover:text-black">
                <User className="h-5 w-5" />
              </Button>
            </div>

            <span className="font-mono text-xs tracking-widest uppercase px-3 text-muted-foreground hidden lg:block">
              WORKSPACE: <span className="text-white font-bold">{workspaceName}</span>
            </span>
          </div>
        </div>

        {/* Categorias Centralizadas (Menu Expandido) */}
        {isMenuOpen && (
          <div className="w-full border-t-2 border-border bg-black relative z-40">
            <div className="flex items-center justify-center overflow-x-auto hide-scrollbar px-4">
              {toolboxCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 border-x border-transparent transition-all text-left font-display uppercase tracking-wider text-xs sm:text-sm min-w-max",
                    activeCategory === category.id 
                      ? "bg-white text-black font-bold border-border" 
                      : "bg-black text-white hover:bg-zinc-900 border-border"
                  )}
                >
                  <category.icon className="h-4 w-4" />
                  {category.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Board Area (Relative for floating dropdowns) */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-black">
        
        {/* Gaveta Individual Absoluta (Apenas da categoria selecionada) */}
        {isMenuOpen && activeCategory && (
          <div className="absolute top-0 left-0 w-full flex justify-center z-30 pointer-events-none">
            <div className="bg-black border-2 border-t-0 border-border shadow-[0px_20px_40px_rgba(0,0,0,0.9)] animate-in slide-in-from-top-2 duration-200 p-6 pointer-events-auto max-w-4xl w-full mx-4 rounded-b-xl">
              
              {/* Grid de Componentes da Categoria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {toolboxCategories.find(c => c.id === activeCategory)?.components.map((component) => (
                  <button
                    key={component.id}
                    onClick={() => {
                      const centerPosition = {
                        x: window.innerWidth / 2 - 160, // 320 / 2
                        y: window.innerHeight / 2 - 120, // 240 / 2
                      };
                      useBusinessStore.getState().addWidget(
                        component.id, 
                        component.title,
                        centerPosition
                      );
                      toggleMenu(); // Fecha tudo ao instanciar
                    }}
                    className="group flex flex-col p-4 border-2 border-border hover:border-white bg-black text-left transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <component.icon className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-1">
                      {component.title}
                    </h4>
                    <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                      {component.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <MainBoard />
      </main>
    </div>
  );
}
