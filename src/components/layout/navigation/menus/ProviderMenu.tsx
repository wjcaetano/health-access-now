
import React from "react";
import { MenuItem } from "../MenuItems";
import { 
  BarChart3,
  ClipboardList,
  DollarSign
} from "lucide-react";

export const providerMenuItems: MenuItem[] = [
  {
    title: "Portal",
    icon: BarChart3,
    href: "/prestador/portal",
    roles: ["prestador"]
  },
  {
    title: "Guias",
    icon: ClipboardList,
    href: "/prestador/guias",
    roles: ["prestador"]
  },
  {
    title: "Faturamento",
    icon: DollarSign,
    href: "/prestador/faturamento",
    roles: ["prestador"]
  }
];
