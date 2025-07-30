
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
                <Button variant="ghost" className="flex items-center gap-2">
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
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {menuItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link to={item.href}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <button onClick={onAbrirLogin} className="w-full text-left">
                    Entrar no Sistema
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderVendas;
