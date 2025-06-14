
import { Check, FileText, Calendar, CreditCard } from "lucide-react";

const etapas = [
  {
    icon: <FileText className="text-agendaja-primary h-7 w-7" />,
    titulo: "Escolha o serviço",
    texto: "Selecione o exame ou consulta que você precisa entre dezenas de opções.",
  },
  {
    icon: <Calendar className="text-agendaja-primary h-7 w-7" />,
    titulo: "Defina data e horário",
    texto: "Agende para o melhor momento para você, sem complicações.",
  },
  {
    icon: <Check className="text-agendaja-primary h-7 w-7" />,
    titulo: "Confirmação instantânea",
    texto: "Receba a confirmação do seu agendamento na hora.",
  },
  {
    icon: <CreditCard className="text-agendaja-primary h-7 w-7" />,
    titulo: "Pagamento seguro",
    texto: "Pague online ou na clínica, como preferir.",
  },
];

const ComoFunciona = () => (
  <section className="w-full max-w-5xl mx-auto px-4 py-10">
    <h2 className="text-3xl font-semibold text-center mb-8">
      Como funciona?
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {etapas.map((etapa, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-2 bg-white rounded-lg p-6 shadow hover-scale border"
        >
          {etapa.icon}
          <span className="mt-3 font-bold">{etapa.titulo}</span>
          <span className="text-gray-500 text-sm">{etapa.texto}</span>
        </div>
      ))}
    </div>
  </section>
);

export default ComoFunciona;
