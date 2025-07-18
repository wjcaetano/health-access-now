
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Página não encontrada
          </h2>
          <p className="text-gray-500 mb-8">
            A página que você está procurando não existe ou foi removida.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/" className="block">
            <Button className="w-full bg-agendaja-primary hover:bg-agendaja-primary/90 text-white">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar à Página Anterior
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Se você acredita que isso é um erro, entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
