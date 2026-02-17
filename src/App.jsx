import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, History, ShieldCheck, Sparkles } from 'lucide-react';

const LILA_SOFT = "rgba(96, 64, 241, 0.7)"; // Lila suavizado para mejor lectura
const BG_COLOR = "#1D1D1D";

function App() {
  const [input, setInput] = useState('');
  const [currentChat, setCurrentChat] = useState({ 
    user: null, 
    ai: 'Bienvenido al sistema interno. Describa su proyecto y los skills que planea integrar para comenzar el análisis.' 
  });
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Antes de cambiar, si ya había un par de mensajes, los mandamos al historial
    if (currentChat.user) {
      setHistory(prev => [{ ...currentChat, id: Date.now() }, ...prev]);
    }

    const userText = input;
    // Limpiamos el centro para las nuevas burbujas
    setCurrentChat({ user: userText, ai: null });
    setInput('');
    setIsTyping(true);

    // Simulación de respuesta IA con delay para la animación
    setTimeout(() => {
      setIsTyping(false);
      setCurrentChat(prev => ({ 
        ...prev, 
        ai: `Análisis de "${userText.substring(0, 20)}..." completado. El sistema ha mapeado las credenciales óptimas para los skills descritos. ¿Desea ajustar algún detalle?` 
      }));
    }, 1500);
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden" style={{ backgroundColor: BG_COLOR, color: 'white' }}>
      
      {/* SECCIÓN PRINCIPAL: INTERACCIÓN */}
      <main className="relative flex-1 flex flex-col items-center p-12 border-r border-white/5">
        
        {/* TÍTULO CENTRALIZADO */}
        <header className="mb-16 text-center animate-in fade-in zoom-in duration-700">
          <h1 className="text-4xl font-black tracking-tighter italic opacity-80 uppercase">MRM</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Bogota Credentials</p>
        </header>

        {/* BARRA DE BÚSQUEDA ALTA */}
        <div className="w-full max-w-2xl z-20">
          <motion.div 
            initial={{ y: -20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="relative group"
          >
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describa el proyecto y los skills necesarios..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 outline-none focus:border-white/20 transition-all text-base placeholder:text-gray-600 shadow-2xl"
            />
            <button 
              onClick={handleSendMessage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all active:scale-90 hover:opacity-90"
              style={{ backgroundColor: LILA_SOFT }}
            >
              <Send size={20} />
            </button>
          </motion.div>
        </div>

        {/* ÁREA DE MENSAJES (MÁXIMO 2 BURBUJAS CON FADE) */}
        <div className="mt-24 w-full max-w-2xl flex flex-col gap-10">
          <AnimatePresence mode="wait">
            {currentChat.user && (
              <motion.div 
                key={`user-${currentChat.user}`}
                initial={{ opacity: 0, x: -10, filter: 'blur(5px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                className="p-6 rounded-[2rem] bg-white/5 border border-white/10 text-gray-300 self-start max-w-[85%] shadow-lg"
              >
                <p className="text-[9px] uppercase tracking-widest opacity-30 mb-2 font-bold italic">User Input</p>
                <span className="text-base leading-relaxed">{currentChat.user}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isTyping ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 p-4">
                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </motion.div>
            ) : currentChat.ai && (
              <motion.div 
                key={`ai-${currentChat.ai}`}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="p-8 rounded-[2.5rem] shadow-2xl self-start max-w-[95%] relative group border border-white/5"
                style={{ backgroundColor: LILA_SOFT }}
              >
                <div className="absolute -top-3 -right-3 p-4 opacity-30 text-white animate-pulse"><Sparkles size={20}/></div>
                <p className="text-[9px] uppercase tracking-[0.4em] text-white/50 mb-3 font-black">AI Response</p>
                <span className="text-lg leading-relaxed font-medium text-white shadow-sm">{currentChat.ai}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* SIDEBAR DERECHO: HISTORIAL */}
      <aside className="w-72 bg-black/20 backdrop-blur-3xl p-8 flex flex-col border-l border-white/5">
        <div className="flex items-center gap-3 mb-10 opacity-30 group">
          <History size={16} className="group-hover:rotate-[-45deg] transition-transform" />
          <h2 className="text-[9px] font-black uppercase tracking-[0.3em]">Sesión Activa</h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 pr-2 scrollbar-hide">
          <AnimatePresence>
            {history.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 0.25 }}
                whileHover={{ opacity: 1, scale: 1.02 }}
                className="space-y-2 cursor-pointer transition-all duration-300"
              >
                <p className="text-[10px] text-gray-400 line-clamp-1 italic font-light">"{item.user}"</p>
                <div className="h-[1px] w-6 bg-white/10"></div>
                <p className="text-[10px] text-indigo-300/80 line-clamp-2 leading-snug">{item.ai}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {history.length === 0 && (
            <p className="text-[9px] text-gray-700 uppercase tracking-tighter">Esperando actividad...</p>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-10 grayscale">
           <ShieldCheck size={14} />
           <span className="text-[8px] font-bold uppercase tracking-widest">Confidential OS</span>
        </div>
      </aside>
    </div>
  );
}

export default App;