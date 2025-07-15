
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SidebarContent } from "./SidebarContent";
import { MenuItem } from "./MenuItems";
import { X } from "lucide-react";

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
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div
        className="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-white shadow-2xl transition-all duration-300 ease-in-out overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4 bg-gradient-to-r from-agendaja-primary to-agendaja-secondary">
          <Link to="/" className="font-bold text-lg text-white" onClick={onClose}>
            AGENDA<span className="text-agendaja-light">JA</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar menu</span>
          </Button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
          <SidebarContent 
            menuItems={menuItems} 
            gerenteMenuItems={gerenteMenuItems} 
            userProfile={userProfile}
            onItemClick={onClose}
          />
        </div>
        
        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="text-center">
            <p className="text-xs text-gray-500">AGENDAJA</p>
            <p className="text-xs text-gray-400">Versão 1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
}
