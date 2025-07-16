
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
  Briefcase
} from "lucide-react";

export const operationalMenuItems: MenuItem[] = [
  {
    title: "Vendas",
    icon: DollarSign,
    href: "/vendas",
    roles: ["admin", "gerente", "colaborador"]
  },
  {
    title: "Agendamentos",
    icon: Calendar,
    href: "/agendamentos",
    roles: ["admin", "gerente", "colaborador"]
  },
  {
    title: "Orçamentos",
    icon: FileText,
    href: "/orcamentos",
    roles: ["admin", "gerente", "colaborador"]
  },
  {
    title: "Clientes",
    icon: Users,
    href: "/clientes",
    roles: ["admin", "gerente", "colaborador"]
  },
  {
    title: "Prestadores",
    icon: Stethoscope,
    href: "/prestadores",
    roles: ["admin", "gerente", "colaborador"]
  },
  {
    title: "Serviços",
    icon: Package,
    href: "/servicos",
    roles: ["admin", "gerente", "colaborador"]
  },
  {
    title: "Conversas",
    icon: MessageSquare,
    href: "/conversas",
    roles: ["admin", "gerente", "colaborador"]
  },
  {
    title: "Guias",
    icon: ClipboardList,
    href: "/guias",
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
