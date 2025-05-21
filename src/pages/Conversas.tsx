
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Send, Phone, User, Clock, Calendar, Plus, Search } from "lucide-react";
import { clientes } from "@/data/mock";
import { format } from "date-fns";

// Estrutura das mensagens
interface Mensagem {
  id: string;
  clienteId: string;
  tipo: "recebida" | "enviada";
  texto: string;
  timestamp: Date;
  lida: boolean;
}

// Gerar mensagens mock para exibição
const conversasClientes = clientes.slice(0, 3).map((cliente) => {
  // Criar array de mensagens para cada cliente
  const mensagens: Mensagem[] = [];
  const numMensagens = Math.floor(Math.random() * 5) + 3; // 3 a 7 mensagens
  
  for (let i = 0; i < numMensagens; i++) {
    const horasAtras = Math.floor(Math.random() * 48); // Até 48 horas atrás
    const timestamp = new Date(Date.now() - horasAtras * 60 * 60 * 1000);
    
    mensagens.push({
      id: `msg-${cliente.id}-${i}`,
      clienteId: cliente.id,
      tipo: i % 2 === 0 ? "recebida" : "enviada",
      texto: getRandomMensagem(i % 2 === 0),
      timestamp,
      lida: horasAtras > 12
    });
  }
  
  // Ordenar mensagens por timestamp (mais antigas primeiro)
  mensagens.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  return {
    cliente,
    mensagens,
    ultimaMsg: mensagens[mensagens.length - 1]
  };
});

// Função para gerar texto aleatório para mensagens
function getRandomMensagem(isCliente: boolean): string {
  const mensagensCliente = [
    "Olá, gostaria de saber mais sobre os serviços disponíveis.",
    "Bom dia, preciso agendar uma consulta com urgência.",
    "Qual o valor da consulta com o Dr. Roberto?",
    "A consulta marcada para amanhã pode ser remarcada?",
    "Gostaria de verificar se vocês têm disponibilidade esta semana.",
    "O desconto informado ainda é válido?",
    "Recebi a confirmação do agendamento, obrigado!"
  ];
  
  const mensagensAtendente = [
    "Olá, como posso ajudá-lo(a) hoje?",
    "Temos horários disponíveis na próxima semana. Qual seria o melhor dia para você?",
    "O valor da consulta é R$ 180,00, mas com o desconto exclusivo fica R$ 140,00.",
    "Vou verificar a disponibilidade e te retorno em instantes.",
    "Sua consulta está confirmada para amanhã às 14h. Poderia confirmar sua presença?",
    "Por favor, envie seus dados completos para realizarmos o cadastro.",
    "O orçamento foi enviado para seu email. Confira e me avise se tiver dúvidas."
  ];
  
  const opcoes = isCliente ? mensagensCliente : mensagensAtendente;
  return opcoes[Math.floor(Math.random() * opcoes.length)];
}

const Conversas: React.FC = () => {
  const [clienteAtivo, setClienteAtivo] = useState(conversasClientes[0]?.cliente.id || "");
  const [novoTexto, setNovoTexto] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtrar contatos com base no termo de busca
  const conversasFiltradas = conversasClientes.filter((conversa) => 
    conversa.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversa.cliente.telefone.includes(searchTerm)
  );
  
  const conversaAtual = conversasClientes.find(c => c.cliente.id === clienteAtivo);
  
  const enviarMensagem = () => {
    if (novoTexto.trim() === "") return;
    // Lógica para enviar mensagem seria implementada aqui
    // Em um app real, isso integraria com a API do WhatsApp
    console.log("Enviando mensagem:", novoTexto);
    setNovoTexto("");
  };

  return (
    <div className="animate-fade-in h-[calc(100vh-10rem)] flex flex-col">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Conversas</h2>
        <p className="text-gray-500 mt-1">
          Gerencie todas as conversas com clientes via WhatsApp
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <CardTitle>Contatos</CardTitle>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Buscar contatos..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          
          <CardContent className="px-3 pt-0 pb-0 flex-1 overflow-y-auto">
            <ul className="space-y-1 -mx-1">
              {conversasFiltradas.map((conversa) => (
                <li key={conversa.cliente.id}>
                  <button
                    onClick={() => setClienteAtivo(conversa.cliente.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
                      clienteAtivo === conversa.cliente.id
                        ? "bg-agendaja-light"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary">
                        <User className="h-6 w-6" />
                      </div>
                      {!conversa.ultimaMsg.lida && conversa.ultimaMsg.tipo === "recebida" && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 text-left truncate">
                      <p className="font-medium">{conversa.cliente.nome}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {conversa.ultimaMsg.tipo === "enviada" && "Você: "}
                        {conversa.ultimaMsg.texto}
                      </p>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {format(conversa.ultimaMsg.timestamp, "HH:mm")}
                    </div>
                  </button>
                </li>
              ))}
              
              {conversasFiltradas.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  Nenhum contato encontrado
                </div>
              )}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 flex flex-col">
          {conversaAtual ? (
            <>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>{conversaAtual.cliente.nome}</CardTitle>
                      <CardDescription>{conversaAtual.cliente.telefone}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <Calendar className="h-5 w-5 text-agendaja-primary" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <Phone className="h-5 w-5 text-agendaja-primary" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {conversaAtual.mensagens.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.tipo === "enviada" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          msg.tipo === "enviada"
                            ? "bg-agendaja-primary text-white rounded-tr-none"
                            : "bg-gray-100 text-gray-800 rounded-tl-none"
                        }`}
                      >
                        <p>{msg.texto}</p>
                        <div
                          className={`text-xs mt-1 ${
                            msg.tipo === "enviada" ? "text-white/70" : "text-gray-500"
                          } flex items-center justify-end gap-1`}
                        >
                          {format(msg.timestamp, "HH:mm")}
                          {msg.tipo === "enviada" && (
                            <Clock className="h-3 w-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="p-4 border-t">
                <form
                  className="flex items-center w-full gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    enviarMensagem();
                  }}
                >
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={novoTexto}
                    onChange={(e) => setNovoTexto(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" className="bg-agendaja-primary hover:bg-agendaja-secondary">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </CardFooter>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium">Nenhuma conversa selecionada</h3>
                <p className="text-gray-500 mt-1">
                  Selecione um contato para iniciar a conversa
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Conversas;
