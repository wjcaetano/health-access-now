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
  Search,
} from "lucide-react";
import { HUB_ROUTES } from "@/lib/routes";

// Menu items para o Hub AGENDAJA (usando novas rotas padronizadas)
export const hubMenuItems: MenuItem[] = [
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
  {
    title: "Clientes",
    icon: Users,
    href: HUB_ROUTES.CUSTOMERS,
    roles: ["admin", "gerente", "atendente"],
  },
  {
    title: "Prestadores",
    icon: Stethoscope,
    href: HUB_ROUTES.PROVIDERS,
    roles: ["admin", "gerente"],
  },
  {
    title: "Buscar Prestadores",
    icon: Search,
    href: HUB_ROUTES.PROVIDERS_SEARCH,
    roles: ["admin", "gerente"],
  },
  {
    title: "Marketplace",
    icon: Store,
    href: HUB_ROUTES.SERVICES_MARKETPLACE,
    roles: ["admin", "gerente", "atendente"],
  },
  {
    title: "Serviços",
    icon: Package,
    href: HUB_ROUTES.SERVICES,
    roles: ["admin", "gerente"],
  },
  {
    title: "Financeiro",
    icon: DollarSign,
    href: HUB_ROUTES.FINANCE,
    roles: ["admin", "gerente"],
  },
  {
    title: "Colaboradores",
    icon: UserCog,
    href: HUB_ROUTES.TEAM,
    roles: ["admin", "gerente"],
  },
  {
    title: "Organizações",
    icon: Building2,
    href: HUB_ROUTES.ORGANIZATIONS,
    roles: ["admin"],
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    href: HUB_ROUTES.REPORTS,
    roles: ["admin", "gerente"],
  },
  {
    title: "Configurações",
    icon: Settings,
    href: HUB_ROUTES.SETTINGS,
    roles: ["admin"],
  },
];
