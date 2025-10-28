import React from "react";
import { MenuItem } from "../MenuItems";
import { 
  BarChart3,
  DollarSign,
  Calendar,
  FileText,
  Users,
  Stethoscope,
  Package,
  Calculator,
  UserCog,
  Settings,
  Building2
} from "lucide-react";

// Menu unificado para o Hub AGENDAJA (modelo centralizado)
export const hubMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/hub/dashboard",
    roles: ["atendente", "gerente", "admin"]
  },
  {
    title: "Dashboard Estratégico",
    icon: BarChart3,
    href: "/hub/dashboard-estrategico",
    roles: ["gerente", "admin"]
  },
  {
    title: "Vendas",
    icon: DollarSign,
    href: "/hub/vendas",
    roles: ["atendente", "gerente", "admin"]
  },
  {
    title: "Agendamentos",
    icon: Calendar,
    href: "/hub/agendamentos",
    roles: ["atendente", "gerente", "admin"]
  },
  {
    title: "Orçamentos",
    icon: FileText,
    href: "/hub/orcamentos",
    roles: ["atendente", "gerente", "admin"]
  },
  {
    title: "Clientes",
    icon: Users,
    href: "/hub/clientes",
    roles: ["atendente", "gerente", "admin"]
  },
  {
    title: "Prestadores",
    icon: Stethoscope,
    href: "/hub/prestadores",
    roles: ["gerente", "admin"]
  },
  {
    title: "Buscar Prestadores",
    icon: Stethoscope,
    href: "/hub/buscar-prestadores",
    roles: ["atendente", "gerente", "admin"]
  },
  {
    title: "Marketplace",
    icon: Package,
    href: "/hub/marketplace",
    roles: ["atendente", "gerente", "admin"]
  },
  {
    title: "Serviços",
    icon: Package,
    href: "/hub/servicos",
    roles: ["gerente", "admin"]
  },
  {
    title: "Financeiro",
    icon: Calculator,
    href: "/hub/financeiro",
    roles: ["gerente", "admin"]
  },
  {
    title: "Colaboradores",
    icon: UserCog,
    href: "/hub/colaboradores",
    roles: ["gerente", "admin"]
  },
  {
    title: "Organizações",
    icon: Building2,
    href: "/hub/organizacoes",
    roles: ["admin"]
  },
  {
    title: "Relatórios",
    icon: FileText,
    href: "/hub/relatorios",
    roles: ["gerente", "admin"]
  },
  {
    title: "Configurações",
    icon: Settings,
    href: "/hub/configuracoes",
    roles: ["admin"]
  }
];
