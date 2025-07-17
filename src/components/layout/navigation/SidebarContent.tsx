
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuItem } from "./MenuItems";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarContentProps {
  menuItems: MenuItem[];
  gerenteMenuItems?: MenuItem[];
  collapsed?: boolean;
  userProfile: string;
  onItemClick?: () => void;
}

export function SidebarContent({ 
  menuItems, 
  gerenteMenuItems = [], 
  collapsed = false, 
  userProfile,
  onItemClick 
}: SidebarContentProps) {
  const location = useLocation();
  const isMobile = useIsMobile();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const MenuSection = ({ title, items }: { title?: string; items: MenuItem[] }) => (
    <div className={`px-3 ${isMobile ? 'py-2' : 'py-4'}`}>
      {title && !collapsed && (
        <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3 ${isMobile ? 'text-agendaja-primary' : ''}`}>
          {title}
        </h3>
      )}
      <nav className="space-y-1">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onItemClick}
              className={cn(
                "group flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                isMobile ? "px-4 py-3" : collapsed ? "px-3 py-2 justify-center" : "px-3 py-2",
                active
                  ? isMobile 
                    ? "bg-agendaja-primary text-white shadow-md" 
                    : "bg-agendaja-light text-agendaja-primary border-r-2 border-agendaja-primary"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
              title={collapsed ? item.title : undefined}
            >
              <div
                className={cn(
                  "flex-shrink-0 transition-colors",
                  isMobile ? "h-5 w-5" : "h-4 w-4",
                  active 
                    ? isMobile ? "text-white" : "text-agendaja-primary" 
                    : "text-gray-400 group-hover:text-gray-500",
                  collapsed ? "" : "mr-3"
                )}
              >
                {React.createElement(item.icon)}
              </div>
              {!collapsed && (
                <span className={cn(
                  "truncate transition-colors",
                  isMobile ? "text-base" : "",
                  active 
                    ? isMobile ? "text-white" : "text-agendaja-primary" 
                    : ""
                )}>
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className={cn(
      "flex-1 overflow-y-auto",
      isMobile ? "bg-white" : ""
    )}>
      <MenuSection items={menuItems} />
      
      {gerenteMenuItems.length > 0 && (
        <>
          {!collapsed && (
            <div className="mx-6 border-t border-gray-200" />
          )}
          <MenuSection 
            title={isMobile ? "Gerência" : collapsed ? undefined : "Gerência"} 
            items={gerenteMenuItems} 
          />
        </>
      )}
    </div>
  );
}
