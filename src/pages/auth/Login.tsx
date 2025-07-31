
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, user, profile, loading, initialized } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    // Aguardar inicialização completa e evitar loops
    if (!initialized || loading || hasRedirected) return;
    
    // Só redirecionar se realmente tiver usuário E perfil válidos
    if (user && profile && profile.status === 'ativo' && profile.nivel_acesso) {
      console.log('User already logged in, redirecting based on profile:', profile.nivel_acesso);
      setHasRedirected(true);
      
      // Redirecionar diretamente para o destino final ao invés de passar por /auth/redirect
      if (profile.nivel_acesso === 'prestador') {
        navigate('/prestador/portal', { replace: true });
      } else if (['admin', 'gerente', 'atendente', 'colaborador'].includes(profile.nivel_acesso)) {
        navigate('/unidade/dashboard', { replace: true });
      }
    }
  }, [user, profile, loading, initialized, navigate, hasRedirected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let result;
      if (isSignUp) {
        if (!nome.trim()) {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Nome é obrigatório para cadastro"
          });
          return;
        }
        result = await signUp(email, password, nome);
      } else {
        result = await signIn(email, password);
      }
      
      if (result.error) {
        let errorMessage = "Ocorreu um erro. Tente novamente.";
        
        if (result.error.message?.includes("Invalid login credentials")) {
          errorMessage = "Email ou senha incorretos";
        } else if (result.error.message?.includes("User already registered")) {
          errorMessage = "Este email já está cadastrado. Faça login.";
        } else if (result.error.message?.includes("Password should be")) {
          errorMessage = "A senha deve ter pelo menos 6 caracteres";
        }
        
        toast({
          variant: "destructive",
          title: isSignUp ? "Erro no cadastro" : "Erro no login",
          description: errorMessage
        });
      } else {
        if (isSignUp) {
          toast({
            title: "Cadastro realizado!",
            description: "Verifique seu email para confirmar a conta"
          });
        } else {
          toast({
            title: "Login realizado com sucesso!",
            description: "Redirecionando..."
          });
          // Aguardar um momento para o contexto de auth atualizar
          setTimeout(() => {
            window.location.href = '/';
          }, 500);
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro inesperado"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-agendaja-primary">
              AGENDA<span className="text-agendaja-secondary">JA</span>
            </h1>
            <p className="text-gray-600 mt-2">Sistema de Agendamento de Saúde</p>
          </div>
          
          <ForgotPasswordForm onBackToLogin={() => setShowForgotPassword(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-agendaja-light to-white rounded-2xl shadow-xl border border-agendaja-border/30">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold elegant-text-gradient">
            AGENDA<span className="text-agendaja-secondary">JA</span>
          </h1>
          <p className="text-agendaja-text-secondary mt-2 text-sm">Sistema de Agendamento de Saúde</p>
        </div>
        
        <Card className="border-agendaja-border/20 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-xl font-semibold text-agendaja-text-primary">
              {isSignUp ? "Criar Conta" : "Acesso ao Sistema"}
            </CardTitle>
            <CardDescription className="text-agendaja-text-secondary text-sm">
              {isSignUp 
                ? "Preencha os dados para criar sua conta" 
                : "Faça login para continuar"
              }
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-agendaja-text-primary font-medium">Nome completo</Label>
                  <Input 
                    id="nome" 
                    type="text" 
                    placeholder="Seu nome completo" 
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required={isSignUp}
                    disabled={isLoading}
                    className="border-agendaja-border/40 bg-white/90 focus:border-agendaja-primary focus:ring-agendaja-primary/20 h-12"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-agendaja-text-primary font-medium">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu.email@empresa.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="border-agendaja-border/40 bg-white/90 focus:border-agendaja-primary focus:ring-agendaja-primary/20 h-12"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-agendaja-text-primary font-medium">Senha</Label>
                  {!isSignUp && (
                    <Button 
                      type="button"
                      variant="link" 
                      className="px-0 h-auto text-xs text-agendaja-primary hover:text-agendaja-secondary transition-colors"
                      onClick={() => setShowForgotPassword(true)}
                      disabled={isLoading}
                    >
                      Esqueceu a senha?
                    </Button>
                  )}
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pr-12 border-agendaja-border/40 bg-white/90 focus:border-agendaja-primary focus:ring-agendaja-primary/20 h-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? 
                      <EyeOff className="h-4 w-4 text-agendaja-text-secondary" /> : 
                      <Eye className="h-4 w-4 text-agendaja-text-secondary" />
                    }
                  </Button>
                </div>
                {isSignUp && (
                  <p className="text-xs text-agendaja-text-secondary">Mínimo 6 caracteres</p>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <Button 
                type="submit" 
                className="w-full h-12 elegant-gradient text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Processando..." : (isSignUp ? "Criar Conta" : "Entrar")}
              </Button>
              
              <Button 
                type="button"
                variant="link" 
                className="text-sm text-agendaja-primary hover:text-agendaja-secondary transition-colors"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={isLoading}
              >
                {isSignUp 
                  ? "Já tem uma conta? Faça login" 
                  : "Não tem conta? Cadastre-se"
                }
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
