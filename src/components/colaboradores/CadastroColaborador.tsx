
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const { error } = await supabase
      .from("colaboradores")
      .insert([{ nome, email, cargo, nivel_acesso: nivel }]);
    if (error) {
      setError("Erro ao cadastrar colaborador: " + error.message);
    } else {
      setSuccess("Colaborador cadastrado com sucesso!");
      setNome("");
      setEmail("");
      setCargo("");
      setNivel("colaborador");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-bold mb-4">Cadastrar Colaborador</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Nome completo"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          placeholder="Cargo"
          value={cargo}
          onChange={e => setCargo(e.target.value)}
        />
        <select
          className="w-full border border-gray-300 px-3 py-2 rounded"
          value={nivel}
          onChange={e => setNivel(e.target.value)}
        >
          {niveis.map(n => (
            <option key={n.value} value={n.value}>
              {n.label}
            </option>
          ))}
        </select>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>
        {success && <div className="text-green-600">{success}</div>}
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
}
