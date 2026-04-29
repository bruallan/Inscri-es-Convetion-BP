import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';
import bgConvention from './assets/bg_convention.jpg';

const CARGOS = [
  "Franqueado(a)",
  "Gestor(a)",
  "Injetor(a)",
  "Gerente Comercial",
  "Consultor(a) Comercial"
];

const UNIDADES = [
  "Botopremium Alagoinhas BA",
  "Botopremium Aracaju SE Aruana",
  "Botopremium Aracaju SE Jardins",
  "Botopremium Araguaína TO Centro",
  "Botopremium Arapiraca AL",
  "Botopremium Araripina PE",
  "Botopremium Bacabal MA",
  "Botopremium Balsas MA",
  "Botopremium Barueri SP Parque Shopping Barueri",
  "Botopremium Belo Horizonte MG Pampulha",
  "Botopremium Campinas SP Conceição",
  "Botopremium Caratinga MG",
  "Botopremium Delmiro Gouveia AL",
  "Botopremium Duque de Caxias RJ Centro",
  "Botopremium Feira de Santana BA Sim",
  "Botopremium Floriano PI Centro",
  "Botopremium Fortaleza CE Aldeota",
  "Botopremium Goiânia GO Setor Bueno",
  "Botopremium Goiânia GO Vila Rosa",
  "Botopremium Icó CE",
  "Botopremium Iguatu CE",
  "Botopremium Irecê BA",
  "Botopremium Itapema SC",
  "Botopremium Jacobina BA",
  "Botopremium Jequié BA",
  "Botopremium João Monlevade MG",
  "Botopremium João Pessoa PB Bancários",
  "Botopremium João Pessoa PB Manaíra",
  "Botopremium Joinville SC América",
  "Botopremium Juazeiro do Norte CE",
  "Botopremium Lagarto SE",
  "Botopremium Lauro De Freitas BA",
  "Botopremium Maceió AL Ponta Verde",
  "Botopremium Maceió AL Serraria",
  "Botopremium Mirassol SP",
  "Botopremium Mossoró RN",
  "Botopremium Niterói RJ Icaraí",
  "Botopremium Nova Iguaçu RJ Centro",
  "Botopremium Palmas TO Plano Diretor Sul",
  "Botopremium Patos PB",
  "Botopremium Paulínia SP",
  "Botopremium Paulo Afonso BA",
  "Botopremium Petrolina PE A Definir",
  "Botopremium Petrolina PE Areia Branca",
  "Botopremium Picos PI",
  "Botopremium Porto Alegre RS Moinhos de Vento",
  "Botopremium Quixeramobim CE",
  "Botopremium Recife PE Graças",
  "Botopremium Ribeira do Pombal BA",
  "Botopremium Ribeirão Preto SP Alto da Boa Vista",
  "Botopremium Ribeirão Preto SP Campos Elísios",
  "Botopremium Rio de Janeiro RJ Barra Olímpica",
  "Botopremium Rio de Janeiro RJ Botafogo",
  "Botopremium Rio de Janeiro RJ Downtown",
  "Botopremium Rio de Janeiro RJ Ipanema",
  "Botopremium Rio de Janeiro RJ Largo do Machado",
  "Botopremium Rio de Janeiro RJ Recreio Shopping",
  "Botopremium Rio de Janeiro RJ Shopping Novo Leblon",
  "Botopremium Salvador BA Barra Ondina",
  "Botopremium Salvador BA Brotas",
  "Botopremium Salvador BA Imbuí",
  "Botopremium Salvador BA Shopping Capemi",
  "Botopremium Santa Inês MA",
  "Botopremium São João de Meriti RJ Grande Rio Shopping",
  "Botopremium São José do Rio Preto SP Redentora",
  "Botopremium São Paulo SP Água Fria",
  "Botopremium São Paulo SP Campo Belo",
  "Botopremium São Paulo SP Pinheiros",
  "Botopremium Serrinha BA",
  "Botopremium Simão Dias SE",
  "Botopremium Sousa PB",
  "Botopremium Tangará da Serra MT",
  "Botopremium Tauá CE",
  "Botopremium Teresina PI Itararé",
  "Botopremium Teresina PI Jóquei",
  "Botopremium Tobias Barreto SE",
  "Botopremium Uberlândia MG Centro",
  "Botopremium Uberlândia MG Santa Mônica",
  "Botopremium Vacaria RS",
  "Botopremium Vitória da Conquista BA Centro",
  "Botopremium Votuporanga SP Centro"
];

const desktopLayout: Record<string, any> = {
  "nao-e-mais-segredo": { x: "60.86%", y: "12.01%", width: "25.56%", height: "7.41%", fontSize: 5.5, justify: "flex-start" },
  "botopremium": { x: "65.45%", y: "30.08%", width: "17.53%", height: "4.24%", fontSize: 3.2, justify: "flex-start" },
  "convention": { x: "66.64%", y: "34.03%", width: "16.08%", height: "4.08%", fontSize: 3.2, justify: "flex-start" },
  "selecao": { x: "63.17%", y: "42.75%", width: "23.5%", height: "7.0%", fontSize: 10.9, justify: "flex-start" },
  "premium": { x: "62.19%", y: "53.96%", width: "24.05%", height: "7.11%", fontSize: 10.9, justify: "flex-start" },
  "sao": { x: "5.91%", y: "61.18%", width: "10.0%", height: "6.5%", fontSize: 9.8, justify: "flex-start" },
  "paulo": { x: "5.84%", y: "71.00%", width: "14.0%", height: "6.5%", fontSize: 9.8, justify: "flex-start" },
  "2026": { x: "5.91%", y: "78.88%", width: "7.45%", height: "6.66%", fontSize: 4.6, justify: "flex-start" },
  "maio": { x: "52.16%", y: "62.67%", width: "8.96%", height: "6.05%", fontSize: 4.8, justify: "flex-start" },
  "26": { x: "50.10%", y: "70.45%", width: "11.0%", height: "15.0%", fontSize: 22.0, justify: "flex-start" },
  "vespera": { x: "62.91%", y: "72.25%", width: "18.98%", height: "3.48%", fontSize: 2.8, justify: "flex-start" },
  "harmonizacao": { x: "62.98%", y: "76.15%", width: "19.57%", height: "2.72%", fontSize: 2.8, justify: "flex-start" },
  "fullface": { x: "62.91%", y: "79.61%", width: "8.57%", height: "3.03%", fontSize: 2.8, justify: "flex-start" },
  "inscreva-se": { x: "62.91%", y: "85.00%", width: "20.0%", height: "6.0%", fontSize: 2.5, justify: "flex-start" },
};

const mobileLayout: Record<string, any> = {
  "nao-e-mais-segredo": { x: "0%", y: "10%", width: "100%", height: "5%", fontSize: 3.5, justify: "center" },
  "botopremium": { x: "0%", y: "20%", width: "100%", height: "4%", fontSize: 2.2, justify: "center" },
  "convention": { x: "0%", y: "24%", width: "100%", height: "4%", fontSize: 2.2, justify: "center" },
  "selecao": { x: "0%", y: "30%", width: "100%", height: "8%", fontSize: 7.5, justify: "center" },
  "premium": { x: "0%", y: "38%", width: "100%", height: "8%", fontSize: 7.5, justify: "center" },
  "sao": { x: "10%", y: "52%", width: "40%", height: "6%", fontSize: 6.5, justify: "flex-start" },
  "paulo": { x: "10%", y: "58%", width: "40%", height: "6%", fontSize: 6.5, justify: "flex-start" },
  "2026": { x: "10%", y: "65%", width: "40%", height: "4%", fontSize: 3.5, justify: "flex-start" },
  "maio": { x: "50%", y: "54%", width: "40%", height: "5%", fontSize: 3.5, justify: "flex-end" },
  "26": { x: "50%", y: "59%", width: "40%", height: "12%", fontSize: 16.0, justify: "flex-end" },
  "vespera": { x: "0%", y: "74%", width: "100%", height: "3%", fontSize: 2.2, justify: "center" },
  "harmonizacao": { x: "0%", y: "77%", width: "100%", height: "3%", fontSize: 2.2, justify: "center" },
  "fullface": { x: "0%", y: "80%", width: "100%", height: "3%", fontSize: 2.2, justify: "center" },
  "inscreva-se": { x: "10%", y: "86%", width: "80%", height: "7%", fontSize: 3.0, justify: "center" },
};

const FixedElement = ({ id, layout, children, delay = 0, initialX = 0, initialY = 0 }: any) => {
  const config = layout[id];
  if (!config) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: initialX, y: initialY }} 
      animate={{ opacity: 1, x: 0, y: 0 }} 
      transition={{ duration: 1, delay }}
      className="absolute flex items-center z-10"
      style={{ 
        left: config.x, 
        top: config.y, 
        width: config.width, 
        height: config.height,
        fontSize: `${config.fontSize}cqh`,
        justifyContent: config.justify || 'flex-start'
      }}
    >
      {children}
    </motion.div>
  );
};

const VerticalVideoPlayer = ({ videoId }: { videoId: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div 
      ref={ref} 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative w-full max-w-[300px] md:max-w-[340px] aspect-[9/16] rounded-2xl overflow-hidden border border-gold-500/20 shadow-[0_0_40px_rgba(212,175,55,0.1)] bg-black"
    >
      {isInView ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&playsinline=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  );
};

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    rg: '',
    phone: '',
    email: '',
    role: '',
    unit: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Optimized Background Loader
    const loadBackground = async () => {
      try {
        const response = await fetch(bgConvention);
        if (!response.ok) throw new Error('Network response error');
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        
        const img = new Image();
        img.onload = () => {
          setBgUrl(objectURL);
          console.log("BACKGROUND: Final render successful via Blob.");
        };
        img.onerror = () => {
          console.error("BACKGROUND: File data is unreadable by this browser.");
        };
        img.src = objectURL;
      } catch (err) {
        console.error("BACKGROUND: Failed to initialize asset.", err);
      }
    };

    loadBackground();

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []); // Run once on mount

  const [bgUrl, setBgUrl] = useState<string>('');

  const layout = isMobile ? mobileLayout : desktopLayout;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      console.log("Enviando inscrição para:", formData.name);
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Falha ao enviar dados');
      }
      
      console.log("Inscrição concluída com sucesso!");
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Erro detalhado:", error);
      setErrorMessage(error.message || 'Ocorreu um erro ao enviar sua inscrição. Verifique se a planilha está configurada corretamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white selection:bg-gold-500 selection:text-white overflow-x-hidden">
      
      {/* Background Section - Priority Rendering */}
      <div 
        className="fixed inset-0 pointer-events-none bg-black"
        style={{ zIndex: -1 }}
      >
        <AnimatePresence>
          {bgUrl && (
            <motion.img 
              key={bgUrl}
              src={bgUrl} 
              alt="" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="w-full h-full object-cover object-center"
            />
          )}
        </AnimatePresence>
        
        {/* Luxury Overlays */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
      </div>

      {/* Hero Section Content */}
      <div className="relative z-10 w-full h-[100dvh] flex items-center justify-center">
        {/* 16:9 Container that scales to fit the screen perfectly */}
        <div 
          className="relative w-full md:aspect-video aspect-[9/16] max-h-[100dvh] mx-auto overflow-hidden" 
          style={{ containerType: 'size' }}
        >
           {/* 1. Elementos do Topo */}
        <FixedElement id="nao-e-mais-segredo" layout={layout} delay={0.2} initialX={50}>
          <h3 className="font-poppins font-medium text-white drop-shadow-lg leading-none whitespace-nowrap pointer-events-none" style={{ fontSize: '1em' }}>
            Não é mais segredo!
          </h3>
        </FixedElement>

        {/* 2. Bloco Central de Títulos (Lado Direito) */}
        <FixedElement id="botopremium" layout={layout} delay={0.3} initialX={50}>
          <p className="font-sans font-extralight tracking-[0.3em] text-white/90 uppercase drop-shadow-lg leading-none whitespace-nowrap pointer-events-none" style={{ fontSize: '1em' }}>
            BOTOPREMIUM
          </p>
        </FixedElement>
        <FixedElement id="convention" layout={layout} delay={0.4} initialX={50}>
          <p className="font-sans font-extralight tracking-[0.3em] text-white/90 uppercase drop-shadow-lg leading-none whitespace-nowrap pointer-events-none" style={{ fontSize: '1em' }}>
            CONVENTION
          </p>
        </FixedElement>

        <FixedElement id="selecao" layout={layout} delay={0.5} initialX={50}>
          <h1 className="font-aboreto bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-transparent drop-shadow-lg leading-none whitespace-nowrap pointer-events-none" style={{ fontSize: '1em' }}>
            SELEÇÃO
          </h1>
        </FixedElement>
        <FixedElement id="premium" layout={layout} delay={0.6} initialX={50}>
          <h1 className="font-aboreto bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-transparent drop-shadow-lg leading-none whitespace-nowrap pointer-events-none" style={{ fontSize: '1em' }}>
            PREMIUM
          </h1>
        </FixedElement>

        {/* 3. Bloco de Local e Ano (Canto Inferior Esquerdo) */}
        <FixedElement id="sao" layout={layout} delay={0.7} initialX={-50}>
          <h2 className="font-poppins font-medium text-white leading-none drop-shadow-lg whitespace-nowrap pointer-events-none" style={{ fontSize: '1em' }}>
            São
          </h2>
        </FixedElement>
        <FixedElement id="paulo" layout={layout} delay={0.8} initialX={-50}>
          <h2 className="font-poppins font-medium text-white leading-none drop-shadow-lg whitespace-nowrap pointer-events-none" style={{ fontSize: '1em' }}>
            Paulo
          </h2>
        </FixedElement>
        <FixedElement id="2026" layout={layout} delay={0.9} initialX={-50}>
          <p className="font-sans font-extralight text-white/90 tracking-widest drop-shadow-lg leading-none whitespace-nowrap pointer-events-none" style={{ fontSize: '1em' }}>
            2026
          </p>
        </FixedElement>

        {/* 4. Bloco de Data (Inferior Central) */}
        <FixedElement id="maio" layout={layout} delay={1.0} initialY={50}>
          <p className="font-sans font-extralight tracking-widest text-white/90 drop-shadow-lg leading-none whitespace-nowrap pointer-events-none" style={{ fontSize: '1em' }}>
            MAIO
          </p>
        </FixedElement>
        <FixedElement id="26" layout={layout} delay={1.1} initialY={50}>
          <p className="font-sans font-extralight leading-none text-white drop-shadow-lg whitespace-nowrap pointer-events-none" style={{ fontSize: '1em' }}>
            26
          </p>
        </FixedElement>

        {/* 5. Bloco de Descrição (Canto Inferior Direito) */}
        <FixedElement id="vespera" layout={layout} delay={1.2} initialX={50}>
          <p className="font-poppins font-medium text-white/90 leading-none drop-shadow-lg whitespace-nowrap pointer-events-none" style={{ fontSize: '1em' }}>
            Véspera do Maior evento de
          </p>
        </FixedElement>
        <FixedElement id="harmonizacao" layout={layout} delay={1.3} initialX={50}>
          <p className="font-poppins font-medium text-white/90 leading-none drop-shadow-lg whitespace-nowrap pointer-events-none" style={{ fontSize: '1em' }}>
            harmonização facial do Brasil
          </p>
        </FixedElement>
        <FixedElement id="fullface" layout={layout} delay={1.4} initialX={50}>
          <p className="font-poppins font-medium text-white/90 leading-none drop-shadow-lg whitespace-nowrap pointer-events-none" style={{ fontSize: '1em' }}>
            (Full face 2026)
          </p>
        </FixedElement>

        {/* Botão Inscreva-se */}
        <FixedElement id="inscreva-se" layout={layout} delay={1.5} initialY={20}>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white px-8 py-2 rounded-sm font-poppins font-medium tracking-wide transition-all shadow-lg shadow-gold-500/30 w-full h-full flex items-center justify-center pointer-events-auto"
            style={{ fontSize: '1em' }}
          >
            Inscreva-se
          </button>
        </FixedElement>

      </div>
      </div>

      {/* Videos Section */}
      <div className="w-full min-h-screen bg-zinc-950 relative z-10 mt-[100dvh] flex flex-col items-center justify-center py-20 px-4 border-t border-gold-500/20 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <div className="absolute inset-0 bg-gold-500/5 blur-3xl -z-10"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-aboreto text-3xl md:text-5xl text-gold-500 mb-4">Sinta a Experiência</h2>
          <p className="font-poppins text-white/70 text-sm md:text-base max-w-xl mx-auto">
            Um pouco do que você vai viver na maior convenção de harmonização facial do Brasil.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full max-w-5xl justify-center items-center">
          <VerticalVideoPlayer videoId="ZQs-scfJmTY" />
          <VerticalVideoPlayer videoId="gWa3V9L_jXY" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white px-12 py-4 rounded-sm font-poppins font-medium tracking-wide transition-all shadow-lg shadow-gold-500/30 text-lg"
          >
            Quero Garantir Minha Vaga
          </button>
        </motion.div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-zinc-950 border border-gold-500/30 text-white w-full max-w-4xl rounded-sm shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row my-8"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-20 bg-black/50 rounded-full p-1 border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Info Section - Simplified and Dark/Gold */}
              <div className="bg-black/50 p-8 md:w-2/5 border-b md:border-b-0 md:border-r border-gold-500/20 flex flex-col justify-center relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-0 w-full h-full bg-gold-500/5 blur-3xl -z-10"></div>

                <h3 className="font-aboreto text-2xl text-gold-500 mb-8">Botopremium<br/>Convention</h3>
                
                <div className="space-y-6 text-sm font-poppins">
                  <div>
                    <p className="text-gold-400 font-medium uppercase tracking-wider text-xs mb-1">Quando</p>
                    <p className="text-white/90">26 de Maio de 2026<br/>08h às 19h</p>
                  </div>

                  <div>
                    <p className="text-gold-400 font-medium uppercase tracking-wider text-xs mb-1">Onde</p>
                    <p className="text-white/90">Centro de Convenções<br/>Distrito Anhembi - SP</p>
                  </div>

                  <div className="pt-6 border-t border-gold-500/20">
                    <p className="text-gold-500 font-medium mb-2 flex items-center gap-2">
                      <span className="text-lg">💎</span> Passaporte Diamond
                    </p>
                    <p className="text-white/70 text-xs leading-relaxed">
                      Injetores ganham acesso gratuito ao 6º Congresso FullFace 2026 (27 a 30 de maio).<br/>
                      <span className="text-gold-500/70 text-[10px] block mt-2">*Limitado a 1 injetor por unidade.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Section - Dark Mode */}
              <div className="p-8 md:w-3/5 bg-zinc-950">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-16 h-16 bg-gold-500/10 text-gold-500 border border-gold-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-aboreto text-gold-500 mb-2">Inscrição Confirmada!</h3>
                    <p className="text-white/70 mb-8 font-poppins text-sm">
                      Sua vaga para a Seleção Premium 2026 foi reservada com sucesso.
                    </p>
                    <button 
                      onClick={() => {
                        setIsModalOpen(false);
                        setTimeout(() => {
                          setIsSuccess(false);
                          setFormData({ name: '', cpf: '', rg: '', phone: '', email: '', role: '', unit: '' });
                        }, 500);
                      }}
                      className="w-full bg-gold-500 hover:bg-gold-600 text-white py-3 rounded-sm font-poppins font-medium transition-colors"
                    >
                      Fechar
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h3 className="text-2xl font-aboreto text-gold-500 mb-1">Inscrição Oficial</h3>
                      <p className="text-xs text-white/50 font-poppins uppercase tracking-wider">Exclusivo para unidades franqueadas</p>
                    </div>

                    {errorMessage && (
                      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm font-poppins text-center">
                        {errorMessage}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1">Nome Completo</label>
                        <input 
                          type="text" required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all text-sm text-white placeholder-zinc-600"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1">CPF</label>
                          <input 
                            type="text" required
                            pattern="\d{3}\.?\d{3}\.?\d{3}-?\d{2}"
                            value={formData.cpf}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length > 11) val = val.slice(0, 11);
                              if (val.length > 9) val = val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                              else if (val.length > 6) val = val.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
                              else if (val.length > 3) val = val.replace(/(\d{3})(\d{1,3})/, '$1.$2');
                              setFormData({...formData, cpf: val});
                            }}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all text-sm text-white placeholder-zinc-600"
                            placeholder="000.000.000-00"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1">RG</label>
                          <input 
                            type="text" required
                            value={formData.rg}
                            onChange={(e) => setFormData({...formData, rg: e.target.value})}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all text-sm text-white placeholder-zinc-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1">Celular (WhatsApp)</label>
                          <input 
                            type="text" required
                            value={formData.phone}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length > 11) val = val.slice(0, 11);
                              if (val.length > 10) val = val.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                              else if (val.length > 6) val = val.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                              else if (val.length > 2) val = val.replace(/(\d{2})(\d{0,5})/, '($1) $2');
                              setFormData({...formData, phone: val});
                            }}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all text-sm text-white placeholder-zinc-600"
                            placeholder="(00) 00000-0000"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1">E-mail</label>
                          <input 
                            type="email" required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all text-sm text-white placeholder-zinc-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1">Cargo</label>
                        <select 
                          required
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all text-sm text-white appearance-none"
                        >
                          <option value="" disabled className="text-zinc-500">Selecione um cargo</option>
                          {CARGOS.map(cargo => (
                            <option key={cargo} value={cargo} className="bg-zinc-900 text-white">{cargo}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1">Unidade</label>
                        <select 
                          required
                          value={formData.unit}
                          onChange={(e) => setFormData({...formData, unit: e.target.value})}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all text-sm text-white appearance-none"
                        >
                          <option value="" disabled className="text-zinc-500">Selecione sua unidade</option>
                          {UNIDADES.map(unidade => (
                            <option key={unidade} value={unidade} className="bg-zinc-900 text-white">{unidade}</option>
                          ))}
                        </select>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-gold-500 hover:bg-gold-600 text-white py-3 rounded-sm font-poppins font-medium tracking-wide transition-colors mt-6 flex justify-center items-center disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          "ENVIAR INSCRIÇÃO"
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
