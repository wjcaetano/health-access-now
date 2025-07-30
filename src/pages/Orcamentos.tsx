import React from "react";
import { Routes, Route } from "react-router-dom";
import { LazyVisualizarOrcamento } from "@/components/layout/LazyPages";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import OrcamentosLista from "@/components/orcamentos/OrcamentosLista";

const Orcamentos: React.FC = () => {
  return (
    <Routes>
      <Route index element={<OrcamentosLista />} />
      <Route path=":id" element={
        <SuspenseWrapper>
          <LazyVisualizarOrcamento />
        </SuspenseWrapper>
      } />
    </Routes>
  );
};

export default Orcamentos;