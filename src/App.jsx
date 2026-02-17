import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, History, X, Globe, Zap, Cpu, Palette, BarChart3, ChevronLeft, ChevronRight, ArrowUpRight, Layers, Bot } from 'lucide-react';

const LILA_REAL = "#6040F1"; 

const PROJECTS_DATA = [
  { id: 1, title: "Plataforma Core Banking", desc: "Modernización de infraestructura legacy para banca digital.", color: "from-indigo-500/20" },
  { id: 2, title: "Ecosistema Retail AR", desc: "Experiencia de compra inmersiva usando Realidad Aumentada.", color: "from-purple-500/20" },
  { id: 3, title: "AI Analytics Dashboard", desc: "Predicción de churn y modelos de comportamiento de usuario.", color: "from-blue-500/20" },
  { id: 4, title: "Brand Identity 360", desc: "Rediseño global de marca y sistemas de diseño escalables.", color: "from-violet-500/20" },
];

const SKILLS_DATA = [
  { id: 1, name: "Estratégico", role: "Consultoría Senior", icon: <Globe size={26}/> },
  { id: 2, name: "Desarrollo", role: "Arquitectura Cloud", icon: <Cpu size={26}/> },
  { id: 3, name: "Creative", role: "Design Systems", icon: <Palette size={26}/> },
  { id: 4, name: "Data", role: "ML & Analytics", icon: <BarChart3 size={26}/> },
];

function App() {
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [currentChat, setCurrentChat] = useState({ 
    user: null, 
    ai: 'Sistema activo. Describe tu proyecto para asignar equipo.' 
  });
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    if (currentChat.user) setHistory(prev => [{ ...currentChat, id: Date.now() }, ...prev].slice(0, 5));
    setCurrentChat({ user: input, ai: null });
    setInput('');
    setIsTyping(true);
    setShowResults(false);

    setTimeout(() => {
      setIsTyping(false);
      setCurrentChat(prev => ({ ...prev, ai: 'He encontrado casos que coinciden con tu búsqueda.' }));
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center pt-10 text-white relative pb-20 px-6 overflow-x-hidden" 
         style={{ background: `linear-gradient(to top right, #110929 0%, #0A0A0A 50%, #0A0A0A 100%)` }}>
      
      {/* 1. HERO BANNER */}
      <motion.header className="w-full max-w-5xl text-center mb-10">
        <h1 className="text-[100px] leading-none tracking-[-0.05em] mrm-bold text-white uppercase select-none">MRM</h1>
        <p className="text-[10px] uppercase tracking-[0.9em] text-gray-600 mt-4 inter-light">Creative Credentials</p>
      </motion.header>

      {/* 2. CHAT AREA */}
      <div className="w-full max-w-5xl flex flex-col space-y-6 z-20 px-4">
        
        {/* BURBUJA USUARIO (Derecha - Lila sólido) */}
        <AnimatePresence>
          {currentChat.user && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="self-end py-2.5 px-6 rounded-2xl rounded-tr-none bg-[#6040F1] text-white text-[12px] mrm-bold shadow-lg shadow-[#6040F1]/20">
              {currentChat.user}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENEDOR IA (Izquierda) */}
        <div className="w-full flex justify-start">
          <AnimatePresence mode="wait">
            {isTyping ? (
              <div className="flex gap-2 p-4 ml-12">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-2 rounded-full bg-[#6040F1]" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-2 h-2 rounded-full bg-[#6040F1]" />
              </div>
            ) : (
              <motion.div 
                className={`flex gap-6 rounded-[2.5rem] border backdrop-blur-md transition-all duration-500 overflow-hidden ${showResults ? 'w-full p-8' : 'w-auto max-w-lg p-5'}`}
                style={{ borderColor: `${LILA_REAL}33`, backgroundColor: `rgba(255, 255, 255, 0.02)` }}
              >
                {/* ICONO SISTEMA */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6040F1]/40 to-transparent flex-shrink-0 flex items-center justify-center border border-white/10">
                  <Bot size={28} className="text-[#6040F1]" />
                </div>

                {/* CONTENIDO TEXTO / RESULTADOS */}
                <div className="flex flex-col justify-center flex-1">
                  <h2 className={`mrm-bold text-white uppercase tracking-tight ${showResults ? 'text-xl mb-6' : 'text-[14px]'}`}>
                    {currentChat.ai}
                  </h2>

                  {/* GRID DE RESULTADOS */}
                  <AnimatePresence>
                    {showResults && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {PROJECTS_DATA.map((proj) => (
                          <div key={proj.id} className="flex gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-[#6040F1]/50 transition-all group">
                            <div className={`w-16 h-16 rounded-xl flex-shrink-0 bg-gradient-to-br ${proj.color} to-transparent border border-white/5 flex items-center justify-center`}>
                              <Layers size={18} className="text-white/20 group-hover:text-[#6040F1] transition-colors" />
                            </div>
                            <div className="flex flex-col justify-center flex-1">
                              <h3 className="text-[11px] mrm-bold uppercase leading-none tracking-tight">{proj.title}</h3>
                              <p className="text-[10px] text-gray-500 inter-light mt-1.5 leading-tight">{proj.desc}</p>
                              {/* BOTON VER DETALLES */}
                              <button className="text-[9px] uppercase text-[#6040F1] mrm-bold mt-3 flex items-center gap-1.5 hover:text-white transition-colors">
                                Ver Detalles <ArrowUpRight size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* INPUT */}
        <div className="w-full flex justify-center pt-6">
          <div className="w-full max-w-xl flex items-center bg-white/[0.04] border border-white/10 rounded-full px-6 py-3 focus-within:border-[#6040F1]/50 transition-all backdrop-blur-md shadow-2xl">
            <input 
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe tu consulta aquí..."
              className="bg-transparent flex-1 outline-none text-[13px] text-white/70 py-1"
            />
            <button onClick={handleSendMessage} className="ml-3 w-9 h-9 rounded-full flex items-center justify-center bg-[#6040F1] hover:scale-105 transition-transform shadow-lg shadow-[#6040F1]/30">
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. SKILLS CAROUSEL ABAJO */}
      <div className="mt-16 flex flex-col items-center space-y-4">
        <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 inter-light">Global Skill Network</p>
        <div className="flex items-center gap-6">
          <ChevronLeft onClick={() => setCurrentIndex(prev => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length)} className="opacity-20 hover:opacity-100 cursor-pointer" />
          <div className="w-60 p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#6040F1]/10 flex items-center justify-center text-[#6040F1]">{SKILLS_DATA[currentIndex].icon}</div>
            <div className="text-left leading-tight">
              <p className="text-[10px] uppercase text-white/80 mrm-bold">{SKILLS_DATA[currentIndex].name}</p>
              <p className="text-[9px] text-gray-600 inter-light uppercase">{SKILLS_DATA[currentIndex].role}</p>
            </div>
          </div>
          <ChevronRight onClick={() => setCurrentIndex(prev => (prev + 1) % SKILLS_DATA.length)} className="opacity-20 hover:opacity-100 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

export default App;