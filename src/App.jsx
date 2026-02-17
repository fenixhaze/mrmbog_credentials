import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, History, X, Globe, Zap, Cpu, Palette, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

const LILA_BRAND = "#6040F1";
const DARK_BG = "#0A0A0A";

const SKILLS_DATA = [
  { id: 1, name: "Estratégico", role: "Consultoría Senior", icon: <Globe size={22}/> },
  { id: 2, name: "Desarrollo", role: "Arquitectura Cloud", icon: <Cpu size={22}/> },
  { id: 3, name: "Creative", role: "Design Systems", icon: <Palette size={22}/> },
  { id: 4, name: "Data", role: "ML & Analytics", icon: <BarChart3 size={22}/> },
  { id: 5, name: "UX/UI", role: "Product Design", icon: <Zap size={22}/> },
];

function App() {
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentChat, setCurrentChat] = useState({ 
    user: null, 
    ai: 'Sistema activo. Describe tu proyecto para mapear credenciales.' 
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
        ai: `Mapeo finalizado para "${userText.substring(0, 15)}...". Perfiles estratégicos listos.` 
      }));
    }, 1200);
  };

  const nextSkill = () => setCurrentIndex((prev) => (prev + 1) % SKILLS_DATA.length);
  const prevSkill = () => setCurrentIndex((prev) => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length);

  return (
    <div className="flex h-screen w-full overflow-hidden flex-col items-center pt-12 bg-[#0A0A0A] text-white">
      
      {/* 1. HERO BANNER (TOP) */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl text-center mb-10"
      >
        <h1 className="text-[140px] font-black tracking-[-0.08em] leading-none text-white opacity-95 select-none uppercase italic">
          MRM
        </h1>
        <div className="flex items-center justify-center gap-4 mt-[-10px]">
          <div className="h-[1px] w-12 bg-white/10"></div>
          <p className="text-[10px] font-bold uppercase tracking-[0.8em] text-gray-500">Creative Credentials</p>
          <div className="h-[1px] w-12 bg-white/10"></div>
        </div>
      </motion.header>

      {/* 2. ZONA DE INTERACCIÓN (UPPER CENTER) */}
      <div className="w-full max-w-xl flex flex-col items-center space-y-8 z-20">
        
        {/* BURBUJAS */}
        <div className="w-full flex flex-col items-center gap-3">
          <AnimatePresence mode="wait">
            {currentChat.user && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="py-2 px-5 rounded-full bg-white/5 border border-white/5 text-[10px] text-gray-500 italic"
              >
                "{currentChat.user}"
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isTyping ? (
              <div className="flex gap-1.5 p-4">
                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 bg-[#6040F1] rounded-full" />
                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#6040F1] rounded-full" />
              </div>
            ) : (
              <motion.div key={currentChat.ai} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full px-8 py-6 rounded-[2.5rem] text-center border border-[#6040F1]/20 backdrop-blur-md bg-[#6040F1]/5 shadow-2xl"
              >
                <p className="text-[14px] leading-relaxed font-light text-white/90 italic tracking-tight">{currentChat.ai}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* INPUT COMPONENT */}
        <div className="w-full max-w-[320px] relative group">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-5 py-2 focus-within:border-[#6040F1]/50 transition-all shadow-xl">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Skills / Proyecto..."
              className="bg-transparent flex-1 outline-none text-[11px] text-white/60 py-1"
            />
            <button onClick={handleSendMessage} className="ml-2 w-8 h-8 rounded-full flex items-center justify-center bg-[#6040F1] hover:scale-110 transition-transform">
              <Send size={11} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. SKILLS OVERVIEW (LOWER CENTER) */}
      <div className="mt-16 flex flex-col items-center space-y-6">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30 italic">Overview by Skills</p>
        
        <div className="flex items-center gap-10">
          <button onClick={prevSkill} className="p-2 opacity-20 hover:opacity-100 transition-all hover:text-[#6040F1]">
            <ChevronLeft size={28} />
          </button>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="w-80 p-7 rounded-[3rem] bg-white/[0.03] border border-white/5 backdrop-blur-xl flex items-center gap-6 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#6040F1]/10 flex items-center justify-center text-[#6040F1] border border-[#6040F1]/20">
                {SKILLS_DATA[currentIndex].icon}
              </div>
              <div className="text-left">
                <h3 className="text-md font-black uppercase tracking-tighter text-white">{SKILLS_DATA[currentIndex].name}</h3>
                <p className="text-[11px] text-gray-500 font-medium tracking-wide mt-1 italic">{SKILLS_DATA[currentIndex].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={nextSkill} className="p-2 opacity-20 hover:opacity-100 transition-all hover:text-[#6040F1]">
            <ChevronRight size={28} />
          </button>
        </div>
      </div>

      {/* 4. FLOATING HISTORY CTA (TOP RIGHT) */}
      <div className="absolute top-8 right-10">
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 opacity-30 hover:opacity-100 transition-all">
          <History size={12} className="text-gray-400" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Records</span>
        </button>
        <AnimatePresence>
          {showHistory && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-12 right-0 p-5 rounded-3xl bg-[#0D0D0D] border border-white/10 w-56 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50"
            >
              <div className="flex justify-between items-center mb-4 opacity-30 text-[8px] font-black uppercase tracking-widest">Session Logs <X size={12} onClick={() => setShowHistory(false)} className="cursor-pointer"/></div>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                {history.map(item => (<p key={item.id} className="text-[10px] text-white/40 border-l-2 border-[#6040F1]/40 pl-3 leading-relaxed italic">{item.ai}</p>))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;