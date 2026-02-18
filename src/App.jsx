import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Globe, ArrowRight, X } from 'lucide-react';

// --- DATA ---
const PROJECTS = [
  { id: 'p1', title: "Digital Roadmap 2030", desc: "Transformación digital maestra para el sector bancario.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", tags: ["Strategy", "Fintech"] },
  { id: 'p2', title: "Market Entry", desc: "Expansión estratégica en mercados emergentes de LATAM.", img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800", tags: ["Data", "Expansion"] }
];

function App() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setChatHistory(prev => [...prev, { type: 'user', text: input }]);
    setInput('');

    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        text: "He diseñado un ecosistema de soluciones clave para tu requerimiento:",
        suggestions: PROJECTS 
      }]);
      setShowResults(true);
    }, 600);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center text-white bg-[#0A0A0A] relative pb-20">
      {/* Fondo Gradiente Fijo */}
      <div className="fixed inset-0 pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle at 50% 0%, #1a0b3d 0%, #0A0A0A 70%)` }} />

      {/* Header Fijo/Estático */}
      <header className="w-full max-w-5xl text-center pt-16 z-10 shrink-0">
        <h1 className="text-[100px] leading-none tracking-[-0.05em] mrm-bold uppercase">MRM</h1>
        <p className="text-[10px] mrm-bold uppercase tracking-[0.8em] text-[#7D68F6] mt-2">BOGOTA CREATIVE CREDENTIALS</p>
      </header>

      {/* CONTENEDOR CENTRAL (Sin animaciones de movimiento de barra) */}
      <div className="w-full max-w-5xl flex flex-col items-center z-20 px-4 mt-12">
        
        {/* Historial de Chat: Solo aparece si hay mensajes */}
        {chatHistory.length > 0 && (
          <div 
            ref={chatScrollRef}
            className="w-full max-h-[500px] overflow-y-auto mb-8 pr-2 flex flex-col gap-6 hide-scrollbar"
            style={{ 
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%)'
            }}
          >
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                {/* SMART ENCLOSURE: La burbuja se ajusta al contenido */}
                <div className={`inline-block max-w-[95%] p-6 rounded-[2rem] text-[13px] shadow-2xl ${
                  msg.type === 'user' 
                  ? 'bg-[#7D68F6] mrm-bold rounded-tr-none' 
                  : 'bg-white/5 border border-white/10 rounded-tl-none inter-light'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  
                  {msg.suggestions && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 w-full min-w-[280px] lg:min-w-[750px]">
                      {msg.suggestions.map((p, i) => (
                        <div key={i} className="flex gap-5 p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-[#7D68F6] cursor-pointer transition-all group">
                          <img src={p.img} className="w-20 h-20 rounded-2xl object-cover grayscale group-hover:grayscale-0" />
                          <div className="flex-1 flex flex-col">
                            <h4 className="text-[11px] mrm-bold uppercase text-white mb-1">{p.title}</h4>
                            <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2 mb-4">{p.desc}</p>
                            <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                              <span className="text-[9px] mrm-bold uppercase text-[#7D68F6]">Ver detalles</span>
                              <ArrowRight size={14} className="text-[#7D68F6] group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Barra de Búsqueda: Estática en su posición */}
        <div className="w-full max-w-2xl flex items-center bg-white/[0.04] border border-white/10 rounded-full px-8 py-5 backdrop-blur-md">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Describe tu requerimiento..." 
            className="bg-transparent flex-1 outline-none text-[14px] text-white/70" 
          />
          <button onClick={handleSendMessage} className="ml-3 w-12 h-12 rounded-full flex items-center justify-center bg-[#7D68F6]">
            <Send size={18}/>
          </button>
        </div>
      </div>

      {/* Grid de Talentos (Aparece abajo de forma estática) */}
      {showResults && (
        <div className="w-full max-w-7xl px-6 mt-20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="p-6 rounded-[2.5rem] border border-white/5 bg-white/[0.03] text-center group cursor-pointer hover:border-[#7D68F6]/40 transition-all">
              <div className="w-12 h-12 rounded-full bg-white/10 mx-auto mb-4 grayscale group-hover:grayscale-0 transition-all" />
              <h3 className="text-[10px] mrm-bold uppercase">Talento Experto</h3>
              <p className="text-[8px] text-gray-500 uppercase">Senior Specialist</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;