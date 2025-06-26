import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import HeaderVendas from "@/components/vendas/HeaderVendas";
import { TrendingUp, DollarSign, Users, Shield, Rocket, Target, CheckCircle, Star, ArrowRight, MapPin, Clock, Award, PieChart, Handshake, BookOpen } from "lucide-react";

const vantagens = [{
  icon: <DollarSign className="w-8 h-8" />,
  title: "Investimento Acessível",
  description: "Comece com apenas R$ 45.000 e tenha retorno em até 12 meses.",
  destaque: "ROI em 12 meses"
}, {
  icon: <Rocket className="w-8 h-8" />,
  title: "Mercado em Expansão",
  description: "Setor de saúde digital cresce 25% ao ano no Brasil.",
  destaque: "+25% crescimento"
}, {
  icon: <Users className="w-8 h-8" />,
  title: "Suporte Completo",
  description: "Marketing, tecnologia, operação e treinamento inclusos.",
  destaque: "360° de suporte"
}, {
  icon: <Shield className="w-8 h-8" />,
  title: "Marca Consolidada",
  description: "Líder no segmento com mais de 50.000 clientes ativos.",
  destaque: "50k+ clientes"
}, {
  icon: <Target className="w-8 h-8" />,
  title: "Território Exclusivo",
  description: "Área de atuação protegida com potencial de 100.000+ habitantes.",
  destaque: "Exclusividade"
}, {
  icon: <PieChart className="w-8 h-8" />,
  title: "Múltiplas Receitas",
  description: "Ganhe com agendamentos, parcerias e programas de fidelidade.",
  destaque: "3 fontes de receita"
}];
const suporte = [{
  icon: <BookOpen className="w-6 h-6" />,
  title: "Treinamento Completo",
  description: "2 semanas de capacitação presencial e online"
}, {
  icon: <Rocket className="w-6 h-6" />,
  title: "Lançamento Assistido",
  description: "Nossa equipe te ajuda nos primeiros 90 dias"
}, {
  icon: <Users className="w-6 h-6" />,
  title: "Marketing Digital",
  description: "Campanhas prontas e suporte em redes sociais"
}, {
  icon: <Shield className="w-6 h-6" />,
  title: "Tecnologia Atualizada",
  description: "Plataforma sempre atualizada sem custo adicional"
}];
const perfil = ["Profissionais de saúde (médicos, enfermeiros, farmacêuticos)", "Empreendedores com experiência em gestão", "Investidores interessados no setor de saúde", "Pessoas com network na área médica", "Empresários que buscam diversificar negócios"];
const resultados = [{
  nome: "Carlos Mendoza",
  cidade: "São Paulo - SP",
  resultado: "Faturamento de R$ 80.000/mês em 8 meses",
  foto: "https://randomuser.me/api/portraits/men/42.jpg"
}, {
  nome: "Ana Beatriz",
  cidade: "Belo Horizonte - MG",
  resultado: "ROI de 150% no primeiro ano",
  foto: "https://randomuser.me/api/portraits/women/38.jpg"
}, {
  nome: "Roberto Silva",
  cidade: "Porto Alegre - RS",
  resultado: "Mais de 300 parceiros credenciados",
  foto: "https://randomuser.me/api/portraits/men/55.jpg"
}];

const SejaFranqueado = () => {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };
  return <div className="bg-white min-h-screen">
            <HeaderVendas />
            
            {/* Hero Section */}
            <section className="pt-16 sm:pt-20 pb-12 sm:pb-16 bg-gradient-to-br from-agendaja-primary via-agendaja-secondary to-agendaja-primary">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div className="text-white space-y-6 sm:space-y-8 text-center lg:text-left">
                    <div>
                      <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 rounded-full text-white font-medium text-xs sm:text-sm mb-4">
                        <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        Franquia do Ano 2024
                      </div>
                      <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                        Seja dono da <span className="text-agendaja-light">revolução</span> da saúde digital
                      </h1>
                      <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                        Invista na franquia que está transformando o acesso à saúde no Brasil. 
                        Mercado de R$ 200 bilhões com crescimento de 25% ao ano.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-6 max-w-md mx-auto lg:max-w-none">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                        <div className="text-xl sm:text-2xl font-bold text-white">R$ 45k</div>
                        <div className="text-white/80 text-xs sm:text-sm">Investimento Inicial</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                        <div className="text-xl sm:text-2xl font-bold text-white">12 meses</div>
                        <div className="text-white/80 text-xs sm:text-sm">Retorno Esperado</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                        <div className="text-xl sm:text-2xl font-bold text-white">200+</div>
                        <div className="text-white/80 text-xs sm:text-sm">Cidades Disponíveis</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                        <div className="text-xl sm:text-2xl font-bold text-white">95%</div>
                        <div className="text-white/80 text-xs sm:text-sm">Satisfação</div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                      <Button size="lg" className="bg-white text-agendaja-primary hover:bg-agendaja-light text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-lg" onClick={() => setShowForm(true)}>
                        Quero Ser Franqueado
                        <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                      <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-agendaja-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4" onClick={() => document.getElementById('vantagens')?.scrollIntoView({
                behavior: 'smooth'
              })}>
                        Ver Vantagens
                      </Button>
                    </div>
                  </div>

                  <div className="relative mt-8 lg:mt-0">
                    <img alt="Empreendedor de sucesso" className="w-full h-auto rounded-2xl shadow-2xl max-h-[300px] sm:max-h-[400px] lg:max-h-none object-cover" src="/lovable-uploads/e2c7d360-2c77-4bf5-8aa1-a29b5b824601.jpg" />
                    <div className="absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 bg-white p-3 sm:p-6 rounded-xl shadow-xl max-w-[200px] sm:max-w-none">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">Franquia Ativa</p>
                          <p className="text-xs sm:text-sm text-gray-600">ROI: 180% em 12 meses</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Mercado */}
            <section className="py-16 sm:py-20 bg-gray-50">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    O mercado que não para de crescer
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                    Saúde digital é o setor que mais cresce no Brasil. Seja parte dessa revolução.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                  <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-agendaja-primary mb-3 sm:mb-4">R$ 200bi</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Mercado de Saúde</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Tamanho do mercado brasileiro de saúde privada</p>
                  </div>
                  <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-agendaja-primary mb-3 sm:mb-4">25%</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Crescimento Anual</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Taxa de crescimento da saúde digital no país</p>
                  </div>
                  <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm text-center sm:col-span-2 md:col-span-1">
                    <div className="text-3xl sm:text-4xl font-bold text-agendaja-primary mb-3 sm:mb-4">80%</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Market Share</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Potencial de mercado ainda não explorado</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Vantagens */}
            <section id="vantagens" className="py-16 sm:py-20 bg-white">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    Por que escolher a franquia Agenda Já?
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                    Vantagens exclusivas que garantem seu sucesso no mercado de saúde digital
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {vantagens.map((vantagem, index) => <div key={index} className="bg-gray-50 p-6 sm:p-8 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="p-2.5 sm:p-3 bg-agendaja-light rounded-lg text-agendaja-primary">
                            {React.cloneElement(vantagem.icon, { className: "w-6 h-6 sm:w-8 sm:h-8" })}
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-agendaja-primary bg-agendaja-light px-2.5 sm:px-3 py-1 rounded-full">
                            {vantagem.destaque}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                            {vantagem.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            {vantagem.description}
                          </p>
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>
            </section>

            {/* Suporte */}
            <section className="py-16 sm:py-20 bg-agendaja-light/20">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    Suporte completo para seu sucesso
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-600">
                    Você nunca estará sozinho. Nossa equipe te acompanha em cada etapa.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                  {suporte.map((item, index) => <div key={index} className="bg-white p-6 sm:p-8 rounded-xl shadow-sm">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="p-2.5 sm:p-3 bg-agendaja-light rounded-lg text-agendaja-primary flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm sm:text-base">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>
            </section>

            {/* Perfil do Franqueado */}
            <section className="py-16 sm:py-20 bg-white">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
                  <div className="order-2 lg:order-1">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                      Perfil ideal do franqueado
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
                      Buscamos empreendedores visionários que acreditam no potencial da 
                      saúde digital e querem fazer a diferença na vida das pessoas.
                    </p>
                    <div className="space-y-3 sm:space-y-4">
                      {perfil.map((item, index) => <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                        </div>)}
                    </div>
                  </div>
                  <div className="relative order-1 lg:order-2">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" alt="Empreendedor de sucesso" className="w-full h-auto rounded-2xl shadow-xl max-h-[300px] sm:max-h-[400px] lg:max-h-none object-cover" />
                  </div>
                </div>
              </div>
            </section>

            {/* Resultados */}
            <section className="py-16 sm:py-20 bg-gray-50">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    Franqueados que já são casos de sucesso
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-600">
                    Histórias reais de empreendedores que transformaram suas vidas
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                  {resultados.map((resultado, index) => <div key={index} className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                      <div className="text-center space-y-4">
                        <img src={resultado.foto} alt={resultado.nome} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto object-cover" />
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                            {resultado.nome}
                          </h3>
                          <p className="text-agendaja-primary font-medium text-sm sm:text-base">
                            {resultado.cidade}
                          </p>
                        </div>
                        <p className="text-gray-600 font-medium text-sm sm:text-base">
                          {resultado.resultado}
                        </p>
                        <div className="flex justify-center text-yellow-400">
                          {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />)}
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="py-16 sm:py-20 bg-agendaja-primary">
              <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Pronto para ser o próximo caso de sucesso?
                  </h2>
                  <p className="text-lg sm:text-xl text-white/90">
                    Preencha o formulário e receba o plano de negócios completo
                  </p>
                </div>

                {submitted ? <div className="bg-white/10 border border-white/20 text-white p-6 sm:p-8 rounded-2xl text-center">
                    <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">Solicitação enviada!</h3>
                    <p className="text-base sm:text-lg">
                      Você receberá o plano de negócios completo em até 2 horas no seu email.
                    </p>
                  </div> : showForm ? <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <Label htmlFor="nome" className="text-gray-700 font-semibold text-sm sm:text-base">
                          Nome Completo *
                        </Label>
                        <Input id="nome" placeholder="Seu nome completo" required className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-700 font-semibold text-sm sm:text-base">
                          Email *
                        </Label>
                        <Input id="email" type="email" placeholder="seu@email.com" required className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="telefone" className="text-gray-700 font-semibold text-sm sm:text-base">
                          Telefone/WhatsApp *
                        </Label>
                        <Input id="telefone" placeholder="(11) 99999-9999" required className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="cidade" className="text-gray-700 font-semibold text-sm sm:text-base">
                          Cidade de Interesse *
                        </Label>
                        <Input id="cidade" placeholder="Qual cidade você gostaria?" required className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="investimento" className="text-gray-700 font-semibold text-sm sm:text-base">
                          Capital Disponível
                        </Label>
                        <Input id="investimento" placeholder="R$ 50.000" className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="experiencia" className="text-gray-700 font-semibold text-sm sm:text-base">
                          Experiência Profissional
                        </Label>
                        <Input id="experiencia" placeholder="Área de atuação" className="mt-2" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full mt-6 sm:mt-8 bg-agendaja-primary hover:bg-agendaja-secondary text-white text-base sm:text-lg py-3 sm:py-4 shadow-lg" size="lg">
                      Receber Plano de Negócios
                      <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </form> : <div className="text-center">
                    <Button size="lg" className="bg-white text-agendaja-primary hover:bg-agendaja-light text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 shadow-lg" onClick={() => setShowForm(true)}>
                      Solicitar Plano de Negócios
                      <ArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                  </div>}
              </div>
            </section>
        </div>;
};

export default SejaFranqueado;
