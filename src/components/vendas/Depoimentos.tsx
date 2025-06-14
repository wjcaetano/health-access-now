
const depoimentos = [
  {
    nome: "Maria Souza",
    texto: "Economizei tempo e dinheiro! Marquei meus exames rapidinho e sem dor de cabeça.",
    foto: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    nome: "Carlos Silva",
    texto: "Ótimo atendimento da equipe e preços excelentes, recomendo a todos os amigos.",
    foto: "https://randomuser.me/api/portraits/men/76.jpg",
  },
  {
    nome: "Aline Ramos",
    texto: "Gostei muito da plataforma, fácil de usar e consegui ser atendida rápido.",
    foto: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const Depoimentos = () => (
  <section className="w-full bg-white py-12 px-4">
    <h2 className="text-3xl font-semibold text-center mb-10">O que dizem nossos clientes</h2>
    <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
      {depoimentos.map((dep, i) => (
        <div
          key={i}
          className="flex flex-col items-center bg-agendaja-light rounded-xl shadow p-6 max-w-xs"
        >
          <img
            src={dep.foto}
            alt={`Foto de ${dep.nome}`}
            className="w-16 h-16 rounded-full mb-3 shadow-md object-cover"
          />
          <p className="text-gray-600 italic mb-2">&quot;{dep.texto}&quot;</p>
          <span className="font-bold text-agendaja-primary">{dep.nome}</span>
        </div>
      ))}
    </div>
  </section>
);

export default Depoimentos;
