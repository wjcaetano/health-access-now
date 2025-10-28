import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in",
      className
    )}>
      <div className="rounded-full bg-primary/10 p-6 mb-4">
        <Icon className="h-12 w-12 text-primary" />
      </div>
      
      <h3 className="text-lg font-semibold mb-2">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-sm">
        {description}
      </p>
      
      {action && (
        <Button onClick={action.onClick} size="lg">
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Variações pré-configuradas para casos comuns
export const EmptyVendas: React.FC<{ onNovaVenda: () => void }> = ({ onNovaVenda }) => (
  <EmptyState
    icon={require("lucide-react").ShoppingCart}
    title="Nenhuma venda registrada"
    description="Comece criando sua primeira venda para este cliente"
    action={{
      label: "Nova Venda",
      onClick: onNovaVenda
    }}
  />
);

export const EmptyClientes: React.FC<{ onNovoCliente: () => void }> = ({ onNovoCliente }) => (
  <EmptyState
    icon={require("lucide-react").Users}
    title="Nenhum cliente cadastrado"
    description="Cadastre seu primeiro cliente para começar a utilizar o sistema"
    action={{
      label: "Cadastrar Cliente",
      onClick: onNovoCliente
    }}
  />
);

export const EmptyAgendamentos: React.FC<{ onNovoAgendamento: () => void }> = ({ onNovoAgendamento }) => (
  <EmptyState
    icon={require("lucide-react").Calendar}
    title="Nenhum agendamento encontrado"
    description="Você ainda não possui agendamentos para este período"
    action={{
      label: "Novo Agendamento",
      onClick: onNovoAgendamento
    }}
  />
);

export const EmptyOrcamentos: React.FC = () => (
  <EmptyState
    icon={require("lucide-react").FileText}
    title="Nenhum orçamento pendente"
    description="Não há orçamentos aguardando aprovação no momento"
  />
);

export const EmptySearch: React.FC = () => (
  <EmptyState
    icon={require("lucide-react").Search}
    title="Nenhum resultado encontrado"
    description="Tente ajustar os filtros ou usar outros termos de busca"
  />
);
