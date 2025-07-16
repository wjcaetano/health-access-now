
import React from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "@/components/dashboard/StatCard";
import { Calendar, FileText, CreditCard, Star, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import AgendamentoOnline from "@/components/clientes/AgendamentoOnline";
import HistoricoServicos from "@/components/clientes/HistoricoServicos";
import PagamentosOnline from "@/components/clientes/PagamentosOnline";
import AvaliacaoServicos from "@/components/clientes/AvaliacaoServicos";

const PortalCliente = () => {
  // Mock data - em implementação real, buscar dados do cliente autenticado
  const cliente = {
    nome: "Maria da Silva",
    email: "maria@email.com",
    telefone: "(11) 99999-9999",
    ultimoAgendamento: new Date(2024, 0, 15),
    proximoAgendamento: new Date(2024, 0, 25),
    totalServicos: 12,
    servicosPendentes: 2,
    valorGasto: 1250.00,
    pontuacao: 850
  };

  const formatMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Olá, {cliente.nome}!
              </h1>
              <p className="text-gray-500 mt-1">
                Bem-vindo ao seu portal AGENDAJA
              </p>
            </div>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Próximo Agendamento"
              value={format(cliente.proximoAgendamento, "dd/MM")}
              icon={<Calendar className="h-5 w-5" />}
              description={format(cliente.proximoAgendamento, "EEEE", { locale: ptBR })}
            />
            
            <StatCard
              title="Serviços Realizados"
              value={cliente.totalServicos.toString()}
              icon={<FileText className="h-5 w-5" />}
              description="Total de procedimentos"
            />
            
            <StatCard
              title="Valor Investido"
              value={formatMoeda(cliente.valorGasto)}
              icon={<CreditCard className="h-5 w-5" />}
              description="Em cuidados com a saúde"
            />
            
            <StatCard
              title="Pontuação"
              value={`${cliente.pontuacao} pts`}
              icon={<Star className="h-5 w-5" />}
              description="Programa de fidelidade"
            />
          </div>

          {/* Próximo Agendamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Próximo Agendamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Consulta Cardiológica</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(cliente.proximoAgendamento, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        AGENDAJA Centro
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Dr. João Silva - Cardiologista
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Reagendar
                    </Button>
                    <Button variant="destructive" size="sm">
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Principais */}
          <Tabs defaultValue="agendamento" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="agendamento">Agendamento</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
              <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
              <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="agendamento" className="mt-6">
              <AgendamentoOnline clienteId="mock-cliente-id" />
            </TabsContent>
            
            <TabsContent value="historico" className="mt-6">
              <HistoricoServicos clienteId="mock-cliente-id" />
            </TabsContent>
            
            <TabsContent value="pagamentos" className="mt-6">
              <PagamentosOnline clienteId="mock-cliente-id" />
            </TabsContent>
            
            <TabsContent value="avaliacoes" className="mt-6">
              <AvaliacaoServicos clienteId="mock-cliente-id" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PortalCliente;
