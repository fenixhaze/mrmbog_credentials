import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, History, X, Globe, Zap, Cpu, Palette, BarChart3 } from 'lucide-react';

const LILA_BRAND = "rgba(96, 64, 241, 1)";
const LILA_SOFT_BG = "rgba(96, 64, 241, 0.08)";
const DARK_BG = "#0A0A0A";

const SKILLS_DATA = [
  { id: 1, name: "Estratégico", icon: <Globe size={12}/>, color: "#6040F1" },
  { id: 2, name: "Desarrollo", icon: <Cpu size={12}/>, color: "#6040F1" },
  { id: 3, name: "Creative", icon: <Palette size={12}/>, color: "#6040F1" },
  { id: 4, name: "Data", icon: <BarChart3 size={12}/>, color: "#6040F1" },
  { id: 5, name: "UX/UI", icon: <Zap size={12}/>, color: "#6040F1" },
];

// Duplicamos la data para el efecto infinito real
const INFINITE_SKILLS = [...SKILLS_DATA, ...SKILLS_DATA, ...SKILLS_DATA];

function App() {
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [currentChat, setCurrentChat] = useState({ 
    user: null, 
    ai: 'Sistema activo. Describe el proyecto para mapear los perfiles idóneos.' 
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
        ai: `Skills mapeados para "${userText.substring(0, 12)}...". Los perfiles óptimos están disponibles en el overview inferior.` 
      }));
    }, 1200);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden flex-col" style={{ backgroundColor: DARK_BG, color: 'white' }}>
      
      {/* CUERPO CENTRAL (ZONA DE CHAT) */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
        
        <div className="w-full max-w-md flex flex-col items-center">
          
          <header className="text-center mb-10">
            <motion.h1 className="text-5xl font-black tracking-tighter text-white m-0">MRM</motion.h1>
            <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-gray-600">Creative Credentials</p>
          </header>

          <div className="w-full flex flex-col items-center gap-4 mb-8">
            <AnimatePresence mode="wait">
              {currentChat.user && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className="w-auto max-w-[85%] py-2 px-4 rounded-full bg-white/[0.03] border border-white/5 text-[10px] text-gray-500 italic text-center"
                >
                  "{currentChat.user}"
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {isTyping ? (
                <div className="flex gap-1.5 p-2">
                  <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 h-1 bg-indigo-500 rounded-full" />
                  <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 h-1 bg-indigo-500 rounded-full" />
                </div>
              ) : (
                <motion.div 
                  key={currentChat.ai}
                  initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                  className="w-auto max-w-[95%] px-7 py-4 rounded-[1.8rem] text-center border border-[#6040F1]/20 backdrop-blur-xl"
                  style={{ backgroundColor: LILA_SOFT_BG }}
                >
                  <p className="text-[12px] leading-relaxed font-light text-white/90 tracking-tight italic">
                    {currentChat.ai}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full max-w-[260px] relative mb-12">
            <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-full px-4 py-1.5 focus-within:border-[#6040F1]/40 transition-all">
              <input 
                value={input} onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Describe tu proyecto..."
                className="bg-transparent flex-1 outline-none text-[10px] text-white/50 placeholder:text-gray-700 py-1"
              />
              <button onClick={handleSendMessage} className="ml-2 w-6 h-6 rounded-full flex items-center justify-center bg-[#6040F1]">
                <Send size={9} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* CTA DE HISTORIAL */}
        <div className="absolute bottom-6 right-8 z-50">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 opacity-40 hover:opacity-100 transition-all"
          >
            <History size={10} className="text-gray-400" />
            <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500 italic">History</span>
          </button>
          
          <AnimatePresence>
            {showHistory && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-12 right-0 p-4 rounded-2xl bg-[#111] border border-white/10 backdrop-blur-3xl w-48 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4 opacity-20"><span className="text-[7px] font-black tracking-widest uppercase">Logs</span><X size={10} onClick={() => setShowHistory(false)} className="cursor-pointer"/></div>
                <div className="space-y-3">
                  {history.map(item => (
                    <p key={item.id} className="text-[9px] text-white/40 border-l border-[#6040F1]/30 pl-2 leading-relaxed italic line-clamp-2">{item.ai}</p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* FOOTER: OVERVIEW BY SKILLS (INFINITE CAROUSEL) */}
      <footer className="w-full bg-white/[0.02] border-t border-white/5 py-8 relative overflow-hidden">
        <div className="text-center mb-4 opacity-20">
          <p className="text-[8px] font-black uppercase tracking-[0.4em]">Overview by Skills</p>
        </div>

        <div className="flex relative overflow-hidden group">
          {/* Capas de degradado para suavizar los bordes */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

          <motion.div 
            className="flex gap-4 px-4"
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            whileHover={{ transition: { duration: 60 } }} // Se ralentiza al hacer hover
          >
            {INFINITE_SKILLS.map((skill, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-[#6040F1]/10 hover:border-[#6040F1]/40 transition-all cursor-pointer min-w-[160px]"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#6040F1]">
                  {skill.icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-tight text-white/80">{skill.name}</p>
                  <p className="text-[7px] uppercase tracking-widest text-gray-600 font-bold">Credential</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

export default App;