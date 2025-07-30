import React from "react";
import { Routes, Route } from "react-router-dom";
import { LazyNovoCliente } from "@/components/layout/LazyPages";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import ClientesLista from "@/components/clientes/ClientesLista";

const Clientes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ClientesLista />} />
      <Route path="novo" element={
        <SuspenseWrapper>
          <LazyNovoCliente />
        </SuspenseWrapper>
      } />
      <Route path="editar/:id" element={
        <SuspenseWrapper>
          <LazyNovoCliente />
        </SuspenseWrapper>
      } />
    </Routes>
  );
};

export default Clientes;