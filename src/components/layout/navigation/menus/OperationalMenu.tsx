
import React from "react";
import { MenuItem } from "../MenuItems";
import { 
  DollarSign,
  Calendar,
  FileText,
  Users,
  Stethoscope,
  Package,
  MessageSquare,
  ClipboardList,
  Briefcase,
  BarChart3
} from "lucide-react";

export const operationalMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/sistema/dashboard",
    roles: ["admin", "gerente", "colaborador"]
  },
  {
    title: "Vendas",
    icon: DollarSign,
    href: "/sistema/vendas",
    roles: ["admin", "gerente", "colaborador"]
  },
  {
    title: "Agendamentos",
    icon: Calendar,
    href: "/sistema/agendamentos",
    roles: ["admin", "gerente", "colaborador"]
  },
  {
    title: "Orçamentos",
    icon: FileText,
    href: "/sistema/orcamentos",
    roles: ["admin", "gerente", "colaborador"]
  },
  {
    title: "Clientes",
    icon: Users,
    href: "/sistema/clientes",
    roles: ["admin", "gerente", "colaborador"]
  },
  {
    title: "Prestadores",
    icon: Stethoscope,
    href: "/sistema/prestadores",
    roles: ["admin", "gerente", "colaborador"]
  },
  {
    title: "Serviços",
    icon: Package,
    href: "/sistema/servicos",
    roles: ["admin", "gerente", "colaborador"]
  },
  {
    title: "Conversas",
    icon: MessageSquare,
    href: "/sistema/conversas",
    roles: ["admin", "gerente", "colaborador"]
  },
  {
    title: "Guias",
    icon: ClipboardList,
    href: "/sistema/guias",
    roles: ["admin", "gerente", "colaborador"]
  }
];

export const OperationalMenuSection = () => (
  {
    title: "Operacional",
    icon: Briefcase,
    items: operationalMenuItems
  }
);
