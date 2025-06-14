
import { Button } from "@/components/ui/button";
import HeaderVendas from "@/components/vendas/HeaderVendas";
import { useNavigate } from "react-router-dom";

const especialidades = ["Cardiologia", "Dermatologia", "Ginecologia", "Oftalmologia", "Ortopedia", "Pediatria", "Psicologia", "Urologia"];

const ConsultasMedicas = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-white min-h-screen">
            <HeaderVendas />
            <main className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-agendaja-primary mb-4">Consultas Médicas</h1>
                <p className="text-lg text-gray-600 mb-8">Oferecemos uma ampla gama de especialidades médicas para cuidar da sua saúde de forma completa e acessível. Agende sua consulta com profissionais qualificados.</p>
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Especialidades Disponíveis:</h2>
                    <div className="flex flex-wrap gap-2">
                        {especialidades.map(especialidade => (
                            <span key={especialidade} className="bg-agendaja-light text-agendaja-primary font-medium py-1 px-3 rounded-full">{especialidade}</span>
                        ))}
                    </div>
                </div>
                <Button size="lg" onClick={() => navigate('/conversas')}>
                    Agendar Consulta
                </Button>
            </main>
        </div>
    );
}

export default ConsultasMedicas;
