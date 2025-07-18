
import { MenuItem } from "../MenuItems";
import { 
  BarChart3,
  ClipboardList,
  DollarSign,
  User
} from "lucide-react";

export const prestadorMenuItems: MenuItem[] = [
  {
    title: "Portal",
    icon: BarChart3,
    href: "/prestador/portal",
    roles: ["prestador"]
  },
  {
    title: "Minhas Guias",
    icon: ClipboardList,
    href: "/prestador/guias",
    roles: ["prestador"]
  },
  {
    title: "Faturamento",
    icon: DollarSign,
    href: "/prestador/faturamento",
    roles: ["prestador"]
  },
  {
    title: "Meu Perfil",
    icon: User,
    href: "/prestador/perfil",
    roles: ["prestador"]
  }
];
