
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useServicos } from "@/hooks/useServicos";
import { usePrestadores } from "@/hooks/usePrestadores";
import GerenciarVinculos from "@/components/servicos/GerenciarVinculos";
import ServicesListTab from "@/components/servicos/ServicesListTab";

const Servicos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [prestadorFiltro, setPrestadorFiltro] = useState("todos");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  
  const { data: servicos, isLoading: carregandoServicos } = useServicos();
  const { data: prestadores, isLoading: carregandoPrestadores } = usePrestadores();
  
  // Extrair categorias únicas para o filtro
  const categorias = Array.from(new Set(servicos?.map(s => s.categoria) || []));
  
  // Aplicar filtros
  const servicosFiltrados = servicos?.filter(servico => {
    const matchBusca = 
      !searchTerm || 
      servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCategoria = categoriaFiltro === "todas" || servico.categoria === categoriaFiltro;
    const matchPrestador = prestadorFiltro === "todos" || servico.prestador_id === prestadorFiltro;
    const matchStatus = statusFiltro === "todos" || 
      (statusFiltro === "ativo" && servico.ativo) || 
      (statusFiltro === "inativo" && !servico.ativo);
    
    return matchBusca && matchCategoria && matchPrestador && matchStatus;
  }) || [];

  const formatMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  if (carregandoServicos || carregandoPrestadores) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-8">
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Serviços</h2>
          <p className="text-gray-500 mt-1">
            Gerencie todos os serviços e prestadores da plataforma
          </p>
        </div>
        <RouterLink to="/unidade/servicos/novo">
          <Button className="bg-agendaja-primary hover:bg-agendaja-secondary">
            <Plus className="h-5 w-5 mr-2" />
            Novo Serviço
          </Button>
        </RouterLink>
      </div>

      <Tabs defaultValue="servicos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="servicos">Lista de Serviços</TabsTrigger>
          <TabsTrigger value="vinculos">Gerenciar Vínculos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="servicos">
          <ServicesListTab
            servicosFiltrados={servicosFiltrados}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoriaFiltro={categoriaFiltro}
            setCategoriaFiltro={setCategoriaFiltro}
            prestadorFiltro={prestadorFiltro}
            setPrestadorFiltro={setPrestadorFiltro}
            statusFiltro={statusFiltro}
            setStatusFiltro={setStatusFiltro}
            categorias={categorias}
            prestadores={prestadores}
            formatMoeda={formatMoeda}
          />
        </TabsContent>
        
        <TabsContent value="vinculos">
          <GerenciarVinculos />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Servicos;
