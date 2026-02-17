import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Globe, Cpu, Palette, ChevronLeft, ChevronRight, 
  X, MessageSquare, ArrowRight 
} from 'lucide-react';

// --- DATA: 26 TALENTOS CON DETALLES COMPLETOS ---
const TALENTS_DATA = [
  { 
    id: 1, name: "Alex Rivera", role: "Cloud Architect", tags: ["AWS", "Terraform", "Docker"], img: "https://i.pravatar.cc/150?u=1", 
    bio: "Alex Rivera es un arquitecto de sistemas de nivel senior con más de una década de experiencia en el diseño de infraestructuras críticas para el sector financiero y tecnológico. Especializado en la filosofía de infraestructura como código (IaC), ha liderado la transición a la nube de múltiples empresas Fortune 500, optimizando costes operativos en un 40% mediante la implementación de arquitecturas serverless.", 
    projects: [{name: "Cloud Core", year: "2024", task: "Infra"}] 
  },
  { 
    id: 2, name: "Elena Sanz", role: "UX Lead", tags: ["Figma", "Research", "Strategy"], img: "https://i.pravatar.cc/150?u=2", 
    bio: "Elena Sanz lidera el diseño de experiencias centradas en el ser humano, combinando principios de psicología cognitiva con las herramientas de diseño más avanzadas de la industria. Como UX Lead, ha gestionado equipos multidisciplinarios en el desarrollo de productos digitales complejos, asegurando que la estética y la funcionalidad converjan para maximizar la retención.", 
    projects: [{name: "UX Portal", year: "2024", task: "Design"}] 
  }
];

for(let i=3; i<=26; i++) {
  TALENTS_DATA.push({
    id: i, name: `Talento Experto ${i}`, role: "Senior Specialist", tags: ["Expertise", "Innovation", "Scaling"], img: `https://i.pravatar.cc/150?u=${i}`,
    bio: "Especialista senior con trayectoria impecable en la ejecución de proyectos de transformación digital de alto impacto. Su enfoque combina una sólida base técnica con una visión estratégica orientada a resultados, permitiendo escalar soluciones complejas de manera eficiente en entornos globales."
  });
}

const SKILLS_DATA = [
  { 
    id: 1, name: "Estratégico", role: "Consultoría Senior", icon: <Globe size={26}/>, 
    projects: [
      { title: "Digital Roadmap 2030", desc: "Transformación digital maestra.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400" },
      { title: "Market Entry Strategy", desc: "Expansión en LATAM.", img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400" }
    ] 
  },
  { 
    id: 2, name: "Desarrollo", role: "Arquitectura Cloud", icon: <Cpu size={26}/>, 
    projects: [
      { title: "Microservices v3", desc: "Ecosistema AWS escalable.", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400" }
    ] 
  },
  { id: 3, name: "Creativo", role: "Branding & Design", icon: <Palette size={26}/>, projects: [{ title: "Visual System", desc: "Diseño modular.", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400" }] }
];

function App() {
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [myTeam, setMyTeam] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
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
        suggestions: [
          { title: "Fintech Core v2", desc: "Infraestructura transaccional distribuida." },
          { title: "Global Marketplace", desc: "Motor de comercio multi-país." }
        ] 
      }]);
      setShowResults(true);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center text-white relative pb-40 px-6 overflow-x-hidden" 
         style={{ background: `radial-gradient(circle at 50% 0%, #1a0b3d 0%, #0A0A0A 60%)` }}>
      
      <header className="w-full max-w-5xl text-center pt-16 mb-12 z-10">
        <h1 className="text-[100px] leading-none tracking-[-0.05em] mrm-bold uppercase">MRM</h1>
        <p className="text-[10px] mrm-bold uppercase tracking-[0.8em] text-[#7D68F6] mt-2">BOGOTA CREATIVE CREDENTIALS</p>
      </header>

      {/* CHAT AREA - SCROLL TOTAL CON DISOLUCIÓN SUPERIOR */}
      <div className="w-full max-w-2xl flex flex-col mb-16 z-20">
        <div 
          className="relative h-[350px] overflow-hidden mb-4"
          style={{ 
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)' 
          }}
        >
          <div ref={chatScrollRef} className="h-full overflow-y-auto pt-24 pb-4 px-2 space-y-6 hide-scrollbar scroll-smooth">
            <AnimatePresence initial={false}>
              {chatHistory.map((msg, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] p-6 rounded-3xl text-[13px] ${msg.type === 'user' ? 'bg-[#7D68F6] mrm-bold rounded-tr-none' : 'bg-white/5 border border-white/10 rounded-tl-none inter-light'}`}>
                    {msg.text}
                    {msg.suggestions && (
                      <div className="mt-4 space-y-2">
                        {msg.suggestions.map((s, i) => (
                          <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                            <h4 className="text-[10px] mrm-bold uppercase text-[#7D68F6]">{s.title}</h4>
                            <p className="text-[9px] text-gray-400">{s.desc}</p>
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

      {/* CAPABILITIES CAROUSEL */}
      {showResults && (
        <div className="w-full flex flex-col items-center mb-28">
          <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 mb-8">Capabilities</p>
          <div className="flex items-center gap-8 mb-12">
            <ChevronLeft onClick={() => setCurrentIndex(prev => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length)} className="cursor-pointer opacity-20 hover:opacity-100 transition-opacity" />
            <div className="w-72 p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center gap-5">
              <div className="text-[#7D68F6]">{SKILLS_DATA[currentIndex].icon}</div>
              <div className="text-left">
                <p className="text-[14px] uppercase mrm-bold">{SKILLS_DATA[currentIndex].name}</p>
                <p className="text-[9px] text-gray-500 uppercase">{SKILLS_DATA[currentIndex].role}</p>
              </div>
            </div>
            <ChevronRight onClick={() => setCurrentIndex(prev => (prev + 1) % SKILLS_DATA.length)} className="cursor-pointer opacity-20 hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex gap-4">
            {SKILLS_DATA[currentIndex].projects?.map((proj, idx) => (
              <div key={idx} className="px-5 py-2 rounded-full border border-white/5 bg-white/[0.03] flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#7D68F6]" />
                <span className="text-[10px] uppercase mrm-bold text-gray-400">{proj.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TALENT GRID CON HOVERS Y CHIPS */}
      {showResults && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full max-w-7xl px-4">
          {TALENTS_DATA.map((talent) => (
            <motion.div key={talent.id} 
              whileHover={{ y: -8, backgroundColor: "rgba(125, 104, 246, 0.12)", borderColor: "#7D68F6" }} 
              onClick={() => setSelectedTalent(talent)} 
              className="p-6 rounded-[2.5rem] border border-white/5 bg-white/[0.03] transition-all cursor-pointer flex flex-col items-center group">
              <img src={talent.img} className="w-14 h-14 rounded-full border-2 border-white/10 mb-4 grayscale group-hover:grayscale-0 transition-all" />
              <h3 className="text-[11px] mrm-bold uppercase text-center">{talent.name}</h3>
              <p className="text-[9px] text-gray-500 uppercase mb-4 text-center">{talent.role}</p>
              <div className="flex flex-wrap justify-center gap-1">
                {talent.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[7px] mrm-bold text-gray-400 uppercase">{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* CHATLOG ABAJO IZQUIERDA */}
      <div className="fixed bottom-10 left-10 z-[100] flex flex-col items-start gap-2 max-w-[280px]">
        <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-2"><MessageSquare size={12}/> Chatlog</div>
        <div className="flex flex-col-reverse gap-2 overflow-y-auto max-h-[160px] pr-2 hide-scrollbar">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[9px] text-gray-500">
              <span className="mrm-bold text-[#7D68F6]/40 uppercase mr-2">{msg.type}</span>
              <span className="line-clamp-1 italic">{msg.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL EXTENSO */}
      <AnimatePresence>
        {selectedTalent && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedTalent(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative w-full max-w-4xl bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-12 flex flex-col md:flex-row gap-12 overflow-hidden text-left">
              <div className="w-full md:w-1/3 flex flex-col items-center border-r border-white/5 pr-12">
                <img src={selectedTalent.img} className="w-32 h-32 rounded-full border-2 border-[#7D68F6]/40 mb-8 object-cover" />
                <h2 className="text-2xl mrm-bold uppercase text-center">{selectedTalent.name}</h2>
                <p className="text-[#7D68F6] mrm-bold text-[10px] uppercase mt-2">{selectedTalent.role}</p>
                <button className="mt-10 w-full py-5 rounded-2xl text-[11px] mrm-bold uppercase bg-[#7D68F6]">Add to Team</button>
              </div>
              <div className="flex-1 py-2">
                <p className="text-[9px] uppercase tracking-[0.4em] text-gray-500 mb-5">Professional Bio</p>
                <p className="text-[15px] text-gray-400 inter-light leading-relaxed">{selectedTalent.bio}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {selectedTalent.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] mrm-bold text-gray-300 uppercase">{tag}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => setSelectedTalent(null)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X size={28}/></button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;