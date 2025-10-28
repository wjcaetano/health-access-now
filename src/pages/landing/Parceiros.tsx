import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Smartphone, 
  Shield, 
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

export default function Parceiros() {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
          <h1 className="text-2xl font-bold text-primary">Agenda Já</h1>
          <Button variant="outline" asChild>
            <a href="/login">Acessar Plataforma</a>
          </Button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-primary">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-primary-foreground space-y-8">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-primary-foreground/20 rounded-full font-medium text-sm mb-4">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Programa de Parceiros
                </div>
                <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                  Transforme sua clínica em um <span className="text-accent">sucesso digital</span>
                </h2>
                <p className="text-xl opacity-90 leading-relaxed">
                  Junte-se a mais de 1.000 profissionais que já aumentaram sua receita 
                  e otimizaram suas agendas com a Agenda Já.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-4 shadow-lg"
                  onClick={() => document.getElementById('cadastro')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Quero Ser Parceiro
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 text-lg px-8 py-4 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  onClick={() => document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver Benefícios
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-primary-foreground/20">
                <div className="text-center">
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-sm opacity-80">Parceiros Ativos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">+40%</div>
                  <div className="text-sm opacity-80">Aumento Médio</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24h</div>
                  <div className="text-sm opacity-80">Para Começar</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80"
                alt="Profissionais de saúde utilizando tecnologia"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-card p-6 rounded-xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Receita Mensal</p>
                    <p className="text-sm text-muted-foreground">+R$ 25.000 este mês</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Parceiros */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Seja qual for seu tipo de prática médica
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nossa plataforma se adapta perfeitamente ao seu modelo de negócio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {tipos.map((tipo, index) => (
              <div key={index} className="bg-card p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full text-accent">
                    {tipo.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {tipo.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {tipo.description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {tipo.exemplos.map((exemplo, i) => (
                      <div key={i} className="flex items-center justify-center text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-accent mr-2" />
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
      <section id="beneficios" className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Por que ser parceiro da Agenda Já?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Benefícios exclusivos que vão transformar sua prática médica
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="bg-muted/50 p-8 rounded-xl hover:bg-card hover:shadow-lg transition-all duration-300 border border-transparent hover:border-border">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-accent/10 rounded-lg text-accent">
                      {beneficio.icon}
                    </div>
                    <span className="text-sm font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                      {beneficio.destaque}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {beneficio.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
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
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Parceiros que já transformaram seus negócios
            </h2>
            <p className="text-xl text-muted-foreground">
              Histórias reais de sucesso na nossa plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {depoimentos.map((depoimento, index) => (
              <div key={index} className="bg-card p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border">
                <div className="space-y-6">
                  <div className="flex text-yellow-500">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic text-lg">
                    "{depoimento.texto}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <img
                      src={depoimento.foto}
                      alt={depoimento.nome}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">
                        {depoimento.nome}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {depoimento.especialidade}
                      </p>
                      <p className="text-sm text-primary">
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
      <section id="cadastro" className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Pronto para começar?
            </h2>
            <p className="text-xl opacity-90">
              Preencha o formulário e nossa equipe entrará em contato em até 24 horas
            </p>
          </div>

          {submitted ? (
            <div className="bg-primary-foreground/10 border border-primary-foreground/20 p-8 rounded-2xl text-center">
              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Cadastro recebido com sucesso!</h3>
              <p className="text-lg opacity-90">
                Nossa equipe analisará suas informações e entrará em contato em até 24 horas 
                para apresentar nossa proposta personalizada.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card text-card-foreground rounded-2xl p-8 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nome">
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
                  <Label htmlFor="email">
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
                  <Label htmlFor="telefone">
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
                  <Label htmlFor="clinica">
                    Nome da Clínica/Laboratório *
                  </Label>
                  <Input 
                    id="clinica" 
                    placeholder="Nome do estabelecimento" 
                    required 
                    className="mt-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="especialidade">
                    Especialidade Principal
                  </Label>
                  <Input 
                    id="especialidade" 
                    placeholder="Ex: Cardiologia, Exames Laboratoriais, etc" 
                    className="mt-2"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full mt-6 text-lg"
              >
                Enviar Cadastro
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Agenda Já. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
