
import React from "react";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import OptimizedColaboradoresContainer from "@/components/colaboradores/OptimizedColaboradoresContainer";

export default function ColaboradoresPage() {
  return (
    <ProtectedRoute requiredLevel="gerente">
      <OptimizedColaboradoresContainer />
    </ProtectedRoute>
  );
}
