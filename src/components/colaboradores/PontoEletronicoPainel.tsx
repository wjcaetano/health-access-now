
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export default function PontoEletronicoPainel() {
  const [colaboradorId, setColaboradorId] = useState("");
  const [tipoPonto, setTipoPonto] = useState("entrada");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const registrarPonto = async () => {
    setLoading(true);
    setMsg("");
    if (!colaboradorId) {
      setMsg("Informe o ID do colaborador!");
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("ponto_eletronico").insert([
      {
        colaborador_id: colaboradorId,
        data_ponto: format(new Date(), "yyyy-MM-dd"),
        tipo_ponto: tipoPonto,
        // hora_entrada/hora_saida pode ser preenchido conforme o tipo, mas para simplicidade registramos só o tipo e preenchimento automático do campo timestamp
      },
    ]);
    if (error) setMsg("Erro: " + error.message);
    else setMsg("Ponto registrado como '" + tipoPonto + "' com sucesso!");
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Registrar Ponto Eletrônico</h2>
      <Input
        placeholder="ID do colaborador"
        value={colaboradorId}
        onChange={e => setColaboradorId(e.target.value)}
        className="mb-2"
      />
      <select
        value={tipoPonto}
        onChange={e => setTipoPonto(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 rounded mb-2"
      >
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </select>
      <Button className="w-full" onClick={registrarPonto} disabled={loading}>
        {loading ? "Registrando..." : "Registrar Ponto"}
      </Button>
      {msg && <div className="mt-2">{msg}</div>}
    </div>
  );
}
