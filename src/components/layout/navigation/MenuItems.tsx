
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { holdingMenuItems } from "./menus/HoldingMenu";
import { operationalMenuItems } from "./menus/OperationalMenu";
import { administrativeMenuItems } from "./menus/AdministrativeMenu";
import { providerMenuItems } from "./menus/ProviderMenu";

export interface MenuItem {
  title: string;
  icon: React.ElementType;
  href: string;
  roles?: string[];
}

// Define section type separately
interface MenuSection {
  title: string;
  items: MenuItem[];
  isSection: true;
}

interface StandaloneItem {
  title: string;
  icon: React.ElementType;
  path: string;
  roles: string[];
  isStandalone: true;
}

// Export menu arrays for Sidebar.tsx
export const agendajaMenu: MenuItem[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
    roles: ["admin", "gerente", "colaborador"]
  },
  ...operationalMenuItems,
  ...administrativeMenuItems
];

export const gerenteMenu: MenuItem[] = [
  ...holdingMenuItems
];

export const prestadorMenu: MenuItem[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
    roles: ["prestador"]
  },
  ...providerMenuItems
];

interface MenuItemsProps {
  onItemClick?: () => void;
}

const MenuItems: React.FC<MenuItemsProps> = ({ onItemClick }) => {
  const { profile } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const getMenuSections = (): (StandaloneItem | MenuSection)[] => {
    const sections: (StandaloneItem | MenuSection)[] = [
      {
        title: "Dashboard",
        icon: BarChart3,
        path: "/dashboard",
        roles: ["admin", "gerente", "colaborador", "prestador"],
        isStandalone: true
      }
    ];

    // Add sections based on user level
    if (profile?.nivel_acesso === "admin") {
      sections.push({
        title: "Franqueadora",
        items: holdingMenuItems,
        isSection: true
      });
    }

    if (["admin", "gerente", "colaborador"].includes(profile?.nivel_acesso || "")) {
      sections.push({
        title: "Operacional",
        items: operationalMenuItems,
        isSection: true
      });
    }

    if (["admin", "gerente"].includes(profile?.nivel_acesso || "")) {
      sections.push({
        title: "Administrativo", 
        items: administrativeMenuItems,
        isSection: true
      });
    }

    if (profile?.nivel_acesso === "prestador") {
      sections.push({
        title: "Prestador",
        items: providerMenuItems,
        isSection: true
      });
    }

    return sections;
  };

  const menuSections = getMenuSections();

  return (
    <nav className="space-y-1">
      {menuSections.map((section, index) => {
        if (section.isStandalone) {
          const standaloneSection = section as StandaloneItem;
          return (
            <Link
              key={index}
              to={standaloneSection.path}
              onClick={onItemClick}
              className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${isActive(standaloneSection.path) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              <standaloneSection.icon className="mr-3 h-4 w-4" />
              {standaloneSection.title}
            </Link>
          );
        }

        if (section.isSection) {
          const menuSection = section as MenuSection;
          return (
            <div key={index} className="pt-4 first:pt-0">
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {menuSection.title}
              </h3>
              {menuSection.items
                .filter(item => !item.roles || item.roles.includes(profile?.nivel_acesso || ""))
                .map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    to={item.href}
                    onClick={onItemClick}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${isActive(item.href) 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
            </div>
          );
        }

        return null;
      })}
    </nav>
  );
};

export default MenuItems;
