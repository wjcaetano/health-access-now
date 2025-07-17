
import React from "react";
import { MenuItem } from "../MenuItems";
import { 
  BarChart3,
  ClipboardList,
  DollarSign
} from "lucide-react";

export const providerMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/sistema/dashboard",
    roles: ["prestador"]
  },
  {
    title: "Portal",
    icon: BarChart3,
    href: "/sistema/prestador/portal",
    roles: ["prestador"]
  },
  {
    title: "Guias",
    icon: ClipboardList,
    href: "/sistema/prestador/guias",
    roles: ["prestador"]
  },
  {
    title: "Faturamento",
    icon: DollarSign,
    href: "/sistema/prestador/faturamento",
    roles: ["prestador"]
  }
];
