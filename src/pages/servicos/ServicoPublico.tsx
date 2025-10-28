import { Button } from "@/components/ui/button";
import HeaderVendas from "@/components/vendas/HeaderVendas";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Login from "@/pages/auth/Login";
import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { 
  Stethoscope, 
  TestTube, 
  Scan, 
  FileCheck,
  LucideIcon 
} from "lucide-react";

interface ServicoConfig {
  titulo: string;
  descricao: string;
  icone: LucideIcon;
  items: string[];
  buttonText: string;
  layout: 'grid' | 'tags';
}

const SERVICOS_CONFIG: Record<string, ServicoConfig> = {
  'consultas-medicas': {
    titulo: 'Consultas Médicas',
    descricao: 'Oferecemos uma ampla gama de especialidades médicas para cuidar da sua saúde de forma completa e acessível. Agende sua consulta com profissionais qualificados.',
    icone: Stethoscope,
    buttonText: 'Agendar Consulta',
    layout: 'grid',
    items: [
      "Alergia e Imunologia",
      "Cardiologia", 
      "Dermatologia",
      "Endocrinologia e Metabologia",
      "Endoscopia",
      "Gastroenterologia",
      "Geriatria",
      "Ginecologia e Obstetrícia",
      "Hematologia e Hemoterapia",
      "Infectologia",
      "Mastologia",
      "Nefrologia",
      "Neurologia",
      "Nutrologia",
      "Oftalmologia",
      "Oncologia Clínica",
      "Ortopedia e Traumatologia",
      "Otorrinolaringologia",
      "Pediatria",
      "Pneumologia",
      "Psiquiatria",
      "Reumatologia",
      "Urologia"
    ]
  },
  'exames-laboratoriais': {
    titulo: 'Exames Laboratoriais',
    descricao: 'Realize seus exames laboratoriais com rapidez e segurança em nossa rede de parceiros. Resultados precisos para um diagnóstico confiável.',
    icone: TestTube,
    buttonText: 'Agendar Exame Laboratorial',
    layout: 'tags',
    items: [
      "Hemograma Completo",
      "Colesterol Total e Frações",
      "Glicemia de Jejum",
      "Exame de Urina",
      "Exame de Fezes",
      "TSH e T4 Livre"
    ]
  },
  'exames-de-imagem': {
    titulo: 'Exames de Imagem',
    descricao: 'Diagnósticos precisos com tecnologia de ponta. Contamos com equipamentos modernos e profissionais especializados para realizar seus exames de imagem.',
    icone: Scan,
    buttonText: 'Agendar Exame de Imagem',
    layout: 'tags',
    items: [
      "Raio-X",
      "Ultrassonografia",
      "Tomografia Computadorizada",
      "Ressonância Magnética",
      "Mamografia",
      "Densitometria Óssea"
    ]
  },
  'outros-exames': {
    titulo: 'Outros Exames',
    descricao: 'Procedimentos especializados para diagnóstico e acompanhamento da sua saúde. Nossa equipe está preparada para realizar diversos tipos de exames com segurança e precisão.',
    icone: FileCheck,
    buttonText: 'Agendar Exame',
    layout: 'tags',
    items: [
      "Endoscopia Digestiva",
      "Colonoscopia",
      "Eletrocardiograma (ECG)",
      "Teste Ergométrico",
      "Espirometria",
      "Holter 24h"
    ]
  }
};

const ServicoPublico = () => {
  const { categoria } = useParams<{ categoria: string }>();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const config = categoria ? SERVICOS_CONFIG[categoria] : null;

  if (!config) {
    return <Navigate to="/" replace />;
  }

  const Icon = config.icone;

  const handleAbrirLogin = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="bg-background min-h-screen">
      <HeaderVendas onAbrirLogin={handleAbrirLogin} />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary mb-4">{config.titulo}</h1>
        <p className="text-lg text-muted-foreground mb-8">{config.descricao}</p>
        
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-foreground">
            {config.layout === 'grid' ? 'Especialidades Disponíveis' : 'Principais Exames'}
          </h2>
          
          {config.layout === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {config.items.map(item => (
                <div 
                  key={item} 
                  className="flex items-center p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-card cursor-default"
                >
                  <Icon className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                  <span className="font-medium text-card-foreground text-sm">{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {config.items.map(item => (
                <span 
                  key={item} 
                  className="bg-primary/10 text-primary font-medium py-2 px-4 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <Button 
          size="lg"
          onClick={() => window.location.href = '/hub/agendamentos'}
        >
          {config.buttonText}
        </Button>
      </main>
      
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="max-w-md p-0 bg-transparent shadow-none border-none">
          <div className="bg-card rounded-lg shadow-lg p-0">
            <Login />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicoPublico;
