import React from "react";
import { Routes, Route } from "react-router-dom";
import { LazyNovoServico } from "@/components/layout/LazyPages";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import ServicosLista from "@/components/servicos/ServicosLista";

const Servicos: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ServicosLista />} />
      <Route path="novo" element={
        <SuspenseWrapper>
          <LazyNovoServico />
        </SuspenseWrapper>
      } />
      <Route path="editar/:id" element={
        <SuspenseWrapper>
          <LazyNovoServico />
        </SuspenseWrapper>
      } />
    </Routes>
  );
};

export default Servicos;