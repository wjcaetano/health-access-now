
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { Agendamento, Cliente } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GuiaAgendamentoProps {
  agendamento: Agendamento;
  cliente: Cliente;
}

const GuiaAgendamento: React.FC<GuiaAgendamentoProps> = ({ agendamento, cliente }) => {
  return (
    <Card className="w-full max-w-xl border-2 border-agendaja-primary/20 print:shadow-none">
      <CardHeader className="bg-agendaja-primary text-white text-center py-4">
        <div className="font-bold text-2xl">AGENDA<span className="text-white">JA</span></div>
        <CardTitle className="text-xl font-medium mt-2">Guia de Agendamento</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        <div>
          <h3 className="font-medium text-lg text-agendaja-primary mb-3">Dados do Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Nome:</p>
              <p className="font-medium">{cliente.nome}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">CPF:</p>
              <p>{cliente.cpf}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Telefone:</p>
              <p>{cliente.telefone}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">ID Associado:</p>
              <p className="font-mono">{cliente.idAssociado}</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium text-lg text-agendaja-primary mb-3">Detalhes do Agendamento</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-agendaja-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Data e Horário</p>
                <p className="text-gray-600">
                  {format(agendamento.dataAgendamento, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {agendamento.horario}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-agendaja-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Local</p>
                <p className="text-gray-600">{agendamento.clinica}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-agendaja-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Profissional</p>
                <p className="text-gray-600">{agendamento.profissional}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-agendaja-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Serviço</p>
                <p className="text-gray-600">{agendamento.servico}</p>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="bg-agendaja-light rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Código de Autenticação</p>
          <p className="font-mono text-2xl font-bold text-agendaja-primary tracking-wider">{agendamento.codigoAutenticacao}</p>
        </div>
        
        <div className="text-center text-sm text-gray-500 pt-2">
          <p>Apresente esta guia no local do atendimento.</p>
          <p>Agendamento realizado em {format(agendamento.createdAt, "dd/MM/yyyy 'às' HH:mm")}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuiaAgendamento;
