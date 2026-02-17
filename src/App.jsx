import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, History, X, Globe, Zap, Cpu, Palette, BarChart3, ChevronLeft, ChevronRight, UserPlus, Layers } from 'lucide-react';

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
  const [currentChat, setCurrentChat] = useState({ user: null, ai: 'Sistema activo. Describe tu proyecto.' });
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
      setCurrentChat(prev => ({ ...prev, ai: 'Mira resultados y agrega talentos a tu equipo.' }));
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center pt-10 text-white relative pb-20 px-6 overflow-x-hidden" 
         style={{ background: `linear-gradient(to top right, #110929 0%, #0A0A0A 50%, #0A0A0A 100%)` }}>
      
      {/* 1. HERO BANNER */}
      <motion.header className="w-full max-w-5xl text-center mb-10">
        <h1 className="text-[110px] leading-none tracking-[-0.05em] select-none mrm-bold text-white uppercase">
          MRM
        </h1>
        <p className="text-[10px] uppercase tracking-[0.9em] text-gray-600 mt-4 inter-light">
          Creative Credentials
        </p>
      </motion.header>

      {/* 2. CHAT AREA */}
      <div className="w-full max-w-4xl flex flex-col items-center space-y-4 z-20">
        
        {/* BURBUJA USUARIO - PEQUEÑA */}
        <AnimatePresence>
          {currentChat.user && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              className="py-1 px-4 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 self-center inter-light uppercase tracking-wider">
              "{currentChat.user}"
            </motion.div>
          )}
        </AnimatePresence>

        {/* BURBUJA IA - ESTILIZADA Y DELGADA */}
        <div className="w-full flex justify-center">
          <AnimatePresence mode="wait">
            {isTyping ? (
              <div className="flex gap-2 p-2">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: LILA_REAL}} />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: LILA_REAL}} />
              </div>
            ) : (
              <motion.div 
                className={`w-full ${showResults ? 'max-w-4xl px-8 py-8' : 'max-w-xl px-6 py-4'} rounded-[2rem] border backdrop-blur-md shadow-xl transition-all duration-500 overflow-hidden`}
                style={{ 
                  borderColor: `${LILA_REAL}44`, 
                  backgroundColor: `rgba(96, 64, 241, 0.08)` // Un poco más claro para que se vea
                }}
              >
                <h2 className={`mrm-bold uppercase text-white/90 text-center ${showResults ? 'text-xl mb-8' : 'text-[14px]'}`}>
                  {currentChat.ai}
                </h2>

                {/* GRID DE RESULTADOS (SOLO APARECE SI HAY MATCH) */}
                <AnimatePresence>
                  {showResults && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {PROJECTS_DATA.map((proj) => (
                        <div key={proj.id} className="flex gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-[#6040F1]/60 transition-all group">
                          <div className={`w-20 h-20 rounded-xl flex-shrink-0 bg-gradient-to-br ${proj.color} to-transparent border border-white/5 flex items-center justify-center`}>
                            <Layers size={20} className="text-white/10 group-hover:text-[#6040F1]" />
                          </div>
                          <div className="flex flex-col justify-between py-1">
                            <div>
                              <h3 className="text-[12px] uppercase mrm-bold leading-tight">{proj.title}</h3>
                              <p className="text-[10px] text-gray-500 inter-light leading-snug mt-1">{proj.desc}</p>
                            </div>
                            <button className="flex items-center gap-2 mt-2 text-[9px] uppercase text-[#6040F1] mrm-bold">
                              <UserPlus size={10} /> Agregar
                            </button>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* INPUT REFINADO */}
        <div className="w-full max-w-xl relative pt-4">
          <div className="flex items-center bg-white/[0.04] border border-white/10 rounded-full px-6 py-2.5 focus-within:border-[#6040F1]/50 transition-all backdrop-blur-md">
            <input 
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describe tu proyecto..."
              className="bg-transparent flex-1 outline-none text-[12px] text-white/60 py-1"
            />
            <button onClick={handleSendMessage} className="ml-3 w-8 h-8 rounded-full flex items-center justify-center bg-[#6040F1] hover:scale-105 transition-transform">
              <Send size={12} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. SKILLS CAROUSEL */}
      <div className="mt-16 flex flex-col items-center space-y-4">
        <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 inter-light">Global Skill Network</p>
        <div className="flex items-center gap-6">
          <ChevronLeft onClick={() => setCurrentIndex(prev => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length)} className="opacity-20 hover:opacity-100 cursor-pointer" />
          <div className="w-60 p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#6040F1]/10 flex items-center justify-center text-[#6040F1]">{SKILLS_DATA[currentIndex].icon}</div>
            <div className="text-left">
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