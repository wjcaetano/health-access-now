import React from "react";
import { Routes, Route } from "react-router-dom";
import { LazyNovoPrestador } from "@/components/layout/LazyPages";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import PrestadoresLista from "@/components/prestadores/PrestadoresLista";

const Prestadores: React.FC = () => {
  return (
    <Routes>
      <Route index element={<PrestadoresLista />} />
      <Route path="novo" element={
        <SuspenseWrapper>
          <LazyNovoPrestador />
        </SuspenseWrapper>
      } />
      <Route path="editar/:id" element={
        <SuspenseWrapper>
          <LazyNovoPrestador />
        </SuspenseWrapper>
      } />
    </Routes>
  );
};

export default Prestadores;