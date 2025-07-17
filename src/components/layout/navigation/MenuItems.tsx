
import React from "react";
import { BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { holdingMenuItems } from "./menus/HoldingMenu";
import { operationalMenuItems } from "./menus/OperationalMenu";
import { administrativeMenuItems } from "./menus/AdministrativeMenu";
import { providerMenuItems } from "./menus/ProviderMenu";
import { OperationalMenuSection } from "./sections/OperationalMenuSection";
import { AdministrativeMenuSection } from "./sections/AdministrativeMenuSection";
import { HoldingMenuSection } from "./sections/HoldingMenuSection";
import { ProviderMenuSection } from "./sections/ProviderMenuSection";

export interface MenuItem {
  title: string;
  icon: React.ElementType;
  href: string;
  roles?: string[];
}

// Export menu arrays for Sidebar.tsx
export const agendajaMenu: MenuItem[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/sistema/dashboard",
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
    href: "/sistema/dashboard",
    roles: ["prestador"]
  },
  ...providerMenuItems
];

interface MenuItemsProps {
  onItemClick?: () => void;
}

const MenuItems: React.FC<MenuItemsProps> = React.memo(({ onItemClick }) => {
  const { profile } = useAuth();
  
  const renderMenuSections = () => {
    const sections = [];

    // Add sections based on user level
    if (profile?.nivel_acesso === "admin") {
      sections.push(
        <HoldingMenuSection 
          key="holding" 
          items={holdingMenuItems} 
          onItemClick={onItemClick} 
        />
      );
    }

    if (["admin", "gerente", "colaborador"].includes(profile?.nivel_acesso || "")) {
      sections.push(
        <OperationalMenuSection 
          key="operational" 
          items={operationalMenuItems} 
          onItemClick={onItemClick} 
        />
      );
    }

    if (["admin", "gerente"].includes(profile?.nivel_acesso || "")) {
      sections.push(
        <AdministrativeMenuSection 
          key="administrative" 
          items={administrativeMenuItems} 
          onItemClick={onItemClick} 
        />
      );
    }

    if (profile?.nivel_acesso === "prestador") {
      sections.push(
        <ProviderMenuSection 
          key="provider" 
          items={providerMenuItems} 
          onItemClick={onItemClick} 
        />
      );
    }

    return sections;
  };

  return (
    <nav className="space-y-1">
      {renderMenuSections()}
    </nav>
  );
});

MenuItems.displayName = "MenuItems";

export default MenuItems;
