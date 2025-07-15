
import React from "react";
import { Link, useLocation } from "react-router-dom";
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
import { useAuth } from "@/hooks/useAuth";

interface MenuItemsProps {
  onItemClick?: () => void;
}

const MenuItems: React.FC<MenuItemsProps> = ({ onItemClick }) => {
  const location = useLocation();
  const { user } = useAuth();
  
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
    ...(user?.nivel_acesso === "admin" ? [
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
    !item.roles || item.roles.includes(user?.nivel_acesso || "")
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
