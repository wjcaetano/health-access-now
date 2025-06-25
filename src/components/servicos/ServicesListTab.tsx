
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ServicesFilters from "./ServicesFilters";
import ServicesTable from "./ServicesTable";

interface ServicesListTabProps {
  servicosFiltrados: any[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categoriaFiltro: string;
  setCategoriaFiltro: (value: string) => void;
  prestadorFiltro: string;
  setPrestadorFiltro: (value: string) => void;
  statusFiltro: string;
  setStatusFiltro: (value: string) => void;
  categorias: string[];
  prestadores: any[];
  formatMoeda: (valor: number) => string;
}

const ServicesListTab: React.FC<ServicesListTabProps> = ({
  servicosFiltrados,
  searchTerm,
  setSearchTerm,
  categoriaFiltro,
  setCategoriaFiltro,
  prestadorFiltro,
  setPrestadorFiltro,
  statusFiltro,
  setStatusFiltro,
  categorias,
  prestadores,
  formatMoeda
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Lista de Serviços</CardTitle>
            <CardDescription>
              Total de {servicosFiltrados.length} serviços cadastrados
            </CardDescription>
          </div>
          <ServicesFilters
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
          />
        </div>
      </CardHeader>
      <CardContent>
        <ServicesTable
          servicosFiltrados={servicosFiltrados}
          formatMoeda={formatMoeda}
        />
      </CardContent>
    </Card>
  );
};

export default ServicesListTab;
