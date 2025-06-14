
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, LogOut, Menu, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    // Remover o token de autenticação simulado
    localStorage.removeItem("agendaja_authenticated");
    localStorage.removeItem("agendaja_user_type");
    
    // Notificar o usuário
    toast({
      title: "Logout realizado com sucesso",
      description: "Você foi desconectado do sistema"
    });
    
    // Redirecionar para a tela inicial (home)
    navigate("/");
  };

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
          
          {/* Botão de logout */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout} 
            className="flex gap-1 text-gray-600 hover:bg-red-50 hover:text-red-600 ml-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
