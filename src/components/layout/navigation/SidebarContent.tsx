
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Settings } from "lucide-react";
import { MenuItem } from "./MenuItems";

interface SidebarContentProps {
  menuItems: MenuItem[];
  gerenteMenuItems: MenuItem[];
  collapsed?: boolean;
  userProfile: string;
}

export function SidebarContent({ 
  menuItems, 
  gerenteMenuItems, 
  collapsed, 
  userProfile 
}: SidebarContentProps) {
  const location = useLocation();

  const isLinkActive = (href: string, exact = false) => {
    return exact ? location.pathname === href : location.pathname.startsWith(href);
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
          to="/dashboard/meu-perfil"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100"
        >
          <Settings className="h-5 w-5" />
          {!collapsed && <span>Configurações</span>}
        </Link>
      </div>
    </ScrollArea>
  );
}
