
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateInvite } from "@/hooks/useInvites";
import { useToast } from "@/hooks/use-toast";
import { Mail, UserPlus } from "lucide-react";

export default function ConviteUsuario() {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [nivelAcesso, setNivelAcesso] = useState("");
  
  const createInvite = useCreateInvite();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !nome || !nivelAcesso) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      await createInvite.mutateAsync({
        email,
        nome,
        nivel_acesso: nivelAcesso,
      });
      
      toast({
        title: "Convite enviado",
        description: `Convite enviado para ${email} com sucesso`,
      });
      
      // Limpar formulário
      setEmail("");
      setNome("");
      setNivelAcesso("");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o convite",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Convidar Novo Usuário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome completo"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="nivel_acesso">Nível de Acesso</Label>
            <Select value={nivelAcesso} onValueChange={setNivelAcesso}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível de acesso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="colaborador">Colaborador</SelectItem>
                <SelectItem value="atendente">Atendente</SelectItem>
                <SelectItem value="gerente">Gerente</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={createInvite.isPending}
          >
            {createInvite.isPending ? "Enviando..." : "Enviar Convite"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
