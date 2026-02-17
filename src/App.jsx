import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, History, MessageCircle } from 'lucide-react';

const LILA_HEX = "#6040F1";
const LILA_RGBA = "rgba(96, 64, 241, 0.1)"; // Opacidad lila suave
const DARK_BG = "#0A0A0A"; // Negro más profundo

function App() {
  const [input, setInput] = useState('');
  const [currentChat, setCurrentChat] = useState({ 
    user: null, 
    ai: 'Sistema activo. Describe el proyecto y skills para iniciar el análisis.' 
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
        ai: `Análisis para "${userText.substring(0, 12)}..." completado con éxito.` 
      }));
    }, 1200);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: DARK_BG, color: 'white' }}>
      
      {/* CUERPO CENTRAL (TODO CENTRADO) */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        
        <div className="w-full max-w-lg flex flex-col items-center space-y-12">
          
          {/* BRANDING (REDUCIDO Y CENTRADO) */}
          <header className="text-center">
            <motion.h1 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-6xl font-black tracking-tighter text-white m-0"
            >
              MRM
            </motion.h1>
            <p className="text-[9px] font-bold uppercase tracking-[0.6em] text-gray-600 mt-1">Creative Credentials</p>
          </header>

          {/* BURBUJA DE COMUNICACIÓN (GLASS + LILA STROKE) */}
          <div className="w-full min-h-[120px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {isTyping ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse" />
                  <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse delay-75" />
                  <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse delay-150" />
                </motion.div>
              ) : (
                <motion.div 
                  key={currentChat.ai}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full p-6 rounded-[2rem] text-center backdrop-blur-xl border border-[#6040F1]/30 shadow-[0_0_30px_rgba(96,64,241,0.05)]"
                  style={{ backgroundColor: LILA_RGBA }}
                >
                  <p className="text-sm leading-relaxed font-light text-white/80 tracking-tight italic">
                    {currentChat.ai}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* INPUT (PEQUEÑO Y CENTRADO) */}
          <div className="w-full max-w-sm relative flex items-center p-1 rounded-full border border-white/10 bg-white/5 focus-within:border-[#6040F1]/50 transition-all shadow-2xl">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Proyecto / Skills..."
              className="bg-transparent flex-1 outline-none px-5 py-2 text-xs text-white/70 placeholder:text-gray-700"
            />
            <button 
              onClick={handleSendMessage}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90"
              style={{ backgroundColor: LILA_HEX }}
            >
              <Send size={12} className="text-white" />
            </button>
          </div>

        </div>
      </main>

      {/* SIDEBAR HISTORIAL (ULTRA SLIM) */}
      <aside className="w-48 p-8 flex flex-col border-l border-white/5 bg-black/40">
        <div className="flex items-center gap-2 opacity-20 mb-10">
          <MessageCircle size={12} />
          <span className="text-[8px] font-black uppercase tracking-widest">Logs</span>
        </div>
        
        <div className="space-y-8 overflow-y-auto scrollbar-hide">
          {history.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} whileHover={{ opacity: 1 }}
              className="group cursor-default"
            >
              <p className="text-[10px] text-white/40 leading-relaxed font-light line-clamp-2 italic border-l border-[#6040F1]/20 pl-3">
                {item.ai}
              </p>
            </motion.div>
          ))}
          {history.length === 0 && <div className="h-20 border-l border-white/5 ml-1 opacity-5"></div>}
        </div>
      </aside>
    </div>
  );
}

export default App;