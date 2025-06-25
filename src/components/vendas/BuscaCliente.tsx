
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

interface BuscaClienteProps {
  termoBusca: string;
  setTermoBusca: (termo: string) => void;
  onBuscar: () => void;
  disabled?: boolean;
}

const BuscaCliente: React.FC<BuscaClienteProps> = ({
  termoBusca,
  setTermoBusca,
  onBuscar,
  disabled = false
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onBuscar();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buscar Cliente</CardTitle>
        <CardDescription>
          Digite o CPF ou nome do cliente para buscar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Digite o CPF ou nome do cliente..."
              className="pl-8"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled}
            />
          </div>
          <Button 
            onClick={onBuscar} 
            className="bg-agendaja-primary hover:bg-agendaja-secondary"
            disabled={disabled}
          >
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuscaCliente;
