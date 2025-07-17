
import React from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "@/components/dashboard/StatCard";
import { Calendar, FileText, MessageSquare, Star, Users, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useProviderData } from "@/hooks/tenant-specific/useProvider";
import AgendaOnline from "@/components/prestadores/AgendaOnline";
import PainelFaturamento from "@/components/prestadores/PainelFaturamento";
import AvaliacoesFeedback from "@/components/prestadores/AvaliacoesFeedback";
import ChatIntegrado from "@/components/prestadores/ChatIntegrado";

const PortalPrestador = () => {
  const { data: prestadorData, isLoading } = useProviderData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-agendaja-primary"></div>
      </div>
    );
  }

  if (!prestadorData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600">
            Você precisa ter um perfil de prestador para acessar esta área.
          </p>
        </div>
      </div>
    );
  }

  // Métricas calculadas
  const totalGuias = prestadorData.guias?.length || 0;
  const guiasPendentes = prestadorData.guias?.filter(g => g.status === 'pendente').length || 0;
  const faturamentoMensal = prestadorData.guias?.reduce((sum, g) => sum + Number(g.valor), 0) || 0;
  const avaliacaoMedia = 4.7; // Mock data - implementar cálculo real

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Bem-vindo, {prestadorData.nome}!
        </h2>
        <p className="text-gray-500 mt-1">
          Gerencie suas atividades e serviços na plataforma AGENDAJA
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Guias Totais"
          value={totalGuias.toString()}
          icon={<FileText className="h-5 w-5" />}
          description="Guias recebidas este mês"
        />
        
        <StatCard
          title="Pendentes"
          value={guiasPendentes.toString()}
          icon={<Calendar className="h-5 w-5" />}
          description="Guias aguardando atendimento"
        />
        
        <StatCard
          title="Faturamento"
          value={new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
          }).format(faturamentoMensal)}
          icon={<DollarSign className="h-5 w-5" />}
          description="Receita mensal atual"
        />
        
        <StatCard
          title="Avaliação"
          value={`${avaliacaoMedia} ⭐`}
          icon={<Star className="h-5 w-5" />}
          description="Média de avaliações"
        />
      </div>
      
      <Tabs defaultValue="agenda" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agenda">Agenda Online</TabsTrigger>
          <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
          <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
          <TabsTrigger value="chat">Mensagens</TabsTrigger>
        </TabsList>
        
        <TabsContent value="agenda" className="mt-6">
          <AgendaOnline prestadorId={prestadorData.id} />
        </TabsContent>
        
        <TabsContent value="faturamento" className="mt-6">
          <PainelFaturamento prestadorId={prestadorData.id} />
        </TabsContent>
        
        <TabsContent value="avaliacoes" className="mt-6">
          <AvaliacoesFeedback prestadorId={prestadorData.id} />
        </TabsContent>
        
        <TabsContent value="chat" className="mt-6">
          <ChatIntegrado prestadorId={prestadorData.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortalPrestador;
