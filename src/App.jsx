import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Globe, Cpu, Palette, ChevronLeft, ChevronRight, 
  X, ArrowRight, ExternalLink 
} from 'lucide-react';

// --- DATA: 26 TALENTOS ---
const TALENTS_DATA = [];
for(let i=1; i<=26; i++) {
  TALENTS_DATA.push({
    id: i, 
    name: i === 1 ? "Alex Rivera" : i === 2 ? "Elena Sanz" : `Talento Experto ${i}`, 
    role: i === 1 ? "Cloud Architect" : i === 2 ? "UX Lead" : "Senior Specialist", 
    tags: ["AWS", "Terraform", "Docker"], 
    img: `https://i.pravatar.cc/150?u=${i}`,
    bio: "Especialista senior con trayectoria impecable en la ejecución de proyectos de transformación digital de alto impacto."
  });
}

const SKILLS_DATA = [
  { 
    id: 1, name: "Estratégico", role: "Consultoría Senior", icon: <Globe size={26}/>, 
    projects: [
      { id: 'p1', title: "Digital Roadmap 2030", desc: "Transformación digital maestra para el sector bancario global, redefiniendo la experiencia del cliente final.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", team: [TALENTS_DATA[0], TALENTS_DATA[1]], tags: ["Strategy", "Fintech", "Cloud"] },
      { id: 'p2', title: "Market Entry", desc: "Expansión estratégica en mercados emergentes de LATAM basada en análisis predictivo de datos masivos.", img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800", team: [TALENTS_DATA[2], TALENTS_DATA[3]], tags: ["Data", "Expansion", "Business"] },
      { id: 'p3', title: "Operations Core", desc: "Optimización integral de procesos operativos críticos mediante metodologías ágiles y automatización.", img: "https://images.unsplash.com/photo-1454165833762-02ad50c8988d?w=800", team: [TALENTS_DATA[4]], tags: ["Ops", "Efficiency", "Lean"] }
    ] 
  }
];

function App() {
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [myTeam, setMyTeam] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [chatHistory, isTyping]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setChatHistory(prev => [...prev, { type: 'user', text: input }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        text: "He diseñado un ecosistema de soluciones clave para tu requerimiento:",
        suggestions: [SKILLS_DATA[0].projects[0], SKILLS_DATA[0].projects[1], SKILLS_DATA[0].projects[2]] 
      }]);
      setShowResults(true);
    }, 1000);
  };

  const addWholeTeam = (team) => {
    setMyTeam(prev => {
      const existingIds = new Set(prev.map(m => m.id));
      const toAdd = team.filter(m => !existingIds.has(m.id));
      return [...prev, ...toAdd];
    });
    setSelectedProject(null);
  };

  const toggleMember = (talent) => {
    if (myTeam.find(m => m.id === talent.id)) {
      setMyTeam(myTeam.filter(m => m.id !== talent.id));
    } else {
      setMyTeam([...myTeam, talent]);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center text-white relative pb-40 px-6 transition-colors duration-500" 
         style={{ background: `#0A0A0A`, backgroundImage: `radial-gradient(circle at 50% 0%, #1a0b3d 0%, #0A0A0A 60%)`, backgroundAttachment: 'fixed' }}>
      
      <header className="w-full max-w-5xl text-center pt-16 mb-12">
        <h1 className="text-[100px] leading-none tracking-[-0.05em] mrm-bold uppercase">MRM</h1>
        <p className="text-[10px] mrm-bold uppercase tracking-[0.8em] text-[#7D68F6] mt-2">BOGOTA CREATIVE CREDENTIALS</p>
      </header>

      {/* CHATBOX CON FADE AJUSTADO (MÁS ARRIBA) */}
      <div className="w-full max-w-2xl flex flex-col mb-12 z-20">
        <div className="relative h-[450px] overflow-hidden mb-4" 
             style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%)' }}>
          <div ref={chatScrollRef} className="h-full overflow-y-auto pt-32 pb-4 px-2 space-y-6 hide-scrollbar scroll-smooth">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-6 rounded-3xl text-[13px] ${msg.type === 'user' ? 'bg-[#7D68F6] mrm-bold rounded-tr-none' : 'bg-white/5 border border-white/10 rounded-tl-none inter-light'}`}>
                  {msg.text}
                  {msg.suggestions && (
                    <div className="mt-6 flex flex-col gap-3">
                      {msg.suggestions.map((p, i) => (
                        <div key={i} onClick={() => setSelectedProject(p)} className="flex gap-4 p-5 rounded-3xl bg-white/[0.05] border border-white/10 hover:border-[#7D68F6] cursor-pointer transition-all group">
                          <img src={p.img} className="w-16 h-16 rounded-2xl object-cover grayscale group-hover:grayscale-0" />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="text-[10px] mrm-bold uppercase text-white mb-1">{p.title}</h4>
                              <div className="flex gap-1 mb-2">
                                {p.tags?.map(t => <span key={t} className="text-[6.5px] border border-[#7D68F6]/30 px-2.5 py-1 rounded-full uppercase text-[#7D68F6]">{t}</span>)}
                              </div>
                              <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed mb-3">{p.desc}</p>
                            </div>
                            <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                              <span className="text-[8px] mrm-bold uppercase text-[#7D68F6]/80 group-hover:text-[#7D68F6]">Click to view project details</span>
                              <ArrowRight size={12} className="text-gray-500 group-hover:text-white transition-colors" />
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
        </div>
        <div className="flex items-center bg-white/[0.04] border border-white/10 rounded-full px-6 py-4 backdrop-blur-md">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Describe tu proyecto" className="bg-transparent flex-1 outline-none text-[13px] text-white/70" />
          <button onClick={handleSendMessage} className="ml-3 w-10 h-10 rounded-full flex items-center justify-center bg-[#7D68F6]"><Send size={16}/></button>
        </div>
      </div>

      {/* CAPABILITIES CAROUSEL */}
      {showResults && (
        <div className="w-full max-w-2xl flex flex-col items-center mb-28">
          <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 mb-8">Capabilities</p>
          <div className="w-full flex items-center justify-between mb-8">
            <button onClick={() => setCurrentIndex((prev) => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length)} className="p-4"><ChevronLeft opacity={0.4} /></button>
            <div className="flex-1 mx-8 p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center gap-5 min-h-[100px]">
              <div className="text-[#7D68F6]">{SKILLS_DATA[currentIndex]?.icon}</div>
              <div className="text-left">
                <p className="text-[14px] uppercase mrm-bold">{SKILLS_DATA[currentIndex]?.name}</p>
                <p className="text-[9px] text-gray-500 uppercase">{SKILLS_DATA[currentIndex]?.role}</p>
              </div>
            </div>
            <button onClick={() => setCurrentIndex((prev) => (prev + 1) % SKILLS_DATA.length)} className="p-4"><ChevronRight opacity={0.4} /></button>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {SKILLS_DATA[currentIndex]?.projects?.map((proj, idx) => (
              <div key={idx} onClick={() => setSelectedProject(proj)} className="group relative px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.03] flex items-center gap-2.5 cursor-pointer hover:bg-white/10 transition-all">
                <div className="w-1.5 h-1.5 rounded-full bg-[#7D68F6]" />
                <span className="text-[10px] uppercase mrm-bold text-gray-300">{proj.title}</span>
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-48 bg-[#0A0A0A] border border-white/10 p-3 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60] shadow-2xl">
                  <img src={proj.img} className="w-full h-24 object-cover rounded-xl mb-3" />
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tags?.map(t => <span key={t} className="text-[6px] bg-[#7D68F6] px-2 py-0.5 rounded-full uppercase font-bold text-white">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TALENTS GRID */}
      {showResults && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full max-w-7xl px-4">
          {TALENTS_DATA.map((talent) => (
            <div key={talent.id} onClick={() => setSelectedTalent(talent)} className="p-6 rounded-[2.5rem] border border-white/5 bg-white/[0.03] cursor-pointer flex flex-col items-center group hover:border-[#7D68F6]/50 transition-all text-center">
              <img src={talent.img} className="w-14 h-14 rounded-full border-2 border-white/10 mb-4 grayscale group-hover:grayscale-0" />
              <h3 className="text-[11px] mrm-bold uppercase">{talent.name}</h3>
              <p className="text-[9px] text-gray-500 uppercase mb-3">{talent.role}</p>
              <div className="flex flex-wrap justify-center gap-1">
                {talent.tags.map(t => <span key={t} className="text-[7.5px] border border-white/10 px-2 py-0.5 rounded-full uppercase text-gray-400">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL PERSONA */}
      <AnimatePresence>
        {selectedTalent && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedTalent(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative w-full max-w-4xl bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-12 flex flex-col md:flex-row gap-12 text-left">
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <img src={selectedTalent.img} className="w-32 h-32 rounded-full mb-8 object-cover" />
                <h2 className="text-2xl mrm-bold uppercase text-center">{selectedTalent.name}</h2>
                <div className="flex gap-2 mt-3 flex-wrap justify-center">
                   {selectedTalent.tags.map(t => <span key={t} className="text-[8.5px] bg-[#7D68F6]/20 text-[#7D68F6] px-3 py-1 rounded-full border border-[#7D68F6]/30 uppercase font-bold">{t}</span>)}
                </div>
                <button onClick={() => toggleMember(selectedTalent)} className="mt-10 w-full py-5 rounded-2xl text-[11px] mrm-bold uppercase bg-[#7D68F6]">
                  {myTeam.find(m => m.id === selectedTalent.id) ? "Remove Member" : "Add to Team"}
                </button>
              </div>
              <div className="flex-1 py-2">
                <p className="text-[15px] text-gray-400 leading-relaxed inter-light">{selectedTalent.bio}</p>
              </div>
              <button onClick={() => setSelectedTalent(null)} className="absolute top-8 right-8 text-white/40"><X /></button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL PROYECTO */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedProject(null)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="relative w-full max-w-5xl bg-[#0A0A0A] border border-white/10 rounded-[3rem] overflow-hidden flex h-[70vh]">
              <div className="w-1/2 h-full relative">
                <img src={selectedProject.img} className="w-full h-full object-cover opacity-40" />
                <div className="absolute bottom-10 left-10 p-2">
                  <h2 className="text-3xl mrm-bold uppercase mb-3">{selectedProject.title}</h2>
                  <div className="flex gap-2.5">
                    {selectedProject.tags?.map(t => <span key={t} className="text-[9.5px] border border-[#7D68F6] text-[#7D68F6] px-3 py-1 rounded-full uppercase font-bold">{t}</span>)}
                  </div>
                </div>
              </div>
              <div className="w-1/2 p-12 flex flex-col bg-[#0A0A0A]">
                <p className="text-sm text-gray-400 mb-8">{selectedProject.desc}</p>
                <div className="flex-1 overflow-y-auto space-y-4 hide-scrollbar">
                  {selectedProject.team?.map(m => (
                    <div key={m.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <img src={m.img} className="w-10 h-10 rounded-full" />
                      <p className="text-[10px] mrm-bold uppercase">{m.name}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => addWholeTeam(selectedProject.team)} className="mt-8 w-full py-5 bg-[#7D68F6] mrm-bold uppercase text-[10px] rounded-2xl tracking-[0.2em]">Add Whole Team</button>
              </div>
              <button onClick={() => setSelectedProject(null)} className="absolute top-8 right-8"><X /></button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BOTÓN PERMANENTE MY TEAM */}
      {myTeam.length > 0 && (
        <div className="fixed bottom-10 right-10 z-[100] bg-black/80 border border-white/10 p-2 pl-6 rounded-full flex items-center gap-6 backdrop-blur-xl">
          <span className="text-[10px] mrm-bold uppercase text-[#7D68F6]">Team ({myTeam.length})</span>
          <button className="px-8 py-3 rounded-full bg-[#7D68F6] text-[10px] mrm-bold uppercase">View Build</button>
        </div>
      )}
    </div>
  );
}

export default App;