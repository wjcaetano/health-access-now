
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
  Settings
} from "lucide-react";

export const unidadeMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/unidade/dashboard",
    roles: ["atendente", "gerente", "admin"]
  },
  {
    title: "Vendas",
    icon: DollarSign,
    href: "/unidade/vendas",
    roles: ["atendente", "gerente", "admin"]
  },
  {
    title: "Agendamentos",
    icon: Calendar,
    href: "/unidade/agendamentos",
    roles: ["atendente", "gerente", "admin"]
  },
  {
    title: "Orçamentos",
    icon: FileText,
    href: "/unidade/orcamentos",
    roles: ["atendente", "gerente", "admin"]
  },
  {
    title: "Clientes",
    icon: Users,
    href: "/unidade/clientes",
    roles: ["atendente", "gerente", "admin"]
  },
  {
    title: "Prestadores Locais",
    icon: Stethoscope,
    href: "/unidade/prestadores",
    roles: ["gerente", "admin"]
  },
  {
    title: "Serviços",
    icon: Package,
    href: "/unidade/servicos",
    roles: ["gerente", "admin"]
  },
  {
    title: "Financeiro",
    icon: Calculator,
    href: "/unidade/financeiro",
    roles: ["gerente", "admin"]
  },
  {
    title: "Colaboradores",
    icon: UserCog,
    href: "/unidade/colaboradores",
    roles: ["gerente", "admin"]
  },
  {
    title: "Configurações",
    icon: Settings,
    href: "/unidade/configuracoes",
    roles: ["admin"]
  }
];
