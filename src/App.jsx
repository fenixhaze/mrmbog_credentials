import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Globe, Cpu, Palette, ChevronLeft, ChevronRight, 
  Users, X, MessageSquare, ArrowRight, ExternalLink 
} from 'lucide-react';

const MAIN_LILA = "#7D68F6"; 

// --- DATA: 26 TALENTOS ---
const TALENTS_DATA = [
  { 
    id: 1, name: "Alex Rivera", role: "Cloud Architect", tags: ["AWS", "Terraform", "Docker"], img: "https://i.pravatar.cc/150?u=1", 
    bio: "Alex Rivera es un arquitecto de sistemas de nivel senior con más de una década de experiencia en el diseño de infraestructuras críticas para el sector financiero y tecnológico.", 
    projects: [{name: "Cloud Core", year: "2024", task: "Infra"}] 
  },
  { 
    id: 2, name: "Elena Sanz", role: "UX Lead", tags: ["Figma", "Research", "Strategy"], img: "https://i.pravatar.cc/150?u=2", 
    bio: "Elena Sanz lidera el diseño de experiencias centradas en el ser humano, combinando principios de psicología cognitiva con las herramientas de diseño más avanzadas de la industria.", 
    projects: [{name: "UX Portal", year: "2024", task: "Design"}] 
  },
  { 
    id: 3, name: "Marcus Chen", role: "Fullstack Dev", tags: ["React", "Node.js", "GraphQL"], img: "https://i.pravatar.cc/150?u=3", 
    bio: "Ingeniero Fullstack con una maestría técnica en el ecosistema JavaScript/TypeScript moderno. Marcus se destaca por su capacidad para construir aplicaciones de extremo a extremo.", 
    projects: [{name: "DevHub", year: "2023", task: "Code"}] 
  },
  { 
    id: 4, name: "Sofia Müller", role: "UI Designer", tags: ["Design Systems", "Visual"], img: "https://i.pravatar.cc/150?u=4", 
    bio: "Sofia Müller es una especialista en interfaces de usuario y diseño de sistemas (Design Systems). Su carrera se ha centrado en la creación de lenguajes visuales escalables.", 
    projects: [{name: "Brand Kit", year: "2024", task: "Visual"}] 
  }
];

for(let i=5; i<=26; i++) {
  if(!TALENTS_DATA[i-1]) {
    TALENTS_DATA.push({
      id: i, name: `Talento Experto ${i}`, role: "Senior Specialist", tags: ["Expertise", "Innovation"], img: `https://i.pravatar.cc/150?u=${i}`,
      bio: "Este especialista senior cuenta con una trayectoria impecable en la ejecución de proyectos de transformación digital de alto impacto."
    });
  }
}

const SKILLS_DATA = [
  { id: 1, name: "Estratégico", role: "Consultoría Senior", icon: <Globe size={26}/>, projects: [{ title: "Digital Roadmap 2030", desc: "Transformación digital.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400" }] },
  { id: 2, name: "Desarrollo", role: "Arquitectura Cloud", icon: <Cpu size={26}/>, projects: [{ title: "Microservices", desc: "Ecosistema AWS.", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400" }] },
  { id: 3, name: "Creativo", role: "Branding & Design", icon: <Palette size={26}/>, projects: [{ title: "Visual System", desc: "Identidad modular.", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400" }] }
];

function App() {
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [myTeam, setMyTeam] = useState([]);
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
        text: "He diseñado un ecosistema de 4 soluciones clave para tu requerimiento:",
        suggestions: [
          { id: 101, title: "Fintech Core v2", type: "Asset", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400", desc: "Infraestructura transaccional." },
          { id: 102, title: "Global Marketplace", type: "Asset", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400", desc: "Motor de comercio." },
          { id: 103, title: "Zero-Trust Security", type: "Security", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?w=400", desc: "Protección perimetral." },
          { id: 104, title: "AI Analytics Hub", type: "AI", img: "https://images.unsplash.com/photo-1551288049-bbbda536339a?w=400", desc: "Dashboard predictivo." }
        ] 
      }]);
      setShowResults(true);
    }, 1200);
  };

  const visibleMessages = chatHistory.slice(-2);

  return (
    <div className="flex min-h-screen w-full flex-col items-center text-white relative pb-40 px-6 overflow-x-hidden" 
         style={{ background: `radial-gradient(circle at 50% 0%, #1a0b3d 0%, #0A0A0A 60%)` }}>
      
      {/* HEADER - BOGOTA CREATIVE CREDENTIALS */}
      <header className="w-full max-w-5xl text-center pt-16 mb-12 z-10">
        <h1 className="text-[100px] leading-none tracking-[-0.05em] mrm-bold uppercase">MRM</h1>
        <p className="text-[10px] mrm-bold uppercase tracking-[0.8em] text-[#7D68F6] mt-2">BOGOTA CREATIVE CREDENTIALS</p>
      </header>

      {/* CHAT AREA - CON FADE OUT HACIA ARRIBA */}
      <div className="w-full max-w-2xl flex flex-col mb-16 z-20">
        <div 
          className="relative h-[300px] flex flex-col justify-end overflow-hidden mb-4 px-2"
          style={{ 
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 45%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 45%)' 
          }}
        >
          <div className="flex flex-col space-y-6 pb-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleMessages.map((msg, idx) => (
                <motion.div 
                  key={`${msg.text}-${idx}`} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[90%] p-6 rounded-3xl text-[13px] ${msg.type === 'user' ? 'bg-[#7D68F6] mrm-bold rounded-tr-none' : 'bg-white/5 border border-white/10 rounded-tl-none inter-light'}`}>
                    {msg.text}
                    {msg.suggestions && (
                      <div className="mt-6 flex flex-col gap-3">
                        {msg.suggestions.map(p => (
                          <div key={p.id} className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                            <img src={p.img} className="w-16 h-16 rounded-xl object-cover grayscale" />
                            <div className="flex-1">
                              <h4 className="text-[10px] mrm-bold uppercase">{p.title}</h4>
                              <p className="text-[10px] text-gray-400 mt-1 leading-snug">{p.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center bg-white/[0.04] border border-white/10 rounded-full px-6 py-4 backdrop-blur-md">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Describe tu proyecto" className="bg-transparent flex-1 outline-none text-[13px] text-white/70" />
          <button onClick={handleSendMessage} className="ml-3 w-10 h-10 rounded-full flex items-center justify-center bg-[#7D68F6]"><Send size={16}/></button>
        </div>
      </div>

      {/* RESULTADOS Y TALENTOS */}
      {showResults && (
        <div className="w-full flex flex-col items-center">
          <div className="flex flex-col items-center mb-28 w-full">
            <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 mb-8">Capabilities</p>
            <div className="flex items-center gap-8 mb-12">
              <ChevronLeft onClick={() => setCurrentIndex(prev => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length)} className="cursor-pointer opacity-20 hover:opacity-100" />
              <div className="w-72 p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center gap-5">
                <div className="text-[#7D68F6]">{SKILLS_DATA[currentIndex].icon}</div>
                <div className="text-left"><p className="text-[14px] uppercase mrm-bold">{SKILLS_DATA[currentIndex].name}</p></div>
              </div>
              <ChevronRight onClick={() => setCurrentIndex(prev => (prev + 1) % SKILLS_DATA.length)} className="cursor-pointer opacity-20 hover:opacity-100" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full max-w-7xl px-4">
            {TALENTS_DATA.map((talent) => (
              <div key={talent.id} 
                onClick={() => setSelectedTalent(talent)} 
                className="p-6 rounded-[2.5rem] border border-white/5 bg-white/[0.03] hover:border-[#7D68F6] transition-all cursor-pointer flex flex-col items-center">
                <img src={talent.img} className="w-14 h-14 rounded-full border-2 border-white/10 mb-4 grayscale" />
                <h3 className="text-[11px] mrm-bold uppercase text-center">{talent.name}</h3>
                <p className="text-[9px] text-gray-500 uppercase text-center">{talent.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHATLOG ABAJO IZQUIERDA */}
      <div className="fixed bottom-10 left-10 z-[100] flex flex-col items-start gap-2 max-w-[280px]">
        <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-2"><MessageSquare size={12}/> Chatlog</div>
        <div className="flex flex-col-reverse gap-2 overflow-y-auto max-h-[160px] pr-2 hide-scrollbar">
          {chatHistory.slice(0, -2).map((msg, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[9px] text-gray-500">
              <span className="mrm-bold text-[#7D68F6]/40 uppercase mr-2">{msg.type}</span>
              <span className="line-clamp-1 italic">{msg.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedTalent && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedTalent(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative w-full max-w-4xl bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-12 flex flex-col md:flex-row gap-12 overflow-hidden text-left">
              <div className="w-full md:w-1/3 flex flex-col items-center border-r border-white/5 pr-0 md:pr-12">
                <img src={selectedTalent.img} className="w-32 h-32 rounded-full border-2 border-[#7D68F6]/40 mb-8 object-cover shadow-2xl" />
                <h2 className="text-2xl mrm-bold uppercase text-center">{selectedTalent.name}</h2>
                <button onClick={() => toggleMember(selectedTalent)} className="mt-10 w-full py-5 rounded-2xl text-[11px] mrm-bold uppercase bg-[#7D68F6]">
                  {myTeam.find(m => m.id === selectedTalent.id) ? "Remove" : "Add to Team"}
                </button>
              </div>
              <div className="flex-1 py-2">
                <p className="text-[9px] uppercase tracking-[0.4em] text-gray-500 mb-5">Bio</p>
                <p className="text-[15px] text-gray-400 inter-light leading-relaxed">{selectedTalent.bio}</p>
              </div>
              <button onClick={() => setSelectedTalent(null)} className="absolute top-8 right-8 text-white/20"><X size={28}/></button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;