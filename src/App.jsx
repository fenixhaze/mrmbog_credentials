import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Globe, Cpu, Palette, BarChart3, ChevronLeft, ChevronRight, 
  ArrowUpRight, Layers, Bot, UserPlus, UserMinus, Users, X 
} from 'lucide-react';

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
  { 
    id: 1, name: "Alex Rivera", role: "Cloud Architect", 
    tags: ["AWS", "Terraform"], img: "https://i.pravatar.cc/150?u=alex",
    bio: "Especialista en infraestructuras resilientes con más de 8 años optimizando entornos cloud para fintechs globales.",
    secondarySkills: ["Docker", "Kubernetes", "Python", "Security Compliance"],
    projects: [
      { name: "NeoBank Scale", year: "2024", task: "Migración total a microservicios." },
      { name: "Global CDN Setup", year: "2023", task: "Optimización de latencia en 4 continentes." }
    ]
  },
  { 
    id: 2, name: "Elena Sanz", role: "UX Lead", 
    tags: ["Research", "Figma"], img: "https://i.pravatar.cc/150?u=elena",
    bio: "Enfocada en diseño centrado en el usuario y sistemas de diseño escalables que conectan marcas con emociones.",
    secondarySkills: ["Design Systems", "Prototyping", "User Testing", "Adobe Suite"],
    projects: [
      { name: "Eco-App Redesign", year: "2024", task: "Aumento del 40% en retención de usuarios." },
      { name: "B2B Dashboard", year: "2023", task: "Simplificación de flujos de datos complejos." }
    ]
  },
  { 
    id: 3, name: "Marc Costa", role: "Data Scientist", 
    tags: ["Python", "AI"], img: "https://i.pravatar.cc/150?u=marc",
    bio: "Experto en modelos predictivos y procesamiento de lenguaje natural aplicado a la optimización de ventas.",
    secondarySkills: ["SQL", "Tableau", "PyTorch", "Data Cleansing"],
    projects: [
      { name: "AI Sales Predictor", year: "2024", task: "Reducción de error en stock del 15%." },
      { name: "Sentiment Analysis Bot", year: "2023", task: "Clasificación automática de 1M+ tickets." }
    ]
  },
  { 
    id: 4, name: "Sara Moon", role: "Art Director", 
    tags: ["Branding", "3D"], img: "https://i.pravatar.cc/150?u=sara",
    bio: "Visionaria creativa que fusiona el arte tradicional con tecnologías 3D de vanguardia para campañas de alto impacto.",
    secondarySkills: ["Blender", "After Effects", "Webflow", "Conceptual Art"],
    projects: [
      { name: "Metaverse Brand Kit", year: "2024", task: "Identidad visual para entornos VR." },
      { name: "Cannes Lion Promo", year: "2023", task: "Dirección de arte para campaña premiada." }
    ]
  },
];

function App() {
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [myTeam, setMyTeam] = useState([]);
  const [hoveredProject, setHoveredProject] = useState(null);

  const toggleMember = (talent) => {
    if (myTeam.find(m => m.id === talent.id)) {
      setMyTeam(myTeam.filter(m => m.id !== talent.id));
    } else {
      setMyTeam([...myTeam, talent]);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center text-white relative pb-32 px-6 overflow-x-hidden" 
         style={{ background: `radial-gradient(circle at 50% 0%, #1a0b3d 0%, #0A0A0A 60%)` }}>
      
      {/* 1. HEADER */}
      <header className="w-full max-w-5xl text-center pt-16 mb-12 relative z-10">
        <h1 className="text-[100px] leading-none tracking-[-0.05em] mrm-bold uppercase select-none">MRM</h1>
        <p className="text-[10px] uppercase tracking-[0.9em] text-gray-500 mt-4 inter-light">Creative Credentials</p>
      </header>

      {/* 2. CHAT INPUT */}
      <div className="w-full max-w-xl mb-24 flex items-center bg-white/[0.04] border border-white/10 rounded-full px-6 py-3 focus-within:border-[#7D68F6]/50 transition-all backdrop-blur-md">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe tu proyecto" 
          className="bg-transparent flex-1 outline-none text-[13px] text-white/70 py-1" 
        />
        <button className="ml-3 w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110" style={{ backgroundColor: MAIN_LILA }}>
          <Send size={14} className="text-white" />
        </button>
      </div>

      {/* 3. PROJECTS BY SKILL */}
      <div className="flex flex-col items-center mb-28">
        <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 inter-light mb-8">Projects by Skill</p>
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

      {/* 4. SEARCH TALENTS */}
      <div className="w-full max-w-5xl flex flex-col items-center">
        <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 inter-light mb-10">Search Talents</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4">
          {TALENTS_DATA.map((talent) => {
            const isSelected = myTeam.find(m => m.id === talent.id);
            return (
              <motion.div
                key={talent.id}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedTalent(talent)}
                className={`group p-6 rounded-[2.5rem] border cursor-pointer transition-all duration-300 flex flex-col items-center relative z-10 ${
                  isSelected ? 'bg-white/[0.08]' : 'bg-white/[0.03] border-white/5'
                }`}
                style={{ borderColor: isSelected ? MAIN_LILA : 'rgba(255,255,255,0.05)' }}
              >
                <div className="relative mb-4">
                  <img 
                    src={talent.img} 
                    className={`w-16 h-16 rounded-full border-2 transition-all duration-500 object-cover ${
                      isSelected ? 'border-[#7D68F6] grayscale-0 scale-105' : 'border-white/10 grayscale group-hover:grayscale-0 group-hover:scale-105'
                    }`}
                  />
                </div>

                <h3 className="text-[12px] mrm-bold uppercase tracking-tight text-white/90">{talent.name}</h3>
                <p className="text-[10px] text-gray-500 uppercase mt-1 inter-light">{talent.role}</p>
                
                <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                  {talent.tags.map(tag => (
                    <span key={tag} className="text-[7px] px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-gray-400 mrm-bold group-hover:border-[#7D68F6]/20 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    toggleMember(talent); 
                  }}
                  className="w-full mt-5 py-2.5 rounded-xl text-[9px] mrm-bold uppercase flex items-center justify-center gap-2 transition-all active:scale-95"
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

      {/* 5. MODAL DE TALENTO */}
      <AnimatePresence>
        {selectedTalent && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedTalent(null)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-xl" 
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative w-full max-w-3xl bg-[#0A0A0A] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[1000]"
            >
              <button 
                onClick={() => setSelectedTalent(null)} 
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors z-50 p-2"
              >
                <X size={24}/>
              </button>
              
              <div className="flex flex-col md:flex-row min-h-[500px]">
                {/* Lateral Izquierdo */}
                <div className="w-full md:w-2/5 p-12 bg-white/[0.02] flex flex-col items-center border-r border-white/5">
                  <img src={selectedTalent.img} className="w-32 h-32 rounded-full border-4 border-[#7D68F6]/20 mb-6 object-cover" />
                  <h2 className="text-xl mrm-bold uppercase text-center leading-tight">{selectedTalent.name}</h2>
                  <p className="text-[10px] text-[#7D68F6] mrm-bold uppercase tracking-[0.2em] mt-2">{selectedTalent.role}</p>
                  
                  <button 
                    onClick={() => toggleMember(selectedTalent)}
                    className="mt-10 w-full py-4 rounded-2xl text-[10px] mrm-bold uppercase flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                    style={{ backgroundColor: myTeam.find(m => m.id === selectedTalent.id) ? `${MAIN_LILA}22` : MAIN_LILA }}
                  >
                    {myTeam.find(m => m.id === selectedTalent.id) ? "Remove from Team" : "Add to Team"}
                  </button>
                </div>

                {/* Contenido Derecho */}
                <div className="flex-1 p-12 overflow-y-auto max-h-[80vh] hide-scrollbar">
                  <section className="mb-10">
                    <p className="text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-4 inter-light">Biography</p>
                    <p className="text-[14px] text-gray-300 leading-relaxed inter-light">{selectedTalent.bio}</p>
                  </section>

                  <section className="mb-10">
                    <p className="text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-4 inter-light">Secondary Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTalent.secondarySkills?.map(s => (
                        <span key={s} className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] mrm-bold text-gray-400 uppercase">{s}</span>
                      ))}
                    </div>
                  </section>

                  <section>
                    <p className="text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-4 inter-light">Recent Projects</p>
                    <div className="grid gap-3">
                      {selectedTalent.projects?.map((p, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex justify-between items-center hover:border-[#7D68F6]/30 transition-all">
                          <div>
                            <h4 className="text-[11px] mrm-bold uppercase">{p.name}</h4>
                            <p className="text-[9px] text-gray-500 inter-light mt-1">{p.task}</p>
                          </div>
                          <span className="text-[10px] mrm-bold text-[#7D68F6]">{p.year}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TEAM COUNTER BUTTON */}
      <AnimatePresence>
        {myTeam.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }} 
            className="fixed bottom-10 right-10 z-[100] flex items-center gap-4 bg-black/80 border border-white/10 p-2.5 pl-6 rounded-full shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex -space-x-3">
              {myTeam.map(m => (
                <img key={m.id} src={m.img} className="w-9 h-9 rounded-full border-2 border-[#0A0A0A] object-cover" />
              ))}
            </div>
            <button className="flex items-center gap-3 px-6 py-2.5 rounded-full text-[11px] mrm-bold uppercase transition-all shadow-lg" style={{ backgroundColor: MAIN_LILA, boxShadow: `0 0 20px ${MAIN_LILA}44` }}>
              <Users size={16} /> My Team ({myTeam.length})
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;