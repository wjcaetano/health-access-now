
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Shield, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

const statusColors = {
  ativo: "bg-green-100 text-green-800",
  pendente: "bg-yellow-100 text-yellow-800", 
  aguardando_aprovacao: "bg-blue-100 text-blue-800",
  suspenso: "bg-red-100 text-red-800",
  inativo: "bg-gray-100 text-gray-800"
};

const nivelAcessoLabels = {
  admin: "Administrador",
  gerente: "Gerente", 
  atendente: "Atendente",
  colaborador: "Colaborador"
};

export default function MeuPerfil() {
  const { profile, updateProfile, updatePassword } = useAuth();
  const { toast } = useToast();
  
  const [editandoDados, setEditandoDados] = useState(false);
  const [editandoSenha, setEditandoSenha] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  
  const [dadosForm, setDadosForm] = useState({
    nome: profile?.nome || "",
    email: profile?.email || "",
  });
  
  const [senhaForm, setSenhaForm] = useState({
    novaSenha: "",
    confirmarSenha: "",
  });

  const handleSalvarDados = async () => {
    try {
      const { error } = await updateProfile({
        nome: dadosForm.nome,
        email: dadosForm.email,
      });

      if (error) throw error;

      toast({
        title: "Dados atualizados",
        description: "Seus dados pessoais foram atualizados com sucesso.",
      });
      setEditandoDados(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seus dados.",
        variant: "destructive",
      });
    }
  };

  const handleAlterarSenha = async () => {
    if (senhaForm.novaSenha !== senhaForm.confirmarSenha) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (senhaForm.novaSenha.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await updatePassword(senhaForm.novaSenha);

      if (error) throw error;

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      });
      setEditandoSenha(false);
      setSenhaForm({ novaSenha: "", confirmarSenha: "" });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar sua senha.",
        variant: "destructive",
      });
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-agendaja-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
        <p className="text-gray-600">Gerencie seus dados pessoais e configurações de acesso</p>
      </div>

      <div className="grid gap-6">
        {/* Status da Conta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Status da Conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={statusColors[profile.status as keyof typeof statusColors]}>
                    {profile.status === 'ativo' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {profile.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline">
                    {nivelAcessoLabels[profile.nivel_acesso as keyof typeof nivelAcessoLabels]}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {profile.status === 'ativo' 
                    ? "Sua conta está ativa e funcionando normalmente." 
                    : "Sua conta possui restrições de acesso."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Dados Pessoais
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  if (editandoDados) {
                    setDadosForm({
                      nome: profile.nome || "",
                      email: profile.email || "",
                    });
                  }
                  setEditandoDados(!editandoDados);
                }}
              >
                {editandoDados ? "Cancelar" : "Editar"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={dadosForm.nome}
                onChange={(e) => setDadosForm(prev => ({ ...prev, nome: e.target.value }))}
                disabled={!editandoDados}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={dadosForm.email}
                onChange={(e) => setDadosForm(prev => ({ ...prev, email: e.target.value }))}
                disabled={!editandoDados}
              />
            </div>
            {editandoDados && (
              <Button onClick={handleSalvarDados} className="w-full">
                Salvar Alterações
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Alterar Senha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  if (editandoSenha) {
                    setSenhaForm({ novaSenha: "", confirmarSenha: "" });
                  }
                  setEditandoSenha(!editandoSenha);
                }}
              >
                {editandoSenha ? "Cancelar" : "Alterar Senha"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!editandoSenha ? (
              <p className="text-gray-600">Clique em "Alterar Senha" para modificar sua senha de acesso.</p>
            ) : (
              <>
                <div>
                  <Label htmlFor="novaSenha">Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="novaSenha"
                      type={mostrarSenha ? "text" : "password"}
                      value={senhaForm.novaSenha}
                      onChange={(e) => setSenhaForm(prev => ({ ...prev, novaSenha: e.target.value }))}
                      placeholder="Mínimo 6 caracteres"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                    >
                      {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmarSenha"
                      type={mostrarConfirmacao ? "text" : "password"}
                      value={senhaForm.confirmarSenha}
                      onChange={(e) => setSenhaForm(prev => ({ ...prev, confirmarSenha: e.target.value }))}
                      placeholder="Confirme a nova senha"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                    >
                      {mostrarConfirmacao ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button onClick={handleAlterarSenha} className="w-full">
                  Confirmar Alteração
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
