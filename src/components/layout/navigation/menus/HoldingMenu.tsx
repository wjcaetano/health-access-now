
import React from "react";
import { MenuItem } from "../MenuItems";
import { 
  Crown,
  TrendingUp,
  Building2,
  UserCheck,
  Users,
  Calculator,
  DollarSign,
  FileText,
  PieChart,
  Target,
  MapPin
} from "lucide-react";

export const holdingMenuItems: MenuItem[] = [
  {
    title: "Visão Executiva",
    icon: TrendingUp,
    href: "/sistema/franqueadora/dashboard",
    roles: ["admin"]
  },
  {
    title: "Gestão de Franquias",
    icon: Building2,
    href: "/sistema/franqueadora/franquias",
    roles: ["admin"]
  },
  {
    title: "Leads de Franqueados",
    icon: UserCheck,
    href: "/sistema/franqueadora/leads",
    roles: ["admin"]
  },
  {
    title: "CRM Franqueados",
    icon: Users,
    href: "/sistema/franqueadora/franqueados",
    roles: ["admin"]
  },
  {
    title: "Financeiro Matriz",
    icon: Calculator,
    href: "/sistema/franqueadora/financeiro",
    roles: ["admin"]
  },
  {
    title: "Royalties",
    icon: DollarSign,
    href: "/sistema/franqueadora/royalties",
    roles: ["admin"]
  },
  {
    title: "Contratos",
    icon: FileText,
    href: "/sistema/franqueadora/contratos",
    roles: ["admin"]
  },
  {
    title: "Relatórios Executivos",
    icon: PieChart,
    href: "/sistema/franqueadora/relatorios",
    roles: ["admin"]
  },
  {
    title: "Metas & KPIs",
    icon: Target,
    href: "/sistema/franqueadora/metas",
    roles: ["admin"]
  },
  {
    title: "Expansão",
    icon: MapPin,
    href: "/sistema/franqueadora/expansao",
    roles: ["admin"]
  }
];

export const HoldingMenuSection = () => (
  {
    title: "Franqueadora",
    icon: Crown,
    items: holdingMenuItems
  }
);
