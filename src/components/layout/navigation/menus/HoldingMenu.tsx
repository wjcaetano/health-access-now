
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
    href: "/franqueadora/dashboard",
    roles: ["admin"]
  },
  {
    title: "Gestão de Franquias",
    icon: Building2,
    href: "/franqueadora/franquias",
    roles: ["admin"]
  },
  {
    title: "Leads de Franqueados",
    icon: UserCheck,
    href: "/franqueadora/leads",
    roles: ["admin"]
  },
  {
    title: "CRM Franqueados",
    icon: Users,
    href: "/franqueadora/franqueados",
    roles: ["admin"]
  },
  {
    title: "Financeiro Matriz",
    icon: Calculator,
    href: "/franqueadora/financeiro",
    roles: ["admin"]
  },
  {
    title: "Royalties",
    icon: DollarSign,
    href: "/franqueadora/royalties",
    roles: ["admin"]
  },
  {
    title: "Contratos",
    icon: FileText,
    href: "/franqueadora/contratos",
    roles: ["admin"]
  },
  {
    title: "Relatórios Executivos",
    icon: PieChart,
    href: "/franqueadora/relatorios",
    roles: ["admin"]
  },
  {
    title: "Metas & KPIs",
    icon: Target,
    href: "/franqueadora/metas",
    roles: ["admin"]
  },
  {
    title: "Expansão",
    icon: MapPin,
    href: "/franqueadora/expansao",
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
