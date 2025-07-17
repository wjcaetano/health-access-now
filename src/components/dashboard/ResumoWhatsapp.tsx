
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Mensagem {
  id: string;
  nome: string;
  telefone: string;
  mensagem: string;
  horario: string;
  naoLida: boolean;
}

interface ResumoWhatsappProps {
  mensagens: Mensagem[];
}

const ResumoWhatsapp: React.FC<ResumoWhatsappProps> = ({ mensagens }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Mensagens WhatsApp</CardTitle>
          <Button variant="ghost" size="sm" className="text-agendaja-primary flex items-center gap-1 h-8">
            <span className="text-sm">Ver todas</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {mensagens.map((msg) => (
              <li key={msg.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">{msg.nome}</p>
                        {msg.naoLida && (
                          <span className="ml-2 h-2 w-2 rounded-full bg-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">{msg.mensagem}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">{msg.horario}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumoWhatsapp;
