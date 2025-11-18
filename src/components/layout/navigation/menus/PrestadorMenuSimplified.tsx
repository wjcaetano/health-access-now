
import { MenuItem } from "../MenuItems";
import { 
  BarChart3,
  ClipboardList,
  DollarSign,
  User,
  Home,
  Calendar,
  FileText,
  Shield
} from "lucide-react";
import { PROVIDER_ROUTES, CLIENT_ROUTES } from "@/lib/routes";

// Menu para prestadores (usando novas rotas padronizadas)
export const prestadorMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: PROVIDER_ROUTES.ROOT,
    roles: ["prestador"]
  },
  {
    title: "Minhas Guias",
    icon: ClipboardList,
    href: PROVIDER_ROUTES.GUIDES,
    roles: ["prestador"]
  },
  {
    title: "Faturamento",
    icon: DollarSign,
    href: PROVIDER_ROUTES.BILLING,
    roles: ["prestador"]
  },
  {
    title: "Meu Perfil",
    icon: User,
    href: PROVIDER_ROUTES.PROFILE,
    roles: ["prestador"]
  }
];

// Menu para clientes (usando novas rotas padronizadas)
export const clienteMenuItems: MenuItem[] = [
  {
    title: "Início",
    icon: Home,
    href: CLIENT_ROUTES.ROOT,
    roles: ["cliente"]
  },
  {
    title: "Meus Agendamentos",
    icon: Calendar,
    href: CLIENT_ROUTES.APPOINTMENTS,
    roles: ["cliente"]
  },
  {
    title: "Minhas Guias",
    icon: Shield,
    href: "/client/guides",
    roles: ["cliente"]
  },
  {
    title: "Meus Orçamentos",
    icon: FileText,
    href: CLIENT_ROUTES.QUOTES,
    roles: ["cliente"]
  },
  {
    title: "Meu Perfil",
    icon: User,
    href: CLIENT_ROUTES.PROFILE,
    roles: ["cliente"]
  }
];
