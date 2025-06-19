
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    try {
      await createInvite.mutateAsync({ email, nome, nivel_acesso: nivelAcesso });
      toast({
        title: "Convite enviado",
        description: `Convite enviado para ${email}`,
      });
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
          Convidar Usuário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nome</label>
            <Input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Nível de Acesso</label>
            <Select value={nivelAcesso} onValueChange={setNivelAcesso}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
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
            <Mail className="h-4 w-4 mr-2" />
            {createInvite.isPending ? "Enviando..." : "Enviar Convite"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
