
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUsuarios, useUpdateUsuario, useUpdateUsuarioStatus } from "@/hooks/useUsuarios";
import { useToast } from "@/hooks/use-toast";
import { Search, User, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

const statusColors = {
  ativo: "bg-green-100 text-green-800",
  pendente: "bg-yellow-100 text-yellow-800", 
  aguardando_aprovacao: "bg-blue-100 text-blue-800",
  suspenso: "bg-red-100 text-red-800",
  inativo: "bg-gray-100 text-gray-800"
};

const statusIcons = {
  ativo: CheckCircle,
  pendente: Clock,
  aguardando_aprovacao: AlertCircle,
  suspenso: XCircle,
  inativo: XCircle
};

const nivelAcessoLabels = {
  admin: "Administrador",
  gerente: "Gerente", 
  atendente: "Atendente",
  colaborador: "Colaborador"
};

export default function GestaoUsuarios() {
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroNivel, setFiltroNivel] = useState<string>("todos");
  const [busca, setBusca] = useState("");
  
  const { data: usuarios, isLoading } = useUsuarios();
  const updateStatus = useUpdateUsuarioStatus();
  const updateUsuario = useUpdateUsuario();
  const { toast } = useToast();

  const handleStatusChange = async (userId: string, novoStatus: string) => {
    try {
      await updateStatus.mutateAsync({ userId, status: novoStatus });
      toast({
        title: "Status atualizado",
        description: "Status do usuário foi alterado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do usuário.",
        variant: "destructive",
      });
    }
  };

  const handleNivelChange = async (userId: string, novoNivel: string) => {
    try {
      await updateUsuario.mutateAsync({ 
        userId, 
        updates: { nivel_acesso: novoNivel }
      });
      toast({
        title: "Nível de acesso atualizado",
        description: "Nível de acesso do usuário foi alterado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o nível de acesso.",
        variant: "destructive",
      });
    }
  };

  const usuariosFiltrados = usuarios?.filter(usuario => {
    const matchStatus = filtroStatus === "todos" || usuario.status === filtroStatus;
    const matchNivel = filtroNivel === "todos" || usuario.nivel_acesso === filtroNivel;
    const matchBusca = busca === "" || 
      usuario.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busca.toLowerCase());
    
    return matchStatus && matchNivel && matchBusca;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-agendaja-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestão de Usuários</h1>
        <p className="text-gray-600">Gerencie usuários, permissões e status de acesso</p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Buscar usuário</label>
              <Input
                placeholder="Nome ou email..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="aguardando_aprovacao">Aguardando Aprovação</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="suspenso">Suspenso</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nível de Acesso</label>
              <Select value={filtroNivel} onValueChange={setFiltroNivel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os níveis</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="gerente">Gerente</SelectItem>
                  <SelectItem value="atendente">Atendente</SelectItem>
                  <SelectItem value="colaborador">Colaborador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <div className="grid gap-4">
        {usuariosFiltrados?.map((usuario) => {
          const StatusIcon = statusIcons[usuario.status as keyof typeof statusIcons];
          
          return (
            <Card key={usuario.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-agendaja-light rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-agendaja-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{usuario.nome || "Sem nome"}</h3>
                      <p className="text-gray-600">{usuario.email}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge className={statusColors[usuario.status as keyof typeof statusColors]}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {usuario.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">
                          {nivelAcessoLabels[usuario.nivel_acesso as keyof typeof nivelAcessoLabels]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select
                      value={usuario.status}
                      onValueChange={(value) => handleStatusChange(usuario.id, value)}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="aguardando_aprovacao">Aguardando Aprovação</SelectItem>
                        <SelectItem value="suspenso">Suspenso</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={usuario.nivel_acesso}
                      onValueChange={(value) => handleNivelChange(usuario.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="colaborador">Colaborador</SelectItem>
                        <SelectItem value="atendente">Atendente</SelectItem>
                        <SelectItem value="gerente">Gerente</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {usuariosFiltrados?.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum usuário encontrado com os filtros aplicados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
