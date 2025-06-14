
import { Button } from "@/components/ui/button";
import HeaderVendas from "@/components/vendas/HeaderVendas";

const exames = ["Hemograma Completo", "Colesterol Total e Frações", "Glicemia de Jejum", "Exame de Urina", "Exame de Fezes", "TSH e T4 Livre"];

const ExamesLaboratoriais = () => {
    const handleAgendar = () => {
        const phone = "5511999999999"; // TODO: Substituir pelo número de WhatsApp da empresa
        const message = "Olá! Gostaria de agendar um exame laboratorial.";
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="bg-white min-h-screen">
            <HeaderVendas />
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
                <Button size="lg" onClick={handleAgendar}>
                    Agendar Exame Laboratorial
                </Button>
            </main>
        </div>
    );
}

export default ExamesLaboratoriais;
