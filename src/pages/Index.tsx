
import React from "react";
import StatCard from "@/components/dashboard/StatCard";
import AgendamentosRecentes from "@/components/dashboard/AgendamentosRecentes";
import OrcamentosRecentes from "@/components/dashboard/OrcamentosRecentes";
import ResumoWhatsapp from "@/components/dashboard/ResumoWhatsapp";
import { Calendar, User, MessageSquare, CalendarCheck } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { agendamentos, clientes, orcamentos } from "@/data/mock";

const mensagensRecentes = [
  {
    id: "1",
    nome: "Maria Silva",
    telefone: "(11) 99999-8888",
    mensagem: "Olá, gostaria de agendar uma consulta com o Dr. Roberto",
    horario: "Há 30 min",
    naoLida: true,
  },
  {
    id: "2",
    nome: "João Santos",
    telefone: "(11) 98888-7777",
    mensagem: "Bom dia, preciso remarcar minha consulta de amanhã",
    horario: "Há 2h",
    naoLida: false,
  },
  {
    id: "3",
    nome: "Ana Oliveira",
    telefone: "(11) 97777-6666",
    mensagem: "Quanto custa uma consulta com dermatologista?",
    horario: "Ontem",
    naoLida: true,
  },
];

// Organiza agendamentos por data, mais recentes primeiro
const agendamentosRecentes = [...agendamentos]
  .sort((a, b) => b.dataAgendamento.getTime() - a.dataAgendamento.getTime())
  .slice(0, 5);

// Organiza orçamentos por data de criação, mais recentes primeiro
const orcamentosRecentes = [...orcamentos]
  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  .slice(0, 5);

const Index = () => {
  // Calcula número de agendamentos por status
  const agendamentosAgendados = agendamentos.filter(a => a.status === 'agendado').length;
  const agendamentosHoje = agendamentos.filter(a => {
    const hoje = new Date();
    const dataAgendamento = new Date(a.dataAgendamento);
    return dataAgendamento.getDate() === hoje.getDate() &&
           dataAgendamento.getMonth() === hoje.getMonth() &&
           dataAgendamento.getFullYear() === hoje.getFullYear();
  }).length;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in max-w-7xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Clientes Cadastrados"
          value={clientes.length}
          icon={<User className="h-4 w-4 md:h-5 md:w-5" />}
          description="Total de clientes na base"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Agendamentos Confirmados"
          value={agendamentosAgendados}
          icon={<Calendar className="h-4 w-4 md:h-5 md:w-5" />}
          description="Agendamentos ativos"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Atendimentos Hoje"
          value={agendamentosHoje}
          icon={<CalendarCheck className="h-4 w-4 md:h-5 md:w-5" />}
          description="Agendados para hoje"
        />
        <StatCard
          title="Mensagens Não Lidas"
          value={mensagensRecentes.filter(m => m.naoLida).length}
          icon={<MessageSquare className="h-4 w-4 md:h-5 md:w-5" />}
          description="Via WhatsApp"
          trend={{ value: 8, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <AgendamentosRecentes agendamentos={agendamentosRecentes} />
        </div>
        <div className="space-y-4 md:space-y-6">
          <OrcamentosRecentes orcamentos={orcamentosRecentes} />
          <ResumoWhatsapp mensagens={mensagensRecentes} />
        </div>
      </div>
    </div>
  );
};

export default Index;
