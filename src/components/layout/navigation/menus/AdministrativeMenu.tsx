
import React from "react";
import { MenuItem } from "../MenuItems";
import { 
  CreditCard,
  Users,
  BarChart3,
  UserPlus,
  Settings
} from "lucide-react";

export const administrativeMenuItems: MenuItem[] = [
  {
    title: "Financeiro",
    icon: CreditCard,
    href: "/financeiro",
    roles: ["admin", "gerente"]
  },
  {
    title: "Colaboradores",
    icon: Users,
    href: "/colaboradores",
    roles: ["admin", "gerente"]
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    href: "/relatorios",
    roles: ["admin", "gerente"]
  },
  {
    title: "Usuários",
    icon: UserPlus,
    href: "/usuarios",
    roles: ["admin"]
  },
  {
    title: "Configurações",
    icon: Settings,
    href: "/configuracoes",
    roles: ["admin"]
  }
];

export const AdministrativeMenuSection = () => (
  {
    title: "Administrativo",
    icon: Settings,
    items: administrativeMenuItems
  }
);
