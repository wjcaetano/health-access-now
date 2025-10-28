import { Button } from "@/components/ui/button";
import HeaderVendas from "@/components/vendas/HeaderVendas";
import { Stethoscope } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Login from "@/pages/auth/Login";
import { useState } from "react";

const especialidades = [
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
];

const ConsultasMedicas = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleAbrirLogin = () => {
        setShowLoginModal(true);
    };

    return (
        <div className="bg-white min-h-screen">
            <HeaderVendas onAbrirLogin={handleAbrirLogin} />
            <main className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-agendaja-primary mb-4">Consultas Médicas</h1>
                <p className="text-lg text-gray-600 mb-8">Oferecemos uma ampla gama de especialidades médicas para cuidar da sua saúde de forma completa e acessível. Agende sua consulta com profissionais qualificados.</p>
                <div className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-gray-800">Especialidades Disponíveis</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {especialidades.map(especialidade => (
                            <div key={especialidade} className="flex items-center p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white cursor-default">
                                <Stethoscope className="h-5 w-5 mr-3 text-agendaja-primary flex-shrink-0" />
                                <span className="font-medium text-gray-700 text-sm">{especialidade}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/hub/agendamentos'}
                >
                  Agendar Consulta
                </Button>
            </main>
            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogContent className="max-w-md p-0 bg-transparent shadow-none border-none">
                    <div className="bg-white rounded-lg shadow-lg p-0">
                        <Login />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ConsultasMedicas;
