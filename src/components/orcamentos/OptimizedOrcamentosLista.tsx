import React, { useState, useMemo, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Search,
  User,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useOrcamentos } from "@/hooks/useOrcamentos";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMemorizedCalculations } from "@/hooks/useMemorizedData";
import OptimizedTable from "@/components/shared/OptimizedTable";

const statusMap = {
  pendente: {
    label: "Pendente",
    color: "bg-yellow-100 hover:bg-yellow-100 text-yellow-800"
  },
  aprovado: {
    label: "Aprovado",
    color: "bg-green-100 hover:bg-green-100 text-green-800"
  },
  recusado: {
    label: "Recusado",
    color: "bg-red-100 hover:bg-red-100 text-red-800"
  },
  expirado: {
    label: "Expirado",
    color: "bg-gray-100 hover:bg-gray-100 text-gray-800"
  }
};

const formatarValor = (valor: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

// Memoized components
const StatusBadge = memo(({ status }: { status: string }) => (
  <Badge variant="outline" className={statusMap[status as keyof typeof statusMap]?.color || statusMap.pendente.color}>
    {statusMap[status as keyof typeof statusMap]?.label || status}
  </Badge>
));
StatusBadge.displayName = "StatusBadge";

const MobileOrcamentoCard = memo(({ orcamento }: { orcamento: any }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="mb-3 overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <div className="h-8 w-8 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary flex-shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{orcamento.clientes?.nome || 'Cliente não encontrado'}</p>
                <p className="text-xs text-gray-500 truncate">{orcamento.servicos?.nome || 'Serviço não encontrado'}</p>
              </div>
            </div>
            <StatusBadge status={orcamento.status} />
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-500">Prestador</p>
              <p className="font-medium truncate">{orcamento.prestadores?.nome || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Valor</p>
              <p className="font-medium">{formatarValor(orcamento.valor_final)}</p>
            </div>
            <div>
              <p className="text-gray-500">Data</p>
              <p className="font-medium">
                {orcamento.created_at ? format(new Date(orcamento.created_at), "dd/MM/yyyy", { locale: ptBR }) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Validade</p>
              <p className="font-medium">
                {format(new Date(orcamento.data_validade), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>

          {/* Action */}
          <Button 
            variant="outline" 
            size="sm"
            className="w-full text-agendaja-primary hover:text-agendaja-primary/80 hover:bg-agendaja-light/50"
            onClick={() => navigate(`/hub/orcamentos/${orcamento.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Visualizar Orçamento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
MobileOrcamentoCard.displayName = "MobileOrcamentoCard";

const OptimizedOrcamentosLista: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { data: orcamentos, isLoading, error } = useOrcamentos();
  const isMobile = useIsMobile();
  
  // Memoized filtered and sorted data
  const orcamentosFiltrados = useMemo(() => {
    if (!orcamentos) return [];
    return orcamentos.filter((orcamento) => 
      orcamento.clientes?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orcamento.servicos?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orcamento.prestadores?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(orcamento.valor_final).includes(searchTerm)
    );
  }, [orcamentos, searchTerm]);
  
  const orcamentosOrdenados = useMemo(() => {
    return [...orcamentosFiltrados].sort(
      (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    );
  }, [orcamentosFiltrados]);
  
  // Memoized columns for desktop table
  const columns = useMemo(() => [
    {
      header: "Cliente",
      accessorKey: "clientes.nome",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary mr-2">
            <User className="h-4 w-4" />
          </div>
          <span className="font-medium">{row.original.clientes?.nome || 'Cliente não encontrado'}</span>
        </div>
      ),
    },
    {
      header: "Serviço",
      accessorKey: "servicos.nome",
      cell: ({ row }: { row: any }) => row.original.servicos?.nome || 'Serviço não encontrado',
    },
    {
      header: "Prestador",
      accessorKey: "prestadores.nome",
      cell: ({ row }: { row: any }) => row.original.prestadores?.nome || 'Prestador não encontrado',
    },
    {
      header: "Valor Final",
      accessorKey: "valor_final",
      cell: ({ row }: { row: any }) => (
        <span className="font-medium">{formatarValor(row.original.valor_final)}</span>
      ),
    },
    {
      header: "Data",
      accessorKey: "created_at",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center text-sm">
          <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
          <div className="flex flex-col">
            <span>{row.original.created_at ? format(new Date(row.original.created_at), "dd/MM/yyyy", { locale: ptBR }) : 'N/A'}</span>
            <span className="text-xs text-gray-500">
              Validade: {format(new Date(row.original.data_validade), "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: { row: any }) => <StatusBadge status={row.original.status} />,
    },
    {
      header: "Ações",
      id: "actions",
      cell: ({ row }: { row: any }) => (
        <Button 
          variant="ghost" 
          size="sm"
          className="text-agendaja-primary hover:text-agendaja-primary/80 hover:bg-agendaja-light/50"
          onClick={() => navigate(`/hub/orcamentos/${row.original.id}`)}
        >
          <Eye className="h-4 w-4 mr-1" />
          Ver
        </Button>
      ),
    },
  ], [navigate]);
  
  if (isLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className={isMobile ? "px-4" : ""}>
          <h2 className={`font-bold text-gray-900 ${isMobile ? "text-2xl" : "text-3xl"}`}>Orçamentos</h2>
          <p className={`text-gray-500 mt-1 ${isMobile ? "text-sm" : ""}`}>Carregando orçamentos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className={isMobile ? "px-4" : ""}>
          <h2 className={`font-bold text-gray-900 ${isMobile ? "text-2xl" : "text-3xl"}`}>Orçamentos</h2>
          <p className={`text-red-500 mt-1 ${isMobile ? "text-sm" : ""}`}>Erro ao carregar orçamentos: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className={isMobile ? "px-4" : ""}>
        <h2 className={`font-bold text-gray-900 ${isMobile ? "text-2xl" : "text-3xl"}`}>Orçamentos</h2>
        <p className={`text-gray-500 mt-1 ${isMobile ? "text-sm" : ""}`}>
          Gerencie todos os orçamentos enviados para clientes
        </p>
      </div>

      <Card className={isMobile ? "mx-4" : ""}>
        <CardHeader className={isMobile ? "p-4 pb-3" : ""}>
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle className={isMobile ? "text-lg" : ""}>Lista de Orçamentos</CardTitle>
              <CardDescription className={isMobile ? "text-xs" : ""}>
                Total de {orcamentosFiltrados.length} orçamentos
              </CardDescription>
            </div>
            <div className="relative w-full">
              <Search className={`absolute left-2.5 top-2.5 text-gray-500 ${isMobile ? "h-4 w-4" : "h-4 w-4"}`} />
              <Input
                placeholder="Buscar orçamentos..."
                className={`pl-8 ${isMobile ? "text-sm" : ""}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className={isMobile ? "p-4 pt-0" : ""}>
          {orcamentosOrdenados.length === 0 ? (
            <div className={`text-center py-8 text-gray-500 ${isMobile ? "py-6" : ""}`}>
              <p className={isMobile ? "text-sm" : ""}>Nenhum orçamento encontrado</p>
              {searchTerm && (
                <p className={`mt-2 ${isMobile ? "text-xs" : "text-sm"}`}>Tente ajustar os termos da busca</p>
              )}
            </div>
          ) : (
            <>
              {/* Mobile View */}
              {isMobile ? (
                <div className="space-y-3">
                  {orcamentosOrdenados.map((orcamento) => (
                    <MobileOrcamentoCard key={orcamento.id} orcamento={orcamento} />
                  ))}
                </div>
              ) : (
                /* Desktop View with OptimizedTable */
                <OptimizedTable 
                  data={orcamentosOrdenados}
                  columns={columns}
                  loading={isLoading}
                  pageSize={20}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default memo(OptimizedOrcamentosLista);