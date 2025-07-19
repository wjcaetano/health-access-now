
import React from 'react';
import { Button } from '@/components/ui/button';

export interface HeaderVendasProps {
  onAbrirLogin?: () => void;
}

const HeaderVendas: React.FC<HeaderVendasProps> = ({ onAbrirLogin }) => {
  const handleLogin = () => {
    if (onAbrirLogin) {
      onAbrirLogin();
    } else {
      // Default behavior - redirect to login
      window.location.href = '/login';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">
          AgendaJá
        </div>
        <Button onClick={handleLogin} variant="outline">
          Fazer Login
        </Button>
      </div>
    </header>
  );
};

export default HeaderVendas;
