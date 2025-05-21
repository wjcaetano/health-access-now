
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
import { Agendamento } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { agendamentos } from "@/data/mock";
import { Link } from "react-router-dom";

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

const Agendamentos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<string>("todos");
  
  // Filtrar agendamentos com base no termo de busca e status
  const agendamentosFiltrados = agendamentos.filter((agendamento) => {
    const matchBusca = 
      !searchTerm || 
      agendamento.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.clinica.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.profissional.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.codigoAutenticacao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = statusFiltro === "todos" || agendamento.status === statusFiltro;
    
    return matchBusca && matchStatus;
  });
  
  // Organizar por data, mais recentes primeiro
  const agendamentosOrdenados = [...agendamentosFiltrados].sort(
    (a, b) => b.dataAgendamento.getTime() - a.dataAgendamento.getTime()
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Agendamentos</h2>
          <p className="text-gray-500 mt-1">
            Gerencie todos os agendamentos de consultas e exames
          </p>
        </div>
        <Link to="/novo-agendamento">
          <Button className="bg-agendaja-primary hover:bg-agendaja-secondary">
            <Plus className="h-5 w-5 mr-2" />
            Novo Agendamento
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Lista de Agendamentos</CardTitle>
              <CardDescription>
                Total de {agendamentosFiltrados.length} agendamentos
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    <SelectItem value="agendado">Agendado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                    <SelectItem value="realizado">Realizado</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar agendamentos..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agendamentosOrdenados.map((agendamento) => (
              <Card key={agendamento.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="p-4 md:p-6 flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary mr-3">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{agendamento.cliente?.nome}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>#{agendamento.codigoAutenticacao}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className={statusMap[agendamento.status].color}>
                        {statusMap[agendamento.status].label}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-agendaja-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Data</p>
                          <p>{format(agendamento.dataAgendamento, "dd/MM/yyyy")}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {format(agendamento.dataAgendamento, "EEEE", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-agendaja-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Horário</p>
                          <p>{agendamento.horario}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-agendaja-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Local</p>
                          <p>{agendamento.clinica}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 md:p-6 md:w-64 md:border-l flex flex-col gap-2">
                    <p className="font-medium">{agendamento.servico}</p>
                    <p className="text-sm text-gray-500">{agendamento.profissional}</p>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" className="flex-1 h-9">
                        Editar
                      </Button>
                      <Button variant="default" className="flex-1 h-9 bg-agendaja-primary hover:bg-agendaja-secondary">
                        Guia
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            {agendamentosOrdenados.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">Nenhum agendamento encontrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agendamentos;
