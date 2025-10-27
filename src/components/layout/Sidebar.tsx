import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { hubMenuItems } from "./navigation/menus/HubMenu";
import { prestadorMenuItems } from "./navigation/menus/PrestadorMenuSimplified";

interface AppSidebarProps {
  userProfile: string;
}

export default function AppSidebar({ userProfile }: AppSidebarProps) {
  const { profile } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  
  // Determinar qual menu mostrar baseado no perfil do usuário
  const menuItems = userProfile === "prestador" ? prestadorMenuItems : hubMenuItems;
  
  // Verificar se é gerente ou admin para mostrar opções administrativas
  const isManagerOrAdmin = ['gerente', 'admin'].includes(profile?.nivel_acesso || '');
  
  const isActive = (href: string) => {
    return location.pathname.startsWith(href);
  };

  return (
    <Sidebar 
      className={cn(
        "border-r bg-sidebar text-sidebar-foreground",
        state === "collapsed" ? "w-14" : "w-64"
      )}
      collapsible="icon"
    >
      <SidebarHeader className="flex h-16 items-center justify-between border-b px-4">
        {state === "collapsed" ? (
          <Link to="/" className="font-bold text-2xl text-agendaja-primary">
            A<span className="text-agendaja-secondary">J</span>
          </Link>
        ) : (
          <Link to="/" className="font-bold text-xl text-agendaja-primary">
            AGENDA<span className="text-agendaja-secondary">JA</span>
          </Link>
        )}
      </SidebarHeader>
      
      <SidebarContent className="flex-1 px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/60 mb-2">
            {userProfile === "prestador" ? "Prestador" : "Hub AGENDAJA"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems
                .filter(item => !item.roles || item.roles.includes(profile?.nivel_acesso || ''))
                .map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-agendaja-primary/10 text-agendaja-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className={cn(
                        "h-4 w-4 flex-shrink-0",
                        isActive(item.href) ? "text-agendaja-primary" : "text-sidebar-foreground/60"
                      )} />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Seção Administrativa - apenas para gerentes e admins */}
        {isManagerOrAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/60 mb-2">
              Gerência
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {hubMenuItems
                  .filter(item => item.roles?.includes('gerente') || item.roles?.includes('admin'))
                  .map((item) => (
                  <SidebarMenuItem key={`admin-${item.title}`}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive(item.href)
                            ? "bg-agendaja-primary/10 text-agendaja-primary"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <item.icon className={cn(
                          "h-4 w-4 flex-shrink-0",
                          isActive(item.href) ? "text-agendaja-primary" : "text-sidebar-foreground/60"
                        )} />
                        {state !== "collapsed" && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}