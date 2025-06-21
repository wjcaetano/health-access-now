
import React, { useState } from "react";
import { useCreateColaborador } from "@/hooks/useColaboradores";
import { useCreateInvite } from "@/hooks/useInvites";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Mail } from "lucide-react";

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
  const [enviarConvite, setEnviarConvite] = useState(true);
  
  const createColaborador = useCreateColaborador();
  const createInvite = useCreateInvite();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Cadastrar colaborador
      await createColaborador.mutateAsync({
        nome,
        email,
        cargo,
        nivel_acesso: nivel
      });
      
      // Enviar convite se solicitado
      if (enviarConvite) {
        await createInvite.mutateAsync({
          email,
          nome,
          nivel_acesso: nivel
        });
        
        toast({
          title: "Colaborador cadastrado",
          description: `${nome} foi cadastrado e um convite foi enviado para ${email}`,
        });
      } else {
        toast({
          title: "Colaborador cadastrado",
          description: `${nome} foi cadastrado com sucesso`,
        });
      }
      
      // Limpar formulário
      setNome("");
      setEmail("");
      setCargo("");
      setNivel("colaborador");
      setEnviarConvite(true);
    } catch (error) {
      console.error("Erro ao cadastrar colaborador:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o colaborador",
        variant: "destructive",
      });
    }
  };

  const isLoading = createColaborador.isPending || createInvite.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Cadastro Completo de Colaborador
        </CardTitle>
      </CardHeader>
      <CardContent>
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
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
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
              />
            </div>
            
            <div>
              <Label htmlFor="nivel">Nível de Acesso *</Label>
              <Select value={nivel} onValueChange={setNivel}>
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
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="convite" 
              checked={enviarConvite}
              onCheckedChange={(checked) => setEnviarConvite(checked as boolean)}
            />
            <Label htmlFor="convite">
              Enviar convite por email para criação de conta
            </Label>
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading ? "Cadastrando..." : "Cadastrar Colaborador"}
          </Button>
          
          {createColaborador.isSuccess && (
            <div className="text-green-600 text-sm text-center">
              Colaborador cadastrado com sucesso!
            </div>
          )}
          
          {(createColaborador.isError || createInvite.isError) && (
            <div className="text-red-600 text-sm text-center">
              Erro ao processar cadastro. Tente novamente.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
