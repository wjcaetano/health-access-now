
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Search, MoreVertical, Phone, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChatIntegradoProps {
  prestadorId: string;
}

const ChatIntegrado: React.FC<ChatIntegradoProps> = ({ prestadorId }) => {
  const [conversaSelecionada, setConversaSelecionada] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [busca, setBusca] = useState("");

  // Mock data - em implementação real, buscar do banco
  const conversas = [
    {
      id: "1",
      unidade: "AGENDAJA Barra",
      ultimaMensagem: "Temos um paciente que precisa de atendimento urgente",
      timestamp: new Date(2024, 0, 15, 14, 30),
      naoLidas: 2,
      online: true
    },
    {
      id: "2",
      unidade: "AGENDAJA Centro",
      ultimaMensagem: "Obrigado pelo excelente atendimento hoje!",
      timestamp: new Date(2024, 0, 15, 12, 15),
      naoLidas: 0,
      online: false
    },
    {
      id: "3",
      unidade: "AGENDAJA Norte",
      ultimaMensagem: "Podemos agendar uma reunião na próxima semana?",
      timestamp: new Date(2024, 0, 14, 16, 45),
      naoLidas: 1,
      online: true
    }
  ];

  const mensagens = [
    {
      id: "1",
      remetente: "AGENDAJA Barra",
      conteudo: "Olá! Temos um paciente que precisa de atendimento urgente para amanhã.",
      timestamp: new Date(2024, 0, 15, 14, 25),
      enviada: false
    },
    {
      id: "2",
      remetente: "Você",
      conteudo: "Claro! Qual o tipo de procedimento?",
      timestamp: new Date(2024, 0, 15, 14, 26),
      enviada: true
    },
    {
      id: "3",
      remetente: "AGENDAJA Barra",
      conteudo: "É um eletrocardiograma. O paciente está com dores no peito.",
      timestamp: new Date(2024, 0, 15, 14, 28),
      enviada: false
    },
    {
      id: "4",
      remetente: "Você",
      conteudo: "Perfeito! Posso atender amanhã às 10h. Vou preparar tudo.",
      timestamp: new Date(2024, 0, 15, 14, 30),
      enviada: true
    }
  ];

  const conversasFiltradas = conversas.filter(conversa =>
    conversa.unidade.toLowerCase().includes(busca.toLowerCase())
  );

  const enviarMensagem = () => {
    if (mensagem.trim()) {
      // Implementar envio da mensagem
      console.log("Enviando:", mensagem);
      setMensagem("");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Lista de Conversas */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Conversas</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar unidades..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {conversasFiltradas.map((conversa) => (
              <div
                key={conversa.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 transition-colors ${
                  conversaSelecionada === conversa.id
                    ? 'bg-blue-50 border-blue-500'
                    : 'border-transparent'
                }`}
                onClick={() => setConversaSelecionada(conversa.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{conversa.unidade}</span>
                    {conversa.online && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {format(conversa.timestamp, "HH:mm")}
                    </span>
                    {conversa.naoLidas > 0 && (
                      <Badge variant="default" className="text-xs">
                        {conversa.naoLidas}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {conversa.ultimaMensagem}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat */}
      <Card className="lg:col-span-2 flex flex-col">
        {conversaSelecionada ? (
          <>
            {/* Header do Chat */}
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-medium">
                      {conversas.find(c => c.id === conversaSelecionada)?.unidade}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {conversas.find(c => c.id === conversaSelecionada)?.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Mensagens */}
            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {mensagens.map((mensagem) => (
                  <div
                    key={mensagem.id}
                    className={`flex ${mensagem.enviada ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        mensagem.enviada
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{mensagem.conteudo}</p>
                      <p className={`text-xs mt-1 ${
                        mensagem.enviada ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {format(mensagem.timestamp, "HH:mm")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            {/* Input de Mensagem */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                  className="flex-1"
                />
                <Button onClick={enviarMensagem}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8" />
              </div>
              <p>Selecione uma conversa para começar</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatIntegrado;
