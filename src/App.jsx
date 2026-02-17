import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Globe, Cpu, Palette, ChevronLeft, ChevronRight, 
  UserPlus, UserMinus, Users, X, ExternalLink, MessageSquare, ArrowRight
} from 'lucide-react';

const MAIN_LILA = "#7D68F6"; 

// Datos de proyectos sugeridos para la burbuja de la IA
const SUGGESTED_PROJECTS = [
  { id: 101, title: "Fintech App", type: "Mobile Architecture", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400", desc: "Rediseño completo de la infraestructura transaccional." },
  { id: 102, title: "Core Banking", type: "Backend System", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400", desc: "Migración a microservicios con latencia cero." }
];

const SKILLS_DATA = [
  { 
    id: 1, name: "Estratégico", role: "Consultoría Senior", icon: <Globe size={26}/>,
    projects: [
      { title: "Digital Roadmap 2030", desc: "Planificación maestra de transformación digital.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400" },
      { title: "M&A Integration", desc: "Sinergia operativa en fusiones corporativas.", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400" }
    ]
  },
  { 
    id: 2, name: "Desarrollo", role: "Arquitectura Cloud", icon: <Cpu size={26}/>,
    projects: [
      { title: "Microservices Architecture", desc: "Ecosistema escalable en AWS y Docker.", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400" }
    ]
  }
];

const TALENTS_DATA = [
  { 
    id: 1, name: "Alex Rivera", role: "Cloud Architect", 
    tags: ["AWS", "Terraform"], img: "https://i.pravatar.cc/150?u=alex",
    bio: "Especialista en infraestructuras resilientes con más de 8 años optimizando entornos cloud para fintechs globales.",
    secondarySkills: ["Docker", "Kubernetes", "Python", "Security Compliance"],
    projects: [{ name: "NeoBank Scale", year: "2024", task: "Migración total a microservicios." }]
  },
  { 
    id: 2, name: "Elena Sanz", role: "UX Lead", 
    tags: ["Research", "Figma"], img: "https://i.pravatar.cc/150?u=elena",
    bio: "Enfocada en diseño centrado en el usuario y sistemas de diseño escalables.",
    secondarySkills: ["Design Systems", "Prototyping"],
    projects: [{ name: "Eco-App Redesign", year: "2024", task: "Aumento de retención." }]
  }
];

function App() {
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [myTeam, setMyTeam] = useState([]);
  const [hoveredProject, setHoveredProject] = useState(null);
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
    setChatHistory([...chatHistory, { type: 'user', text: input }]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        text: "He analizado tu solicitud. Estos son los activos estratégicos que mejor encajan con tu visión:",
        suggestions: SUGGESTED_PROJECTS 
      }]);
      setShowResults(true);
    }, 1200);
  };

  const visibleMessages = chatHistory.slice(-2);

  return (
    <div className="flex min-h-screen w-full flex-col items-center text-white relative pb-32 px-6 overflow-x-hidden" 
         style={{ background: `radial-gradient(circle at 50% 0%, #1a0b3d 0%, #0A0A0A 60%)` }}>
      
      {/* HEADER */}
      <header className="w-full max-w-5xl text-center pt-16 mb-12 relative z-10">
        <h1 className="text-[100px] leading-none tracking-[-0.05em] mrm-bold uppercase">MRM</h1>
        <p className="text-[10px] uppercase tracking-[0.9em] text-gray-500 mt-4 inter-light">Creative Credentials</p>
      </header>

      {/* CHAT AREA (LIMITADO A 2 BURBUJAS) */}
      <div className="w-full max-w-2xl flex flex-col space-y-6 mb-16 z-20 min-h-[120px] justify-end">
        <AnimatePresence mode="popLayout">
          {visibleMessages.map((msg, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] p-6 rounded-3xl text-[13px] ${msg.type === 'user' ? 'bg-[#7D68F6] mrm-bold rounded-tr-none' : 'bg-white/5 border border-white/10 rounded-tl-none inter-light'}`}>
                {msg.text}

                {/* LA BURBUJA GRANDE DE PROYECTOS RESTAURADA */}
                {msg.suggestions && (
                  <div className="mt-6 flex flex-col gap-3 w-full">
                    {msg.suggestions.map(p => (
                      <div key={p.id} className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#7D68F6]/30 transition-all group">
                        <img src={p.img} className="w-20 h-20 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-[11px] mrm-bold uppercase tracking-wider">{p.title}</h4>
                            <button className="text-[8px] uppercase mrm-bold text-[#7D68F6] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              Details <ArrowRight size={10}/>
                            </button>
                          </div>
                          <p className="text-[9px] text-gray-500 uppercase mt-0.5 mrm-bold tracking-tighter">{p.type}</p>
                          <p className="text-[11px] text-gray-400 mt-2 leading-relaxed line-clamp-2">{p.desc}</p>
                        </div>
                      </div>
                    ))}
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

        <div className="relative w-full mt-2">
          <div className="flex items-center bg-white/[0.04] border border-white/10 rounded-full px-6 py-4 focus-within:border-[#7D68F6]/50 transition-all backdrop-blur-md">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describe tu proyecto" className="bg-transparent flex-1 outline-none text-[13px] text-white/70" />
            <button onClick={handleSendMessage} className="ml-3 w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95" style={{ backgroundColor: MAIN_LILA }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* RESULTADOS (CARRUSEL Y TALENTOS) */}
      {showResults && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col items-center">
          {/* Carrusel de Habilidades */}
          <div className="flex flex-col items-center mb-28 w-full">
            <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 inter-light mb-8">Projects by Skill</p>
            <div className="flex items-center gap-8 mb-12">
              <ChevronLeft onClick={() => setCurrentIndex(prev => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length)} className="opacity-20 hover:opacity-100 cursor-pointer" />
              <div className="w-80 p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-[#7D68F6]/20" style={{ backgroundColor: `${MAIN_LILA}1A`, color: MAIN_LILA }}>{SKILLS_DATA[currentIndex].icon}</div>
                <div className="text-left"><p className="text-[14px] uppercase mrm-bold">{SKILLS_DATA[currentIndex].name}</p><p className="text-[10px] text-gray-500 uppercase">{SKILLS_DATA[currentIndex].role}</p></div>
              </div>
              <ChevronRight onClick={() => setCurrentIndex(prev => (prev + 1) % SKILLS_DATA.length)} className="opacity-20 hover:opacity-100 cursor-pointer" />
            </div>
            {/* Muestras de proyecto flotantes */}
            <div className="flex justify-center gap-4 h-12">
              {SKILLS_DATA[currentIndex].projects.map((proj, idx) => (
                <div key={idx} onMouseEnter={() => setHoveredProject(proj)} onMouseLeave={() => setHoveredProject(null)} className="relative px-5 py-2 rounded-full border border-white/5 bg-white/[0.03] flex items-center gap-2.5 cursor-help transition-all hover:bg-white/10">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: MAIN_LILA }} />
                  <span className="text-[10px] uppercase mrm-bold text-gray-400">{proj.title}</span>
                  <AnimatePresence>
                    {hoveredProject === proj && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-52 bg-[#1A1A1A] border border-white/10 rounded-xl p-3 z-50 shadow-2xl">
                        <img src={proj.img} className="w-full h-24 object-cover rounded-lg mb-2" />
                        <h4 className="text-[11px] mrm-bold uppercase">{proj.title}</h4>
                        <p className="text-[9px] text-gray-500">{proj.desc}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
          {/* Grid de Talentos */}
          <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 inter-light mb-10">Recommended Talent</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl px-4">
            {TALENTS_DATA.map((talent) => {
              const isAdded = myTeam.find(m => m.id === talent.id);
              return (
                <motion.div key={talent.id} whileHover={{ y: -8 }} onClick={() => setSelectedTalent(talent)} className={`group p-6 rounded-[2.5rem] border transition-all cursor-pointer flex flex-col items-center ${isAdded ? 'bg-white/[0.08] border-[#7D68F6]' : 'bg-white/[0.03] border-white/5'}`}>
                  <img src={talent.img} className={`w-16 h-16 rounded-full transition-all border-2 ${isAdded ? 'grayscale-0 border-[#7D68F6]' : 'grayscale group-hover:grayscale-0 border-white/10'}`} />
                  <h3 className="text-[12px] mrm-bold uppercase mt-4">{talent.name}</h3>
                  <p className="text-[10px] text-gray-500 uppercase">{talent.role}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* CHATLOG (ABAJO IZQUIERDA) */}
      <div className="fixed bottom-10 left-10 z-[100] flex flex-col items-start gap-2 max-w-[280px]">
        <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-2">
          <MessageSquare size={12}/> Chatlog
        </div>
        <div className="flex flex-col-reverse gap-2 overflow-y-auto max-h-[160px] pr-2 hide-scrollbar">
          {chatHistory.slice(0, -2).map((msg, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] text-gray-500 inter-light">
              <span className="mrm-bold text-[#7D68F6]/40 mr-2 uppercase">{msg.type}</span>
              <span className="line-clamp-1 italic">{msg.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TEAM BUTTON (DERECHA) */}
      <AnimatePresence>
        {myTeam.length > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-10 right-10 z-[100] flex items-center gap-4 bg-black/80 border border-white/10 p-2.5 pl-6 rounded-full backdrop-blur-2xl shadow-2xl">
            <div className="flex -space-x-3">{myTeam.map(m => <img key={m.id} src={m.img} className="w-9 h-9 rounded-full border-2 border-[#0A0A0A] object-cover" />)}</div>
            <button className="flex items-center gap-3 px-6 py-2.5 rounded-full text-[11px] mrm-bold uppercase" style={{ backgroundColor: MAIN_LILA }}>
              <Users size={16} /> My Team ({myTeam.length})
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DE TALENTO */}
      <AnimatePresence>
        {selectedTalent && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedTalent(null)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-3xl bg-[#0A0A0A] border border-white/10 rounded-[3rem] overflow-hidden">
              <button onClick={() => setSelectedTalent(null)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"><X size={24}/></button>
              <div className="flex flex-col md:flex-row min-h-[500px]">
                <div className="w-full md:w-2/5 p-12 bg-white/[0.02] flex flex-col items-center border-r border-white/5">
                  <img src={selectedTalent.img} className="w-32 h-32 rounded-full border-4 border-[#7D68F6]/20 mb-6 object-cover" />
                  <h2 className="text-xl mrm-bold uppercase text-center">{selectedTalent.name}</h2>
                  <p className="text-[10px] text-[#7D68F6] mrm-bold uppercase tracking-widest mt-2">{selectedTalent.role}</p>
                  <button onClick={() => toggleMember(selectedTalent)} className="mt-10 w-full py-4 rounded-2xl text-[10px] mrm-bold uppercase shadow-lg"
                    style={{ backgroundColor: myTeam.find(m => m.id === selectedTalent.id) ? `${MAIN_LILA}22` : MAIN_LILA }}>
                    {myTeam.find(m => m.id === selectedTalent.id) ? "Remove Member" : "Add to Team"}
                  </button>
                </div>
                <div className="flex-1 p-12 overflow-y-auto max-h-[80vh] hide-scrollbar">
                  <p className="text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-4 inter-light">Biography</p>
                  <p className="text-[14px] text-gray-300 leading-relaxed inter-light mb-8">{selectedTalent.bio}</p>
                  <p className="text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-4 inter-light">Recent Projects</p>
                  <div className="grid gap-3">
                    {selectedTalent.projects?.map((p, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
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
    </div>
  );
}

export default App;