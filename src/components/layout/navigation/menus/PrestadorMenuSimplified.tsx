
import { MenuItem } from "../MenuItems";
import { 
  BarChart3,
  ClipboardList,
  DollarSign,
  User,
  Home,
  Calendar,
  FileText
} from "lucide-react";

// Menu para prestadores
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

// Menu para clientes
export const clienteMenuItems: MenuItem[] = [
  {
    title: "Meu Portal",
    icon: Home,
    href: "/cliente/dashboard",
    roles: ["cliente"]
  },
  {
    title: "Meus Agendamentos",
    icon: Calendar,
    href: "/cliente/agendamentos",
    roles: ["cliente"]
  },
  {
    title: "Meus Orçamentos",
    icon: FileText,
    href: "/cliente/orcamentos",
    roles: ["cliente"]
  },
  {
    title: "Meu Perfil",
    icon: User,
    href: "/hub/meu-perfil",
    roles: ["cliente"]
  }
];
