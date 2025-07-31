
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderVendasProps {
  onAbrirLogin: () => void;
}

const HeaderVendas: React.FC<HeaderVendasProps> = ({ onAbrirLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Consultas Médicas", href: "/servicos/consultas-medicas" },
    { label: "Exames Laboratoriais", href: "/servicos/exames-laboratoriais" },
    { label: "Exames de Imagem", href: "/servicos/exames-de-imagem" },
    { label: "Outros Exames", href: "/servicos/outros-exames" },
    { label: "Portal Parceiro", href: "/portal-parceiro" },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-agendaja-primary">
              AGENDA<span className="text-agendaja-secondary">JA</span>
            </h1>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-agendaja-text-primary hover:text-agendaja-primary hover:bg-agendaja-light">
                  Serviços
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/servicos/consultas-medicas">Consultas Médicas</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/servicos/exames-laboratoriais">Exames Laboratoriais</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/servicos/exames-de-imagem">Exames de Imagem</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/servicos/outros-exames">Outros Exames</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/portal-parceiro" className="text-gray-700 hover:text-agendaja-primary">
              Portal Parceiro
            </Link>

            <Button 
              onClick={onAbrirLogin}
              className="bg-agendaja-primary hover:bg-agendaja-secondary text-white"
            >
              Entrar no Sistema
            </Button>
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative h-10 w-10 rounded-lg border border-border/40 bg-background/80 backdrop-blur-sm hover:bg-accent transition-all duration-200"
                >
                  <Menu className="h-5 w-5 text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-72 mt-2 bg-background/95 backdrop-blur-md border border-border/50 shadow-2xl rounded-xl p-2 animate-fade-in"
                sideOffset={8}
              >
                <div className="px-3 py-2 mb-2">
                  <h3 className="text-sm font-semibold text-foreground/90">Menu de Navegação</h3>
                </div>
                
                <div className="space-y-1">
                  <div className="px-2 py-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Serviços</p>
                  </div>
                  {menuItems.slice(0, 4).map((item) => (
                    <DropdownMenuItem key={item.href} asChild className="rounded-lg">
                      <Link 
                        to={item.href} 
                        className="flex items-center px-3 py-3 text-sm font-medium text-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors duration-200 rounded-lg"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary/60 mr-3"></div>
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>

                <div className="my-3 border-t border-border/50"></div>

                <div className="space-y-1">
                  <div className="px-2 py-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Acesso</p>
                  </div>
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link 
                      to="/portal-parceiro" 
                      className="flex items-center px-3 py-3 text-sm font-medium text-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors duration-200 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-secondary/60 mr-3"></div>
                      Portal Parceiro
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg">
                    <button 
                      onClick={onAbrirLogin} 
                      className="w-full flex items-center px-3 py-3 text-sm font-medium bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
                      Entrar no Sistema
                    </button>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderVendas;
