
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Menu, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  toggleSidebar 
}) => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:block w-64">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar..." 
                className="pl-8 bg-gray-50 border-gray-200 focus:bg-white" 
              />
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="hidden md:flex gap-1">
            <Search className="h-4 w-4 md:hidden" />
            <span>Buscar</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
