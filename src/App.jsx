import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, ShieldCheck, History, Sparkles } from 'lucide-react';

const LILA_SOFT = "rgba(96, 64, 241, 0.8)"; // Lila suavizado
const BG_COLOR = "#1D1D1D";

function App() {
  const [input, setInput] = useState('');
  const [currentChat, setCurrentChat] = useState({ user: null, ai: '¡Bienvenido! Describe tu proyecto y los skills que planeas integrar.' });
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Guardar el par anterior en el historial lateral antes de limpiar el centro
    if (currentChat.user) {
      setHistory(prev => [{ ...currentChat }, ...prev].slice(0, 5));
    }

    const userText = input;
    setCurrentChat({ user: userText, ai: null });
    setInput('');
    setIsTyping(true);

    // Simulación de respuesta de IA con lógica de reemplazo
    setTimeout(() => {
      setIsTyping(false);
      setCurrentChat(prev => ({ ...prev, ai: `Entendido. Los skills para "${userText.substring(0, 15)}..." están siendo procesados. ¿Deseas profundizar en algún área técnica?` }));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#1D1D1D] text-white font-sans flex overflow-hidden">
      
      {/* SECCIÓN IZQUIERDA: INTERACCIÓN PRINCIPAL */}
      <main className="flex-1 flex flex-col p-12 relative border-r border-white/5">
        
        {/* HEADER MINI */}
        <header className="mb-12">
          <h1 className="text-3xl font-black tracking-tighter italic opacity-80">MRM <span className="text-xs font-normal not-italic opacity-40">BOGOTA</span></h1>
        </header>

        {/* BARRA DE TEXTO POSICIONADA ARRIBA */}
        <div className="w-full max-w-2xl">
          <div className="relative group">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describa el proyecto y los skills..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 outline-none focus:border-white/20 transition-all text-lg placeholder:text-gray-600 shadow-2xl"
            />
            <button 
              onClick={handleSendMessage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all active:scale-90"
              style={{ backgroundColor: LILA_SOFT }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* ÁREA DE MENSAJES DINÁMICOS (SOLO 2 BURBUJAS) */}
        <div className="mt-20 flex flex-col gap-8 max-w-2xl">
          <AnimatePresence mode="wait">
            {currentChat.user && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 rounded-[2rem] bg-white/5 border border-white/10 text-gray-300 self-start max-w-[90%]"
              >
                <p className="text-xs uppercase tracking-widest opacity-40 mb-2 font-bold">Proyecto / Skills</p>
                <span className="text-lg">{currentChat.user}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isTyping ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 p-4">
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </motion.div>
            ) : currentChat.ai && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                className="p-8 rounded-[2.5rem] text-white shadow-2xl self-start max-w-[95%] relative overflow-hidden group"
                style={{ backgroundColor: LILA_SOFT }}
              >
                <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles size={24}/></div>
                <p className="text-xs uppercase tracking-[0.3em] opacity-60 mb-3 font-black italic">Assistant Response</p>
                <span className="text-xl leading-relaxed font-medium">{currentChat.ai}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* SECCIÓN DERECHA: HISTORIAL DE TEXTO (SIDEBAR) */}
      <aside className="w-80 bg-black/20 backdrop-blur-3xl p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-8 opacity-40">
          <History size={18} />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Registro Confidencial</h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 pr-2">
          {history.length === 0 && (
            <p className="text-[10px] text-gray-600 italic">No hay registros previos en esta sesión.</p>
          )}
          {history.map((item, index) => (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.3 }} 
              whileHover={{ opacity: 1 }}
              key={index} 
              className="space-y-2 cursor-default transition-all"
            >
              <p className="text-[10px] text-gray-400 line-clamp-2 italic">"{item.user}"</p>
              <div className="h-[1px] w-8 bg-white/10"></div>
              <p className="text-[10px] text-indigo-400 line-clamp-3 leading-relaxed">{item.ai}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-20">
           <ShieldCheck size={16} />
           <span className="text-[9px] font-bold uppercase tracking-widest text-white">Internal OS v2.1</span>
        </div>
      </aside>
    </div>
  );
}

export default App;