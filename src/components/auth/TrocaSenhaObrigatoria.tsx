
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Lock, Eye, EyeOff, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TrocaSenhaObrigatoria() {
  const { updatePassword, user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmaSenha, setMostrarConfirmaSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Validações da nova senha
  const validacoes = {
    minimo8: novaSenha.length >= 8,
    temMaiuscula: /[A-Z]/.test(novaSenha),
    temNumero: /\d/.test(novaSenha),
    senhasIguais: novaSenha === confirmaSenha && novaSenha.length > 0,
  };

  const todasValidacoesOk = Object.values(validacoes).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!todasValidacoesOk) {
      toast({
        title: "Erro de validação",
        description: "Por favor, verifique se todos os requisitos da senha foram atendidos",
        variant: "destructive",
      });
      return;
    }

    if (novaSenha === senhaAtual) {
      toast({
        title: "Erro",
        description: "A nova senha deve ser diferente da senha atual",
        variant: "destructive",
      });
      return;
    }

    setCarregando(true);

    try {
      // Atualizar a senha no Supabase
      const { error } = await updatePassword(novaSenha);
      
      if (error) {
        throw error;
      }

      toast({
        title: "Senha atualizada com sucesso!",
        description: "Sua senha foi alterada. Redirecionando para o dashboard...",
      });

      // Redirecionar para o dashboard após sucesso
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error);
      toast({
        title: "Erro ao atualizar senha",
        description: error.message || "Ocorreu um erro ao tentar atualizar sua senha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  };

  const ValidacaoItem = ({ valida, texto }: { valida: boolean; texto: string }) => (
    <div className={`flex items-center gap-2 text-sm ${valida ? 'text-green-600' : 'text-red-500'}`}>
      {valida ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      {texto}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
            <Lock className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Troca de Senha Obrigatória</CardTitle>
          <p className="text-gray-600 mt-2">
            Por motivos de segurança, você deve atualizar sua senha provisória antes de continuar.
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="senha-atual">Senha Atual (Provisória)</Label>
              <div className="relative">
                <Input
                  id="senha-atual"
                  type={mostrarSenhaAtual ? "text" : "password"}
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  placeholder="Digite sua senha atual"
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                >
                  {mostrarSenhaAtual ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="nova-senha">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="nova-senha"
                  type={mostrarNovaSenha ? "text" : "password"}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Digite sua nova senha"
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                >
                  {mostrarNovaSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirma-senha">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  id="confirma-senha"
                  type={mostrarConfirmaSenha ? "text" : "password"}
                  value={confirmaSenha}
                  onChange={(e) => setConfirmaSenha(e.target.value)}
                  placeholder="Confirme sua nova senha"
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setMostrarConfirmaSenha(!mostrarConfirmaSenha)}
                >
                  {mostrarConfirmaSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Validações da senha */}
            {novaSenha && (
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Requisitos da senha:</p>
                <ValidacaoItem valida={validacoes.minimo8} texto="Mínimo 8 caracteres" />
                <ValidacaoItem valida={validacoes.temMaiuscula} texto="Pelo menos 1 letra maiúscula" />
                <ValidacaoItem valida={validacoes.temNumero} texto="Pelo menos 1 número" />
                {confirmaSenha && (
                  <ValidacaoItem valida={validacoes.senhasIguais} texto="Senhas coincidem" />
                )}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!todasValidacoesOk || carregando}
            >
              {carregando ? "Atualizando..." : "Atualizar Senha"}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Importante:</strong> Esta tela é obrigatória por motivos de segurança. 
              Você só poderá acessar o sistema após atualizar sua senha.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
