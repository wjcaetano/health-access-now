
import { CheckCircle, Zap, Users, BadgeDollarSign, Shield, Clock, MapPin, Heart } from 'lucide-react';

const features = [
  {
    icon: <BadgeDollarSign className="h-8 w-8 text-agendaja-primary" />,
    title: 'Economia Real',
    description: 'Até 60% de desconto em consultas e exames particulares. Sem mensalidades ou taxas ocultas.',
  },
  {
    icon: <Zap className="h-8 w-8 text-agendaja-primary" />,
    title: 'Agendamento Instantâneo',
    description: 'Marque sua consulta em minutos. Disponibilidade em tempo real e confirmação imediata.',
  },
  {
    icon: <MapPin className="h-8 w-8 text-agendaja-primary" />,
    title: 'Rede Ampla e Próxima',
    description: 'Mais de 1.000 clínicas e laboratórios parceiros. Sempre há uma opção perto de você.',
  },
  {
    icon: <Shield className="h-8 w-8 text-agendaja-primary" />,
    title: 'Segurança Garantida',
    description: 'Todos os prestadores são credenciados. Pagamentos 100% seguros e dados protegidos.',
  },
  {
    icon: <Clock className="h-8 w-8 text-agendaja-primary" />,
    title: 'Disponível 24/7',
    description: 'Agende quando quiser, onde estiver. Nossa plataforma funciona 24 horas por dia.',
  },
  {
    icon: <Heart className="h-8 w-8 text-agendaja-primary" />,
    title: 'Cuidado Personalizado',
    description: 'Suporte especializado via WhatsApp. Estamos aqui para ajudar em cada etapa.',
  },
];

const numeros = [
  { valor: "50k+", label: "Pacientes Atendidos" },
  { valor: "1.000+", label: "Parceiros Credenciados" },
  { valor: "98%", label: "Satisfação dos Clientes" },
  { valor: "24/7", label: "Suporte Disponível" }
];

const Sobre = () => {
  return (
    <section className="py-20 bg-agendaja-light">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Lado esquerdo - Conteúdo */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-agendaja-primary/10 rounded-full text-agendaja-primary font-medium text-sm mb-4">
                Por que escolher a Agenda Já?
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                A revolução no cuidado com a sua saúde
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  <strong className="text-gray-900">Cansado de pagar caro por consultas médicas?</strong> 
                  A Agenda Já chegou para democratizar o acesso à saúde de qualidade no Brasil.
                </p>
                <p>
                  Nossa plataforma conecta você diretamente com uma ampla rede de clínicas, 
                  laboratórios e profissionais de saúde credenciados, oferecendo preços justos 
                  e transparentes.
                </p>
                <p>
                  <strong className="text-agendaja-primary">Sem mensalidades, sem complicação.</strong> 
                  Pague apenas quando usar e economize até 60% nos seus cuidados de saúde.
                </p>
              </div>
            </div>

            {/* Números de impacto */}
            <div className="grid grid-cols-2 gap-6">
              {numeros.map((numero, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-agendaja-primary mb-1">
                    {numero.valor}
                  </div>
                  <div className="text-sm text-gray-600">
                    {numero.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lado direito - Imagem */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80"
              alt="Médica sorrindo com tablet"
              className="w-full h-auto rounded-2xl shadow-xl"
            />
            {/* Floating testimonial */}
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-lg border max-w-xs">
              <div className="flex items-start space-x-3">
                <img
                  src="https://randomuser.me/api/portraits/women/32.jpg"
                  alt="Ana Silva"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    "Economizei R$ 200 na minha consulta com cardiologista!"
                  </p>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 text-xs">
                      ⭐⭐⭐⭐⭐
                    </div>
                    <span className="text-xs text-gray-500 ml-2">Ana Silva</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Vantagens que fazem a diferença
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desenvolvemos uma solução completa pensando em cada detalhe da sua experiência
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-agendaja-light rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xl text-gray-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sobre;
