
import { 
  Calendar,
  User,
  MessageSquare,
  CreditCard,
  Users,
  Building2,
  ListChecks,
  FileText,
  BarChart3,
  ShoppingCart,
  Clock
} from "lucide-react";

export interface MenuItem {
  title: string;
  icon: JSX.Element;
  href: string;
  end?: boolean;
}

export const agendajaMenu: MenuItem[] = [
  {
    title: "Painel",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/dashboard",
    end: true,
  },
  {
    title: "Clientes",
    icon: <User className="h-5 w-5" />,
    href: "/clientes",
  },
  {
    title: "Vendas",
    icon: <ShoppingCart className="h-5 w-5" />,
    href: "/vendas",
  },
  {
    title: "Orçamentos",
    icon: <CreditCard className="h-5 w-5" />,
    href: "/orcamentos",
  },
  {
    title: "Guias",
    icon: <FileText className="h-5 w-5" />,
    href: "/guias",
  },
  {
    title: "Conversas",
    icon: <MessageSquare className="h-5 w-5" />,
    href: "/conversas",
  },
  {
    title: "Colaboradores",
    icon: <Clock className="h-5 w-5" />,
    href: "/colaboradores",
  },
];

export const gerenteMenu: MenuItem[] = [
  {
    title: "Prestadores",
    icon: <Building2 className="h-5 w-5" />,
    href: "/prestadores",
  },
  {
    title: "Serviços",
    icon: <ListChecks className="h-5 w-5" />,
    href: "/servicos",
  },
  {
    title: "Agenda de Pagamentos",
    icon: <Calendar className="h-5 w-5" />,
    href: "/agenda-pagamentos",
  },
  {
    title: "Financeiro",
    icon: <CreditCard className="h-5 w-5" />,
    href: "/financeiro",
  },
];

export const prestadorMenu: MenuItem[] = [
  {
    title: "Portal",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/prestador",
    end: true,
  },
  {
    title: "Guias",
    icon: <FileText className="h-5 w-5" />,
    href: "/prestador/guias",
  },
  {
    title: "Faturamento",
    icon: <CreditCard className="h-5 w-5" />,
    href: "/prestador/faturamento",
  },
];
