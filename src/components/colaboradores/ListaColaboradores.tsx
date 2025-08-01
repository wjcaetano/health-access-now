import React, { useState } from "react";
import { useColaboradores } from "@/hooks/useColaboradores";
import { useUsuarios, useUpdateUsuario, useDeleteUsuario } from "@/hooks/useUsuarios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Users, Key } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import ResetSenhaModal from "@/components/usuarios/ResetSenhaModal";

const niveis = [
  { label: "Colaborador", value: "colaborador" },
  { label: "Atendente", value: "atendente" },
  { label: "Gerente", value: "gerente" },
  { label: "Admin", value: "admin" },
];

export default function ListaColaboradores() {
  const { data: colaboradores, isLoading: loadingColaboradores } = useColaboradores();
  const { data: usuarios, isLoading: loadingUsuarios } = useUsuarios();
  const updateUsuario = useUpdateUsuario();
  const deleteUsuario = useDeleteUsuario();
  const { toast } = useToast();

  // Merge colaboradores data with profiles data
  const colaboradoresCompletos = React.useMemo(() => {
    if (!colaboradores || !usuarios) return [];
    
    return colaboradores.map(colaborador => {
      const usuario = usuarios.find(u => u.email === colaborador.email);
      return {
        ...colaborador,
        ...usuario,
        // Keep colaborador data as priority for specific fields
        id: usuario?.id || colaborador.id,
        nome: colaborador.nome,
        email: colaborador.email,
        nivel_acesso: colaborador.nivel_acesso,
        created_at: colaborador.data_cadastro,
        status: colaborador.ativo ? 'ativo' : 'inativo'
      };
    });
  }, [colaboradores, usuarios]);
  
  const [editingUser, setEditingUser] = useState<any>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    nome: "",
    email: "",
    nivel_acesso: "",
    status: ""
  });

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setEditForm({
      nome: user.nome || "",
      email: user.email || "",
      nivel_acesso: user.nivel_acesso || "",
      status: user.status || ""
    });
  };

  const handleResetPassword = (user: any) => {
    setSelectedUserForReset(user);
    setResetModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingUser) return;
    
    try {
      await updateUsuario.mutateAsync({
        userId: editingUser.id,
        updates: {
          nome: editForm.nome,
          nivel_acesso: editForm.nivel_acesso,
          status: editForm.status
        }
      });
      
      toast({
        title: "Usuário atualizado",
        description: "As informações foram salvas com sucesso",
      });
      
      setEditingUser(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o usuário",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (userEmail: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${userName}? Esta ação não pode ser desfeita.`)) {
      return;
    }
    
    try {
      await deleteUsuario.mutateAsync(userEmail);
      toast({
        title: "Usuário excluído",
        description: `O usuário ${userName} foi removido do sistema`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o usuário",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      ativo: "default",
      inativo: "secondary",
      suspenso: "destructive"
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getNivelBadge = (nivel: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-100 text-red-800",
      gerente: "bg-blue-100 text-blue-800",
      atendente: "bg-green-100 text-green-800",
      colaborador: "bg-gray-100 text-gray-800"
    };
    return (
      <Badge className={colors[nivel] || "bg-gray-100 text-gray-800"}>
        {nivel}
      </Badge>
    );
  };

  if (loadingColaboradores || loadingUsuarios) {
    return <div className="flex items-center justify-center h-64">Carregando...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Colaboradores
          </CardTitle>
        </CardHeader>
        <CardContent>
          {colaboradoresCompletos?.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Nível</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {colaboradoresCompletos.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.nome}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getNivelBadge(user.nivel_acesso)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(user.created_at), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEdit(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Usuário</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="nome">Nome</Label>
                                  <Input
                                    id="nome"
                                    value={editForm.nome}
                                    onChange={(e) => setEditForm({...editForm, nome: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="email">Email</Label>
                                  <Input
                                    id="email"
                                    value={editForm.email}
                                    disabled
                                    className="bg-gray-50"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="nivel">Nível de Acesso</Label>
                                  <Select 
                                    value={editForm.nivel_acesso} 
                                    onValueChange={(value) => setEditForm({...editForm, nivel_acesso: value})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {niveis.map((nivel) => (
                                        <SelectItem key={nivel.value} value={nivel.value}>
                                          {nivel.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="status">Status</Label>
                                  <Select 
                                    value={editForm.status} 
                                    onValueChange={(value) => setEditForm({...editForm, status: value})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="ativo">Ativo</SelectItem>
                                      <SelectItem value="inativo">Inativo</SelectItem>
                                      <SelectItem value="suspenso">Suspenso</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setEditingUser(null)}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button 
                                    onClick={handleSave}
                                    disabled={updateUsuario.isPending}
                                  >
                                    {updateUsuario.isPending ? "Salvando..." : "Salvar"}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleResetPassword(user)}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(user.email, user.nome)}
                            disabled={deleteUsuario.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">Nenhum colaborador encontrado</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Os colaboradores cadastrados aparecerão aqui
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedUserForReset && (
        <ResetSenhaModal
          isOpen={resetModalOpen}
          onClose={() => {
            setResetModalOpen(false);
            setSelectedUserForReset(null);
          }}
          userEmail={selectedUserForReset.email}
          userName={selectedUserForReset.nome}
        />
      )}
    </>
  );
}
