
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GuiaAgendamento from "@/components/guias/GuiaAgendamento";
import { ArrowLeft, Calendar, Clock, Search, MapPin, User } from "lucide-react";
import { Cliente, Agendamento } from "@/types";
import { clientes } from "@/data/mock";
import { useToast } from "@/hooks/use-toast";

// Listas mockadas para seleção nos dropdowns
const clinicas = [
  "Clínica São Lucas",
  "Hospital Santa Maria",
  "Centro Médico Paulista",
  "Laboratório Diagnósticos",
  "Clínica Bem Estar"
];

const profissionais = [
  "Dr. Roberto Almeida",
  "Dra. Camila Santos",
  "Dr. Marcelo Costa",
  "Dra. Juliana Pereira",
  "Dr. Fernando Oliveira"
];

const servicos = [
  "Consulta Cardiologia",
  "Exame de Sangue",
  "Ultrassonografia",
  "Consulta Dermatologia",
  "Raio-X",
  "Consulta Oftalmologia",
  "Exame de Urina"
];

const horarios = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

// Função para gerar código de autenticação aleatório
const gerarCodigoAutenticacao = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

const NovoAgendamento: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    clienteId: "",
    data: "",
    horario: "",
    clinica: "",
    profissional: "",
    servico: "",
  });
  
  const [formErrors, setFormErrors] = useState<{
    [key: string]: string;
  }>({});
  
  const [searchTerm, setSearchTerm] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState(clientes);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [mostrarPreview, setMostrarPreview] = useState(false);
  
  const dataAtual = new Date().toISOString().split("T")[0]; // Para o min do campo de data
  
  // Agendamento temporário para preview da guia
  const agendamentoPreview: Agendamento = {
    id: "preview",
    clienteId: clienteSelecionado?.id || "",
    dataAgendamento: formData.data ? new Date(formData.data) : new Date(),
    horario: formData.horario,
    clinica: formData.clinica,
    profissional: formData.profissional,
    servico: formData.servico,
    status: "agendado",
    codigoAutenticacao: gerarCodigoAutenticacao(),
    createdAt: new Date()
  };

  useEffect(() => {
    // Filtrar clientes com base no termo de busca
    const resultados = clientes.filter((cliente) => 
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.cpf.includes(searchTerm) ||
      cliente.telefone.includes(searchTerm)
    );
    setClientesFiltrados(resultados);
  }, [searchTerm]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.clienteId) errors.clienteId = "Cliente é obrigatório";
    if (!formData.data) errors.data = "Data é obrigatória";
    if (!formData.horario) errors.horario = "Horário é obrigatório";
    if (!formData.clinica) errors.clinica = "Clínica é obrigatória";
    if (!formData.profissional) errors.profissional = "Profissional é obrigatório";
    if (!formData.servico) errors.servico = "Serviço é obrigatório";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSelectCliente = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setFormData(prev => ({ ...prev, clienteId: cliente.id }));
    setSearchTerm("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Mostrar o preview da guia de agendamento
      setMostrarPreview(true);
      
      toast({
        title: "Agendamento criado com sucesso!",
        description: "A guia de agendamento foi gerada.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro no formulário",
        description: "Preencha todos os campos obrigatórios.",
      });
    }
  };

  const concluirAgendamento = () => {
    // Em um app real, aqui seria a confirmação e persistência dos dados
    navigate("/agendamentos");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/agendamentos")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Novo Agendamento</h2>
          <p className="text-gray-500 mt-1">
            Cadastre um novo agendamento para um cliente
          </p>
        </div>
      </div>

      {mostrarPreview ? (
        <div>
          <div className="text-center mb-6">
            <h3 className="text-xl font-medium mb-2">
              Guia de Agendamento Gerada
            </h3>
            <p className="text-gray-500">
              Revise os dados e confirme o agendamento
            </p>
          </div>
          
          <div className="flex justify-center mb-8">
            {clienteSelecionado && (
              <GuiaAgendamento 
                agendamento={agendamentoPreview}
                cliente={clienteSelecionado}
              />
            )}
          </div>
          
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setMostrarPreview(false)}
            >
              Editar Agendamento
            </Button>
            <Button 
              className="bg-agendaja-primary hover:bg-agendaja-secondary"
              onClick={concluirAgendamento}
            >
              Confirmar e Concluir
            </Button>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Dados do Agendamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  1. Selecione o Cliente
                </Label>
                
                {!clienteSelecionado ? (
                  <div>
                    <div className="relative mb-4">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Buscar por nome, CPF ou telefone..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    {searchTerm && (
                      <div className="border rounded-md max-h-60 overflow-y-auto">
                        {clientesFiltrados.length > 0 ? (
                          <ul className="divide-y divide-gray-200">
                            {clientesFiltrados.map((cliente) => (
                              <li key={cliente.id}>
                                <button
                                  type="button"
                                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center"
                                  onClick={() => handleSelectCliente(cliente)}
                                >
                                  <div className="h-10 w-10 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary mr-3">
                                    <User className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{cliente.nome}</p>
                                    <div className="text-sm text-gray-500">
                                      <span>{cliente.cpf}</span>
                                      <span className="mx-2">•</span>
                                      <span>{cliente.telefone}</span>
                                    </div>
                                  </div>
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            Nenhum cliente encontrado
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary mr-4">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium text-lg">{clienteSelecionado.nome}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{clienteSelecionado.cpf}</span>
                          <span className="mx-2">•</span>
                          <span>{clienteSelecionado.telefone}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setClienteSelecionado(null);
                        setFormData(prev => ({ ...prev, clienteId: "" }));
                      }}
                    >
                      Alterar
                    </Button>
                  </div>
                )}
                
                {formErrors.clienteId && !clienteSelecionado && (
                  <p className="text-sm text-red-500">
                    {formErrors.clienteId}
                  </p>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  2. Data e Horário
                </Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <Label htmlFor="data">Data <span className="text-red-500">*</span></Label>
                    </div>
                    <Input
                      id="data"
                      type="date"
                      min={dataAtual}
                      value={formData.data}
                      onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                      className={formErrors.data ? "border-red-500" : ""}
                    />
                    {formErrors.data && (
                      <p className="text-sm text-red-500">{formErrors.data}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <Label htmlFor="horario">Horário <span className="text-red-500">*</span></Label>
                    </div>
                    <Select
                      value={formData.horario}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, horario: value }))}
                    >
                      <SelectTrigger
                        id="horario"
                        className={formErrors.horario ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {horarios.map((horario) => (
                            <SelectItem key={horario} value={horario}>
                              {horario}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {formErrors.horario && (
                      <p className="text-sm text-red-500">{formErrors.horario}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  3. Local e Serviço
                </Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <Label htmlFor="clinica">Clínica <span className="text-red-500">*</span></Label>
                    </div>
                    <Select
                      value={formData.clinica}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, clinica: value }))}
                    >
                      <SelectTrigger
                        id="clinica"
                        className={formErrors.clinica ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Selecione a clínica" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {clinicas.map((clinica) => (
                            <SelectItem key={clinica} value={clinica}>
                              {clinica}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {formErrors.clinica && (
                      <p className="text-sm text-red-500">{formErrors.clinica}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <Label htmlFor="profissional">Profissional <span className="text-red-500">*</span></Label>
                    </div>
                    <Select
                      value={formData.profissional}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, profissional: value }))}
                    >
                      <SelectTrigger
                        id="profissional"
                        className={formErrors.profissional ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Selecione o profissional" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {profissionais.map((profissional) => (
                            <SelectItem key={profissional} value={profissional}>
                              {profissional}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {formErrors.profissional && (
                      <p className="text-sm text-red-500">{formErrors.profissional}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="servico">Serviço <span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.servico}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, servico: value }))}
                    >
                      <SelectTrigger
                        id="servico"
                        className={formErrors.servico ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Selecione o serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {servicos.map((servico) => (
                            <SelectItem key={servico} value={servico}>
                              {servico}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {formErrors.servico && (
                      <p className="text-sm text-red-500">{formErrors.servico}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/agendamentos")}
                  className="mr-2"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-agendaja-primary hover:bg-agendaja-secondary"
                >
                  Gerar Guia de Agendamento
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NovoAgendamento;
