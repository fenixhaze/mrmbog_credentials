import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Globe, Cpu, Palette, Search, Zap, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

const SKILLS_DATA = [
  { 
    id: 1, name: "ESTRATÉGICO", role: "CONSULTORÍA SENIOR", icon: <Globe size={32} />,
    projects: [
      { id: 101, title: "DIGITAL ROADMAP", img: "https://picsum.photos/seed/mrm1/1200/800", tags: ["Strategy", "Fintech"], desc: "Transformación digital maestra para el sector bancario global." },
      { id: 102, title: "MARKET ENTRY", img: "https://picsum.photos/seed/mrm2/1200/800", tags: ["Data", "Expansion"], desc: "Expansión estratégica en mercados emergentes de LATAM." },
      { id: 103, title: "B2B GROWTH", img: "https://picsum.photos/seed/mrm3/1200/800", tags: ["Sales", "B2B"], desc: "Estructura de escalabilidad para servicios corporativos." },
      { id: 104, title: "BRAND EQUITY", img: "https://picsum.photos/seed/mrm4/1200/800", tags: ["Branding", "Global"], desc: "Reposicionamiento de marca para consumo masivo." }
    ] 
  }
];

const TALENTS_LIST = [
  { name: "Agustina De Girolamo", role: "UX/UI Analyst" },
  { name: "Mariapaula Fernandez", role: "Middle Digital Designer" },
  { name: "Mariana Ceballos", role: "Middle Digital Designer" },
  { name: "Isabela Rivera", role: "Senior Digital Designer" },
  { name: "Christian Sneyder Lemus", role: "Art Director" },
  { name: "Maria Alejandra Orjuela", role: "Middle Digital Designer" },
  { name: "Emmanuel Rodriguez", role: "Project Manager" },
  { name: "Estefania Barbosa", role: "Middle Digital Designer" },
  { name: "Tania Viviana Espitia", role: "UX UI Designer" },
  { name: "Andres Mateo Sanchez", role: "UX UI Designer" },
  { name: "Camila Ortiz", role: "Art Director" },
  { name: "Daniela Larrota", role: "UX Project Manager" },
  { name: "Paula Martinez", role: "Information Architect Specialist" },
  { name: "German Bernardo Jose Herrera", role: "Creative Director" },
  { name: "Darwin Jose Silva", role: "Art Director" },
  { name: "Stephany Diaz", role: "Senior Digital Designer" },
  { name: "Laura Patino", role: "Creative Operations Manager" },
  { name: "Ana Maria Nino", role: "Middle Digital Designer" },
  { name: "David Ricardo Angel", role: "Middle Digital Designer" },
  { name: "Sara Maria Builes", role: "Senior Digital Designer" },
  { name: "Mariana Osorio", role: "Middle Digital Designer" },
  { name: "Camilo Esteban Vaca", role: "Middle Digital Designer" },
  { name: "Juan Pablo Pabon", role: "Senior Digital Designer" },
  { name: "Juan Diego Cordoba", role: "Senior Presentation Designer" },
  { name: "Juan Camilo Bahamon", role: "Senior UX/UI Designer" },
  { name: "Marina Esther Montero", role: "Middle Digital Designer" }
].map((t, i) => ({
  ...t,
  id: i,
  skills: ["DESIGN", "DIGITAL", "CREATIVE"].sort(() => 0.5 - Math.random()).slice(0, 2),
  img: `https://i.pravatar.cc/150?u=mrm${i}`
}));

function App() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([{ type: 'ai', text: "Bienvenido al sistema de credenciales interactivas, Describe tu requerimiento y necesidades" }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (!input.trim() || isProcessing) return;
    setIsProcessing(true);
    setChatHistory(prev => [...prev, { type: 'user', text: input }]);
    setInput('');
    
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        text: "He identificado estos proyectos y el equipo idóneo para tu reto:",
        responseProjects: SKILLS_DATA[0].projects 
      }]);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col items-center overflow-x-hidden pb-40 relative">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_15%,#1a0b3d_0%,#0A0A0A_75%)] z-0" />

      <header className="w-full pt-16 z-10 text-center flex flex-col items-center shrink-0">
        <h1 className="text-[90px] leading-[0.8] tracking-[-0.05em] font-black uppercase mrm-bold italic">MRM</h1>
        <p className="text-[11px] mrm-bold uppercase tracking-[1em] text-[#7D68F6] mt-4 ml-4">BOGOTA CREATIVE CREDENTIALS</p>
      </header>

      <section className="w-full max-w-2xl z-20 mt-12 flex flex-col items-center px-6">
        <div ref={chatContainerRef} className="w-full h-[380px] overflow-y-auto mb-6 flex flex-col gap-6 scroll-smooth hide-scrollbar p-2" style={{ maskImage: 'linear-gradient(to top, black 85%, transparent 100%)' }}>
          <AnimatePresence initial={false}>
            {chatHistory.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col gap-4 ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 px-6 rounded-[2rem] text-[13px] border shadow-xl w-fit max-w-[85%] ${msg.type === 'user' ? 'bg-[#7D68F6] border-[#7D68F6] rounded-tr-none' : 'bg-white/5 border-white/10 backdrop-blur-md rounded-tl-none'}`}>
                  {msg.text}
                </div>
                {msg.responseProjects && (
                  <div className="flex gap-3 overflow-x-auto pb-4 max-w-full hide-scrollbar">
                    {msg.responseProjects.map((p) => (
                      <motion.div key={p.id} whileHover={{ y: -5 }} onClick={() => setSelectedProject(p)} className="min-w-[160px] bg-white/5 border border-white/10 p-3 rounded-[1.8rem] cursor-pointer hover:border-[#7D68F6]/50 transition-all">
                        <img src={p.img} className="w-full h-20 object-cover rounded-[1.2rem] mb-2" />
                        <h4 className="text-[9px] mrm-bold uppercase truncate px-1 text-white/80">{p.title}</h4>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="w-full flex items-center bg-white/[0.03] border border-white/10 rounded-full px-7 py-4 backdrop-blur-2xl shadow-2xl">
          <Search size={18} className="text-white/20 mr-4" />
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
            placeholder="" 
            className="bg-transparent flex-1 outline-none text-[13px] uppercase tracking-widest font-light" 
          />
          <button onClick={handleSendMessage} className="ml-3 w-11 h-11 rounded-full bg-[#7D68F6] flex items-center justify-center hover:scale-110 transition-all"><Send size={18}/></button>
        </div>
      </section>

      <div className="w-full max-w-6xl mt-32 mb-12 z-10 flex flex-col items-center">
        <div className="h-[1px] w-20 bg-[#7D68F6] mb-8" />
        <h3 className="text-[12px] font-black tracking-[0.8em] text-white/30 uppercase">Ecosistema de Capacidades</h3>
      </div>

      <section className="w-full max-w-5xl z-10 flex flex-col items-center mb-40 px-6">
        <div className="flex items-center justify-between w-full mb-12">
          <button onClick={() => setCurrentIndex(p => (p - 1 + SKILLS_DATA.length) % SKILLS_DATA.length)} className="p-3 border border-white/10 rounded-full hover:bg-white/5"><ChevronLeft size={24}/></button>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-5xl mrm-bold uppercase tracking-tighter">{SKILLS_DATA[currentIndex].name}</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.5em] mt-2 font-bold">{SKILLS_DATA[currentIndex].role}</p>
          </div>
          <button onClick={() => setCurrentIndex(p => (p + 1) % SKILLS_DATA.length)} className="p-3 border border-white/10 rounded-full hover:bg-white/5"><ChevronRight size={24}/></button>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {SKILLS_DATA[currentIndex].projects.map((p) => (
            <div key={p.id} className="group relative px-8 py-4 rounded-full border border-white/10 bg-white/5 cursor-pointer hover:border-[#7D68F6] transition-all" onClick={() => setSelectedProject(p)}>
              <span className="text-[14px] mrm-bold uppercase tracking-widest">{p.title}</span>
              <div className="absolute bottom-[140%] left-1/2 -translate-x-1/2 w-[400px] bg-[#0A0A0A] border border-white/20 p-6 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all z-50 pointer-events-none shadow-2xl scale-95 group-hover:scale-100">
                <img src={p.img} className="w-full h-40 object-cover rounded-[1.5rem] mb-4" />
                <h3 className="text-xl mrm-bold uppercase mb-2">{p.title}</h3>
                <p className="text-gray-400 text-xs font-light leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="w-full max-w-6xl mb-16 z-10 flex flex-col items-center">
        <div className="h-[1px] w-20 bg-[#7D68F6] mb-8" />
        <h3 className="text-[12px] font-black tracking-[0.8em] text-white/30 uppercase">Seniority & Talent</h3>
      </div>

      <section className="w-full max-w-7xl px-10 z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {TALENTS_LIST.map(t => (
          <motion.div key={t.id} whileHover={{ y: -8, borderColor: '#7D68F6' }} className="flex flex-col items-center bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] group transition-all duration-300">
            <div className="relative mb-5">
               <img src={t.img} className="w-16 h-16 rounded-full grayscale group-hover:grayscale-0 transition-all border border-white/10" />
               <Zap size={12} className="absolute bottom-0 right-0 text-[#7D68F6] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-[12px] mrm-bold uppercase mb-1 text-center leading-tight">{t.name}</h4>
            <p className="text-[8px] text-gray-500 uppercase tracking-widest mb-4 text-center h-4">{t.role}</p>
            <div className="flex flex-wrap justify-center gap-1">
              {t.skills.map(s => (
                <span key={s} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[6px] font-black text-white/40 group-hover:text-[#7D68F6] transition-colors">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </section>

      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80" onClick={() => setSelectedProject(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#0D0D0D] border border-white/10 w-full max-w-5xl rounded-[3rem] overflow-hidden relative shadow-2xl" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedProject(null)} className="absolute top-8 right-8 z-[110] p-3 bg-white/5 rounded-full hover:bg-[#7D68F6] transition-all"><X size={20}/></button>
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 h-[500px]"><img src={selectedProject.img} className="w-full h-full object-cover" /></div>
                <div className="md:w-1/2 p-12 flex flex-col justify-center text-left">
                  <h2 className="text-5xl mrm-bold uppercase mb-6 leading-none">{selectedProject.title}</h2>
                  <p className="text-lg text-gray-400 font-light mb-8">{selectedProject.desc}</p>
                  <div className="flex gap-2 mb-8">{selectedProject.tags.map(t => <span key={t} className="px-5 py-2 bg-[#7D68F6] text-white rounded-full text-[10px] font-black uppercase tracking-widest">{t}</span>)}</div>
                  <button className="flex items-center gap-3 text-[#7D68F6] uppercase text-[10px] font-black tracking-[0.2em]"><Maximize2 size={14}/> Full Case Study</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;