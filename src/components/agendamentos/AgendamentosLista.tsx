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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar,
  Clock,
  MapPin,
  Plus,
  Search,
  User
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { useAgendamentos } from "@/hooks/useAgendamentos";
import { Skeleton } from "@/components/ui/skeleton";

const statusMap = {
  agendado: {
    label: "Agendado",
    color: "bg-blue-100 hover:bg-blue-100 text-blue-800"
  },
  confirmado: {
    label: "Confirmado",
    color: "bg-green-100 hover:bg-green-100 text-green-800"
  },
  cancelado: {
    label: "Cancelado",
    color: "bg-red-100 hover:bg-red-100 text-red-800"
  },
  realizado: {
    label: "Realizado",
    color: "bg-purple-100 hover:bg-purple-100 text-purple-800"
  }
};

const AgendamentosLista: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const { data: agendamentos, isLoading } = useAgendamentos();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Agendamentos</h2>
            <p className="text-gray-500 mt-1">Gerencie todos os agendamentos</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Agendamentos</CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-32" />
                </CardDescription>
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filtrar agendamentos
  const agendamentosFiltrados = (agendamentos || []).filter((agendamento) => {
    const matchStatus = statusFilter === "todos" || agendamento.status === statusFilter;
    const matchSearch = !searchTerm || 
      agendamento.clientes?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.servicos?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.prestadores?.nome.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Agendamentos</h2>
          <p className="text-gray-500 mt-1">Gerencie todos os agendamentos</p>
        </div>
        <Link to="/unidade/agendamentos/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </Link>
      </div>

      {/* Filtros e Lista */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Lista de Agendamentos</CardTitle>
              <CardDescription>
                Total de {agendamentosFiltrados.length} agendamentos
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar agendamentos..."
                  className="pl-8 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="agendado">Agendado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                    <SelectItem value="realizado">Realizado</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {agendamentosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum agendamento encontrado</p>
              {searchTerm && (
                <p className="text-sm mt-2">Tente ajustar os termos da busca</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {agendamentosFiltrados.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 space-y-4 md:space-y-0"
                >
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 flex-1">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <User className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-lg">
                        {agendamento.clientes?.nome || "Cliente não encontrado"}
                      </h3>
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 text-sm text-gray-500 space-y-1 md:space-y-0">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(agendamento.data_agendamento), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {agendamento.horario}
                        </span>
                        <span>
                          {agendamento.servicos?.nome || "Serviço não encontrado"}
                        </span>
                        <span>
                          {agendamento.prestadores?.nome || "Prestador não encontrado"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <Badge variant="outline" className={statusMap[agendamento.status as keyof typeof statusMap]?.color || statusMap.agendado.color}>
                      {statusMap[agendamento.status as keyof typeof statusMap]?.label || agendamento.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgendamentosLista;