import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, History, X, Globe, Zap, Cpu, Palette, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

// COLOR LILA EXACTO DE TU REFERENCIA
const LILA_REAL = "#6040F1"; 
const DARK_BG = "#0A0A0A";

const SKILLS_DATA = [
  { id: 1, name: "Estratégico", role: "Consultoría Senior", icon: <Globe size={26}/> },
  { id: 2, name: "Desarrollo", role: "Arquitectura Cloud", icon: <Cpu size={26}/> },
  { id: 3, name: "Creative", role: "Design Systems", icon: <Palette size={26}/> },
  { id: 4, name: "Data", role: "ML & Analytics", icon: <BarChart3 size={26}/> },
  { id: 5, name: "UX/UI", role: "Product Design", icon: <Zap size={26}/> },
];

function App() {
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
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
    setTimeout(() => {
      setIsTyping(false);
      setCurrentChat(prev => ({ 
        ...prev, 
        ai: `Mapeo finalizado para "${userText.substring(0, 15)}...". Los perfiles estratégicos han sido asignados correctamente.` 
      }));
    }, 1200);
  };

  const nextSkill = () => setCurrentIndex((prev) => (prev + 1) % SKILLS_DATA.length);
  const prevSkill = () => setCurrentIndex((prev) => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length);

  return (
    <div className="flex h-screen w-full overflow-hidden flex-col items-center pt-8 bg-[#0A0A0A] text-white">
      
      {/* 1. HERO BANNER (SUBIDO Y ANCHO) */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl text-center mb-10"
      >
        <h1 className="text-[150px] font-black tracking-[-0.08em] leading-[0.75] text-white select-none uppercase italic">
          MRM
        </h1>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="h-[1px] w-16 bg-white/10"></div>
          <p className="text-[11px] font-bold uppercase tracking-[0.9em] text-gray-500">Creative Credentials</p>
          <div className="h-[1px] w-16 bg-white/10"></div>
        </div>
      </motion.header>

      {/* 2. ZONA DE INTERACCIÓN (ALARGADA) */}
      <div className="w-full max-w-3xl flex flex-col items-center space-y-8 z-20">
        
        {/* BURBUJAS ALARGADAS */}
        <div className="w-full flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            {currentChat.user && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="py-2 px-6 rounded-full bg-white/5 border border-white/5 text-[11px] text-gray-400 italic"
              >
                "{currentChat.user}"
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isTyping ? (
              <div className="flex gap-2 p-4">
                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-2 rounded-full" style={{backgroundColor: LILA_REAL}} />
                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-2 h-2 rounded-full" style={{backgroundColor: LILA_REAL}} />
              </div>
            ) : (
              <motion.div key={currentChat.ai} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full px-12 py-8 rounded-[3rem] text-center border backdrop-blur-md shadow-2xl transition-all duration-500"
                style={{ 
                    borderColor: `${LILA_REAL}44`, 
                    backgroundColor: `${LILA_REAL}0A`,
                    boxShadow: `0 0 40px ${LILA_REAL}11`
                }}
              >
                <p className="text-[15px] leading-relaxed font-light text-white/90 italic tracking-tight">{currentChat.ai}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* INPUT ALARGADO */}
        <div className="w-full max-w-[450px] relative group">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-6 py-2.5 focus-within:border-[#6040F1]/60 transition-all shadow-xl">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Skills / Proyecto / Credenciales..."
              className="bg-transparent flex-1 outline-none text-[12px] text-white/60 py-1"
            />
            <button onClick={handleSendMessage} className="ml-3 w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg" style={{backgroundColor: LILA_REAL}}>
              <Send size={12} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. SKILLS OVERVIEW (TARJETAS MÁS GRANDES Y LARGAS) */}
      <div className="mt-14 flex flex-col items-center space-y-6">
        <p className="text-[10px] font-black uppercase tracking-[0.6em] opacity-30 italic">Overview by Skills</p>
        
        <div className="flex items-center gap-12">
          <button onClick={prevSkill} className="p-3 opacity-20 hover:opacity-100 transition-all hover:scale-110" style={{color: LILA_REAL}}>
            <ChevronLeft size={32} />
          </button>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-[400px] p-8 rounded-[3.5rem] bg-white/[0.03] border border-white/5 backdrop-blur-xl flex items-center gap-8 shadow-2xl group hover:border-[#6040F1]/30 transition-all"
            >
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center border transition-colors shadow-inner" 
                   style={{ 
                       backgroundColor: `${LILA_REAL}15`, 
                       borderColor: `${LILA_REAL}33`,
                       color: LILA_REAL
                   }}>
                {SKILLS_DATA[currentIndex].icon}
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black uppercase tracking-tighter text-white group-hover:text-[#6040F1] transition-colors">{SKILLS_DATA[currentIndex].name}</h3>
                <p className="text-[12px] text-gray-500 font-medium tracking-wide mt-1 italic">{SKILLS_DATA[currentIndex].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={nextSkill} className="p-3 opacity-20 hover:opacity-100 transition-all hover:scale-110" style={{color: LILA_REAL}}>
            <ChevronRight size={32} />
          </button>
        </div>
      </div>

      {/* 4. FLOATING HISTORY (TOP RIGHT) */}
      <div className="absolute top-10 right-12">
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 opacity-30 hover:opacity-100 transition-all">
          <History size={14} className="text-gray-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Records</span>
        </button>
        <AnimatePresence>
          {showHistory && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-12 right-0 p-6 rounded-3xl bg-[#0D0D0D] border border-white/10 w-64 shadow-2xl z-50"
            >
              <div className="flex justify-between items-center mb-4 opacity-30 text-[8px] font-black uppercase tracking-widest">Session Logs <X size={12} onClick={() => setShowHistory(false)} className="cursor-pointer hover:text-white"/></div>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
                {history.map(item => (<p key={item.id} className="text-[11px] text-white/40 border-l-2 pl-3 leading-relaxed italic" style={{borderColor: `${LILA_REAL}66`}}>{item.ai}</p>))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;