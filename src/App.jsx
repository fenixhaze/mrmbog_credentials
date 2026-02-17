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
    <div className="flex min-h-screen w-full flex-col items-center pt-8 text-white relative pb-20 px-6 overflow-x-hidden" 
         style={{ background: `linear-gradient(to top right, #110929 0%, #0A0A0A 40%, #0A0A0A 100%)` }}>
      
      {/* 1. HERO BANNER */}
      <motion.header className="w-full max-w-5xl text-center mb-6">
        <h1 className="text-[110px] leading-none tracking-[-0.05em] select-none font-mrm-title">
          MRM
        </h1>
        <p className="text-[10px] uppercase tracking-[0.9em] text-gray-600 mt-4 font-inter-light">
          Creative Credentials
        </p>
      </motion.header>

      {/* 2. CHAT AREA */}
      <div className="w-full max-w-4xl flex flex-col items-center space-y-6 z-20">
        
        {/* BURBUJA USUARIO */}
        <AnimatePresence>
          {currentChat.user && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-1.5 px-6 rounded-full bg-white/5 border border-white/5 text-[10px] text-gray-500 italic self-center">
              "{currentChat.user}"
            </motion.div>
          )}
        </AnimatePresence>

        {/* BURBUJA IA EXPANDIDA */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {isTyping ? (
              <div className="flex justify-center gap-2 p-4">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-2 rounded-full" style={{backgroundColor: LILA_REAL}} />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-2 h-2 rounded-full" style={{backgroundColor: LILA_REAL}} />
              </div>
            ) : (
              <motion.div 
                className="w-full px-8 py-8 rounded-[3rem] border backdrop-blur-xl shadow-2xl relative overflow-hidden"
                style={{ borderColor: `${LILA_REAL}22`, backgroundColor: `rgba(255, 255, 255, 0.01)` }}
              >
                <h2 className="text-xl italic text-center mb-8 tracking-tight text-white/90 font-mrm-title">
                  {currentChat.ai}
                </h2>

                <AnimatePresence>
                  {showResults && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {PROJECTS_DATA.map((proj) => (
                        <div key={proj.id} className="flex gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[#6040F1]/40 transition-all group cursor-pointer">
                          <div className={`w-24 h-24 rounded-2xl flex-shrink-0 bg-gradient-to-br ${proj.color} to-transparent border border-white/5 flex items-center justify-center`}>
                            <Layers size={24} className="text-white/10 group-hover:text-[#6040F1] transition-colors" />
                          </div>
                          <div className="flex flex-col justify-between py-1">
                            <div>
                              <h3 className="text-[13px] uppercase tracking-tight mb-1 font-mrm-title">{proj.title}</h3>
                              <p className="text-[11px] text-gray-500 leading-tight italic font-inter-light">{proj.desc}</p>
                            </div>
                            <button className="flex items-center gap-2 mt-2 text-[9px] uppercase text-[#6040F1] hover:text-white transition-colors font-mrm-title">
                              <UserPlus size={12} /> Agregar Talento
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

        {/* INPUT */}
        <div className="w-full max-w-2xl relative">
          <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-full px-7 py-3 focus-within:border-[#6040F1]/50 transition-all backdrop-blur-md">
            <input 
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describe tu proyecto..."
              className="bg-transparent flex-1 outline-none text-[12px] text-white/50 py-1"
            />
            <button onClick={handleSendMessage} className="ml-3 w-10 h-10 rounded-full flex items-center justify-center bg-[#6040F1]">
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. SKILLS CAROUSEL */}
      <div className="mt-12 flex flex-col items-center space-y-4">
        <p className="text-[8px] uppercase tracking-[0.5em] opacity-20 italic font-inter-light">Global Skill Network</p>
        <div className="flex items-center gap-6">
          <ChevronLeft onClick={() => setCurrentIndex(prev => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length)} className="opacity-20 hover:opacity-100 cursor-pointer" />
          <div className="w-64 p-5 rounded-3xl bg-white/[0.01] border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#6040F1]/10 flex items-center justify-center text-[#6040F1]">{SKILLS_DATA[currentIndex].icon}</div>
            <div className="text-left">
              <p className="text-[11px] uppercase text-white/80 font-mrm-title">{SKILLS_DATA[currentIndex].name}</p>
              <p className="text-[10px] text-gray-600 italic font-inter-light uppercase tracking-wider">{SKILLS_DATA[currentIndex].role}</p>
            </div>
          </div>
          <ChevronRight onClick={() => setCurrentIndex(prev => (prev + 1) % SKILLS_DATA.length)} className="opacity-20 hover:opacity-100 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

export default App;