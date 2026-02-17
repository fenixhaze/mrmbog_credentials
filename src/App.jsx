import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, MessageSquare, Mic, PenTool, Image as ImageIcon, Book } from 'lucide-react';

const LILA_MAIN = "rgb(96, 64, 241)";
const LILA_TRANSPARENT = "rgba(96, 64, 241, 0.2)";
const DARK_BG = "#0D0D0D";

function App() {
  const [input, setInput] = useState('');
  const [currentChat, setCurrentChat] = useState({ 
    user: null, 
    ai: 'Bienvenido. Describe tu proyecto y los skills para iniciar el análisis corporativo.' 
  });
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    if (currentChat.user) {
      setHistory(prev => [{ ...currentChat, id: Date.now() }, ...prev].slice(0, 8));
    }
    const userText = input;
    setCurrentChat({ user: userText, ai: null });
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setCurrentChat(prev => ({ 
        ...prev, 
        ai: `Análisis estratégico finalizado. Para "${userText.substring(0, 15)}..." se han mapeado las credenciales de ejecución interna.` 
      }));
    }, 1500);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans" style={{ backgroundColor: DARK_BG, color: 'white' }}>
      
      {/* SECCIÓN CENTRAL: CHAT Y BRANDING */}
      <main className="flex-1 flex flex-col items-center justify-between py-10 px-6 relative">
        
        {/* BRANDING */}
        <header className="text-center mt-4">
          <h1 className="text-7xl font-black tracking-tighter text-white m-0 opacity-90">MRM</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-gray-500">Creative Credentials</p>
        </header>

        {/* CONTENEDOR DE BURBUJAS (GLASSMORFISMO) */}
        <div className="w-full max-w-2xl flex flex-col gap-4 mb-auto mt-12 overflow-y-auto scrollbar-hide">
          
          {/* SUGERENCIAS RÁPIDAS (ESTILO IMAGEN) */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[ 
              { icon: <ImageIcon size={14}/>, label: 'Generate image' },
              { icon: <PenTool size={14}/>, label: 'Creative Illustrations' },
              { icon: <Book size={14}/>, label: 'Inspiring stories' }
            ].map((btn, i) => (
              <button key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-400 hover:bg-white/10 transition-all">
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {currentChat.user && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="self-start max-w-[80%] py-3 px-6 rounded-3xl rounded-bl-none bg-white/5 border border-white/10 text-sm font-light text-gray-300"
              >
                {currentChat.user}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isTyping ? (
              <div className="flex gap-1 ml-4 py-2">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              </div>
            ) : (
              <motion.div 
                key={currentChat.ai}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full p-8 rounded-[2.5rem] bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 backdrop-blur-md relative"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                    <Sparkles size={16} />
                  </div>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-indigo-500" />
                    <div className="w-1 h-1 rounded-full bg-indigo-500/40" />
                    <div className="w-1 h-1 rounded-full bg-indigo-500/20" />
                  </div>
                </div>
                <p className="text-lg leading-relaxed font-light text-white/80 tracking-tight">
                  {currentChat.ai}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* INPUT CENTRADO (ESTILO IMAGEN) */}
        <div className="w-full max-w-xl flex flex-col items-center gap-4">
          <div className="w-full relative flex items-center p-1.5 rounded-full border-2 border-indigo-500/30 bg-[#1A1A1A] focus-within:border-indigo-500 transition-all shadow-[0_0_20px_rgba(96,64,241,0.1)]">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="¿En qué puedo asistirte hoy?"
              className="bg-transparent flex-1 outline-none px-6 py-3 text-sm text-white/80 placeholder:text-gray-600 font-light"
            />
            <button 
              onClick={handleSendMessage}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-95"
              style={{ backgroundColor: LILA_MAIN }}
            >
              <Send size={18} className="text-white ml-0.5" />
            </button>
          </div>
        </div>
      </main>

      {/* HISTORIAL LATERAL (ULTRA SLIM) */}
      <aside className="w-64 p-8 flex flex-col border-l border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="flex items-center gap-3 opacity-30 mb-8 border-b border-white/5 pb-4">
          <MessageSquare size={14} />
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">History</span>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
          {history.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} whileHover={{ opacity: 0.8 }}
              className="group cursor-pointer"
            >
              <p className="text-[10px] text-indigo-400 mb-1">● AI Response</p>
              <p className="text-[11px] text-white/50 leading-relaxed font-light line-clamp-2 italic border-l border-white/10 pl-3">
                {item.ai}
              </p>
            </motion.div>
          ))}
          {history.length === 0 && <div className="text-[9px] text-gray-800 tracking-widest uppercase">No logs</div>}
        </div>
      </aside>
    </div>
  );
}

export default App;