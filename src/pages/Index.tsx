
import React from "react";
import StatCard from "@/components/dashboard/StatCard";
import AgendamentosRecentes from "@/components/dashboard/AgendamentosRecentes";
import OrcamentosRecentes from "@/components/dashboard/OrcamentosRecentes";
import ResumoWhatsapp from "@/components/dashboard/ResumoWhatsapp";
import { Calendar, User, MessageSquare, CalendarCheck } from "lucide-react";
import { 
  useDashboardStats, 
  useAgendamentosRecentes, 
  useOrcamentosRecentes, 
  useMensagensRecentes 
} from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: agendamentosRecentes, isLoading: agendamentosLoading } = useAgendamentosRecentes();
  const { data: orcamentosRecentes, isLoading: orcamentosLoading } = useOrcamentosRecentes();
  const { data: mensagensRecentes, isLoading: mensagensLoading } = useMensagensRecentes();
  const isMobile = useIsMobile();

  if (statsLoading) {
    return (
      <div className={`space-y-4 animate-fade-in max-w-full ${isMobile ? 'px-1' : 'container mx-auto px-4 py-6'}`}>
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className={isMobile ? "h-24" : "h-32"} />
          ))}
        </div>
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          <div className={isMobile ? "" : "lg:col-span-2"}>
            <Skeleton className={isMobile ? "h-64" : "h-96"} />
          </div>
          <div className={`space-y-4 ${isMobile ? '' : 'md:space-y-6'}`}>
            <Skeleton className={isMobile ? "h-40" : "h-48"} />
            <Skeleton className={isMobile ? "h-40" : "h-48"} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in max-w-full bg-white text-gray-900" style={{ backgroundColor: '#ffffff', color: '#1f2937' }}>
      <div className={`${isMobile ? 'px-1' : 'container mx-auto px-4 py-6'}`}>
        {/* Stats Cards */}
        <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
          <StatCard
            title="Clientes Cadastrados"
            value={stats?.totalClientes || 0}
            icon={<User className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4 md:h-5 md:w-5'}`} />}
            description="Total de clientes na base"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Agendamentos Confirmados"
            value={stats?.agendamentosConfirmados || 0}
            icon={<Calendar className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4 md:h-5 md:w-5'}`} />}
            description="Agendamentos ativos"
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Atendimentos Hoje"
            value={stats?.agendamentosHoje || 0}
            icon={<CalendarCheck className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4 md:h-5 md:w-5'}`} />}
            description="Agendados para hoje"
          />
          <StatCard
            title="Mensagens Não Lidas"
            value={stats?.mensagensNaoLidas || 0}
            icon={<MessageSquare className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4 md:h-5 md:w-5'}`} />}
            description="Via WhatsApp"
            trend={{ value: 8, isPositive: false }}
          />
        </div>

        {/* Main Content */}
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          <div className={isMobile ? "" : "lg:col-span-2"}>
            {agendamentosLoading ? (
              <Skeleton className={isMobile ? "h-64" : "h-96"} />
            ) : (
              <AgendamentosRecentes agendamentos={agendamentosRecentes || []} />
            )}
          </div>
          <div className={`space-y-4 ${isMobile ? '' : 'md:space-y-6'}`}>
            {orcamentosLoading ? (
              <Skeleton className={isMobile ? "h-40" : "h-48"} />
            ) : (
              <OrcamentosRecentes orcamentos={orcamentosRecentes || []} />
            )}
            {mensagensLoading ? (
              <Skeleton className={isMobile ? "h-40" : "h-48"} />
            ) : (
              <ResumoWhatsapp mensagens={mensagensRecentes || []} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
