
import React from "react";

export const InactiveUserLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Conta Inativa
        </h2>
        <p className="text-gray-600">
          Sua conta não está ativa. Entre em contato com o administrador.
        </p>
      </div>
    </div>
  );
};
