import { useState } from 'react';
import { ArrowRight, Search, Calendar, CreditCard, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import SelecaoUnidadeModal from "@/components/vendas/SelecaoUnidadeModal";

const passos = [
  {
    numero: "01",
    icone: <Search className="w-8 h-8" />,
    titulo: "Encontre o que precisa",
    descricao: "Busque por consultas médicas, exames laboratoriais ou de imagem na nossa plataforma. Temos centenas de opções próximas a você.",
    cor: "bg-blue-500"
  },
  {
    numero: "02",
    icone: <Calendar className="w-8 h-8" />,
    titulo: "Escolha data e horário",
    descricao: "Veja a disponibilidade em tempo real e escolha o melhor horário que se encaixa na sua agenda. Sem esperas desnecessárias.",
    cor: "bg-green-500"
  },
  {
    numero: "03",
    icone: <CreditCard className="w-8 h-8" />,
    titulo: "Pague com segurança",
    descricao: "Pagamento 100% seguro com cartão, PIX ou parcelamento. Preços transparentes e sem taxas ocultas.",
    cor: "bg-purple-500"
  },
  {
    numero: "04",
    icone: <UserCheck className="w-8 h-8" />,
    titulo: "Compareça ao atendimento",
    descricao: "Receba a confirmação e todos os detalhes por WhatsApp. É só comparecer no local e ser atendido com qualidade.",
    cor: "bg-orange-500"
  }
];

const ComoFunciona = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
            Processo Simplificado
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Como funciona a Agenda Já?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Em apenas 4 passos simples, você agenda seu atendimento médico com economia e praticidade. 
            Veja como é fácil cuidar da sua saúde.
          </p>
        </div>

        {/* Passos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {passos.map((passo, index) => (
            <div key={index} className="relative">
              <div className="text-center group">
                {/* Número */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full font-bold text-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {passo.numero}
                </div>
                
                {/* Ícone */}
                <div className={`inline-flex items-center justify-center w-12 h-12 ${passo.cor} text-white rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {passo.icone}
                </div>
                
                {/* Conteúdo */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {passo.titulo}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {passo.descricao}
                </p>
              </div>
              
              {/* Seta conectora */}
              {index < passos.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-4 z-10">
                  <ArrowRight className="w-6 h-6 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => setModalOpen(true)}
              >
                Agendar Consulta ou Exame
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </DialogTrigger>
            <SelecaoUnidadeModal tipoServico="Consulta ou Exame" />
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default ComoFunciona;
