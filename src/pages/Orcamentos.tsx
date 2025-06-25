
import React, { useState } from "react";
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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

const Orcamentos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { data: orcamentos, isLoading, error } = useOrcamentos();
  
  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Orçamentos</h2>
          <p className="text-gray-500 mt-1">Carregando orçamentos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Orçamentos</h2>
          <p className="text-red-500 mt-1">Erro ao carregar orçamentos: {error.message}</p>
        </div>
      </div>
    );
  }

  // Filtrar orçamentos com base no termo de busca
  const orcamentosFiltrados = (orcamentos || []).filter((orcamento) => 
    orcamento.clientes?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orcamento.servicos?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orcamento.prestadores?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(orcamento.valor_final).includes(searchTerm)
  );
  
  // Organizar por data de criação, mais recentes primeiro
  const orcamentosOrdenados = [...orcamentosFiltrados].sort(
    (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Orçamentos</h2>
        <p className="text-gray-500 mt-1">
          Gerencie todos os orçamentos enviados para clientes
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Lista de Orçamentos</CardTitle>
              <CardDescription>
                Total de {orcamentosFiltrados.length} orçamentos
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar orçamentos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {orcamentosOrdenados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum orçamento encontrado</p>
              {searchTerm && (
                <p className="text-sm mt-2">Tente ajustar os termos da busca</p>
              )}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Prestador</TableHead>
                    <TableHead>Valor Final</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orcamentosOrdenados.map((orcamento) => (
                    <TableRow key={orcamento.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary mr-2">
                            <User className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{orcamento.clientes?.nome || 'Cliente não encontrado'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{orcamento.servicos?.nome || 'Serviço não encontrado'}</TableCell>
                      <TableCell>{orcamento.prestadores?.nome || 'Prestador não encontrado'}</TableCell>
                      <TableCell className="font-medium">
                        {formatarValor(orcamento.valor_final)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                          <div className="flex flex-col">
                            <span>{orcamento.created_at ? format(new Date(orcamento.created_at), "dd/MM/yyyy", { locale: ptBR }) : 'N/A'}</span>
                            <span className="text-xs text-gray-500">
                              Validade: {format(new Date(orcamento.data_validade), "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusMap[orcamento.status as keyof typeof statusMap]?.color || statusMap.pendente.color}>
                          {statusMap[orcamento.status as keyof typeof statusMap]?.label || orcamento.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-agendaja-primary hover:text-agendaja-primary/80 hover:bg-agendaja-light/50"
                          onClick={() => navigate(`/orcamentos/${orcamento.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orcamentos;
