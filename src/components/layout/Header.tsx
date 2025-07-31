
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Menu, Search, User, Users, Settings, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title: string;
  subtitle?: string;
  toggleSidebar: () => void;
}

export default function Header({ title, subtitle, toggleSidebar }: HeaderProps) {
  const { toast } = useToast();
  const { signOut, profile, user, isManager } = useAuth();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado do sistema"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no logout",
        description: "Ocorreu um erro ao fazer logout"
      });
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
      <div className={`flex items-center justify-between ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className={`${isMobile ? 'h-9 w-9' : 'h-8 w-8'} flex-shrink-0`}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="min-w-0 flex-1">
            <h1 className={`font-semibold text-gray-900 truncate ${isMobile ? 'text-lg' : 'text-xl'}`}>
              {title}
            </h1>
            {subtitle && !isMobile && (
              <p className="text-sm text-gray-500 truncate">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Search - hidden on mobile */}
          {!isMobile && (
            <>
              <div className="hidden lg:block w-48 xl:w-64">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Buscar..." 
                    className="pl-8 bg-gray-50 border-gray-200 focus:bg-white text-sm" 
                  />
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="hidden md:flex gap-1 text-sm">
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">Buscar</span>
              </Button>
            </>
          )}
          
          {/* Mobile search button */}
          {isMobile && (
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          {/* Notification Bell */}
          <NotificationBell />
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size={isMobile ? "icon" : "sm"} 
                className={`flex ${isMobile ? 'h-9 w-9' : 'gap-2'}`}
              >
                <User className={isMobile ? "h-5 w-5" : "h-4 w-4"} />
                {!isMobile && (
                  <span className="hidden sm:inline text-sm truncate max-w-24 md:max-w-none">
                    {profile?.nome || user?.email}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none truncate">{profile?.nome || 'Usuário'}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">
                    {profile?.nivel_acesso}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/unidade/perfil" className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </Link>
              </DropdownMenuItem>
              {isManager && (
                <DropdownMenuItem asChild>
                  <Link to="/unidade/configuracoes" className="flex items-center cursor-pointer">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
