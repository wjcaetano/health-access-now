
import { Check, Zap, User, Clock } from "lucide-react";

const vantagens = [
  {
    icon: <Check className="text-agendaja-primary h-8 w-8" />,
    titulo: "Sem mensalidade",
    texto: "Pague apenas pelo que usar, sem taxas escondidas.",
  },
  {
    icon: <Zap className="text-agendaja-primary h-8 w-8" />,
    titulo: "Agendamento rápido",
    texto: "Marque exames e consultas em poucos minutos, de forma simples.",
  },
  {
    icon: <Clock className="text-agendaja-primary h-8 w-8" />,
    titulo: "Atendimento ágil",
    texto: "Reduza o tempo de espera e resolva tudo pelo celular.",
  },
  {
    icon: <User className="text-agendaja-primary h-8 w-8" />,
    titulo: "Variedade de especialidades",
    texto: "Diversos serviços, clínicas e laboratórios em um só lugar.",
  },
];

const Diferenciais = () => (
  <section className="max-w-5xl mx-auto px-4 py-10">
    <h2 className="text-3xl font-semibold text-center mb-6">Por que escolher a AGENDAJA?</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {vantagens.map((v, i) => (
        <div
          key={i}
          className="flex flex-col items-center bg-gray-50 rounded-lg shadow-md p-6 text-center hover-scale"
        >
          {v.icon}
          <span className="font-bold mt-3 mb-2">{v.titulo}</span>
          <span className="text-gray-500 text-sm">{v.texto}</span>
        </div>
      ))}
    </div>
  </section>
);

export default Diferenciais;
