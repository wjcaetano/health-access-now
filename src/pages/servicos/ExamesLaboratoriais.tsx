import { Button } from "@/components/ui/button";
import HeaderVendas from "@/components/vendas/HeaderVendas";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import SelecaoUnidadeModal from "@/components/vendas/SelecaoUnidadeModal";
import Login from "@/pages/auth/Login";
import { useState } from "react";

const exames = ["Hemograma Completo", "Colesterol Total e Frações", "Glicemia de Jejum", "Exame de Urina", "Exame de Fezes", "TSH e T4 Livre"];

const ExamesLaboratoriais = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleAbrirLogin = () => {
        setShowLoginModal(true);
    };

    return (
        <div className="bg-white min-h-screen">
            <HeaderVendas onAbrirLogin={handleAbrirLogin} />
            <main className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-agendaja-primary mb-4">Exames Laboratoriais</h1>
                <p className="text-lg text-gray-600 mb-8">Realize seus exames laboratoriais com rapidez e segurança em nossa rede de parceiros. Resultados precisos para um diagnóstico confiável.</p>
                 <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Principais Exames:</h2>
                    <div className="flex flex-wrap gap-2">
                        {exames.map(exame => (
                            <span key={exame} className="bg-agendaja-light text-agendaja-primary font-medium py-1 px-3 rounded-full">{exame}</span>
                        ))}
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="lg">
                            Agendar Exame Laboratorial
                        </Button>
                    </DialogTrigger>
                    <SelecaoUnidadeModal tipoServico="Exame Laboratorial" />
                </Dialog>
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

export default ExamesLaboratoriais;
