
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import HeaderVendas from "@/components/vendas/HeaderVendas";
import { useState } from "react";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Smartphone, 
  Shield, 
  Clock, 
  CheckCircle,
  Star,
  ArrowRight,
  Building,
  Stethoscope,
  UserCheck
} from "lucide-react";

const beneficios = [
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Aumento da Receita",
    description: "Incremente seu faturamento em até 40% com novos pacientes da nossa plataforma.",
    destaque: "Até +40% receita"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Mais Pacientes",
    description: "Acesso a mais de 50.000 pacientes ativos buscando consultas e exames.",
    destaque: "50k+ pacientes"
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: "Agenda Otimizada",
    description: "Reduza horários ociosos com nossa inteligência de agendamento automático.",
    destaque: "Zero ociosidade"
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Gestão Digital",
    description: "Plataforma completa para gerenciar agendamentos, pagamentos e relatórios.",
    destaque: "Tudo digital"
  },
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: "Pagamento Garantido",
    description: "Receba seus pagamentos em até 2 dias úteis, sem risco de inadimplência.",
    destaque: "Pago em 2 dias"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Suporte Completo",
    description: "Equipe especializada para ajudar você em marketing, operação e tecnologia.",
    destaque: "Suporte 24/7"
  }
];

const tipos = [
  {
    icon: <Building className="w-12 h-12" />,
    title: "Clínicas Médicas",
    description: "Especialidades médicas em geral",
    exemplos: ["Cardiologia", "Dermatologia", "Ginecologia", "Pediatria"]
  },
  {
    icon: <Stethoscope className="w-12 h-12" />,
    title: "Laboratórios",
    description: "Exames laboratoriais e de imagem",
    exemplos: ["Sangue", "Urina", "Ultrassom", "Raio-X"]
  },
  {
    icon: <UserCheck className="w-12 h-12" />,
    title: "Profissionais Autônomos",
    description: "Médicos e especialistas independentes",
    exemplos: ["Consultório próprio", "Atendimento domiciliar", "Telemedicina"]
  }
];

const depoimentos = [
  {
    nome: "Dr. Carlos Mendes",
    especialidade: "Cardiologista",
    foto: "https://randomuser.me/api/portraits/men/45.jpg",
    texto: "Aumentei minha receita em 35% nos primeiros 3 meses. A plataforma trouxe muitos pacientes novos!",
    clinica: "Clínica CardioVida"
  },
  {
    nome: "Dra. Ana Paula",
    especialidade: "Dermatologista",
    foto: "https://randomuser.me/api/portraits/women/52.jpg",
    texto: "Minha agenda ficou 100% preenchida. O suporte da equipe Agenda Já é excepcional!",
    clinica: "Derma Clinic"
  },
  {
    nome: "Dr. Roberto Silva",
    especialidade: "Laboratório",
    foto: "https://randomuser.me/api/portraits/men/58.jpg",
    texto: "Triplicamos o número de exames mensais. A melhor decisão que tomamos foi ser parceiro!",
    clinica: "Laboratório Vida"
  }
];

const PortalParceiro = () => {
    const { toast } = useToast();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
        toast({
            title: "Cadastro Enviado!",
            description: "Nossa equipe entrará em contato em até 24 horas.",
        });
    };

    return (
        <div className="bg-white min-h-screen">
            <HeaderVendas />
            
            {/* Hero Section */}
            <section className="pt-20 pb-16 bg-gradient-to-br from-agendaja-primary via-agendaja-secondary to-agendaja-primary">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="text-white space-y-8">
                    <div>
                      <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white font-medium text-sm mb-4">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Programa de Parceiros
                      </div>
                      <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                        Transforme sua clínica em um <span className="text-agendaja-light">sucesso digital</span>
                      </h1>
                      <p className="text-xl text-white/90 leading-relaxed">
                        Junte-se a mais de 1.000 profissionais que já aumentaram sua receita 
                        e otimizaram suas agendas com a Agenda Já.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        size="lg"
                        className="bg-white text-agendaja-primary hover:bg-agendaja-light text-lg px-8 py-4 shadow-lg"
                        onClick={() => document.getElementById('cadastro')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        Quero Ser Parceiro
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-2 border-white text-white hover:bg-white hover:text-agendaja-primary text-lg px-8 py-4"
                        onClick={() => document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        Ver Benefícios
                      </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">1000+</div>
                        <div className="text-white/80 text-sm">Parceiros Ativos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">+40%</div>
                        <div className="text-white/80 text-sm">Aumento Médio</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">24h</div>
                        <div className="text-white/80 text-sm">Para Começar</div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80"
                      alt="Médicos felizes com tablet"
                      className="w-full h-auto rounded-2xl shadow-2xl"
                    />
                    <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Receita Mensal</p>
                          <p className="text-sm text-gray-600">+R$ 25.000 este mês</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Tipos de Parceiros */}
            <section className="py-20 bg-gray-50">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Seja qual for seu tipo de prática médica
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Nossa plataforma se adapta perfeitamente ao seu modelo de negócio
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {tipos.map((tipo, index) => (
                    <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-agendaja-light rounded-full text-agendaja-primary">
                          {tipo.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {tipo.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {tipo.description}
                          </p>
                        </div>
                        <div className="space-y-2">
                          {tipo.exemplos.map((exemplo, i) => (
                            <div key={i} className="flex items-center justify-center text-sm text-gray-500">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                              {exemplo}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Benefícios */}
            <section id="beneficios" className="py-20 bg-white">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Por que ser parceiro da Agenda Já?
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Benefícios exclusivos que vão transformar sua prática médica
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {beneficios.map((beneficio, index) => (
                    <div key={index} className="bg-gray-50 p-8 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="p-3 bg-agendaja-light rounded-lg text-agendaja-primary">
                            {beneficio.icon}
                          </div>
                          <span className="text-sm font-semibold text-agendaja-primary bg-agendaja-light px-3 py-1 rounded-full">
                            {beneficio.destaque}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {beneficio.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {beneficio.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Depoimentos */}
            <section className="py-20 bg-gray-50">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Parceiros que já transformaram seus negócios
                  </h2>
                  <p className="text-xl text-gray-600">
                    Histórias reais de sucesso na nossa plataforma
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {depoimentos.map((depoimento, index) => (
                    <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                      <div className="space-y-6">
                        <div className="flex text-yellow-400">
                          {[1,2,3,4,5].map((i) => (
                            <Star key={i} className="w-5 h-5 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-600 italic text-lg">
                          "{depoimento.texto}"
                        </p>
                        <div className="flex items-center space-x-4">
                          <img
                            src={depoimento.foto}
                            alt={depoimento.nome}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {depoimento.nome}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {depoimento.especialidade}
                            </p>
                            <p className="text-sm text-agendaja-primary">
                              {depoimento.clinica}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Formulário de Cadastro */}
            <section id="cadastro" className="py-20 bg-agendaja-primary">
              <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Pronto para começar?
                  </h2>
                  <p className="text-xl text-white/90">
                    Preencha o formulário e nossa equipe entrará em contato em até 24 horas
                  </p>
                </div>

                {submitted ? (
                  <div className="bg-white/10 border border-white/20 text-white p-8 rounded-2xl text-center">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-4">Cadastro recebido com sucesso!</h3>
                    <p className="text-lg">
                      Nossa equipe analisará suas informações e entrará em contato em até 24 horas 
                      para apresentar nossa proposta personalizada.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="nome" className="text-gray-700 font-semibold">
                          Nome do Responsável *
                        </Label>
                        <Input 
                          id="nome" 
                          placeholder="Dr(a). Seu nome completo" 
                          required 
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-700 font-semibold">
                          Email Profissional *
                        </Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="contato@clinica.com" 
                          required 
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefone" className="text-gray-700 font-semibold">
                          Telefone/WhatsApp *
                        </Label>
                        <Input 
                          id="telefone" 
                          placeholder="(11) 99999-9999" 
                          required 
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clinica" className="text-gray-700 font-semibold">
                          Nome da Clínica/Laboratório *
                        </Label>
                        <Input 
                          id="clinica" 
                          placeholder="Nome do estabelecimento" 
                          required 
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="especialidade" className="text-gray-700 font-semibold">
                          Especialidade Principal
                        </Label>
                        <Input 
                          id="especialidade" 
                          placeholder="Ex: Cardiologia, Dermatologia..." 
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cidade" className="text-gray-700 font-semibold">
                          Cidade *
                        </Label>
                        <Input 
                          id="cidade" 
                          placeholder="Sua cidade" 
                          required 
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full mt-8 bg-agendaja-primary hover:bg-agendaja-secondary text-white text-lg py-4 shadow-lg" 
                      size="lg"
                    >
                      Quero Ser Parceiro da Agenda Já
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </form>
                )}
              </div>
            </section>
        </div>
    );
};

export default PortalParceiro;
