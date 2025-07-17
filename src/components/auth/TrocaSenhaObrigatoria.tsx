
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Lock, Eye, EyeOff, Check, X, Shield, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TrocaSenhaObrigatoria() {
  const { updatePassword, user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmaSenha, setMostrarConfirmaSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [senhaFoco, setSenhaFoco] = useState(false);

  // Verificar se é um reset de senha por admin
  const isPasswordReset = user?.user_metadata?.senha_resetada_em;
  const resetDate = isPasswordReset ? new Date(user.user_metadata.senha_resetada_em) : null;

  // Validações da nova senha com pontuação
  const validacoes = {
    minimo8: { 
      valida: novaSenha.length >= 8, 
      texto: "Mínimo 8 caracteres",
      pontos: 25
    },
    temMaiuscula: { 
      valida: /[A-Z]/.test(novaSenha), 
      texto: "Pelo menos 1 letra maiúscula",
      pontos: 25
    },
    temMinuscula: { 
      valida: /[a-z]/.test(novaSenha), 
      texto: "Pelo menos 1 letra minúscula",
      pontos: 20
    },
    temNumero: { 
      valida: /\d/.test(novaSenha), 
      texto: "Pelo menos 1 número",
      pontos: 20
    },
    temEspecial: {
      valida: /[!@#$%^&*(),.?":{}|<>]/.test(novaSenha),
      texto: "Pelo menos 1 caractere especial",
      pontos: 10
    }
  };

  const senhasIguais = novaSenha === confirmaSenha && novaSenha.length > 0;
  const todasValidacoesObrigatorias = validacoes.minimo8.valida && 
                                     validacoes.temMaiuscula.valida && 
                                     validacoes.temNumero.valida;

  // Calcular força da senha
  const forcaSenha = Object.values(validacoes).reduce((total, validacao) => {
    return total + (validacao.valida ? validacao.pontos : 0);
  }, 0);

  const getForcaTexto = (forca: number) => {
    if (forca < 30) return { texto: "Muito fraca", cor: "text-red-600" };
    if (forca < 60) return { texto: "Fraca", cor: "text-orange-600" };
    if (forca < 85) return { texto: "Boa", cor: "text-yellow-600" };
    return { texto: "Muito forte", cor: "text-green-600" };
  };

  const forcaInfo = getForcaTexto(forcaSenha);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!todasValidacoesObrigatorias) {
      toast({
        title: "Senha não atende aos requisitos",
        description: "Por favor, verifique se a senha atende aos requisitos mínimos",
        variant: "destructive",
      });
      return;
    }

    if (!senhasIguais) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas não são iguais",
        variant: "destructive",
      });
      return;
    }

    setCarregando(true);

    try {
      const { error } = await updatePassword(novaSenha);
      
      if (error) {
        throw error;
      }

      toast({
        title: "Senha atualizada com sucesso!",
        description: "Sua senha foi alterada. Redirecionando...",
      });

      // Redirecionar baseado no tipo de usuário
      setTimeout(() => {
        if (profile?.prestador_id) {
          navigate("/prestador");
        } else {
          navigate("/dashboard");
        }
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

  const ValidacaoItem = ({ validacao, texto }: { validacao: boolean; texto: string }) => (
    <div className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
      validacao ? 'text-green-600' : 'text-gray-500'
    }`}>
      {validacao ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      )}
      <span className={validacao ? 'font-medium' : ''}>{texto}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header com logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-agendaja-primary">
            AGENDA<span className="text-agendaja-secondary">JA</span>
          </h1>
          <p className="text-gray-600 mt-2">Sistema de Agendamento de Saúde</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {isPasswordReset ? "Alterar Senha Resetada" : "Defina sua Nova Senha"}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {isPasswordReset 
                ? "Sua senha foi resetada por um administrador. Por segurança, defina uma nova senha."
                : "Por segurança, você precisa definir uma nova senha para continuar."
              }
            </p>
            
            {isPasswordReset && resetDate && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    Reset realizado em {resetDate.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Nova Senha */}
              <div className="space-y-2">
                <Label htmlFor="nova-senha">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="nova-senha"
                    type={mostrarNovaSenha ? "text" : "password"}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    onFocus={() => setSenhaFoco(true)}
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

                {/* Medidor de força da senha */}
                {(novaSenha || senhaFoco) && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Força da senha:</span>
                      <span className={`text-sm font-medium ${forcaInfo.cor}`}>
                        {forcaInfo.texto}
                      </span>
                    </div>
                    <Progress value={forcaSenha} className="h-2" />
                  </div>
                )}
              </div>

              {/* Campo Confirmar Senha */}
              <div className="space-y-2">
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
                
                {/* Validação de senhas iguais */}
                {confirmaSenha && (
                  <div className={`flex items-center gap-2 text-sm ${
                    senhasIguais ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {senhasIguais ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <span>{senhasIguais ? 'Senhas coincidem' : 'Senhas não coincidem'}</span>
                  </div>
                )}
              </div>

              {/* Requisitos da senha */}
              {novaSenha && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Requisitos da senha:</p>
                  <div className="space-y-2">
                    <ValidacaoItem validacao={validacoes.minimo8.valida} texto={validacoes.minimo8.texto} />
                    <ValidacaoItem validacao={validacoes.temMaiuscula.valida} texto={validacoes.temMaiuscula.texto} />
                    <ValidacaoItem validacao={validacoes.temMinuscula.valida} texto={validacoes.temMinuscula.texto} />
                    <ValidacaoItem validacao={validacoes.temNumero.valida} texto={validacoes.temNumero.texto} />
                    <ValidacaoItem validacao={validacoes.temEspecial.valida} texto={validacoes.temEspecial.texto} />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-agendaja-primary hover:bg-agendaja-secondary" 
                disabled={!todasValidacoesObrigatorias || !senhasIguais || carregando}
              >
                {carregando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPasswordReset ? "Alterar Senha" : "Definir Nova Senha"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Dica de Segurança</p>
                  <p className="text-sm text-blue-800 mt-1">
                    Use uma combinação de letras maiúsculas, minúsculas, números e símbolos 
                    para criar uma senha mais segura.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
