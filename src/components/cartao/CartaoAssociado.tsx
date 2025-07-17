
import React from 'react';
import { Card } from '@/components/ui/card';
import { Cliente } from '@/types';
import { format } from 'date-fns';

interface CartaoAssociadoProps {
  cliente: Cliente;
}

const CartaoAssociado: React.FC<CartaoAssociadoProps> = ({ cliente }) => {
  return (
    <Card className="w-full max-w-md bg-gradient-to-r from-agendaja-primary to-agendaja-accent text-white overflow-hidden rounded-xl shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start mb-8">
          <div className="font-bold text-3xl">
            AGENDA<span className="text-white">JA</span>
          </div>
          <div className="text-xs text-white/80">
            Cartão Associado
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-xs text-white/80 mb-1">Nome</p>
          <p className="text-lg font-bold">{cliente.nome}</p>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-white/80 mb-1">ID Associado</p>
            <p className="font-mono text-lg">{cliente.idAssociado}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/80 mb-1">Desde</p>
            <p className="text-sm">{format(cliente.dataCadastro, "MM/yyyy")}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white/20 backdrop-blur-sm py-3 px-6">
        <p className="text-xs text-center">
          Apresente este cartão para obter descontos exclusivos
        </p>
      </div>
    </Card>
  );
};

export default CartaoAssociado;
