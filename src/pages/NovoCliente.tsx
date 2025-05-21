
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CartaoAssociado from "@/components/cartao/CartaoAssociado";
import { ArrowLeft } from "lucide-react";
import { Cliente } from "@/types";
import { useToast } from "@/hooks/use-toast";

const NovoCliente: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    endereco: "",
  });

  const [formErrors, setFormErrors] = useState<{
    [key: string]: string;
  }>({});

  // Cliente temporário para preview do cartão
  const clientePreview: Cliente = {
    ...formData,
    id: "preview",
    dataCadastro: new Date(),
    idAssociado: "AJ" + Math.random().toString(36).substring(2, 8).toUpperCase(),
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.nome) errors.nome = "Nome é obrigatório";
    if (!formData.cpf) errors.cpf = "CPF é obrigatório";
    if (!formData.telefone) errors.telefone = "Telefone é obrigatório";
    if (!formData.endereco) errors.endereco = "Endereço é obrigatório";
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido";
    }
    
    if (formData.cpf && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      errors.cpf = "CPF deve estar no formato 000.000.000-00";
    }
    
    if (formData.telefone && !/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.telefone)) {
      errors.telefone = "Telefone deve estar no formato (00) 00000-0000";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Formatação automática de campos
    if (name === "cpf") {
      formattedValue = formatCPF(value);
    } else if (name === "telefone") {
      formattedValue = formatTelefone(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    
    // Limpar erro quando o campo é preenchido
    if (formErrors[name] && formattedValue) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Em um app real, aqui seria feita a integração com backend
      console.log("Dados do cliente:", formData);
      
      toast({
        title: "Cliente cadastrado com sucesso!",
        description: `${formData.nome} foi adicionado(a) à base de clientes.`,
      });
      
      navigate("/clientes");
    } else {
      toast({
        variant: "destructive",
        title: "Erro no formulário",
        description: "Verifique os campos e tente novamente.",
      });
    }
  };

  // Funções auxiliares para formatação de campos
  const formatCPF = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');
    
    // Limita ao máximo de 11 dígitos
    const cpf = numericValue.slice(0, 11);
    
    // Aplica a máscara 000.000.000-00
    if (cpf.length <= 3) {
      return cpf;
    } else if (cpf.length <= 6) {
      return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
    } else if (cpf.length <= 9) {
      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
    } else {
      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
    }
  };
  
  const formatTelefone = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');
    
    // Limita ao máximo de 11 dígitos
    const phone = numericValue.slice(0, 11);
    
    // Aplica a máscara (00) 00000-0000
    if (phone.length <= 2) {
      return phone;
    } else if (phone.length <= 7) {
      return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
    } else {
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/clientes")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Novo Cliente</h2>
          <p className="text-gray-500 mt-1">
            Cadastre um novo cliente na plataforma
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo <span className="text-red-500">*</span></Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className={formErrors.nome ? "border-red-500" : ""}
                      placeholder="Nome completo do cliente"
                    />
                    {formErrors.nome && (
                      <p className="text-sm text-red-500">{formErrors.nome}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF <span className="text-red-500">*</span></Label>
                    <Input
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      className={formErrors.cpf ? "border-red-500" : ""}
                      placeholder="000.000.000-00"
                    />
                    {formErrors.cpf && (
                      <p className="text-sm text-red-500">{formErrors.cpf}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone <span className="text-red-500">*</span></Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className={formErrors.telefone ? "border-red-500" : ""}
                      placeholder="(00) 00000-0000"
                    />
                    {formErrors.telefone && (
                      <p className="text-sm text-red-500">{formErrors.telefone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={formErrors.email ? "border-red-500" : ""}
                      placeholder="email@exemplo.com"
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="endereco">Endereço <span className="text-red-500">*</span></Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      className={formErrors.endereco ? "border-red-500" : ""}
                      placeholder="Endereço completo"
                    />
                    {formErrors.endereco && (
                      <p className="text-sm text-red-500">{formErrors.endereco}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/clientes")}
                    className="mr-2"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-agendaja-primary hover:bg-agendaja-secondary">
                    Cadastrar Cliente
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Cartão de Associado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <CartaoAssociado cliente={clientePreview} />
              </div>
              <p className="text-sm text-gray-500 text-center mt-4">
                Este cartão será gerado automaticamente após o cadastro do cliente.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NovoCliente;
