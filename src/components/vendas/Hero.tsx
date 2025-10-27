import { Button } from "@/components/ui/button";
import { User, Play, CheckCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="w-full px-4 pt-20 pb-16 bg-gradient-to-br from-agendaja-background via-agendaja-surface to-agendaja-light">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Lado esquerdo - Conteúdo */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-agendaja-primary/10 rounded-full text-agendaja-primary font-medium text-sm border border-agendaja-border">
                <CheckCircle className="w-4 h-4 mr-2" />
                Plataforma #1 em agendamentos de saúde
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-agendaja-text-primary leading-tight">
                Agende consultas e exames com{" "}
                <span className="text-agendaja-primary">economia</span> e{" "}
                <span className="text-agendaja-secondary">praticidade</span>
              </h1>
              <p className="text-xl text-agendaja-text-secondary max-w-2xl mx-auto lg:mx-0">
                Sem mensalidades, sem complicação. Pague apenas quando usar e economize até 
                <span className="font-bold text-agendaja-primary"> 60% nos seus cuidados de saúde</span>.
              </p>
            </div>

            {/* Benefícios rápidos */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="flex items-center text-agendaja-text-primary">
                <CheckCircle className="w-5 h-5 text-agendaja-success mr-2" />
                <span>Sem mensalidades</span>
              </div>
              <div className="flex items-center text-agendaja-text-primary">
                <CheckCircle className="w-5 h-5 text-agendaja-success mr-2" />
                <span>Até 60% de economia</span>
              </div>
              <div className="flex items-center text-agendaja-text-primary">
                <CheckCircle className="w-5 h-5 text-agendaja-success mr-2" />
                <span>Rede particular próxima</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="text-lg px-8 py-4 bg-gradient-to-r from-agendaja-primary to-agendaja-secondary text-white hover:from-agendaja-primary/90 hover:to-agendaja-secondary/90 shadow-lg transition-all duration-300 hover:scale-105 border-none" 
                onClick={() => window.location.href = '/unidade/agendamentos'}
              >
                <User className="mr-2 w-5 h-5" /> 
                Agendar Agora
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 border-2 border-agendaja-primary text-agendaja-primary bg-agendaja-surface hover:bg-agendaja-primary hover:text-white transition-all duration-300" 
                onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="mr-2 w-5 h-5" />
                Como Funciona
              </Button>
            </div>

            {/* Social proof */}
            <div className="pt-8 border-t border-agendaja-border">
              <p className="text-sm text-agendaja-text-secondary mb-4">Mais de 50.000 pessoas já confiaram na Agenda Já</p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <img 
                      key={i} 
                      src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${20 + i}.jpg`} 
                      alt="Cliente satisfeito" 
                      className="w-10 h-10 rounded-full border-2 border-agendaja-surface" 
                    />
                  ))}
                </div>
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map(i => <span key={i}>⭐</span>)}
                </div>
                <span className="text-sm text-agendaja-text-secondary">4.9/5 (2.4k avaliações)</span>
              </div>
            </div>
          </div>

          {/* Lado direito - Imagem */}
          <div className="relative lg:mt-0 mt-12">
            <div className="relative z-10">
              <img 
                alt="Família feliz e saudável" 
                className="w-full h-auto rounded-2xl shadow-2xl" 
                src="/lovable-uploads/62ef4ecf-40de-4ea2-a21e-ed31123e2898.jpg" 
              />
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 lg:-bottom-8 lg:-left-8 bg-agendaja-surface p-4 sm:p-6 rounded-xl shadow-xl border border-agendaja-border max-w-[280px] sm:max-w-xs">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-agendaja-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-agendaja-success" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-agendaja-text-primary text-sm sm:text-base">Consulta Agendada!</p>
                    <p className="text-xs sm:text-sm text-agendaja-text-secondary">Economia de R$ 150,00</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-agendaja-primary/20 to-agendaja-secondary/20 rounded-2xl transform rotate-3 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
