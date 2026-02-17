import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, MessageSquare } from 'lucide-react';

const LILA_MAIN = "rgba(96, 64, 241, 1)";
const LILA_GLOW = "rgba(96, 64, 241, 0.15)";
const DARK_BG = "#0D0D0D"; // Fondo más oscuro para mayor contraste suave

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
        ai: `Análisis estratégico finalizado. Para "${userText.substring(0, 15)}..." se han mapeado las credenciales de ejecución interna. ¿Algún requerimiento adicional?` 
      }));
    }, 1200);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans" style={{ backgroundColor: DARK_BG, color: 'white' }}>
      
      {/* CUERPO CENTRAL */}
      <div className="flex-1 flex flex-col items-center justify-between py-12 px-10 relative">
        
        {/* BRANDING HERO */}
        <motion.header 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-[100px] font-black leading-none tracking-tighter text-white m-0 opacity-90">MRM</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.8em] text-gray-600 mt-[-5px]">Creative Credentials</p>
        </motion.header>

        {/* ÁREA DE MENSAJES (BURBUJAS LARGAS Y SUAVES) */}
        <div className="w-full max-w-4xl flex flex-col gap-8 items-center mb-10">
          <AnimatePresence mode="wait">
            {currentChat.user && (
              <motion.div 
                key={currentChat.user}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full py-5 px-10 rounded-3xl border border-white/5 bg-white/[0.02] text-gray-400 text-sm font-light tracking-wide text-center"
              >
                <span className="opacity-40 text-[9px] uppercase tracking-widest block mb-1">Tu solicitud</span>
                "{currentChat.user}"
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isTyping ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                {[0, 0.2, 0.4].map((d) => (
                  <motion.div 
                    key={d}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: d }}
                    className="w-1 h-1 rounded-full bg-indigo-500"
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key={currentChat.ai}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full p-10 rounded-[2.5rem] text-center relative overflow-hidden group border border-white/10"
                style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)` }}
              >
                {/* Brillo suave de fondo estilo iOS */}
                <div className="absolute inset-0 bg-indigo-500/5 blur-3xl -z-10 group-hover:bg-indigo-500/10 transition-colors duration-700" />
                
                <Sparkles className="mx-auto mb-4 opacity-30" size={20} style={{ color: LILA_MAIN }} />
                <span className="text-2xl leading-relaxed font-extralight text-white/80 tracking-tight italic">
                   {currentChat.ai}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BARRA DE COMUNICACIÓN (CENTRO ABAJO) */}
        <div className="w-full max-w-2xl">
          <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-full px-6 py-2 backdrop-blur-md focus-within:border-white/20 transition-all">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="¿En qué puedo asistirte hoy?"
              className="bg-transparent flex-1 outline-none py-3 text-sm text-white/70 placeholder:text-gray-700 font-light"
            />
            <button 
              onClick={handleSendMessage}
              className="p-2 ml-2 rounded-full hover:bg-white/5 transition-colors group"
            >
              <Send size={18} className="text-gray-500 group-hover:text-indigo-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* HISTORIAL (DERECHA - ESTÉTICA SUAVE) */}
      <aside className="w-80 p-10 flex flex-col justify-center border-l border-white/5 bg-black/20">
        <div className="flex items-center gap-2 opacity-20 mb-10">
          <MessageSquare size={14} />
          <span className="text-[9px] font-bold uppercase tracking-[0.4em]">History</span>
        </div>
        
        <div className="space-y-12 overflow-y-auto scrollbar-hide pr-2">
          <AnimatePresence>
            {history.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.2 }}
                whileHover={{ opacity: 1, scale: 1.02 }}
                className="group cursor-pointer transition-all duration-700"
              >
                <div className="h-px w-4 bg-indigo-500/30 mb-4 group-hover:w-full transition-all duration-700" />
                <p className="text-[11px] text-white/50 leading-relaxed font-light line-clamp-3 italic">
                  {item.ai}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          {history.length === 0 && (
            <div className="text-[10px] text-gray-800 uppercase tracking-widest italic">Standby...</div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default App;