import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Globe, ChevronLeft, ChevronRight, 
  X, ArrowRight 
} from 'lucide-react';

// --- DATA: 26 TALENTOS ---
const TALENTS_DATA = Array.from({ length: 26 }, (_, i) => ({
  id: i + 1,
  name: i === 0 ? "Alex Rivera" : i === 1 ? "Elena Sanz" : `Talento Experto ${i + 1}`,
  role: i === 0 ? "Cloud Architect" : i === 1 ? "UX Lead" : "Senior Specialist",
  tags: ["AWS", "Design", "DevOps"],
  img: `https://i.pravatar.cc/150?u=${i + 1}`,
  bio: "Especialista senior con trayectoria impecable en ejecución digital."
}));

const SKILLS_DATA = [
  { 
    id: 1, name: "Estratégico", role: "Consultoría Senior", icon: <Globe size={22}/>, 
    projects: [
      { id: 'p1', title: "Digital Roadmap 2030", desc: "Transformación digital maestra para el sector bancario.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", tags: ["Strategy", "Fintech"] },
      { id: 'p2', title: "Market Entry", desc: "Expansión estratégica en mercados emergentes de LATAM.", img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800", tags: ["Data", "Expansion"] },
      { id: 'p3', title: "Operations Core", desc: "Optimización integral de procesos operativos críticos.", img: "https://images.unsplash.com/photo-1454165833762-02ad50c8988d?w=800", tags: ["Ops", "Efficiency"] },
      { id: 'p4', title: "Innovation Lab", desc: "Células de innovación para prototipado rápido de servicios.", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800", tags: ["UX", "Prototyping"] }
    ] 
  }
];

function App() {
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [myTeam, setMyTeam] = useState([]);
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
        text: "He diseñado un ecosistema de soluciones clave:",
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

      <div className="w-full max-w-5xl flex flex-col items-center z-20 px-4 mt-10">
        {/* CHAT LOG */}
        {chatHistory.length > 0 && (
          <div ref={chatScrollRef} className="w-full max-h-[550px] overflow-y-auto mb-6 pr-2 flex flex-col gap-6 hide-scrollbar scroll-smooth"
               style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)' }}>
            {chatHistory.map((msg, idx) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`inline-block max-w-[95%] p-5 rounded-[1.8rem] text-[12.5px] shadow-2xl ${msg.type === 'user' ? 'bg-[#7D68F6] mrm-bold rounded-tr-none' : 'bg-white/5 border border-white/10 rounded-tl-none inter-light'}`}>
                  <p>{msg.text}</p>
                  {msg.suggestions && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 lg:min-w-[780px]">
                      {msg.suggestions.map((p, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-[1.5rem] bg-white/[0.03] border border-white/10 hover:border-[#7D68F6] cursor-pointer transition-all group">
                          <img src={p.img} className="w-16 h-16 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                          <div className="flex-1 flex flex-col">
                            <h4 className="text-[10px] mrm-bold uppercase mb-1">{p.title}</h4>
                            <p className="text-[9px] text-gray-400 line-clamp-2 mb-2">{p.desc}</p>
                            <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between">
                              <span className="text-[8px] mrm-bold uppercase text-[#7D68F6]">Ver detalles</span>
                              <ArrowRight size={12} className="text-[#7D68F6] group-hover:translate-x-1 transition-transform" />
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

        {/* SEARCH BAR (Elegante y Estática) */}
        <div className="w-full max-w-xl flex items-center bg-white/[0.04] border border-white/10 rounded-full px-6 py-3.5 backdrop-blur-md">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Describe tu proyecto..." className="bg-transparent flex-1 outline-none text-[13px] text-white/60" />
          <button onClick={handleSendMessage} className="ml-3 w-10 h-10 rounded-full flex items-center justify-center bg-[#7D68F6] hover:scale-105 transition-all active:scale-95">
            <Send size={16}/>
          </button>
        </div>
      </div>

      {showResults && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full mt-20 flex flex-col items-center">
          {/* CAPABILITIES CAROUSEL */}
          <div className="w-full max-w-2xl flex flex-col items-center mb-20 px-4">
            <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 mb-6">Capabilities</p>
            <div className="w-full flex items-center justify-between">
              <button onClick={() => setCurrentIndex((prev) => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length)} className="p-2 opacity-40 hover:opacity-100 transition-opacity"><ChevronLeft size={20}/></button>
              <div className="flex-1 mx-4 p-5 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
                <div className="text-[#7D68F6]">{SKILLS_DATA[currentIndex]?.icon}</div>
                <div className="text-left">
                  <p className="text-[13px] uppercase mrm-bold">{SKILLS_DATA[currentIndex]?.name}</p>
                  <p className="text-[8px] text-gray-500 uppercase">{SKILLS_DATA[currentIndex]?.role}</p>
                </div>
              </div>
              <button onClick={() => setCurrentIndex((prev) => (prev + 1) % SKILLS_DATA.length)} className="p-2 opacity-40 hover:opacity-100 transition-opacity"><ChevronRight size={20}/></button>
            </div>
          </div>

          {/* PEOPLE GRID (26 PERSONAS) */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 w-full max-w-7xl px-6">
            {TALENTS_DATA.map((t) => (
              <motion.div whileHover={{ y: -8, scale: 1.02 }} key={t.id} onClick={() => setSelectedTalent(t)}
                className="p-5 rounded-[2rem] border border-white/5 bg-white/[0.02] cursor-pointer flex flex-col items-center group hover:border-[#7D68F6]/40 transition-all text-center">
                <img src={t.img} className="w-11 h-11 rounded-full border border-white/10 mb-3 grayscale group-hover:grayscale-0 transition-all" />
                <h3 className="text-[9.5px] mrm-bold uppercase">{t.name}</h3>
                <p className="text-[7.5px] text-gray-500 uppercase mb-2">{t.role}</p>
                <div className="flex flex-wrap justify-center gap-1">
                  {t.tags.slice(0, 2).map(tag => <span key={tag} className="text-[6.5px] border border-white/10 px-1.5 py-0.5 rounded-full text-gray-500 uppercase">{tag}</span>)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* MODAL TALENTO */}
      <AnimatePresence>
        {selectedTalent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTalent(null)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-10 text-center">
              <img src={selectedTalent.img} className="w-24 h-24 rounded-full mx-auto mb-6 border-2 border-[#7D68F6]" />
              <h2 className="text-xl mrm-bold uppercase mb-2">{selectedTalent.name}</h2>
              <p className="text-[10px] text-[#7D68F6] uppercase tracking-widest mb-6">{selectedTalent.role}</p>
              <p className="text-sm text-gray-400 inter-light leading-relaxed mb-8">{selectedTalent.bio}</p>
              <button onClick={() => setSelectedTalent(null)} className="absolute top-6 right-6 text-white/30 hover:text-white"><X size={20}/></button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;