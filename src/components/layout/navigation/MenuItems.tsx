
import React from "react";
import { 
  Calendar, 
  Users, 
  FileText, 
  DollarSign, 
  UserPlus, 
  ClipboardList, 
  Building2, 
  MessageSquare, 
  Clock, 
  BarChart3, 
  Settings, 
  Stethoscope,
  Package,
  CreditCard,
  TrendingUp,
  UserCheck,
  Target,
  MapPin,
  Crown,
  Network,
  Briefcase,
  Calculator,
  PieChart
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export interface MenuItem {
  title: string;
  icon: React.ElementType;
  href: string;
  roles?: string[];
  isSection?: boolean;
}

interface MenuItemsProps {
  onItemClick?: () => void;
}

// Menu items for AGENDAJA units
export const agendajaMenu: MenuItem[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
    roles: ["admin", "gerente", "colaborador"]
  },
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

// Menu items for managers
export const gerenteMenu: MenuItem[] = [
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

// Menu items for prestadores
export const prestadorMenu: MenuItem[] = [
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

const MenuItems: React.FC<MenuItemsProps> = ({ onItemClick }) => {
  const { profile } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    // Dashboard sempre visível
    {
      title: "Dashboard",
      icon: BarChart3,
      path: "/dashboard",
      roles: ["admin", "gerente", "colaborador", "prestador"]
    },
    
    // Seção Franqueadora (apenas para admins)
    ...(profile?.nivel_acesso === "admin" ? [
      {
        title: "Franqueadora",
        icon: Crown,
        isSection: true,
        roles: ["admin"]
      },
      {
        title: "Visão Executiva",
        icon: TrendingUp,
        path: "/franqueadora/dashboard",
        roles: ["admin"]
      },
      {
        title: "Gestão de Franquias",
        icon: Building2,
        path: "/franqueadora/franquias",
        roles: ["admin"]
      },
      {
        title: "Leads de Franqueados",
        icon: UserCheck,
        path: "/franqueadora/leads",
        roles: ["admin"]
      },
      {
        title: "CRM Franqueados",
        icon: Users,
        path: "/franqueadora/franqueados",
        roles: ["admin"]
      },
      {
        title: "Financeiro Matriz",
        icon: Calculator,
        path: "/franqueadora/financeiro",
        roles: ["admin"]
      },
      {
        title: "Royalties",
        icon: DollarSign,
        path: "/franqueadora/royalties",
        roles: ["admin"]
      },
      {
        title: "Contratos",
        icon: FileText,
        path: "/franqueadora/contratos",
        roles: ["admin"]
      },
      {
        title: "Relatórios Executivos",
        icon: PieChart,
        path: "/franqueadora/relatorios",
        roles: ["admin"]
      },
      {
        title: "Metas & KPIs",
        icon: Target,
        path: "/franqueadora/metas",
        roles: ["admin"]
      },
      {
        title: "Expansão",
        icon: MapPin,
        path: "/franqueadora/expansao",
        roles: ["admin"]
      }
    ] : []),
    
    // Seção Operacional (para unidades)
    {
      title: "Operacional",
      icon: Briefcase,
      isSection: true,
      roles: ["admin", "gerente", "colaborador"]
    },
    {
      title: "Vendas",
      icon: DollarSign,
      path: "/vendas",
      roles: ["admin", "gerente", "colaborador"]
    },
    {
      title: "Agendamentos",
      icon: Calendar,
      path: "/agendamentos",
      roles: ["admin", "gerente", "colaborador"]
    },
    {
      title: "Orçamentos",
      icon: FileText,
      path: "/orcamentos",
      roles: ["admin", "gerente", "colaborador"]
    },
    {
      title: "Clientes",
      icon: Users,
      path: "/clientes",
      roles: ["admin", "gerente", "colaborador"]
    },
    {
      title: "Prestadores",
      icon: Stethoscope,
      path: "/prestadores",
      roles: ["admin", "gerente", "colaborador"]
    },
    {
      title: "Serviços",
      icon: Package,
      path: "/servicos",
      roles: ["admin", "gerente", "colaborador"]
    },
    {
      title: "Conversas",
      icon: MessageSquare,
      path: "/conversas",
      roles: ["admin", "gerente", "colaborador"]
    },
    {
      title: "Guias",
      icon: ClipboardList,
      path: "/guias",
      roles: ["admin", "gerente", "colaborador"]
    },
    
    // Seção Administrativa
    {
      title: "Administrativo",
      icon: Settings,
      isSection: true,
      roles: ["admin", "gerente"]
    },
    {
      title: "Financeiro",
      icon: CreditCard,
      path: "/financeiro",
      roles: ["admin", "gerente"]
    },
    {
      title: "Colaboradores",
      icon: Users,
      path: "/colaboradores",
      roles: ["admin", "gerente"]
    },
    {
      title: "Relatórios",
      icon: BarChart3,
      path: "/relatorios",
      roles: ["admin", "gerente"]
    },
    {
      title: "Usuários",
      icon: UserPlus,
      path: "/usuarios",
      roles: ["admin"]
    },
    {
      title: "Configurações",
      icon: Settings,
      path: "/configuracoes",
      roles: ["admin"]
    }
  ];

  const filteredItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(profile?.nivel_acesso || "")
  );

  return (
    <nav className="space-y-1">
      {filteredItems.map((item, index) => {
        if (item.isSection) {
          return (
            <div key={index} className="pt-4 first:pt-0">
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                <item.icon className="h-3 w-3" />
                {item.title}
              </h3>
            </div>
          );
        }

        return (
          <Link
            key={index}
            to={item.path}
            onClick={onItemClick}
            className={`
              flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
              ${isActive(item.path) 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }
            `}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};

export default MenuItems;
