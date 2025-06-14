
import { CheckCircle, Zap, Users, BadgeDollarSign } from 'lucide-react';

const features = [
  {
    icon: <BadgeDollarSign className="h-8 w-8 text-agendaja-primary" />,
    title: 'Valores acessíveis',
    description: 'Consultas e exames com até 60% de desconto.',
  },
  {
    icon: <Zap className="h-8 w-8 text-agendaja-primary" />,
    title: 'Agendamento rápido',
    description: 'Agendar é super simples, fácil e rápido.',
  },
  {
    icon: <Users className="h-8 w-8 text-agendaja-primary" />,
    title: 'Rede particular próxima',
    description: 'Agendamento na rede particular mais próxima a você.',
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-agendaja-primary" />,
    title: 'Sem mensalidades',
    description: 'Sem mensalidades. Pague apenas quando usar.',
  },
];

const Sobre = () => {
  return (
    <section id="como-funciona" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Tecnologia inovadora para cuidar da sua saúde
            </h2>
            <p className="text-gray-600 mb-6">
              Procurar os melhores profissionais de saúde é uma tarefa complicada e demorada. E mesmo quando encontramos, os custos podem ser altos.
            </p>
            <p className="text-gray-600 mb-8">
              A <span className="font-bold text-agendaja-primary">Agenda Já</span> facilita a busca pelo médico, clínica ou laboratório perfeito para os cuidados com a sua saúde com valores mais acessíveis.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-700">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ab?auto=format&fit=crop&w=800&q=80"
              alt="Médica usando um tablet"
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sobre;
