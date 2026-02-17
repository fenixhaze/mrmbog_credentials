import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, History, X, Globe, Zap, Cpu, Palette, BarChart3, ChevronLeft, ChevronRight, Users, Eye } from 'lucide-react';

const LILA_REAL = "#6040F1"; 

const SKILLS_DATA = [
  { id: 1, name: "Estratégico", role: "Consultoría Senior", icon: <Globe size={26}/> },
  { id: 2, name: "Desarrollo", role: "Arquitectura Cloud", icon: <Cpu size={26}/> },
  { id: 3, name: "Creative", role: "Design Systems", icon: <Palette size={26}/> },
  { id: 4, name: "Data", role: "ML & Analytics", icon: <BarChart3 size={26}/> },
  { id: 5, name: "UX/UI", role: "Product Design", icon: <Zap size={26}/> },
];

const MOCK_PROJECTS = [
  { id: 1, title: "Nexus Fintech", team: "3 Devs, 1 Lead UX", match: "98%" },
  { id: 2, title: "Orbit Brand", team: "2 Creatives, 1 Strategist", match: "92%" },
  { id: 3, title: "Data Core AI", team: "4 Data Scientists", match: "89%" },
];

function App() {
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [currentChat, setCurrentChat] = useState({ 
    user: null, 
    ai: 'Sistema activo. Describe tu proyecto para mapear credenciales corporativas.' 
  });
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    if (currentChat.user) {
      setHistory(prev => [{ ...currentChat, id: Date.now() }, ...prev].slice(0, 5));
    }
    const userText = input;
    setCurrentChat({ user: userText, ai: null });
    setInput('');
    setIsTyping(true);
    setShowResults(false);

    setTimeout(() => {
      setIsTyping(false);
      setCurrentChat(prev => ({ 
        ...prev, 
        ai: `Mira los resultados y el equipo de trabajo asociado a tus necesidades:` 
      }));
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden flex-col items-center pt-8 text-white relative pb-20" 
         style={{ background: `radial-gradient(circle at center, #1a0f3c 0%, #0A0A0A 70%)` }}>
      
      {/* 1. HERO BANNER */}
      <motion.header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-[120px] font-black tracking-[-0.08em] leading-[0.75] text-white select-none uppercase italic">MRM</h1>
        <div className="flex items-center justify-center gap-6 mt-4 opacity-40">
          <div className="h-[1px] w-12 bg-white"></div>
          <p className="text-[10px] font-bold uppercase tracking-[0.9em]">Creative Credentials</p>
          <div className="h-[1px] w-12 bg-white"></div>
        </div>
      </motion.header>

      {/* 2. ZONA DE INTERACCIÓN */}
      <div className="w-full max-w-3xl flex flex-col items-center space-y-6 z-20 px-6 mb-10">
        
        <div className="w-full flex flex-col items-center gap-4">
          <AnimatePresence>
            {currentChat.user && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="py-1.5 px-6 rounded-full bg-white/5 border border-white/5 text-[10px] text-gray-400 italic"
              >
                "{currentChat.user}"
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isTyping ? (
              <div className="flex gap-2 p-3">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{backgroundColor: LILA_REAL}} />
                <div className="w-1.5 h-1.5 rounded-full animate-pulse delay-75" style={{backgroundColor: LILA_REAL}} />
              </div>
            ) : (
              <motion.div key={currentChat.ai} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="w-full px-10 py-6 rounded-[2.5rem] text-center border backdrop-blur-md shadow-2xl overflow-hidden relative"
                style={{ borderColor: `${LILA_REAL}44`, backgroundColor: `rgba(96, 64, 241, 0.03)` }}
              >
                <p className="text-[15px] leading-snug font-light text-white/90 italic mb-6 tracking-tight">{currentChat.ai}</p>

                {/* BURBUJA GRANDE DE RESULTADOS */}
                <AnimatePresence>
                  {showResults && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-3 gap-4 mt-2">
                      {MOCK_PROJECTS.map((project) => (
                        <motion.div 
                          key={project.id}
                          whileHover={{ y: -5, borderColor: LILA_REAL }}
                          className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 transition-all cursor-pointer group"
                        >
                          <p className="text-[9px] font-bold text-indigo-400 mb-1 tracking-widest uppercase">{project.match} Match</p>
                          <h4 className="text-xs font-black uppercase mb-2">{project.title}</h4>
                          <div className="h-[1px] w-full bg-white/5 mb-3 group-hover:bg-[#6040F1]/30 transition-colors" />
                          
                          {/* Info on hover / Small text */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                              <Users size={10} />
                              <span className="text-[8px] font-medium">{project.team}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#6040F1] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                              <Eye size={10} />
                              <span className="text-[8px] font-bold uppercase tracking-tighter">Ver Detalles</span>
                            </div>
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

        {/* INPUT (MISMO ANCHO) */}
        <div className="w-full relative">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-7 py-3 focus-within:border-[#6040F1]/60 transition-all shadow-xl backdrop-blur-sm">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe para encontrar tu equipo..."
              className="bg-transparent flex-1 outline-none text-[12px] text-white/60 py-1"
            />
            <button onClick={handleSendMessage} className="ml-3 w-9 h-9 rounded-full flex items-center justify-center bg-[#6040F1]">
              <Send size={12} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. SKILLS OVERVIEW */}
      <div className="flex flex-col items-center space-y-4">
        <p className="text-[9px] font-black uppercase tracking-[0.6em] opacity-30 italic">Overview by Skills</p>
        <div className="flex items-center gap-8">
          <ChevronLeft onClick={() => setCurrentIndex(prev => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length)} size={24} className="opacity-20 hover:opacity-100 cursor-pointer" />
          <motion.div key={currentIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="w-[360px] p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl flex items-center gap-6"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#6040F1]/10 text-[#6040F1] border border-[#6040F1]/20">{SKILLS_DATA[currentIndex].icon}</div>
            <div className="text-left">
              <h3 className="text-md font-black uppercase text-white">{SKILLS_DATA[currentIndex].name}</h3>
              <p className="text-[10px] text-gray-500 italic mt-0.5">{SKILLS_DATA[currentIndex].role}</p>
            </div>
          </motion.div>
          <ChevronRight onClick={() => setCurrentIndex(prev => (prev + 1) % SKILLS_DATA.length)} size={24} className="opacity-20 hover:opacity-100 cursor-pointer" />
        </div>
      </div>

      {/* 4. HISTORY */}
      <div className="absolute top-8 right-10">
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 opacity-20 hover:opacity-100 transition-all">
          <History size={12} className="text-gray-400" /><span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 italic">History</span>
        </button>
        <AnimatePresence>
          {showHistory && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-10 right-0 p-5 rounded-3xl bg-[#0D0D0D] border border-white/10 w-56 shadow-2xl z-50"
            >
              <div className="flex justify-between items-center mb-3 opacity-30 text-[7px] font-black uppercase tracking-widest">Logs <X size={10} onClick={() => setShowHistory(false)} className="cursor-pointer"/></div>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                {history.map(item => (<p key={item.id} className="text-[9px] text-white/40 border-l border-[#6040F1]/40 pl-2 italic leading-relaxed">{item.ai}</p>))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;