
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  UserPlus
} from "lucide-react";
import { useClientes } from "@/hooks/useClientes";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type EstadoVenda = 'inicial' | 'nao_encontrado' | 'cliente_selecionado' | 'cadastro_servicos';

const Vendas: React.FC = () => {
  const [termoBusca, setTermoBusca] = useState("");
  const [estadoAtual, setEstadoAtual] = useState<EstadoVenda>('inicial');
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const { data: clientes } = useClientes();
  const navigate = useNavigate();
  const { toast } = useToast();

  const buscarCliente = () => {
    if (!termoBusca.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Digite o CPF ou nome do cliente para buscar.",
        variant: "destructive"
      });
      return;
    }

    const clienteEncontrado = clientes?.find((cliente) =>
      cliente.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      cliente.cpf.includes(termoBusca)
    );

    if (clienteEncontrado) {
      setClienteSelecionado(clienteEncontrado);
      setEstadoAtual('cliente_selecionado');
    } else {
      setClienteSelecionado(null);
      setEstadoAtual('nao_encontrado');
    }
  };

  const confirmarCliente = () => {
    setEstadoAtual('cadastro_servicos');
    toast({
      title: "Cliente selecionado",
      description: `${clienteSelecionado.nome} foi selecionado para venda.`
    });
  };

  const alterarCliente = () => {
    // Navegar para página de edição do cliente
    navigate(`/editar-cliente/${clienteSelecionado.id}`);
  };

  const cancelarOperacao = () => {
    setTermoBusca("");
    setClienteSelecionado(null);
    setEstadoAtual('inicial');
  };

  const irParaCadastro = () => {
    navigate("/novo-cliente");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      buscarCliente();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Vendas</h2>
        <p className="text-gray-500 mt-1">
          Busque um cliente para iniciar uma venda
        </p>
      </div>

      {/* Formulário de Busca - Sempre visível */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Cliente</CardTitle>
          <CardDescription>
            Digite o CPF ou nome do cliente para buscar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Digite o CPF ou nome do cliente..."
                className="pl-8"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button onClick={buscarCliente} className="bg-agendaja-primary hover:bg-agendaja-secondary">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estado: Cliente não encontrado */}
      {estadoAtual === 'nao_encontrado' && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="h-12 w-12 mx-auto text-amber-500 mb-4" />
              <h3 className="text-lg font-medium text-amber-800 mb-2">
                Cliente não encontrado
              </h3>
              <p className="text-amber-600 mb-4">
                Não foi possível encontrar um cliente com o termo "{termoBusca}"
              </p>
              <Button onClick={irParaCadastro} className="bg-agendaja-primary hover:bg-agendaja-secondary">
                <UserPlus className="h-4 w-4 mr-2" />
                Cadastrar Novo Cliente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado: Cliente selecionado */}
      {estadoAtual === 'cliente_selecionado' && clienteSelecionado && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Cliente Encontrado</CardTitle>
            <CardDescription className="text-green-600">
              Verifique os dados do cliente abaixo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Dados do Cliente */}
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary mr-4">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{clienteSelecionado.nome}</h3>
                    <p className="text-gray-500">ID: {clienteSelecionado.id_associado}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-medium mr-2">CPF:</span>
                    <span>{clienteSelecionado.cpf}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="font-medium mr-2">Telefone:</span>
                    <span>{clienteSelecionado.telefone}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="font-medium mr-2">E-mail:</span>
                    <span>{clienteSelecionado.email}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="font-medium mr-2">Cadastro:</span>
                    <span>{format(new Date(clienteSelecionado.data_cadastro), "dd/MM/yyyy", { locale: ptBR })}</span>
                  </div>
                  
                  {clienteSelecionado.endereco && (
                    <div className="flex items-start text-gray-600 md:col-span-2">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                      <span className="font-medium mr-2">Endereço:</span>
                      <span>{clienteSelecionado.endereco}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={confirmarCliente} 
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  Confirmar Cliente
                </Button>
                <Button 
                  onClick={alterarCliente} 
                  variant="outline" 
                  className="flex-1"
                >
                  Alterar Dados
                </Button>
                <Button 
                  onClick={cancelarOperacao} 
                  variant="outline" 
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado: Cadastro de Serviços */}
      {estadoAtual === 'cadastro_servicos' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Cadastro de Serviços</CardTitle>
            <CardDescription className="text-blue-600">
              Cliente: {clienteSelecionado?.nome} | CPF: {clienteSelecionado?.cpf}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-blue-800 mb-2">
                Funcionalidade em Desenvolvimento
              </h3>
              <p className="text-blue-600 mb-4">
                A tela de cadastro de serviços será implementada em breve
              </p>
              <Button onClick={cancelarOperacao} variant="outline">
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Vendas;
