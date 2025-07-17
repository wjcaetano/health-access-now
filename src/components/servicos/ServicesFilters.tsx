
import React from "react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface ServicesFiltersProps {
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
}

const ServicesFilters: React.FC<ServicesFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  categoriaFiltro,
  setCategoriaFiltro,
  prestadorFiltro,
  setPrestadorFiltro,
  statusFiltro,
  setStatusFiltro,
  categorias,
  prestadores
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas</SelectItem>
          {categorias.map((categoria) => (
            <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={prestadorFiltro} onValueChange={setPrestadorFiltro}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Prestador" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          {prestadores?.map((prestador) => (
            <SelectItem key={prestador.id} value={prestador.id}>{prestador.nome}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={statusFiltro} onValueChange={setStatusFiltro}>
        <SelectTrigger className="w-full sm:w-[120px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="ativo">Ativos</SelectItem>
          <SelectItem value="inativo">Inativos</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Buscar serviços..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ServicesFilters;
