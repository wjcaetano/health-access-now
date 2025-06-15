
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCliente } from "@/hooks/useClientes";
import { useToast } from "@/hooks/use-toast";

export default function FormularioCliente() {
  const { toast } = useToast();
  const createCliente = useCreateCliente();
  
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    endereco: "",
    id_associado: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createCliente.mutateAsync(formData);
      toast({
        title: "Cliente cadastrado com sucesso!",
        description: "O cliente foi adicionado ao sistema.",
      });
      
      // Limpar formulário
      setFormData({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        endereco: "",
        id_associado: "",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar cliente",
        description: error.message,
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Cadastrar Novo Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => handleChange("cpf", e.target.value)}
                placeholder="000.000.000-00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="id_associado">ID do Associado *</Label>
              <Input
                id="id_associado"
                value={formData.id_associado}
                onChange={(e) => handleChange("id_associado", e.target.value)}
                placeholder="Ex: ASS001"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleChange("endereco", e.target.value)}
                placeholder="Rua, número, bairro, cidade"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-agendaja-primary hover:bg-agendaja-secondary"
            disabled={createCliente.isPending}
          >
            {createCliente.isPending ? "Cadastrando..." : "Cadastrar Cliente"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
