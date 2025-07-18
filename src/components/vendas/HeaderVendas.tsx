
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeaderVendasProps {
  onAbrirLogin: () => void;
}

const HeaderVendas: React.FC<HeaderVendasProps> = ({ onAbrirLogin }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="font-bold text-xl text-agendaja-primary">
              AGENDA<span className="text-agendaja-secondary">JA</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/servicos/consultas-medicas" 
              className="text-gray-600 hover:text-agendaja-primary transition-colors"
            >
              Consultas
            </Link>
            <Link 
              to="/servicos/exames-laboratoriais" 
              className="text-gray-600 hover:text-agendaja-primary transition-colors"
            >
              Exames Laboratoriais
            </Link>
            <Link 
              to="/servicos/exames-de-imagem" 
              className="text-gray-600 hover:text-agendaja-primary transition-colors"
            >
              Exames de Imagem
            </Link>
            <Link 
              to="/servicos/outros-exames" 
              className="text-gray-600 hover:text-agendaja-primary transition-colors"
            >
              Outros Exames
            </Link>
            <Link 
              to="/portal-parceiro" 
              className="text-gray-600 hover:text-agendaja-primary transition-colors"
            >
              Seja Parceiro
            </Link>
            <Link 
              to="/seja-franqueado" 
              className="text-gray-600 hover:text-agendaja-primary transition-colors"
            >
              Seja Franqueado
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onAbrirLogin}
              className="text-gray-600 hover:text-agendaja-primary"
            >
              Entrar
            </Button>
            <Button
              onClick={onAbrirLogin}
              className="bg-agendaja-primary hover:bg-agendaja-primary/90 text-white"
            >
              Acessar Sistema
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderVendas;
