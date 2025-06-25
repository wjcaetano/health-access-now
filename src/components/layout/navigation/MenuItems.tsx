
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
    href: "/dashboard/clientes",
  },
  {
    title: "Vendas",
    icon: <ShoppingCart className="h-5 w-5" />,
    href: "/dashboard/vendas",
  },
  {
    title: "Orçamentos",
    icon: <CreditCard className="h-5 w-5" />,
    href: "/dashboard/orcamentos",
  },
  {
    title: "Guias",
    icon: <FileText className="h-5 w-5" />,
    href: "/dashboard/guias",
  },
  {
    title: "Conversas",
    icon: <MessageSquare className="h-5 w-5" />,
    href: "/dashboard/conversas",
  },
  {
    title: "Colaboradores",
    icon: <Clock className="h-5 w-5" />,
    href: "/dashboard/colaboradores",
  },
];

export const gerenteMenu: MenuItem[] = [
  {
    title: "Prestadores",
    icon: <Building2 className="h-5 w-5" />,
    href: "/dashboard/prestadores",
  },
  {
    title: "Serviços",
    icon: <ListChecks className="h-5 w-5" />,
    href: "/dashboard/servicos",
  },
  {
    title: "Agenda de Pagamentos",
    icon: <Calendar className="h-5 w-5" />,
    href: "/dashboard/agenda-pagamentos",
  },
  {
    title: "Financeiro",
    icon: <CreditCard className="h-5 w-5" />,
    href: "/dashboard/financeiro",
  },
];

export const prestadorMenu: MenuItem[] = [
  {
    title: "Portal",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/dashboard/prestador",
    end: true,
  },
  {
    title: "Guias",
    icon: <FileText className="h-5 w-5" />,
    href: "/dashboard/prestador/guias",
  },
  {
    title: "Faturamento",
    icon: <CreditCard className="h-5 w-5" />,
    href: "/dashboard/prestador/faturamento",
  },
];
