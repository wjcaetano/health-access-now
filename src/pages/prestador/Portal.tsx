
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import { Calendar, FileText, CreditCard, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dados simulados do prestador
const prestadorMock = {
  nome: "Clínica Saúde Plena",
  tipo: "clinica",
  especialidades: ["Cardiologia", "Ortopedia", "Dermatologia"],
  guiasTotal: 58,
  guiasPendentes: 12,
  valorDisponivel: 4580.00,
  proximoPagamento: new Date(2025, 5, 15),
  realizados: {
    mes: 24,
    semana: 8,
    hoje: 2
  }
};

const PortalPrestador: React.FC = () => {
  const navigate = useNavigate();
  
  // Formatar valor em reais
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };
  
  // Formatar data
  const formatarData = (data: Date) => {
    return new Intl.NumberFormat("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(data);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bem-vindo, {prestadorMock.nome}</h1>
          <p className="text-gray-500">
            Portal do Prestador AGENDAJA - {prestadorMock.especialidades.join(", ")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate("/prestador/guias")}
          >
            Ver Guias
          </Button>
          <Button 
            className="bg-agendaja-primary hover:bg-agendaja-secondary"
            onClick={() => navigate("/prestador/faturamento")}
          >
            Solicitar Pagamento
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Guias"
          value={prestadorMock.guiasTotal}
          icon={<FileText className="h-5 w-5" />}
          description="Guias recebidas da AGENDAJA"
        />
        <StatCard 
          title="Guias Pendentes"
          value={prestadorMock.guiasPendentes}
          icon={<Clock className="h-5 w-5" />}
          description="Aguardando faturamento"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard 
          title="Valor Disponível"
          value={formatarValor(prestadorMock.valorDisponivel)}
          valueClassName="text-lg"
          icon={<CreditCard className="h-5 w-5" />}
          description="Para solicitar pagamento"
        />
        <StatCard 
          title="Próximo Pagamento"
          value={formatarData(prestadorMock.proximoPagamento)}
          valueClassName="text-base"
          icon={<Calendar className="h-5 w-5" />}
          description="Data programada"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Atendimentos</CardTitle>
            <CardDescription>Serviços realizados através da AGENDAJA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-around py-4">
              <div className="text-center mb-4 sm:mb-0">
                <p className="text-gray-500 text-sm">Hoje</p>
                <p className="text-3xl font-bold text-agendaja-primary">
                  {prestadorMock.realizados.hoje}
                </p>
              </div>
              <div className="text-center mb-4 sm:mb-0">
                <p className="text-gray-500 text-sm">Esta Semana</p>
                <p className="text-3xl font-bold text-agendaja-primary">
                  {prestadorMock.realizados.semana}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm">Este Mês</p>
                <p className="text-3xl font-bold text-agendaja-primary">
                  {prestadorMock.realizados.mes}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Instruções</CardTitle>
            <CardDescription>Como utilizar o Portal do Prestador</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-agendaja-primary pl-4 py-1">
              <p className="font-medium">Guias de Serviço</p>
              <p className="text-gray-600 text-sm">
                Visualize todas as guias enviadas pela AGENDAJA e confirme os serviços realizados.
              </p>
            </div>
            <div className="border-l-4 border-agendaja-primary pl-4 py-1">
              <p className="font-medium">Faturamento</p>
              <p className="text-gray-600 text-sm">
                Solicite o pagamento dos serviços realizados e agende a data de recebimento.
              </p>
            </div>
            <div className="border-l-4 border-agendaja-primary pl-4 py-1">
              <p className="font-medium">Agenda de Pagamentos</p>
              <p className="text-gray-600 text-sm">
                Escolha uma data disponível para recebimento após o dia 10 de cada mês.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortalPrestador;
