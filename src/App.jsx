import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Globe, Cpu, Palette, ChevronLeft, ChevronRight, 
  UserPlus, UserMinus, Users, X, Bot, ExternalLink 
} from 'lucide-react';

const MAIN_LILA = "#7D68F6"; 

// Datos simulados para los proyectos sugeridos en la burbuja del chat
const SUGGESTED_PROJECTS = [
  { id: 101, title: "Fintech App", type: "Mobile" },
  { id: 102, title: "Core Banking", type: "Backend" }
];

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
  }
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
  }
];

function App() {
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [myTeam, setMyTeam] = useState([]);
  const [hoveredProject, setHoveredProject] = useState(null);
  
  // Chat States
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const toggleMember = (talent) => {
    if (myTeam.find(m => m.id === talent.id)) {
      setMyTeam(myTeam.filter(m => m.id !== talent.id));
    } else {
      setMyTeam([...myTeam, talent]);
    }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setChatHistory([...chatHistory, { type: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        text: "Basado en tu descripción, he seleccionado estos activos estratégicos:",
        suggestions: SUGGESTED_PROJECTS 
      }]);
      setShowResults(true);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center text-white relative pb-32 px-6 overflow-x-hidden" 
         style={{ background: `radial-gradient(circle at 50% 0%, #1a0b3d 0%, #0A0A0A 60%)` }}>
      
      {/* 1. HEADER */}
      <header className="w-full max-w-5xl text-center pt-16 mb-12 relative z-10">
        <h1 className="text-[100px] leading-none tracking-[-0.05em] mrm-bold uppercase select-none">MRM</h1>
        <p className="text-[10px] uppercase tracking-[0.9em] text-gray-500 mt-4 inter-light">Creative Credentials</p>
      </header>

      {/* 2. CHATBOT AREA */}
      <div className="w-full max-w-2xl flex flex-col space-y-4 mb-16 z-20">
        <AnimatePresence>
          {chatHistory.map((msg, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-[12px] ${msg.type === 'user' ? 'bg-[#7D68F6] mrm-bold rounded-tr-none' : 'bg-white/5 border border-white/10 rounded-tl-none inter-light'}`}>
                {msg.text}
                
                {/* Proyectos sugeridos dentro de la burbuja */}
                {msg.suggestions && (
                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2 w-full">
                    <p className="text-[9px] uppercase tracking-widest text-gray-500 mb-1">Suggested Cases:</p>
                    <div className="flex gap-2">
                      {msg.suggestions.map(p => (
                        <div key={p.id} className="flex-1 bg-white/5 rounded-xl p-3 border border-white/5 hover:border-[#7D68F6]/40 transition-all cursor-pointer group">
                          <p className="text-[10px] mrm-bold uppercase flex items-center justify-between">
                            {p.title} <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                          </p>
                          <p className="text-[8px] text-gray-500 mt-0.5">{p.type}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="self-start bg-white/5 p-4 rounded-2xl flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* INPUT CON SOPORTE ENTER */}
        <div className="relative w-full mt-6">
          <div className="flex items-center bg-white/[0.04] border border-white/10 rounded-full px-6 py-4 focus-within:border-[#7D68F6]/50 transition-all backdrop-blur-md">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describe tu proyecto" 
              className="bg-transparent flex-1 outline-none text-[13px] text-white/70" 
            />
            <button onClick={handleSendMessage} className="ml-3 w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95" style={{ backgroundColor: MAIN_LILA }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. RESULTADOS (Carrusel y Talentos) */}
      <AnimatePresence>
        {showResults && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col items-center">
            
            <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 inter-light mb-8">Projects by Skill</p>
            <div className="flex items-center gap-8 mb-16">
              <ChevronLeft onClick={() => setCurrentIndex(prev => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length)} className="opacity-20 hover:opacity-100 cursor-pointer" />
              <div className="w-80 p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-[#7D68F6]/20" style={{ backgroundColor: `${MAIN_LILA}1A`, color: MAIN_LILA }}>
                  {SKILLS_DATA[currentIndex].icon}
                </div>
                <div className="text-left">
                  <p className="text-[14px] uppercase mrm-bold">{SKILLS_DATA[currentIndex].name}</p>
                  <p className="text-[10px] text-gray-500 uppercase inter-light">{SKILLS_DATA[currentIndex].role}</p>
                </div>
              </div>
              <ChevronRight onClick={() => setCurrentIndex(prev => (prev + 1) % SKILLS_DATA.length)} className="opacity-20 hover:opacity-100 cursor-pointer" />
            </div>

            <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 inter-light mb-10">Recommended Talent</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl px-4">
              {TALENTS_DATA.map((talent) => {
                const isSelected = myTeam.find(m => m.id === talent.id);
                return (
                  <motion.div key={talent.id} whileHover={{ y: -8 }} onClick={() => setSelectedTalent(talent)}
                    className={`group p-6 rounded-[2.5rem] border cursor-pointer transition-all duration-300 flex flex-col items-center relative z-10 ${isSelected ? 'bg-white/[0.08]' : 'bg-white/[0.03] border-white/5'}`}
                    style={{ borderColor: isSelected ? MAIN_LILA : 'rgba(255,255,255,0.05)' }}>
                    <img src={talent.img} className={`w-16 h-16 rounded-full border-2 mb-4 transition-all duration-500 object-cover ${isSelected ? 'grayscale-0 border-[#7D68F6] scale-105' : 'grayscale border-white/10 group-hover:grayscale-0 group-hover:scale-105'}`} />
                    <h3 className="text-[12px] mrm-bold uppercase tracking-tight">{talent.name}</h3>
                    <p className="text-[10px] text-gray-500 uppercase mt-1 inter-light">{talent.role}</p>
                    <button onClick={(e) => { e.stopPropagation(); toggleMember(talent); }} className="w-full mt-6 py-2.5 rounded-xl text-[9px] mrm-bold uppercase transition-all"
                      style={{ backgroundColor: isSelected ? `${MAIN_LILA}33` : 'rgba(255,255,255,0.05)', color: isSelected ? MAIN_LILA : 'white' }}>
                      {isSelected ? "Remove Member" : "Add to Team"}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL Y TEAM BUTTON (Sin cambios para mantener estabilidad) */}
      <AnimatePresence>
        {selectedTalent && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTalent(null)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative w-full max-w-3xl bg-[#0A0A0A] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl z-[1000]">
              <button onClick={() => setSelectedTalent(null)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors z-50 p-2"><X size={24}/></button>
              <div className="flex flex-col md:flex-row min-h-[500px]">
                <div className="w-full md:w-2/5 p-12 bg-white/[0.02] flex flex-col items-center border-r border-white/5">
                  <img src={selectedTalent.img} className="w-32 h-32 rounded-full border-4 border-[#7D68F6]/20 mb-6 object-cover" />
                  <h2 className="text-xl mrm-bold uppercase text-center">{selectedTalent.name}</h2>
                  <p className="text-[10px] text-[#7D68F6] mrm-bold uppercase tracking-widest mt-2">{selectedTalent.role}</p>
                  <button onClick={() => toggleMember(selectedTalent)} className="mt-10 w-full py-4 rounded-2xl text-[10px] mrm-bold uppercase shadow-lg"
                    style={{ backgroundColor: myTeam.find(m => m.id === selectedTalent.id) ? `${MAIN_LILA}22` : MAIN_LILA }}>
                    {myTeam.find(m => m.id === selectedTalent.id) ? "Remove" : "Add Member"}
                  </button>
                </div>
                <div className="flex-1 p-12 overflow-y-auto max-h-[80vh] hide-scrollbar">
                  <p className="text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-4">Biography</p>
                  <p className="text-[14px] text-gray-300 mb-8 inter-light leading-relaxed">{selectedTalent.bio}</p>
                  <p className="text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-4">Secondary Skills</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedTalent.secondarySkills?.map(s => <span key={s} className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] mrm-bold text-gray-400 uppercase">{s}</span>)}
                  </div>
                  <p className="text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-4">Recent Projects</p>
                  <div className="grid gap-3">
                    {selectedTalent.projects?.map((p, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex justify-between items-center group hover:border-[#7D68F6]/30 transition-all">
                        <div><h4 className="text-[11px] mrm-bold uppercase">{p.name}</h4><p className="text-[9px] text-gray-500 mt-1">{p.task}</p></div>
                        <span className="text-[10px] mrm-bold text-[#7D68F6]">{p.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {myTeam.length > 0 && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} 
            className="fixed bottom-10 right-10 z-[100] flex items-center gap-4 bg-black/80 border border-white/10 p-2.5 pl-6 rounded-full shadow-2xl backdrop-blur-2xl">
            <div className="flex -space-x-3">{myTeam.map(m => <img key={m.id} src={m.img} className="w-9 h-9 rounded-full border-2 border-[#0A0A0A] object-cover" />)}</div>
            <button className="flex items-center gap-3 px-6 py-2.5 rounded-full text-[11px] mrm-bold uppercase" style={{ backgroundColor: MAIN_LILA }}>
              <Users size={16} /> My Team ({myTeam.length})
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;