
import { Button } from "@/components/ui/button";
import HeaderVendas from "@/components/vendas/HeaderVendas";
import { useNavigate } from "react-router-dom";

const exames = ["Eletrocardiograma (ECG)", "Teste Ergométrico", "Endoscopia", "Colonoscopia", "MAPA 24h", "Holter 24h"];

const OutrosExames = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-white min-h-screen">
            <HeaderVendas />
            <main className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-agendaja-primary mb-4">Outros Exames</h1>
                <p className="text-lg text-gray-600 mb-8">Conheça outros procedimentos e exames disponíveis para um cuidado completo com a sua saúde.</p>
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Exames Adicionais:</h2>
                    <div className="flex flex-wrap gap-2">
                        {exames.map(exame => (
                            <span key={exame} className="bg-agendaja-light text-agendaja-primary font-medium py-1 px-3 rounded-full">{exame}</span>
                        ))}
                    </div>
                </div>
                <Button size="lg" onClick={() => navigate('/conversas')}>
                    Agendar Outro Exame
                </Button>
            </main>
        </div>
    );
}

export default OutrosExames;
