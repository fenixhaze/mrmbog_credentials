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
      setCurrentChat(prev => ({ ...prev, ai: 'Mira resultados y agrega talentos a tu equipo.' }));
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center pt-8 text-white relative pb-20 px-6 overflow-x-hidden" 
         style={{ 
           background: `linear-gradient(to top right, #110929 0%, #0A0A0A 40%, #0A0A0A 100%)` 
         }}>
      
      {/* 1. HERO BANNER - Usando MW Sans Bold */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl text-center mb-6"
      >
        <h1 className="text-[100px] font-mwsans-bold italic uppercase select-none leading-none tracking-[-0.08em]">
          MRM
        </h1>
        <p className="text-[10px] font-inter-light uppercase tracking-[0.9em] text-gray-600 mt-2">
          Creative Credentials
        </p>
      </motion.header>

      {/* 2. CHAT AREA */}
      <div className="w-full max-w-4xl flex flex-col items-center space-y-6 z-20">
        
        {/* BURBUJA DE USUARIO - MW Sans Regular */}
        <AnimatePresence>
          {currentChat.user && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-1.5 px-6 rounded-full bg-white/5 border border-white/5 text-[10px] text-gray-500 italic self-center font-mwsans"
            >
              "{currentChat.user}"
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENEDOR DE IA EXPANDIDO */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {isTyping ? (
              <div className="flex justify-center gap-2 p-4">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-2 rounded-full" style={{backgroundColor: LILA_REAL}} />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-2 h-2 rounded-full" style={{backgroundColor: LILA_REAL}} />
              </div>
            ) : (
              <motion.div 
                key={currentChat.ai}
                initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full px-8 py-8 rounded-[3rem] border backdrop-blur-xl shadow-2xl relative overflow-hidden"
                style={{ borderColor: `${LILA_REAL}22`, backgroundColor: `rgba(255, 255, 255, 0.01)` }}
              >
                {/* Título del Bot - MW Sans Bold */}
                <h2 className="text-xl font-mwsans-bold italic text-center mb-8 tracking-tight text-white/90">
                  {currentChat.ai}
                </h2>

                {/* GRID DE RESULTADOS */}
                <AnimatePresence>
                  {showResults && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-5"
                    >
                      {PROJECTS_DATA.map((proj) => (
                        <motion.div 
                          key={proj.id}
                          whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.03)" }}
                          className="flex gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[#6040F1]/40 transition-all group cursor-pointer"
                        >
                          {/* IMAGEN IZQUIERDA */}
                          <div className={`w-24 h-24 rounded-2xl flex-shrink-0 bg-gradient-to-br ${proj.color} to-transparent border border-white/5 flex items-center justify-center`}>
                            <Layers size={24} className="text-white/10 group-hover:text-[#6040F1] transition-colors" />
                          </div>

                          {/* CONTENIDO - Títulos MW Sans, Descrip. Inter Light */}
                          <div className="flex flex-col justify-between py-1">
                            <div>
                              <h3 className="text-[13px] font-mwsans-bold uppercase tracking-tight mb-1">{proj.title}</h3>
                              <p className="text-[11px] font-inter-light text-gray-500 leading-tight italic line-clamp-2">{proj.desc}</p>
                            </div>
                            <button className="flex items-center gap-2 mt-2 text-[9px] font-mwsans-bold uppercase tracking-tighter text-[#6040F1] hover:text-white transition-colors">
                              <UserPlus size={12} />
                              Agregar Talento
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* INPUT ALARGADO - MW Sans Regular */}
        <div className="w-full max-w-2xl relative">
          <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-full px-7 py-3 focus-within:border-[#6040F1]/50 transition-all backdrop-blur-md">
            <input 
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describe tu proyecto para asignar equipo..."
              className="bg-transparent flex-1 outline-none text-[12px] text-white/50 py-1 font-mwsans"
            />
            <button onClick={handleSendMessage} className="ml-3 w-10 h-10 rounded-full flex items-center justify-center bg-[#6040F1] hover:shadow-[0_0_15px_#6040F1] transition-all">
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. SKILLS CAROUSEL - Roles en Inter Light */}
      <div className="mt-12 flex flex-col items-center space-y-4">
        <p className="text-[8px] font-inter-light uppercase tracking-[0.5em] opacity-20 italic">Global Skill Network</p>
        <div className="flex items-center gap-6">
          <ChevronLeft onClick={() => setCurrentIndex(prev => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length)} className="opacity-20 hover:opacity-100 cursor-pointer transition-opacity" />
          <div className="w-64 p-5 rounded-3xl bg-white/[0.01] border border-white/5 flex items-center gap-4 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-[#6040F1]/10 flex items-center justify-center text-[#6040F1] border border-[#6040F1]/10">{SKILLS_DATA[currentIndex].icon}</div>
            <div className="text-left">
              <p className="text-[11px] font-mwsans-bold uppercase text-white/80">{SKILLS_DATA[currentIndex].name}</p>
              <p className="text-[9px] font-inter-light text-gray-600 italic uppercase tracking-wider">{SKILLS_DATA[currentIndex].role}</p>
            </div>
          </div>
          <ChevronRight onClick={() => setCurrentIndex(prev => (prev + 1) % SKILLS_DATA.length)} className="opacity-20 hover:opacity-100 cursor-pointer transition-opacity" />
        </div>
      </div>

      {/* 4. HISTORY RECORDS */}
      <div className="absolute top-8 right-10">
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 opacity-20 hover:opacity-100 transition-all">
          <History size={12} className="text-gray-400" />
          <span className="text-[9px] font-inter-light uppercase tracking-widest text-gray-500">History</span>
        </button>
        <AnimatePresence>
          {showHistory && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-10 right-0 p-5 rounded-3xl bg-[#0D0D0D] border border-white/10 w-56 shadow-2xl z-50 scrollbar-hide"
            >
              <div className="flex justify-between items-center mb-3 opacity-30 text-[7px] font-mwsans-bold uppercase tracking-widest">Logs <X size={10} onClick={() => setShowHistory(false)} className="cursor-pointer"/></div>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                {history.map(item => (
                  <p key={item.id} className="text-[9px] font-inter-light text-white/40 border-l border-[#6040F1]/40 pl-2 leading-relaxed italic">{item.ai}</p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;