import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Globe, Cpu, Palette, BarChart3, ChevronLeft, ChevronRight, ArrowUpRight, Layers, Bot, UserPlus, UserMinus, Users } from 'lucide-react';

const MAIN_LILA = "#7D68F6"; 

const SKILLS_DATA = [
  { 
    id: 1, name: "Estratégico", role: "Consultoría Senior", icon: <Globe size={26}/>,
    projects: [
      { title: "Digital Roadmap 2030", desc: "Planificación maestra de transformación digital.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80" },
      { title: "M&A Integration", desc: "Sinergia operativa en fusiones corporativas.", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80" }
    ]
  },
  { 
    id: 2, name: "Desarrollo", role: "Arquitectura Cloud", icon: <Cpu size={26}/>,
    projects: [
      { title: "Microservices Architecture", desc: "Ecosistema escalable en AWS y Docker.", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80" },
      { title: "Kubernetes Core", desc: "Orquestación de contenedores de alta disponibilidad.", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?w=400&q=80" }
    ]
  },
  { 
    id: 3, name: "Creative", role: "Design Systems", icon: <Palette size={26}/>,
    projects: [
      { title: "Global UI Kit", desc: "Librería de componentes atómicos para React.", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&q=80" }
    ]
  },
];

const TALENTS_DATA = [
  { id: 1, name: "Alex Rivera", role: "Cloud Architect", tags: ["AWS", "Terraform"], img: "https://i.pravatar.cc/150?u=alex" },
  { id: 2, name: "Elena Sanz", role: "UX Lead", tags: ["Research", "Figma"], img: "https://i.pravatar.cc/150?u=elena" },
  { id: 3, name: "Marc Costa", role: "Data Scientist", tags: ["Python", "AI"], img: "https://i.pravatar.cc/150?u=marc" },
  { id: 4, name: "Sara Moon", role: "Art Director", tags: ["Branding", "3D"], img: "https://i.pravatar.cc/150?u=sara" },
];

function App() {
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [currentChat, setCurrentChat] = useState({ user: null, ai: 'Sistema activo. Describe tu proyecto.' });
  const [isTyping, setIsTyping] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [myTeam, setMyTeam] = useState([]);

  const toggleMember = (talent) => {
    if (myTeam.find(m => m.id === talent.id)) {
      setMyTeam(myTeam.filter(m => m.id !== talent.id));
    } else {
      setMyTeam([...myTeam, talent]);
    }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setCurrentChat({ user: input, ai: null });
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setCurrentChat(prev => ({ ...prev, ai: 'Análisis completo. He filtrado los mejores activos para ti.' }));
      setShowResults(true);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center text-white relative pb-32 px-6 overflow-x-hidden" 
         style={{ background: `radial-gradient(circle at 50% 0%, #1a0b3d 0%, #0A0A0A 60%)` }}>
      
      {/* 1. HEADER */}
      <motion.header className="w-full max-w-5xl text-center pt-16 mb-12 relative z-10">
        <h1 className="text-[100px] leading-none tracking-[-0.05em] mrm-bold text-white uppercase select-none">MRM</h1>
        <p className="text-[10px] uppercase tracking-[0.9em] text-gray-500 mt-4 inter-light">Creative Credentials</p>
      </motion.header>

      {/* 2. CHAT AREA */}
      <div className="w-full max-w-5xl flex flex-col space-y-6 z-20 px-4 mb-20">
        <AnimatePresence>
          {currentChat.user && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="self-end py-2.5 px-6 rounded-2xl rounded-tr-none text-white text-[12px] mrm-bold shadow-lg"
              style={{ backgroundColor: MAIN_LILA }}>
              {currentChat.user}
            </motion.div>
          )}
        </AnimatePresence>

        {/* INPUT BOX */}
        <div className="w-full flex justify-center pt-6">
          <div className="w-full max-w-xl flex items-center bg-white/[0.04] border border-white/10 rounded-full px-6 py-3 focus-within:border-[#7D68F6]/50 transition-all backdrop-blur-md">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Busca perfiles o proyectos..." className="bg-transparent flex-1 outline-none text-[13px] text-white/70 py-1" />
            <button onClick={handleSendMessage} className="ml-3 w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110" style={{ backgroundColor: MAIN_LILA }}>
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. PROJECTS BY SKILL (Carrusel + Proyectos Permanentes) */}
      <div className="flex flex-col items-center mb-24">
        <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 inter-light mb-6">Projects by Skill</p>
        <div className="flex items-center gap-8 mb-10">
          <ChevronLeft onClick={() => setCurrentIndex(prev => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length)} className="opacity-20 hover:opacity-100 cursor-pointer" />
          <div className="w-72 p-5 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center gap-5 shadow-xl transition-all hover:border-[#7D68F6]/30">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-[#7D68F6]/20" style={{ backgroundColor: `${MAIN_LILA}1A`, color: MAIN_LILA }}>
              {SKILLS_DATA[currentIndex].icon}
            </div>
            <div className="text-left leading-tight">
              <p className="text-[12px] uppercase text-white/90 mrm-bold">{SKILLS_DATA[currentIndex].name}</p>
              <p className="text-[10px] text-gray-500 inter-light uppercase mt-0.5">{SKILLS_DATA[currentIndex].role}</p>
            </div>
          </div>
          <ChevronRight onClick={() => setCurrentIndex(prev => (prev + 1) % SKILLS_DATA.length)} className="opacity-20 hover:opacity-100 cursor-pointer" />
        </div>

        <div className="flex justify-center gap-4 h-12">
          <AnimatePresence mode="wait">
            <motion.div key={currentIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex gap-4">
              {SKILLS_DATA[currentIndex].projects.map((proj, idx) => (
                <div key={idx} onMouseEnter={() => setHoveredProject(proj)} onMouseLeave={() => setHoveredProject(null)}
                  className="relative px-5 py-2 rounded-full border border-white/5 bg-white/[0.03] flex items-center gap-2.5 backdrop-blur-sm cursor-help hover:bg-white/5 transition-all">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: MAIN_LILA, boxShadow: `0 0 8px ${MAIN_LILA}` }} />
                  <span className="text-[10px] uppercase mrm-bold text-gray-400 tracking-widest">{proj.title}</span>
                  <AnimatePresence>
                    {hoveredProject === proj && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-52 bg-[#1A1A1A] border border-white/10 rounded-xl p-3 shadow-2xl z-50 tooltip-fade">
                        <img src={proj.img} className="w-full h-24 object-cover rounded-lg mb-2" />
                        <h4 className="text-[11px] mrm-bold uppercase leading-tight mb-1">{proj.title}</h4>
                        <p className="text-[9px] text-gray-500 inter-light leading-snug">{proj.desc}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 4. SEARCH TALENTS (Con animaciones y hovers personalizados) */}
      <div className="w-full max-w-5xl flex flex-col items-center">
        <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 inter-light mb-8">Search Talents</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
          {TALENTS_DATA.map((talent) => {
            const isSelected = myTeam.find(m => m.id === talent.id);
            return (
              <motion.div
                key={talent.id}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`group p-5 rounded-[2rem] border transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center ${
                  isSelected ? 'bg-white/[0.08]' : 'bg-white/[0.03] border-white/5'
                }`}
                style={{ borderColor: isSelected ? MAIN_LILA : 'rgba(255,255,255,0.05)' }}
              >
                {/* Imagen: Grayscale a Color en Hover */}
                <div className="relative mb-4">
                  <img 
                    src={talent.img} 
                    className={`w-16 h-16 rounded-full border-2 transition-all duration-500 object-cover ${
                      isSelected ? 'border-[#7D68F6] grayscale-0 scale-105' : 'border-white/10 grayscale group-hover:grayscale-0 group-hover:scale-105'
                    }`}
                  />
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#7D68F6] flex items-center justify-center border-2 border-[#0A0A0A]">
                      <Users size={10} className="text-white" />
                    </div>
                  )}
                </div>

                <h3 className="text-[12px] mrm-bold uppercase tracking-tight text-white/90">{talent.name}</h3>
                <p className="text-[10px] text-gray-500 uppercase mt-1 inter-light">{talent.role}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap justify-center gap-1.5 my-4">
                  {talent.tags.map(tag => (
                    <span key={tag} className="text-[7px] px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-gray-400 uppercase mrm-bold group-hover:border-[#7D68F6]/20 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Botón interactivo */}
                <button 
                  onClick={() => toggleMember(talent)}
                  className="w-full py-2.5 rounded-xl text-[9px] mrm-bold uppercase flex items-center justify-center gap-2 transition-all active:scale-95"
                  style={{ 
                    backgroundColor: isSelected ? `${MAIN_LILA}33` : 'rgba(255,255,255,0.05)',
                    color: isSelected ? MAIN_LILA : 'white'
                  }}
                >
                  {isSelected ? <><UserMinus size={12}/> Remove</> : <><UserPlus size={12}/> Add to Team</>}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 5. PERSISTENT MY TEAM BUTTON */}
      <AnimatePresence>
        {myTeam.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 right-10 z-50 flex items-center gap-4 bg-black/80 border border-white/10 p-2.5 pl-6 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            <div className="flex -space-x-3">
              {myTeam.map(m => (
                <motion.img 
                  layout key={m.id} src={m.img} 
                  className="w-9 h-9 rounded-full border-2 border-[#0A0A0A] object-cover" 
                />
              ))}
            </div>
            <div className="h-5 w-[1px] bg-white/10 mx-1" />
            <button 
              className="flex items-center gap-3 px-6 py-2.5 rounded-full text-[11px] mrm-bold uppercase transition-all hover:brightness-110 active:scale-95 shadow-lg"
              style={{ backgroundColor: MAIN_LILA, boxShadow: `0 0 20px ${MAIN_LILA}44` }}
            >
              <Users size={16} />
              My Team <span className="opacity-60">({myTeam.length})</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;