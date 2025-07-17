
import React, { useState } from "react";
import { useCreateColaborador } from "@/hooks/useColaboradores";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const niveis = [
  { label: "Colaborador", value: "colaborador" },
  { label: "Atendente", value: "atendente" },
  { label: "Gerente", value: "gerente" },
  { label: "Admin", value: "admin" },
];

export default function CadastroColaborador() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [nivel, setNivel] = useState("colaborador");
  
  const createColaborador = useCreateColaborador();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createColaborador.mutateAsync({
        nome,
        email,
        cargo,
        nivel_acesso: nivel
      });
      
      // Limpar formulário
      setNome("");
      setEmail("");
      setCargo("");
      setNivel("colaborador");
    } catch (error) {
      console.error("Erro ao cadastrar colaborador:", error);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Cadastrar Colaborador</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            placeholder="Cargo"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
          />
          <Select value={nivel} onValueChange={setNivel}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o nível de acesso" />
            </SelectTrigger>
            <SelectContent>
              {niveis.map((n) => (
                <SelectItem key={n.value} value={n.value}>
                  {n.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            type="submit" 
            disabled={createColaborador.isPending} 
            className="w-full"
          >
            {createColaborador.isPending ? "Cadastrando..." : "Cadastrar"}
          </Button>
          
          {createColaborador.isSuccess && (
            <div className="text-green-600 text-sm">
              Colaborador cadastrado com sucesso!
            </div>
          )}
          
          {createColaborador.isError && (
            <div className="text-red-600 text-sm">
              Erro ao cadastrar colaborador. Tente novamente.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
