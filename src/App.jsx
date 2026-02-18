import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Globe, ChevronLeft, ChevronRight, 
  X, ArrowRight, Cpu, Palette 
} from 'lucide-react';

// --- DATA: 26 TALENTOS ---
const TALENTS_DATA = Array.from({ length: 26 }, (_, i) => ({
  id: i + 1,
  name: i === 0 ? "Alex Rivera" : i === 1 ? "Elena Sanz" : `Talento Experto ${i + 1}`,
  role: i === 0 ? "Cloud Architect" : i === 1 ? "UX Lead" : "Senior Specialist",
  tags: ["AWS", "Design", "DevOps"],
  img: `https://i.pravatar.cc/150?u=${i + 1}`,
  bio: "Especialista senior con trayectoria impecable en ejecución digital de alto impacto."
}));

const SKILLS_DATA = [
  { 
    id: 1, name: "Estratégico", role: "Consultoría Senior", icon: <Globe size={22}/>, 
    projects: [
      { id: 'p1', title: "Digital Roadmap 2030", desc: "Transformación digital maestra para el sector bancario.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", tags: ["Strategy", "Fintech"] },
      { id: 'p2', title: "Market Entry", desc: "Expansión estratégica en mercados emergentes de LATAM.", img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800", tags: ["Data", "Expansion"] },
      { id: 'p3', title: "Operations Core", desc: "Optimización integral de procesos operativos críticos.", img: "https://images.unsplash.com/photo-1454165833762-02ad50c8988d?w=800", tags: ["Ops", "Efficiency"] },
      { id: 'p4', title: "Innovation Lab", desc: "Células de innovación para prototipado rápido.", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800", tags: ["UX", "Prototyping"] }
    ] 
  },
  { id: 2, name: "Tecnología", role: "Arquitectura Cloud", icon: <Cpu size={22}/>, projects: [] },
  { id: 3, name: "Creatividad", role: "Design Systems", icon: <Palette size={22}/>, projects: [] }
];

function App() {
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' });
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
        suggestions: SKILLS_DATA[0].projects 
      }]);
      setShowResults(true);
    }, 600);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center text-white bg-[#0A0A0A] relative pb-32">
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 50% 0%, #1a0b3d 0%, #0A0A0A 70%)` }} />

      <header className="w-full max-w-5xl text-center pt-12 shrink-0 z-10">
        <h1 className="text-[90px] leading-none tracking-[-0.05em] mrm-bold uppercase">MRM</h1>
        <p className="text-[10px] mrm-bold uppercase tracking-[0.8em] text-[#7D68F6] mt-1">BOGOTA CREATIVE CREDENTIALS</p>
      </header>

      {/* CHAT AREA */}
      <div className="w-full max-w-5xl flex flex-col items-center z-20 px-4 mt-10">
        {chatHistory.length > 0 && (
          <div ref={chatScrollRef} className="w-full max-h-[500px] overflow-y-auto mb-6 pr-2 flex flex-col gap-6 hide-scrollbar scroll-smooth"
               style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)' }}>
            {chatHistory.map((msg, idx) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`inline-block max-w-[95%] p-6 rounded-[2rem] text-[13px] shadow-2xl ${msg.type === 'user' ? 'bg-[#7D68F6] mrm-bold rounded-tr-none' : 'bg-white/5 border border-white/10 rounded-tl-none inter-light'}`}>
                  <p>{msg.text}</p>
                  {msg.suggestions && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 w-full min-w-[280px] lg:min-w-[780px]">
                      {msg.suggestions.map((p, i) => (
                        <div key={i} className="flex gap-5 p-5 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-[#7D68F6] cursor-pointer transition-all group">
                          <img src={p.img} className="w-20 h-20 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                          <div className="flex-1 flex flex-col">
                            <h4 className="text-[11px] mrm-bold uppercase text-white mb-1">{p.title}</h4>
                            <p className="text-[10px] text-gray-400 line-clamp-2 mb-4">{p.desc}</p>
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
              </motion.div>
            ))}
          </div>
        )}

        {/* SEARCH BAR */}
        <div className="w-full max-w-xl flex items-center bg-white/[0.04] border border-white/10 rounded-full px-6 py-3.5 backdrop-blur-md">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Describe tu proyecto..." className="bg-transparent flex-1 outline-none text-[13px] text-white/60" />
          <button onClick={handleSendMessage} className="ml-3 w-10 h-10 rounded-full flex items-center justify-center bg-[#7D68F6]">
            <Send size={16}/>
          </button>
        </div>
      </div>

      {showResults && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full mt-24 flex flex-col items-center">
          
          {/* CAROUSEL EXTENDIDO (Al ancho de la barra de búsqueda / max-w-xl) */}
          <div className="w-full max-w-xl flex flex-col items-center mb-24 px-4">
            <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 mb-8">Capabilities</p>
            <div className="w-full flex items-center justify-between mb-10">
              <button onClick={() => setCurrentIndex((prev) => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length)} className="p-2 opacity-40 hover:opacity-100 transition-opacity"><ChevronLeft size={24}/></button>
              <div className="flex-1 mx-6 p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 flex items-center gap-5">
                <div className="text-[#7D68F6]">{SKILLS_DATA[currentIndex]?.icon}</div>
                <div className="text-left">
                  <p className="text-[14px] uppercase mrm-bold">{SKILLS_DATA[currentIndex]?.name}</p>
                  <p className="text-[9px] text-gray-500 uppercase">{SKILLS_DATA[currentIndex]?.role}</p>
                </div>
              </div>
              <button onClick={() => setCurrentIndex((prev) => (prev + 1) % SKILLS_DATA.length)} className="p-2 opacity-40 hover:opacity-100 transition-opacity"><ChevronRight size={24}/></button>
            </div>

            {/* PROYECTOS CATEGORÍA CON TOOLTIPS */}
            <div className="flex flex-wrap justify-center gap-3">
              {SKILLS_DATA[currentIndex]?.projects?.map((proj, idx) => (
                <div key={idx} className="group relative px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.03] flex items-center gap-2.5 cursor-pointer hover:bg-white/10 transition-all">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7D68F6]" />
                  <span className="text-[10px] uppercase mrm-bold text-gray-300">{proj.title}</span>
                  {/* Tooltip */}
                  <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-48 bg-[#0A0A0A] border border-white/10 p-3 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[60] shadow-2xl">
                    <img src={proj.img} className="w-full h-24 object-cover rounded-xl mb-3" />
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tags?.map(t => <span key={t} className="text-[6px] bg-[#7D68F6] px-2 py-0.5 rounded-full uppercase font-bold text-white">{t}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PEOPLE GRID (Diseño anterior con stroke hover) */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full max-w-7xl px-6">
            {TALENTS_DATA.map((t) => (
              <div key={t.id} onClick={() => setSelectedTalent(t)}
                className="p-6 rounded-[2.5rem] border border-white/5 bg-white/[0.03] cursor-pointer flex flex-col items-center text-center transition-all duration-300 hover:border-[#7D68F6] hover:bg-white/[0.05]">
                <img src={t.img} className="w-14 h-14 rounded-full border-2 border-white/10 mb-4 grayscale hover:grayscale-0 transition-all" />
                <h3 className="text-[11px] mrm-bold uppercase">{t.name}</h3>
                <p className="text-[9px] text-gray-500 uppercase mb-3">{t.role}</p>
                <div className="flex flex-wrap justify-center gap-1">
                  {t.tags.slice(0, 2).map(tag => <span key={tag} className="text-[7.5px] border border-white/10 px-2 py-0.5 rounded-full text-gray-400 uppercase">{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* MODAL DETALLE */}
      <AnimatePresence>
        {selectedTalent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTalent(null)} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative w-full max-w-3xl bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-12 flex gap-10">
              <img src={selectedTalent.img} className="w-32 h-32 rounded-full border-2 border-[#7D68F6]" />
              <div className="text-left flex-1">
                <h2 className="text-2xl mrm-bold uppercase mb-2">{selectedTalent.name}</h2>
                <p className="text-[12px] text-[#7D68F6] mrm-bold uppercase mb-6">{selectedTalent.role}</p>
                <p className="text-[15px] text-gray-400 inter-light leading-relaxed mb-8">{selectedTalent.bio}</p>
                <div className="flex gap-2">
                  {selectedTalent.tags.map(t => <span key={t} className="px-4 py-1.5 border border-[#7D68F6] rounded-full text-[9px] text-[#7D68F6] font-bold uppercase">{t}</span>)}
                </div>
              </div>
              <button onClick={() => setSelectedTalent(null)} className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors"><X size={24}/></button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;