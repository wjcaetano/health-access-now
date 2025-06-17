import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  MessageSquare,
  CreditCard,
  Users,
  Settings,
  Building2,
  ListChecks,
  FileText,
  BarChart3,
  ShoppingCart,
  Clock
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  userProfile: string; // "agendaja" ou "prestador"
}

// Menus para diferentes perfis
const agendajaMenu = [
  {
    title: "Painel",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/",
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

const gerenteMenu = [
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

const prestadorMenu = [
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

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, userProfile }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Determinar qual menu mostrar baseado no perfil do usuário
  const menuItems = userProfile === "prestador" ? prestadorMenu : agendajaMenu;
  const showGerenteMenu = userProfile === "agendaja"; // Temporariamente, mostra o menu de gerente para todos os usuários da AGENDAJA
  
  // Mobile sidebar - renderiza quando NÃO está collapsed (ou seja, quando está aberto)
  if (!collapsed && isMobile) {
    return (
      <div
        className="fixed inset-0 z-10 bg-black/50"
        onClick={() => setCollapsed(true)}
      >
        <div
          className="absolute inset-y-0 left-0 w-72 bg-white shadow-lg transition-all duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-16 items-center justify-between border-b px-6">
            <Link to="/" className="font-bold text-xl text-agendaja-primary">
              AGENDA<span className="text-agendaja-secondary">JA</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCollapsed(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m16 16-4-4 4-4"></path>
                <path d="m8 16-4-4 4-4"></path>
              </svg>
              <span className="sr-only">Fechar menu</span>
            </Button>
          </div>
          <SidebarContent 
            menuItems={menuItems} 
            gerenteMenuItems={showGerenteMenu ? gerenteMenu : []} 
            pathname={location.pathname} 
            userProfile={userProfile}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-10 hidden h-full w-72 flex-col bg-white shadow-md transition-all sm:flex",
        collapsed && "w-20"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-6">
        {collapsed ? (
          <Link to="/" className="font-bold text-2xl text-agendaja-primary">
            A<span className="text-agendaja-secondary">J</span>
          </Link>
        ) : (
          <Link to="/" className="font-bold text-xl text-agendaja-primary">
            AGENDA<span className="text-agendaja-secondary">JA</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-4 w-4 transition-transform", collapsed ? "rotate-180" : "")}
          >
            <path d="m15 16-4-4 4-4"></path>
          </svg>
          <span className="sr-only">
            {collapsed ? "Expandir menu" : "Recolher menu"}
          </span>
        </Button>
      </div>
      <SidebarContent 
        menuItems={menuItems} 
        gerenteMenuItems={showGerenteMenu ? gerenteMenu : []} 
        pathname={location.pathname} 
        collapsed={collapsed}
        userProfile={userProfile}
      />
    </div>
  );
};

interface SidebarContentProps {
  menuItems: {
    title: string;
    icon: JSX.Element;
    href: string;
    end?: boolean;
  }[];
  gerenteMenuItems: {
    title: string;
    icon: JSX.Element;
    href: string;
    end?: boolean;
  }[];
  pathname: string;
  collapsed?: boolean;
  userProfile: string;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  menuItems,
  gerenteMenuItems,
  pathname,
  collapsed,
  userProfile,
}) => {
  const isLinkActive = (href: string, exact = false) => {
    return exact ? pathname === href : pathname.startsWith(href);
  };

  return (
    <ScrollArea className="flex-1 overflow-auto pb-6">
      <nav className="space-y-1 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
              isLinkActive(item.href, item.end)
                ? "bg-agendaja-light text-agendaja-primary"
                : "hover:bg-gray-100"
            )}
          >
            {item.icon}
            {!collapsed && <span>{item.title}</span>}
          </Link>
        ))}
        
        {/* Menu de gerência (apenas para usuários AGENDAJA) */}
        {userProfile === "agendaja" && gerenteMenuItems.length > 0 && (
          <>
            <Separator className="my-4" />
            {!collapsed && (
              <h3 className="mb-2 px-3 text-xs font-semibold text-gray-500">
                GERÊNCIA
              </h3>
            )}
            {gerenteMenuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                  isLinkActive(item.href)
                    ? "bg-agendaja-light text-agendaja-primary"
                    : "hover:bg-gray-100"
                )}
              >
                {item.icon}
                {!collapsed && <span>{item.title}</span>}
              </Link>
            ))}
          </>
        )}
      </nav>

      <div className="mt-6 p-4">
        <Separator className="mb-4" />
        <Link
          to="/configuracoes"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100"
        >
          <Settings className="h-5 w-5" />
          {!collapsed && <span>Configurações</span>}
        </Link>
      </div>
    </ScrollArea>
  );
};

export default Sidebar;
