
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("agendaja"); // "agendaja" ou "prestador"
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de login - em um app real, isso seria uma chamada à API
    setTimeout(() => {
      setIsLoading(false);
      
      if (email && password) {
        // Salvar um token de autenticação simulado
        localStorage.setItem("agendaja_authenticated", "true");
        localStorage.setItem("agendaja_user_type", userType);
        
        // Redirecionar para o painel apropriado
        if (userType === "prestador") {
          navigate("/prestador");
          toast({
            title: "Login realizado com sucesso!",
            description: "Bem-vindo ao Portal do Prestador AGENDAJA",
          });
        } else {
          navigate("/");
          toast({
            title: "Login realizado com sucesso!",
            description: "Bem-vindo ao Sistema AGENDAJA",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Email ou senha inválidos. Tente novamente.",
        });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-agendaja-primary">
            AGENDA<span className="text-agendaja-secondary">JA</span>
          </h1>
          <p className="text-gray-600 mt-2">Sistema de Agendamento de Saúde</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">Acesso ao Sistema</CardTitle>
            <CardDescription className="text-center">
              Escolha seu tipo de acesso e faça login para continuar
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="agendaja" className="w-full" onValueChange={setUserType}>
            <TabsList className="grid grid-cols-2 mb-2 mx-6">
              <TabsTrigger value="agendaja">Equipe AGENDAJA</TabsTrigger>
              <TabsTrigger value="prestador">Prestador</TabsTrigger>
            </TabsList>
            
            <TabsContent value="agendaja">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu.email@agendaja.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      <Button variant="link" className="px-0 h-auto text-xs">
                        Esqueceu a senha?
                      </Button>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-agendaja-primary hover:bg-agendaja-secondary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Autenticando..." : "Entrar"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="prestador">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prestador-email">Email do Prestador</Label>
                    <Input 
                      id="prestador-email" 
                      type="email" 
                      placeholder="email@clinica.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="prestador-password">Senha</Label>
                      <Button variant="link" className="px-0 h-auto text-xs">
                        Esqueceu a senha?
                      </Button>
                    </div>
                    <Input 
                      id="prestador-password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-agendaja-primary hover:bg-agendaja-secondary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Autenticando..." : "Acessar Portal"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
