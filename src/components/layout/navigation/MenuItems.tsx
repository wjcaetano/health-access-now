
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { unidadeMenuItems } from "./menus/UnidadeMenu";
import { prestadorMenuItems } from "./menus/PrestadorMenuSimplified";

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
  
  const getMenuItems = () => {
    if (profile?.nivel_acesso === "prestador") {
      return prestadorMenuItems;
    }
    
    if (["gerente", "atendente"].includes(profile?.nivel_acesso || "")) {
      return unidadeMenuItems;
    }
    
    return [];
  };

  const menuItems = getMenuItems();

  return (
    <nav className="space-y-1">
      {menuItems.map((item) => (
        <div key={item.title} className="px-3 py-2">
          <button
            onClick={onItemClick}
            className="w-full flex items-center text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.title}
          </button>
        </div>
      ))}
    </nav>
  );
});

MenuItems.displayName = "MenuItems";

export default MenuItems;
