import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  ShoppingBag, 
  Calendar, 
  Users, 
  Menu,
  BarChart3,
  Briefcase
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePrimaryRole } from "@/hooks/useUserRoles";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  roles?: string[];
}

const hubNavItems: NavItem[] = [
  { icon: Home, label: 'Início', href: '/hub/dashboard', roles: ['admin', 'gerente', 'atendente', 'colaborador'] },
  { icon: ShoppingBag, label: 'Vendas', href: '/hub/vendas', roles: ['admin', 'gerente', 'atendente'] },
  { icon: Calendar, label: 'Agenda', href: '/hub/agendamentos', roles: ['admin', 'gerente', 'atendente'] },
  { icon: Users, label: 'Clientes', href: '/hub/clientes', roles: ['admin', 'gerente', 'atendente'] },
];

const prestadorNavItems: NavItem[] = [
  { icon: Home, label: 'Início', href: '/prestador/portal' },
  { icon: Briefcase, label: 'Guias', href: '/prestador/guias' },
  { icon: BarChart3, label: 'Faturamento', href: '/prestador/faturamento' },
  { icon: Menu, label: 'Menu', href: '/prestador/portal' },
];

const clienteNavItems: NavItem[] = [
  { icon: Home, label: 'Início', href: '/cliente/dashboard' },
  { icon: Calendar, label: 'Agendamentos', href: '/cliente/agendamentos' },
  { icon: Menu, label: 'Menu', href: '/cliente/dashboard' },
];

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const primaryRole = usePrimaryRole(user?.id);

  // Determinar quais itens mostrar baseado no role
  let navItems: NavItem[] = hubNavItems;
  if (primaryRole === 'prestador') {
    navItems = prestadorNavItems;
  } else if (primaryRole === 'cliente') {
    navItems = clienteNavItems;
  }

  // Filtrar itens baseado nas permissões
  const filteredItems = navItems.filter(item => {
    if (!item.roles) return true;
    return primaryRole && item.roles.includes(primaryRole);
  });

  // Não mostrar bottom nav no desktop
  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="grid grid-cols-4 gap-1 px-2 py-2 safe-area-bottom">
        {filteredItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || 
                          location.pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-all",
                "active:scale-95",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-transform",
                isActive && "scale-110"
              )} />
              <span className="text-[10px] font-medium truncate w-full text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
