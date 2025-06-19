
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Bell, Camera } from "lucide-react";
import UploadFotoPerfil from "@/components/usuarios/UploadFotoPerfil";
import NotificationsPanel from "@/components/usuarios/NotificationsPanel";

export default function MeuPerfil() {
  const { profile, updateProfile, updatePassword } = useAuth();
  const { toast } = useToast();
  
  // Estados para edição do perfil
  const [nome, setNome] = useState(profile?.nome || "");
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  
  // Estados para alteração de senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");

  const handleSalvarPerfil = async () => {
    try {
      await updateProfile({ nome });
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso",
      });
      setEditandoPerfil(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
        variant: "destructive",
      });
    }
  };

  const handleAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (novaSenha !== confirmaSenha) {
      toast({
        title: "Erro",
        description: "As senhas não conferem",
        variant: "destructive",
      });
      return;
    }

    if (novaSenha.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    try {
      await updatePassword(novaSenha);
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso",
      });
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmaSenha("");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar a senha",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
      </div>

      <Tabs defaultValue="perfil" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="foto">Foto</TabsTrigger>
          <TabsTrigger value="senha">Senha</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={!editandoPerfil}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile?.email || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="nivel">Nível de Acesso</Label>
                  <Input
                    id="nivel"
                    value={profile?.nivel_acesso || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    value={profile?.status || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                {editandoPerfil ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditandoPerfil(false);
                        setNome(profile?.nome || "");
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSalvarPerfil}>
                      Salvar
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEditandoPerfil(true)}>
                    Editar Perfil
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="foto">
          <UploadFotoPerfil />
        </TabsContent>

        <TabsContent value="senha">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Alterar Senha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAlterarSenha} className="space-y-4">
                <div>
                  <Label htmlFor="nova-senha">Nova Senha</Label>
                  <Input
                    id="nova-senha"
                    type="password"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Digite sua nova senha"
                  />
                </div>
                <div>
                  <Label htmlFor="confirma-senha">Confirmar Nova Senha</Label>
                  <Input
                    id="confirma-senha"
                    type="password"
                    value={confirmaSenha}
                    onChange={(e) => setConfirmaSenha(e.target.value)}
                    placeholder="Confirme sua nova senha"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Alterar Senha
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes">
          <NotificationsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
