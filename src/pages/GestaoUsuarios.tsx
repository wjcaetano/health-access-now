
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUsuarios, useUpdateUsuario, useUpdateUsuarioStatus } from "@/hooks/useUsuarios";
import { useToast } from "@/hooks/use-toast";
import { Search, User, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { createAuditLog } from "@/hooks/useAuditLog";

// Componentes das funcionalidades
import HistoricoAuditoria from "@/components/usuarios/HistoricoAuditoria";
import NotificationsPanel from "@/components/usuarios/NotificationsPanel";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ativo': return 'bg-green-100 text-green-800';
    case 'pendente': return 'bg-yellow-100 text-yellow-800';
    case 'aguardando_aprovacao': return 'bg-blue-100 text-blue-800';
    case 'suspenso': return 'bg-red-100 text-red-800';
    case 'inativo': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ativo': return <CheckCircle className="h-4 w-4" />;
    case 'pendente': return <Clock className="h-4 w-4" />;
    case 'aguardando_aprovacao': return <AlertCircle className="h-4 w-4" />;
    case 'suspenso': return <XCircle className="h-4 w-4" />;
    case 'inativo': return <XCircle className="h-4 w-4" />;
    default: return <User className="h-4 w-4" />;
  }
};

export default function GestaoUsuarios() {
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroNivel, setFiltroNivel] = useState<string>("todos");
  const [termoPesquisa, setTermoPesquisa] = useState("");
  
  const { data: usuarios, isLoading } = useUsuarios();
  const updateStatus = useUpdateUsuarioStatus();
  const updateUsuario = useUpdateUsuario();
  const { toast } = useToast();

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ userId, status: newStatus });
      await createAuditLog(userId, 'status_change', { new_status: newStatus });
      toast({
        title: "Status atualizado",
        description: "Status do usuário foi alterado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status",
        variant: "destructive",
      });
    }
  };

  const usuariosFiltrados = usuarios?.filter(usuario => {
    const matchStatus = filtroStatus === "todos" || usuario.status === filtroStatus;
    const matchNivel = filtroNivel === "todos" || usuario.nivel_acesso === filtroNivel;
    const matchPesquisa = !termoPesquisa || 
      usuario.nome?.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      usuario.email.toLowerCase().includes(termoPesquisa.toLowerCase());
    
    return matchStatus && matchNivel && matchPesquisa;
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
      </div>

      <Tabs defaultValue="usuarios" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="auditoria">Auditoria</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Pesquisar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Nome ou email..."
                      value={termoPesquisa}
                      onChange={(e) => setTermoPesquisa(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="aguardando_aprovacao">Aguardando Aprovação</SelectItem>
                      <SelectItem value="suspenso">Suspenso</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nível</label>
                  <Select value={filtroNivel} onValueChange={setFiltroNivel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
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

          <div className="grid gap-4">
            {usuariosFiltrados?.map((usuario) => (
              <Card key={usuario.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{usuario.nome || "Nome não informado"}</h3>
                          <Badge variant="outline">{usuario.nivel_acesso}</Badge>
                          <Badge className={getStatusColor(usuario.status)}>
                            {getStatusIcon(usuario.status)}
                            <span className="ml-1">{usuario.status}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{usuario.email}</p>
                        {usuario.colaboradores && (
                          <p className="text-xs text-gray-500">Colaborador: {usuario.colaboradores.nome}</p>
                        )}
                        {usuario.prestadores && (
                          <p className="text-xs text-gray-500">Prestador: {usuario.prestadores.nome}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={usuario.status}
                        onValueChange={(value) => handleStatusChange(usuario.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="aguardando_aprovacao">Aguardando Aprovação</SelectItem>
                          <SelectItem value="suspenso">Suspenso</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="auditoria">
          <HistoricoAuditoria />
        </TabsContent>

        <TabsContent value="notificacoes">
          <NotificationsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
