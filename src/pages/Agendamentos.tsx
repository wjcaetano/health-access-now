import React from "react";
import { Routes, Route } from "react-router-dom";
import { LazyNovoAgendamento } from "@/components/layout/LazyPages";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import AgendamentosLista from "@/components/agendamentos/AgendamentosLista";

const Agendamentos: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AgendamentosLista />} />
      <Route path="novo" element={
        <SuspenseWrapper>
          <LazyNovoAgendamento />
        </SuspenseWrapper>
      } />
      <Route path="editar/:id" element={
        <SuspenseWrapper>
          <LazyNovoAgendamento />
        </SuspenseWrapper>
      } />
    </Routes>
  );
};

export default Agendamentos;