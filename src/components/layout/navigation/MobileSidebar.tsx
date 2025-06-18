
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SidebarContent } from "./SidebarContent";
import { MenuItem } from "./MenuItems";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  gerenteMenuItems: MenuItem[];
  userProfile: string;
}

export function MobileSidebar({ 
  isOpen, 
  onClose, 
  menuItems, 
  gerenteMenuItems, 
  userProfile 
}: MobileSidebarProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-10 bg-black/50"
      onClick={onClose}
    >
      <div
        className="absolute inset-y-0 left-0 w-72 bg-white shadow-lg transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <Link to="/" className="font-bold text-xl text-agendaja-primary">
            AGENDA<span className="text-agendaja-secondary">JA</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m16 16-4-4 4-4"></path>
              <path d="m8 16-4-4 4-4"></path>
            </svg>
            <span className="sr-only">Fechar menu</span>
          </Button>
        </div>
        <SidebarContent 
          menuItems={menuItems} 
          gerenteMenuItems={gerenteMenuItems} 
          userProfile={userProfile}
        />
      </div>
    </div>
  );
}
