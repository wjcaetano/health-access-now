
import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  User, 
  Users, 
  MessageSquare, 
  Plus,
  CalendarCheck,
  CalendarMinus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      title: "Clientes",
      href: "/clientes",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Agendamentos",
      href: "/agendamentos",
      icon: <CalendarCheck className="h-5 w-5" />
    },
    {
      title: "Orçamentos",
      href: "/orcamentos",
      icon: <CalendarMinus className="h-5 w-5" />
    },
    {
      title: "Conversas",
      href: "/conversas",
      icon: <MessageSquare className="h-5 w-5" />
    },
  ];

  return (
    <aside 
      className={cn(
        "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="font-bold text-2xl text-agendaja-primary">
              AGENDA<span className="text-agendaja-accent">JA</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto text-2xl font-bold text-agendaja-primary">
            A<span className="text-agendaja-accent">J</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    isActive
                      ? "bg-agendaja-light text-agendaja-primary font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  )
                }
              >
                {item.icon}
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline" 
          className={cn(
            "w-full flex items-center gap-2 bg-agendaja-light text-agendaja-primary hover:bg-agendaja-light/90",
            collapsed && "justify-center"
          )}
        >
          <Plus className="h-5 w-5" />
          {!collapsed && <span>Novo Agendamento</span>}
        </Button>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-agendaja-primary h-9 w-9 rounded-full flex items-center justify-center text-white">
            <User className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-medium">Atendente</p>
              <p className="text-xs text-gray-500">atendente@agendaja.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
