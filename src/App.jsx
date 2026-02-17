import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Globe, Cpu, Palette, BarChart3, ChevronLeft, ChevronRight, ArrowUpRight, Layers, Bot } from 'lucide-react';

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
      { title: "Global UI Kit", desc: "Librería de componentes atómicos para React.", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&q=80" },
      { title: "Brand Identity 360", desc: "Rediseño de lenguaje visual corporativo.", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80" }
    ]
  },
  { 
    id: 4, name: "Data", role: "ML & Analytics", icon: <BarChart3 size={26}/>,
    projects: [
      { title: "Predictive Churn", desc: "Modelos de IA para retención de usuarios.", img: "https://images.unsplash.com/photo-1551288049-bbda38a10ad5?w=400&q=80" },
      { title: "Data Lake Setup", desc: "Infraestructura para procesamiento masivo.", img: "https://images.unsplash.com/photo-1518186239717-2e9b13673603?w=400&q=80" }
    ]
  },
];

const PROJECTS_DATA = [
  { id: 1, title: "Plataforma Core Banking", desc: "Modernización de infraestructura legacy.", color: "from-indigo-500/20" },
  { id: 2, title: "Ecosistema Retail AR", desc: "Experiencia de compra inmersiva.", color: "from-purple-500/20" },
];

function App() {
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [currentChat, setCurrentChat] = useState({ user: null, ai: 'Sistema activo. Describe tu proyecto.' });
  const [isTyping, setIsTyping] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setCurrentChat({ user: input, ai: null });
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setCurrentChat(prev => ({ ...prev, ai: 'He encontrado casos que coinciden con tu búsqueda.' }));
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center text-white relative pb-20 px-6 overflow-x-hidden" 
         style={{ background: `radial-gradient(circle at 50% 0%, #1a0b3d 0%, #0A0A0A 60%)` }}>
      
      {/* 1. HEADER */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl text-center pt-16 mb-12 relative z-10"
      >
        <h1 className="text-[100px] leading-none tracking-[-0.05em] mrm-bold text-white uppercase select-none">MRM</h1>
        <p className="text-[10px] uppercase tracking-[0.9em] text-gray-500 mt-4 inter-light">Creative Credentials</p>
      </motion.header>

      {/* 2. CHAT AREA */}
      <div className="w-full max-w-5xl flex flex-col space-y-6 z-20 px-4">
        {currentChat.user && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="self-end py-2.5 px-6 rounded-2xl rounded-tr-none text-white text-[12px] mrm-bold shadow-lg"
            style={{ backgroundColor: MAIN_LILA, boxShadow: `0 10px 15px -3px ${MAIN_LILA}33` }}>
            {currentChat.user}
          </motion.div>
        )}

        <div className="w-full flex justify-start">
          <AnimatePresence mode="wait">
            {isTyping ? (
              <div className="flex gap-2 p-4 ml-12">
                {[0, 1].map(i => (
                  <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} 
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }} 
                    className="w-2 h-2 rounded-full" style={{ backgroundColor: MAIN_LILA }} />
                ))}
              </div>
            ) : (
              <motion.div 
                className={`flex gap-6 rounded-[2.5rem] border backdrop-blur-md transition-all duration-500 overflow-hidden ${showResults ? 'w-full p-8' : 'w-auto max-w-lg p-5'}`}
                style={{ borderColor: `${MAIN_LILA}33`, backgroundColor: `rgba(255, 255, 255, 0.02)` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7D68F6]/40 to-transparent flex-shrink-0 flex items-center justify-center border border-white/10">
                  <Bot size={28} style={{ color: MAIN_LILA }} />
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <h2 className={`mrm-bold text-white uppercase tracking-tight ${showResults ? 'text-xl mb-6' : 'text-[14px]'}`}>
                    {currentChat.ai}
                  </h2>
                  {showResults && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {PROJECTS_DATA.map((proj) => (
                        <div key={proj.id} className="flex gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-[#7D68F6]/50 transition-all group">
                          <div className="w-16 h-16 rounded-xl flex-shrink-0 bg-white/5 flex items-center justify-center">
                            <Layers size={18} className="text-white/20 group-hover:text-[#7D68F6] transition-colors" />
                          </div>
                          <div className="flex flex-col justify-center flex-1">
                            <h3 className="text-[11px] mrm-bold uppercase leading-none">{proj.title}</h3>
                            <p className="text-[10px] text-gray-500 inter-light mt-1.5">{proj.desc}</p>
                            <button className="text-[9px] uppercase mrm-bold mt-3 flex items-center gap-1.5 hover:text-white transition-colors" style={{ color: MAIN_LILA }}>
                              Ver Detalles <ArrowUpRight size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* INPUT */}
        <div className="w-full flex justify-center pt-6">
          <div className="w-full max-w-xl flex items-center bg-white/[0.04] border border-white/10 rounded-full px-6 py-3 focus-within:border-[#7D68F6]/50 transition-all backdrop-blur-md">
            <input 
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describe tu consulta aquí..."
              className="bg-transparent flex-1 outline-none text-[13px] text-white/70 py-1"
            />
            <button onClick={handleSendMessage} className="ml-3 w-9 h-9 rounded-full flex items-center justify-center hover:scale-105 transition-transform" style={{ backgroundColor: MAIN_LILA }}>
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. PROJECTS BY SKILL (CORREGIDO) */}
      <div className="mt-28 flex flex-col items-center">
        {/* Aquí está el cambio de título solicitado */}
        <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 inter-light mb-6">Projects by Skill</p>
        
        <div className="flex items-center gap-8 mb-10">
          <ChevronLeft onClick={() => setCurrentIndex(prev => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length)} className="opacity-20 hover:opacity-100 cursor-pointer transition-all" />
          
          <div className="w-72 p-5 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center gap-5 shadow-xl transition-all hover:border-[#7D68F6]/30">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-[#7D68F6]/20" style={{ backgroundColor: `${MAIN_LILA}1A`, color: MAIN_LILA }}>
              {SKILLS_DATA[currentIndex].icon}
            </div>
            <div className="text-left leading-tight">
              <p className="text-[12px] uppercase text-white/90 mrm-bold">{SKILLS_DATA[currentIndex].name}</p>
              <p className="text-[10px] text-gray-500 inter-light uppercase mt-0.5">{SKILLS_DATA[currentIndex].role}</p>
            </div>
          </div>
          
          <ChevronRight onClick={() => setCurrentIndex(prev => (prev + 1) % SKILLS_DATA.length)} className="opacity-20 hover:opacity-100 cursor-pointer transition-all" />
        </div>

        {/* PROYECTOS CATEGORÍA */}
        <div className="flex justify-center h-12">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-4"
            >
              {SKILLS_DATA[currentIndex].projects.map((proj, idx) => (
                <div 
                  key={idx}
                  onMouseEnter={() => setHoveredProject(proj)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="relative px-5 py-2 rounded-full border border-white/5 bg-white/[0.03] flex items-center gap-2.5 backdrop-blur-sm cursor-help transition-all hover:bg-white/5"
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: MAIN_LILA, boxShadow: `0 0 8px ${MAIN_LILA}` }} />
                  <span className="text-[10px] uppercase mrm-bold text-gray-400 tracking-widest">{proj.title}</span>

                  <AnimatePresence>
                    {hoveredProject === proj && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-52 bg-[#1A1A1A] border border-white/10 rounded-xl p-3 shadow-2xl z-50 tooltip-fade"
                      >
                        <img src={proj.img} className="w-full h-24 object-cover rounded-lg mb-2" alt="Preview" />
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
    </div>
  );
}

export default App;