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
import { hubMenuGroups } from "./navigation/menus/HubMenu";
import { prestadorMenuItems } from "./navigation/menus/PrestadorMenuSimplified";
import { usePrimaryRole } from "@/hooks/useUserRoles";

interface AppSidebarProps {
  userProfile: string;
}

export default function AppSidebar({ userProfile }: AppSidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  const primaryRole = usePrimaryRole(user?.id);
  
  const isActive = (href: string) => {
    return location.pathname.startsWith(href);
  };

  // Filtrar grupos e itens baseado no role do usuário
  const getVisibleGroups = () => {
    if (!primaryRole) return [];
    
    return hubMenuGroups
      .map(group => ({
        ...group,
        items: group.items.filter(item => 
          !item.roles || item.roles.includes(primaryRole)
        )
      }))
      .filter(group => group.items.length > 0);
  };
  
  const visibleGroups = userProfile === "prestador" 
    ? [{ title: "Prestador", items: prestadorMenuItems }]
    : getVisibleGroups();

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
        {visibleGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.title}>
            {state !== "collapsed" && (
              <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/60 mb-2 px-2">
                {group.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
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
        ))}
      </SidebarContent>
    </Sidebar>
  );
}