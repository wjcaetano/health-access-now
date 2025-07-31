
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { unidadeMenuItems } from "./menus/UnidadeMenu";
import { prestadorMenuItems } from "./menus/PrestadorMenuSimplified";
import { cn } from "@/lib/utils";

export interface MenuItem {
  title: string;
  icon: React.ElementType;
  href: string;
  roles?: string[];
}

interface MenuItemsProps {
  onItemClick?: () => void;
}

const MenuItems: React.FC<MenuItemsProps> = React.memo(({ onItemClick }) => {
  const { profile } = useAuth();
  const location = useLocation();
  
  const getMenuItems = () => {
    if (profile?.nivel_acesso === "prestador") {
      return prestadorMenuItems;
    }
    
    if (["admin", "gerente", "atendente", "colaborador"].includes(profile?.nivel_acesso || "")) {
      return unidadeMenuItems;
    }
    
    return [];
  };

  const menuItems = getMenuItems();
  
  const isActive = (href: string) => {
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="space-y-1">
      {menuItems.map((item) => (
        <div key={item.title} className="px-3 py-2">
          <Link
            to={item.href}
            onClick={onItemClick}
            className={cn(
              "w-full flex items-center text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              isActive(item.href)
                ? "bg-agendaja-light text-agendaja-primary border-r-2 border-agendaja-primary"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <item.icon className={cn(
              "mr-3 h-4 w-4",
              isActive(item.href) ? "text-agendaja-primary" : "text-gray-400"
            )} />
            {item.title}
          </Link>
        </div>
      ))}
    </nav>
  );
});

MenuItems.displayName = "MenuItems";

export default MenuItems;
