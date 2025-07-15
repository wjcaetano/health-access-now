
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, Search, X } from "lucide-react";

interface FiltersState {
  periodo: string;
  status: string;
  franquia: string;
  vencimento: string;
}

interface RoyaltiesFiltersProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  onClearFilters: () => void;
  franquias: Array<{ id: string; nome_fantasia: string; }>;
}

const statusOptions = [
  { value: 'todos', label: 'Todos os Status' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'pago', label: 'Pago' },
  { value: 'atrasado', label: 'Atrasado' },
  { value: 'isento', label: 'Isento' }
];

const periodoOptions = [
  { value: 'todos', label: 'Todos os Períodos' },
  { value: '2024-12', label: 'Dezembro 2024' },
  { value: '2024-11', label: 'Novembro 2024' },
  { value: '2024-10', label: 'Outubro 2024' },
  { value: '2024-09', label: 'Setembro 2024' },
  { value: '2024-08', label: 'Agosto 2024' },
  { value: '2024-07', label: 'Julho 2024' }
];

const vencimentoOptions = [
  { value: 'todos', label: 'Todos os Vencimentos' },
  { value: 'vencido', label: 'Vencido' },
  { value: 'hoje', label: 'Vence Hoje' },
  { value: '7dias', label: 'Próximos 7 dias' },
  { value: '30dias', label: 'Próximos 30 dias' }
];

export const RoyaltiesFilters: React.FC<RoyaltiesFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  franquias
}) => {
  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== 'todos' && value !== ''
  ).length;

  const handleFilterChange = (key: keyof FiltersState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtros:</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} ativo(s)</Badge>
            )}
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 flex-1">
              <Select value={filters.periodo} onValueChange={(value) => handleFilterChange('periodo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  {periodoOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.franquia} onValueChange={(value) => handleFilterChange('franquia', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Franquia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Franquias</SelectItem>
                  {franquias.map((franquia) => (
                    <SelectItem key={franquia.id} value={franquia.id}>
                      {franquia.nome_fantasia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.vencimento} onValueChange={(value) => handleFilterChange('vencimento', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Vencimento" />
                </SelectTrigger>
                <SelectContent>
                  {vencimentoOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Limpar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
