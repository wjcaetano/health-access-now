
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuItem } from "../MenuItems";

interface AdministrativeMenuSectionProps {
  items: MenuItem[];
  onItemClick?: () => void;
}

export const AdministrativeMenuSection: React.FC<AdministrativeMenuSectionProps> = ({ 
  items, 
  onItemClick 
}) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="pt-4">
      <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Administrativo
      </h3>
      {items.map((item, index) => (
        <Link
          key={index}
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
};
