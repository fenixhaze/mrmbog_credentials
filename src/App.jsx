import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, History, X, Globe, Zap, Cpu, Palette, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

const LILA_BRAND = "#6040F1";
const DARK_BG = "#0A0A0A";

const SKILLS_DATA = [
  { id: 1, name: "Estratégico", role: "Consultoría Senior", icon: <Globe size={20}/> },
  { id: 2, name: "Desarrollo", role: "Arquitectura Cloud", icon: <Cpu size={20}/> },
  { id: 3, name: "Creative", role: "Design Systems", icon: <Palette size={20}/> },
  { id: 4, name: "Data", role: "ML & Analytics", icon: <BarChart3 size={20}/> },
  { id: 5, name: "UX/UI", role: "Product Design", icon: <Zap size={20}/> },
];

function App() {
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
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
        ai: `Skills mapeados para "${userText.substring(0, 12)}...". Revisa las credenciales abajo.` 
      }));
    }, 1200);
  };

  const nextSkill = () => setCurrentIndex((prev) => (prev + 1) % SKILLS_DATA.length);
  const prevSkill = () => setCurrentIndex((prev) => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length);

  return (
    <div className="flex h-screen w-full overflow-hidden flex-col relative" style={{ backgroundColor: DARK_BG, color: 'white' }}>
      
      {/* ZONA CENTRAL: CHAT */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md flex flex-col items-center mb-12">
          <header className="text-center mb-8">
            <h1 className="text-5xl font-black tracking-tighter text-white m-0">MRM</h1>
            <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-gray-600">Creative Credentials</p>
          </header>

          <div className="w-full flex flex-col items-center gap-4 mb-8">
            <AnimatePresence mode="wait">
              {currentChat.user && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className="w-auto max-w-[85%] py-2 px-4 rounded-full bg-white/[0.03] border border-white/5 text-[10px] text-gray-500 italic text-center"
                >
                  "{currentChat.user}"
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {isTyping ? (
                <div className="flex gap-1.5 p-2">
                  <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 bg-[#6040F1] rounded-full" />
                  <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#6040F1] rounded-full" />
                </div>
              ) : (
                <motion.div key={currentChat.ai} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                  className="w-auto max-w-[95%] px-8 py-5 rounded-[2rem] text-center border border-[#6040F1]/20 backdrop-blur-xl bg-[#6040F1]/5"
                >
                  <p className="text-[13px] leading-relaxed font-light text-white/90 italic tracking-tight">{currentChat.ai}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full max-w-[260px] relative">
            <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-full px-4 py-1.5 focus-within:border-[#6040F1]/40 transition-all">
              <input value={input} onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Describe tu proyecto..."
                className="bg-transparent flex-1 outline-none text-[10px] text-white/50 py-1"
              />
              <button onClick={handleSendMessage} className="ml-2 w-7 h-7 rounded-full flex items-center justify-center bg-[#6040F1]">
                <Send size={10} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* OVERVIEW BY SKILLS: FLOTANTE ABAJO */}
      <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center space-y-4">
        <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-20">Overview by Skills</p>
        
        <div className="flex items-center gap-8 group">
          <button onClick={prevSkill} className="p-2 opacity-20 hover:opacity-100 transition-opacity hover:text-[#6040F1]">
            <ChevronLeft size={24} />
          </button>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-72 p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md flex items-center gap-5 transition-all hover:border-[#6040F1]/30"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#6040F1]/10 flex items-center justify-center text-[#6040F1] shadow-[0_0_20px_rgba(96,64,241,0.1)]">
                {SKILLS_DATA[currentIndex].icon}
              </div>
              <div className="text-left">
                <h3 className="text-sm font-black uppercase tracking-tighter text-white/90">{SKILLS_DATA[currentIndex].name}</h3>
                <p className="text-[10px] text-gray-500 font-medium tracking-wide mt-0.5">{SKILLS_DATA[currentIndex].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={nextSkill} className="p-2 opacity-20 hover:opacity-100 transition-opacity hover:text-[#6040F1]">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* HISTORY CTA */}
      <div className="absolute top-8 right-8">
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 opacity-40 hover:opacity-100 transition-all">
          <History size={10} className="text-gray-400" />
          <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">History</span>
        </button>
        <AnimatePresence>
          {showHistory && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-10 right-0 p-4 rounded-2xl bg-[#111] border border-white/10 w-48 shadow-2xl z-50"
            >
              <div className="flex justify-between items-center mb-4 opacity-20 text-[7px] font-black uppercase tracking-widest">Logs <X size={10} onClick={() => setShowHistory(false)} className="cursor-pointer"/></div>
              <div className="space-y-3">{history.map(item => (<p key={item.id} className="text-[9px] text-white/40 border-l border-[#6040F1]/30 pl-2 italic line-clamp-2">{item.ai}</p>))}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;