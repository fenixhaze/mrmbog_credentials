import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, History, X } from 'lucide-react';

const LILA_BRAND = "rgba(96, 64, 241, 1)";
const LILA_SOFT_BG = "rgba(96, 64, 241, 0.08)";
const DARK_BG = "#0A0A0A";

function App() {
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [currentChat, setCurrentChat] = useState({ 
    user: null, 
    ai: 'Sistema activo. Describe el proyecto para iniciar.' 
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
        ai: `Análisis para "${userText.substring(0, 15)}..." finalizado.` 
      }));
    }, 1200);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: DARK_BG, color: 'white' }}>
      
      {/* CUERPO CENTRAL */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
        
        <div className="w-full max-w-md flex flex-col items-center">
          
          {/* BRANDING COMPACTO */}
          <header className="text-center mb-10">
            <motion.h1 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-5xl font-black tracking-tighter text-white m-0"
            >
              MRM
            </motion.h1>
            <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-gray-500">Creative Credentials</p>
          </header>

          {/* BURBUJAS COMPACTAS */}
          <div className="w-full flex flex-col items-center gap-4 mb-8">
            <AnimatePresence mode="wait">
              {currentChat.user && (
                <motion.div 
                  key={currentChat.user}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-auto max-w-[85%] py-2 px-4 rounded-full bg-white/[0.03] border border-white/5 text-[10px] text-gray-500 italic"
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
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
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

          {/* INPUT MINIMALISTA */}
          <div className="w-full max-w-[260px] relative">
            <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-full px-4 py-1.5 focus-within:border-[#6040F1]/40 transition-all shadow-lg">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Skills / Proyecto..."
                className="bg-transparent flex-1 outline-none text-[10px] text-white/50 placeholder:text-gray-700 py-1"
              />
              <button 
                onClick={handleSendMessage}
                className="ml-2 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-md"
                style={{ backgroundColor: LILA_BRAND }}
              >
                <Send size={9} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* CTA DE HISTORIAL (ABAJO A LA DERECHA) */}
        <div className="absolute bottom-6 right-8 flex flex-col items-end gap-3">
          <AnimatePresence>
            {showHistory && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="mb-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl w-48 space-y-4 shadow-2xl"
              >
                <div className="flex justify-between items-center opacity-30 border-b border-white/5 pb-2 mb-2">
                  <span className="text-[7px] font-black uppercase tracking-widest">Logs</span>
                  <button onClick={() => setShowHistory(false)}><X size={10}/></button>
                </div>
                <div className="max-h-40 overflow-y-auto scrollbar-hide space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="border-l border-[#6040F1]/30 pl-2">
                      <p className="text-[9px] text-white/30 italic line-clamp-2">{item.ai}</p>
                    </div>
                  ))}
                  {history.length === 0 && <p className="text-[8px] opacity-10 uppercase tracking-tighter italic">Vacío</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all opacity-40 hover:opacity-100 shadow-sm"
          >
            <History size={10} className="text-gray-400" />
            <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">History</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;