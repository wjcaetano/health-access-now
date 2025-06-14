
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full px-4 pt-16 pb-8 bg-white flex flex-col items-center text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-gray-800 drop-shadow-sm">
        Agende exames e consultas <span className="text-agendaja-primary">com rapidez</span> e <span className="text-agendaja-primary">preço justo</span>
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-600">
        Plataforma inteligente para facilitar sua vida e cuidar melhor de você.
      </p>
      <Button
        size="lg"
        className="text-lg bg-agendaja-primary text-white hover:bg-agendaja-primary/90 shadow-lg"
        onClick={() => navigate("/novo-cliente")}
      >
        <User className="mr-2" /> Agendar agora
      </Button>
      <div className="mt-10">
        <img
          src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
          alt="Saúde digital"
          className="max-h-64 w-full object-cover rounded-xl shadow-lg mx-auto"
        />
      </div>
    </section>
  );
};

export default Hero;
