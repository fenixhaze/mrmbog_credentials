import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Globe, Cpu, Palette, ChevronLeft, ChevronRight, 
  X, ArrowRight 
} from 'lucide-react';

// --- DATA (TALENTOS Y PROYECTOS) ---
const TALENTS_DATA = Array.from({ length: 26 }, (_, i) => ({
  id: i + 1,
  name: i === 0 ? "Alex Rivera" : i === 1 ? "Elena Sanz" : `Talento Experto ${i + 1}`,
  role: i === 0 ? "Cloud Architect" : i === 1 ? "UX Lead" : "Senior Specialist",
  tags: ["AWS", "Design", "DevOps"],
  img: `https://i.pravatar.cc/150?u=${i + 1}`,
  bio: "Especialista senior con trayectoria impecable en ejecución digital."
}));

const PROJECTS = [
  { id: 'p1', title: "Digital Roadmap 2030", desc: "Transformación digital maestra para el sector bancario.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", tags: ["Strategy", "Fintech"] },
  { id: 'p2', title: "Market Entry", desc: "Expansión estratégica en mercados emergentes de LATAM.", img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800", tags: ["Data", "Expansion"] }
];

function App() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const chatScrollRef = useRef(null);

  // Scroll automático al nuevo mensaje
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { type: 'user', text: input };
    setChatHistory(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        text: "He diseñado un ecosistema de soluciones clave:",
        suggestions: PROJECTS 
      }]);
      setShowResults(true);
    }, 800);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center text-white bg-[#0A0A0A] overflow-x-hidden relative">
      {/* Fondo Gradiente Fijo */}
      <div className="fixed inset-0 pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle at 50% 0%, #1a0b3d 0%, #0A0A0A 70%)` }} />

      {/* Header Estático */}
      <header className="w-full max-w-5xl text-center pt-16 z-10">
        <h1 className="text-[100px] leading-none tracking-[-0.05em] mrm-bold uppercase">MRM</h1>
        <p className="text-[10px] mrm-bold uppercase tracking-[0.8em] text-[#7D68F6] mt-2">BOGOTA CREATIVE CREDENTIALS</p>
      </header>

      {/* CHAT CONTAINER - El corazón de la animación */}
      <div className="w-full max-w-5xl flex flex-col items-center z-20 px-4 mt-12">
        
        {/* Historial de Chat (Aparece y crece hacia arriba) */}
        <div 
          ref={chatScrollRef}
          className="w-full overflow-y-auto overflow-x-hidden hide-scrollbar flex flex-col gap-6 transition-all duration-500"
          style={{ 
            maxHeight: showResults ? '500px' : '0px',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%)'
          }}
        >
          {chatHistory.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`w-fit max-w-[90%] p-7 rounded-[2rem] text-[13px] shadow-2xl ${
                msg.type === 'user' ? 'bg-[#7D68F6] mrm-bold rounded-tr-none' : 'bg-white/5 border border-white/10 rounded-tl-none inter-light'
              }`}>
                {msg.text}
                {msg.suggestions && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 lg:min-w-[700px]">
                    {msg.suggestions.map((p, i) => (
                      <div key={i} onClick={() => setSelectedProject(p)} className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#7D68F6] cursor-pointer transition-all group">
                        <img src={p.img} className="w-20 h-20 rounded-xl object-cover grayscale group-hover:grayscale-0" />
                        <div className="flex-1 flex flex-col justify-between">
                          <h4 className="text-[11px] mrm-bold uppercase">{p.title}</h4>
                          <p className="text-[10px] text-gray-400 line-clamp-1">{p.desc}</p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                            <span className="text-[8px] mrm-bold text-[#7D68F6] uppercase">Ver detalles</span>
                            <ArrowRight size={12} className="text-[#7D68F6]" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Bar - Se desplaza suavemente sin romper el layout */}
        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 40, damping: 15 }}
          className={`w-full max-w-2xl mt-8 ${!showResults ? 'translate-y-[20vh]' : 'translate-y-0'}`}
        >
          <div className="flex items-center bg-white/[0.04] border border-white/10 rounded-full px-8 py-5 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="¿Qué proyecto tienes en mente?" 
              className="bg-transparent flex-1 outline-none text-[15px] text-white/80 placeholder:text-white/20" 
            />
            <button onClick={handleSendMessage} className="ml-4 w-12 h-12 rounded-full flex items-center justify-center bg-[#7D68F6] hover:scale-105 transition-transform">
              <Send size={18}/>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Sección de Talentos (Aparece solo tras la respuesta) */}
      <AnimatePresence>
        {showResults && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-7xl px-6 mt-32"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {TALENTS_DATA.map((t) => (
                <div key={t.id} className="p-6 rounded-[2.5rem] border border-white/5 bg-white/[0.02] hover:border-[#7D68F6]/40 transition-all text-center group cursor-pointer">
                  <img src={t.img} className="w-12 h-12 rounded-full mx-auto mb-4 grayscale group-hover:grayscale-0 transition-all" />
                  <h3 className="text-[10px] mrm-bold uppercase">{t.name}</h3>
                  <p className="text-[8px] text-gray-500 uppercase">{t.role}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer / Padding final */}
      <div className="h-40 w-full" />
    </div>
  );
}

export default App;