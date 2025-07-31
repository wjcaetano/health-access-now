
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarContent } from "./navigation/SidebarContent";
import { MobileSidebar } from "./navigation/MobileSidebar";
import { unidadeMenuItems } from "./navigation/menus/UnidadeMenu";
import { prestadorMenuItems } from "./navigation/menus/PrestadorMenuSimplified";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  userProfile: string;
}

export default function Sidebar({ collapsed, setCollapsed, userProfile }: SidebarProps) {
  const isMobile = useIsMobile();
  const { profile } = useAuth();
  
  // Determinar qual menu mostrar baseado no perfil do usuário
  const menuItems = userProfile === "prestador" ? prestadorMenuItems : unidadeMenuItems;
  
  // Verificar se é gerente ou admin para mostrar opções administrativas
  const isManagerOrAdmin = ['gerente', 'admin'].includes(profile?.nivel_acesso || '');
  
  const adminMenuItems = isManagerOrAdmin ? unidadeMenuItems.filter(item => 
    item.roles?.includes('gerente') || item.roles?.includes('admin')
  ) : [];

  // Mobile sidebar
  if (isMobile) {
    return (
      <MobileSidebar
        isOpen={!collapsed}
        onClose={() => setCollapsed(true)}
        menuItems={menuItems}
        gerenteMenuItems={adminMenuItems}
        userProfile={userProfile}
      />
    );
  }

  // Desktop sidebar
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex h-full flex-col bg-white shadow-lg transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-72"
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
        gerenteMenuItems={adminMenuItems} 
        collapsed={collapsed}
        userProfile={userProfile}
      />
    </div>
  );
}
