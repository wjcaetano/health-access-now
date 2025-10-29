import React from "react";
import { MenuItem } from "../MenuItems";
import {
  LayoutDashboard,
  ShoppingCart,
  Calendar,
  FileText,
  Users,
  Stethoscope,
  Package,
  DollarSign,
  UserCog,
  Building2,
  BarChart3,
  Settings,
  Store,
  TrendingUp,
} from "lucide-react";
import { HUB_ROUTES } from "@/lib/routes";

export interface MenuGroup {
  title: string;
  items: MenuItem[];
  roles?: string[];
}

// Dashboard & Analytics
const dashboardGroup: MenuGroup = {
  title: "Dashboard",
  items: [
    {
      title: "Overview",
      icon: LayoutDashboard,
      href: HUB_ROUTES.ROOT,
      roles: ["admin", "gerente", "atendente", "colaborador"],
    },
    {
      title: "Analytics",
      icon: TrendingUp,
      href: HUB_ROUTES.ANALYTICS,
      roles: ["admin", "gerente"],
    },
  ],
};

// Operações de Vendas
const salesGroup: MenuGroup = {
  title: "Operações",
  items: [
    {
      title: "Vendas",
      icon: ShoppingCart,
      href: HUB_ROUTES.SALES,
      roles: ["admin", "gerente", "atendente"],
    },
    {
      title: "Agendamentos",
      icon: Calendar,
      href: HUB_ROUTES.APPOINTMENTS,
      roles: ["admin", "gerente", "atendente"],
    },
    {
      title: "Orçamentos",
      icon: FileText,
      href: HUB_ROUTES.QUOTES,
      roles: ["admin", "gerente", "atendente"],
    },
  ],
};

// Gestão de Relacionamento
const relationshipGroup: MenuGroup = {
  title: "Relacionamento",
  items: [
    {
      title: "Clientes",
      icon: Users,
      href: HUB_ROUTES.CUSTOMERS,
      roles: ["admin", "gerente", "atendente"],
    },
    {
      title: "Marketplace",
      icon: Store,
      href: HUB_ROUTES.SERVICES_MARKETPLACE,
      roles: ["admin", "gerente", "atendente"],
    },
  ],
};

// Gestão de Recursos
const resourcesGroup: MenuGroup = {
  title: "Recursos",
  items: [
    {
      title: "Prestadores",
      icon: Stethoscope,
      href: HUB_ROUTES.PROVIDERS,
      roles: ["admin", "gerente"],
    },
    {
      title: "Serviços",
      icon: Package,
      href: HUB_ROUTES.SERVICES,
      roles: ["admin", "gerente"],
    },
    {
      title: "Colaboradores",
      icon: UserCog,
      href: HUB_ROUTES.TEAM,
      roles: ["admin", "gerente"],
    },
  ],
};

// Gestão Financeira
const financeGroup: MenuGroup = {
  title: "Financeiro",
  items: [
    {
      title: "Financeiro",
      icon: DollarSign,
      href: HUB_ROUTES.FINANCE,
      roles: ["admin", "gerente"],
    },
  ],
};

// Administração
const adminGroup: MenuGroup = {
  title: "Administração",
  items: [
    {
      title: "Relatórios",
      icon: BarChart3,
      href: HUB_ROUTES.REPORTS,
      roles: ["admin", "gerente"],
    },
    {
      title: "Configurações da Plataforma",
      icon: Building2,
      href: HUB_ROUTES.PLATFORM_CONFIG,
      roles: ["admin"],
    },
    {
      title: "Configurações",
      icon: Settings,
      href: HUB_ROUTES.SETTINGS,
      roles: ["admin"],
    },
  ],
};

export const hubMenuGroups: MenuGroup[] = [
  dashboardGroup,
  salesGroup,
  relationshipGroup,
  resourcesGroup,
  financeGroup,
  adminGroup,
];

// Lista plana para compatibilidade (deprecated - usar hubMenuGroups)
export const hubMenuItems: MenuItem[] = hubMenuGroups.flatMap(group => group.items);
