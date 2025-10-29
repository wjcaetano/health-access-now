import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateCliente } from "@/hooks/useClientes";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco?: string;
  id_associado: string;
}

interface EditarClienteDialogProps {
  cliente: Cliente | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function EditarClienteDialog({
  cliente,
  open,
  onOpenChange,
  onSuccess,
}: EditarClienteDialogProps) {
  const { toast } = useToast();
  const updateCliente = useUpdateCliente();
  
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    endereco: "",
    id_associado: "",
  });

  useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome || "",
        cpf: cliente.cpf || "",
        telefone: cliente.telefone || "",
        email: cliente.email || "",
        endereco: cliente.endereco || "",
        id_associado: cliente.id_associado || "",
      });
    }
  }, [cliente]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cliente?.id) return;

    try {
      await updateCliente.mutateAsync({
        id: cliente.id,
        updates: formData,
      });

      toast({
        title: "Cliente atualizado",
        description: "As informações foram atualizadas com sucesso.",
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar as informações.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateCliente.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={updateCliente.isPending}>
              {updateCliente.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
