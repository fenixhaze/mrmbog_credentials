import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Globe, Cpu, Palette, ChevronLeft, ChevronRight, 
  X, MessageSquare, ArrowRight, ExternalLink 
} from 'lucide-react';

// --- DATA: 26 TALENTOS (Restaurados con chips y bios) ---
const TALENTS_DATA = [];
for(let i=1; i<=26; i++) {
  TALENTS_DATA.push({
    id: i, 
    name: i === 1 ? "Alex Rivera" : i === 2 ? "Elena Sanz" : `Talento Experto ${i}`, 
    role: i === 1 ? "Cloud Architect" : i === 2 ? "UX Lead" : "Senior Specialist", 
    tags: ["AWS", "Terraform", "Docker"], 
    img: `https://i.pravatar.cc/150?u=${i}`,
    bio: "Especialista senior con trayectoria impecable en la ejecución de proyectos de transformación digital de alto impacto. Su enfoque combina una sólida base técnica con una visión estratégica orientada a resultados."
  });
}

const SKILLS_DATA = [
  { 
    id: 1, name: "Estratégico", role: "Consultoría Senior", icon: <Globe size={26}/>, 
    projects: [
      { title: "Digital Roadmap 2030", desc: "Transformación digital maestra.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", team: [TALENTS_DATA[0], TALENTS_DATA[1]] },
      { title: "Market Entry", desc: "Expansión en LATAM.", img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800", team: [TALENTS_DATA[2], TALENTS_DATA[3]] }
    ] 
  },
  { id: 2, name: "Desarrollo", role: "Arquitectura Cloud", icon: <Cpu size={26}/>, projects: [{ title: "Microservices", desc: "Ecosistema AWS.", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800", team: [TALENTS_DATA[4], TALENTS_DATA[5]] }] }
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
      setChatHistory(prev => [...prev, { type: 'ai', text: "Basado en tu requerimiento, estas son las capacidades recomendadas:" }]);
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

  return (
    <div className="flex min-h-screen w-full flex-col items-center text-white relative pb-40 px-6" 
         style={{ background: `radial-gradient(circle at 50% 0%, #1a0b3d 0%, #0A0A0A 60%)` }}>
      
      <header className="w-full max-w-5xl text-center pt-16 mb-12">
        <h1 className="text-[100px] leading-none tracking-[-0.05em] mrm-bold uppercase">MRM</h1>
        <p className="text-[10px] mrm-bold uppercase tracking-[0.8em] text-[#7D68F6] mt-2">BOGOTA CREATIVE CREDENTIALS</p>
      </header>

      {/* CHATBOX */}
      <div className="w-full max-w-2xl flex flex-col mb-12 z-20">
        <div className="relative h-[300px] overflow-hidden mb-4" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)' }}>
          <div ref={chatScrollRef} className="h-full overflow-y-auto pt-20 pb-4 px-2 space-y-6 hide-scrollbar scroll-smooth">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-6 rounded-3xl text-[13px] ${msg.type === 'user' ? 'bg-[#7D68F6] mrm-bold rounded-tr-none' : 'bg-white/5 border border-white/10 rounded-tl-none inter-light'}`}>{msg.text}</div>
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

      {/* CAROUSEL - AJUSTADO A MAX-W-2XL */}
      {showResults && (
        <div className="w-full max-w-2xl flex flex-col items-center mb-28">
          <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 mb-8">Capabilities</p>
          <div className="w-full flex items-center justify-between mb-8">
            <ChevronLeft onClick={() => setCurrentIndex(prev => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length)} className="cursor-pointer opacity-20 hover:opacity-100" />
            <div className="flex-1 mx-8 p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center gap-5">
              <div className="text-[#7D68F6]">{SKILLS_DATA[currentIndex]?.icon}</div>
              <div className="text-left">
                <p className="text-[14px] uppercase mrm-bold">{SKILLS_DATA[currentIndex]?.name}</p>
                <p className="text-[9px] text-gray-500 uppercase">{SKILLS_DATA[currentIndex]?.role}</p>
              </div>
            </div>
            <ChevronRight onClick={() => setCurrentIndex(prev => (prev + 1) % SKILLS_DATA.length)} className="cursor-pointer opacity-20 hover:opacity-100" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {SKILLS_DATA[currentIndex]?.projects?.map((proj, idx) => (
              <div key={idx} onClick={() => setSelectedProject(proj)} className="group relative px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.03] flex items-center gap-2.5 cursor-pointer hover:bg-white/10 transition-all">
                <div className="w-1.5 h-1.5 rounded-full bg-[#7D68F6]" />
                <span className="text-[10px] uppercase mrm-bold text-gray-300">{proj.title}</span>
                {/* TOOLTIP RESTAURADO */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#7D68F6] text-[8px] mrm-bold uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[60] pointer-events-none">
                  Click to view project
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PERSON GRID */}
      {showResults && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full max-w-7xl px-4">
          {TALENTS_DATA.map((talent) => (
            <motion.div key={talent.id} whileHover={{ y: -5 }} onClick={() => setSelectedTalent(talent)} className="p-6 rounded-[2.5rem] border border-white/5 bg-white/[0.03] cursor-pointer flex flex-col items-center">
              <img src={talent.img} className="w-14 h-14 rounded-full border-2 border-white/10 mb-4 grayscale hover:grayscale-0" />
              <h3 className="text-[11px] mrm-bold uppercase text-center">{talent.name}</h3>
              <p className="text-[9px] text-gray-500 uppercase text-center mb-3">{talent.role}</p>
              <div className="flex gap-1">
                {talent.tags.slice(0, 2).map(t => <span key={t} className="text-[6px] border border-white/10 px-1 rounded uppercase">{t}</span>)}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* MODAL PROYECTO */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedProject(null)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative w-full max-w-5xl bg-[#0A0A0A] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col md:flex-row h-[70vh]">
              <div className="w-1/2 h-full relative">
                <img src={selectedProject.img} className="w-full h-full object-cover opacity-50" />
                <div className="absolute bottom-10 left-10"><h2 className="text-3xl mrm-bold uppercase">{selectedProject.title}</h2></div>
              </div>
              <div className="w-1/2 p-12 flex flex-col">
                <p className="text-gray-400 mb-8">{selectedProject.desc}</p>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 hide-scrollbar">
                  {selectedProject.team.map(m => (
                    <div key={m.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <img src={m.img} className="w-10 h-10 rounded-full" />
                      <div><p className="text-[10px] mrm-bold uppercase">{m.name}</p><p className="text-[8px] text-gray-500 uppercase">{m.role}</p></div>
                    </div>
                  ))}
                </div>
                <button onClick={() => addWholeTeam(selectedProject.team)} className="mt-8 w-full py-5 bg-[#7D68F6] mrm-bold uppercase text-[10px] rounded-2xl">Add Whole Team</button>
              </div>
              <button onClick={() => setSelectedProject(null)} className="absolute top-8 right-8"><X /></button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHATLOG */}
      <div className="fixed bottom-10 left-10 z-[100] flex flex-col items-start gap-2 max-w-[280px]">
        <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-2"><MessageSquare size={12}/> Chatlog</div>
        <div className="flex flex-col-reverse gap-2 overflow-y-auto max-h-[160px] pr-2 hide-scrollbar text-[9px] text-white/40 italic">
          {chatHistory.map((msg, idx) => <div key={idx} className="line-clamp-1">{msg.text}</div>)}
        </div>
      </div>
    </div>
  );
}

export default App;