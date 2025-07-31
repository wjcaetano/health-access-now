
import React, { useState } from "react";
import { useCreateUsuario } from "@/hooks/useUsuarios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

const niveis = [
  { label: "Colaborador", value: "colaborador" },
  { label: "Atendente", value: "atendente" },
  { label: "Gerente", value: "gerente" },
  { label: "Admin", value: "admin" },
];

export default function CadastroCompleto() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [nivel, setNivel] = useState("colaborador");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [senhaDialog, setSenhaDialog] = useState({ isOpen: false, senha: "", email: "" });
  
  const createUsuario = useCreateUsuario();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Validações básicas
    if (!nome.trim()) {
      setError("Nome é obrigatório");
      setIsLoading(false);
      return;
    }
    
    if (!email.trim()) {
      setError("Email é obrigatório");
      setIsLoading(false);
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Por favor, insira um email válido");
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await createUsuario.mutateAsync({
        nome: nome.trim(),
        email: email.trim(),
        cargo: cargo.trim() || undefined,
        nivel_acesso: nivel
      });
      
      // Mostrar senha provisória
      setSenhaDialog({
        isOpen: true,
        senha: result.senha_provisoria,
        email: email.trim()
      });
      
      toast({
        title: "✅ Usuário criado com sucesso!",
        description: `${nome.trim()} foi cadastrado. A senha provisória será exibida.`,
      });
      
      // Limpar formulário
      setNome("");
      setEmail("");
      setCargo("");
      setNivel("colaborador");
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao criar usuário";
      
      setError(errorMessage);
      
      toast({
        title: "❌ Erro ao criar usuário",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Cadastro de Colaborador
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  placeholder="Nome completo do colaborador"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  placeholder="Cargo/Função do colaborador"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="nivel">Nível de Acesso *</Label>
                <Select value={nivel} onValueChange={setNivel} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível de acesso" />
                  </SelectTrigger>
                  <SelectContent>
                    {niveis.map((n) => (
                      <SelectItem key={n.value} value={n.value}>
                        {n.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full"
            >
              {isLoading ? "Criando usuário..." : "Criar Usuário"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={senhaDialog.isOpen} onOpenChange={(open) => setSenhaDialog({...senhaDialog, isOpen: open})}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>✅ Usuário Criado com Sucesso!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email:</Label>
              <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                {senhaDialog.email}
              </div>
            </div>
            <div>
              <Label>Senha Provisória:</Label>
              <div className="font-mono text-sm bg-yellow-100 p-2 rounded border border-yellow-300">
                {senhaDialog.senha}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <strong>Importante:</strong> O usuário deverá alterar esta senha no primeiro acesso.
            </div>
            <Button 
              onClick={() => setSenhaDialog({...senhaDialog, isOpen: false})}
              className="w-full"
            >
              Entendi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
