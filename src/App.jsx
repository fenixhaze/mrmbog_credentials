import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Globe, Cpu, Palette, ChevronLeft, ChevronRight, 
  Users, X, MessageSquare, ArrowRight, ExternalLink 
} from 'lucide-react';

const MAIN_LILA = "#7D68F6"; 

// --- DATA: 26 TALENTOS CON BIOS EXTENSAS ---
const TALENTS_DATA = [
  { 
    id: 1, name: "Alex Rivera", role: "Cloud Architect", tags: ["AWS", "Terraform", "Docker"], img: "https://i.pravatar.cc/150?u=1", 
    bio: "Alex Rivera es un arquitecto de sistemas de nivel senior con más de una década de experiencia en el diseño de infraestructuras críticas para el sector financiero y tecnológico. Especializado en la filosofía de infraestructura como código (IaC), ha liderado la transición a la nube de múltiples empresas Fortune 500, optimizando costes operativos en un 40% mediante la implementación de arquitecturas serverless y microservicios orquestados con Kubernetes. Su enfoque se centra en la alta disponibilidad, la resiliencia ante desastres y la automatización total de pipelines de despliegue global.", 
    projects: [{name: "Cloud Core", year: "2024", task: "Infra"}] 
  },
  { 
    id: 2, name: "Elena Sanz", role: "UX Lead", tags: ["Figma", "Research", "Strategy"], img: "https://i.pravatar.cc/150?u=2", 
    bio: "Elena Sanz lidera el diseño de experiencias centradas en el ser humano, combinando principios de psicología cognitiva con las herramientas de diseño más avanzadas de la industria. Como UX Lead, ha gestionado equipos multidisciplinarios en el desarrollo de productos digitales complejos, desde plataformas de banca abierta hasta ecosistemas de e-learning. Su metodología se basa en una investigación de usuarios profunda, mapeo de recorridos críticos y una iteración constante basada en datos reales de comportamiento, asegurando que la estética y la funcionalidad converjan para maximizar la retención del cliente.", 
    projects: [{name: "UX Portal", year: "2024", task: "Design"}] 
  },
  { 
    id: 3, name: "Marcus Chen", role: "Fullstack Dev", tags: ["React", "Node.js", "GraphQL"], img: "https://i.pravatar.cc/150?u=3", 
    bio: "Ingeniero Fullstack con una maestría técnica en el ecosistema JavaScript/TypeScript moderno. Marcus se destaca por su capacidad para construir aplicaciones de extremo a extremo, desde interfaces de usuario altamente interactivas y accesibles hasta arquitecturas de servidor robustas que gestionan millones de peticiones diarias. Experto en GraphQL para la optimización de transferencia de datos y en la implementación de patrones de diseño escalables, su prioridad es siempre el rendimiento y la mantenibilidad a largo plazo del código.", 
    projects: [{name: "DevHub", year: "2023", task: "Code"}] 
  },
  { 
    id: 4, name: "Sofia Müller", role: "UI Designer", tags: ["Design Systems", "Visual"], img: "https://i.pravatar.cc/150?u=4", 
    bio: "Sofia Müller es una especialista en interfaces de usuario y diseño de sistemas (Design Systems). Su carrera se ha centrado en la creación de lenguajes visuales escalables que permiten a las marcas globales mantener una consistencia impecable en múltiples productos y plataformas. Mediante el uso de diseño atómico, Sofia construye librerías de componentes reutilizables que aceleran el tiempo de desarrollo en un 50%, manteniendo siempre un nivel de detalle milimétrico en la tipografía y el uso cromático.", 
    projects: [{name: "Brand Kit", year: "2024", task: "Visual"}] 
  },
  { 
    id: 5, name: "Lucas Petit", role: "Data Scientist", tags: ["Python", "ML", "SQL"], img: "https://i.pravatar.cc/150?u=5", 
    bio: "Científico de datos con un fuerte trasfondo en matemáticas aplicadas y aprendizaje automático. Lucas se especializa en convertir grandes volúmenes de datos desestructurados en activos estratégicos para el negocio. Ha desarrollado modelos predictivos de fuga de clientes, motores de recomendación personalizados y sistemas de análisis de sentimiento que han permitido a sus clientes aumentar sus ingresos orgánicos sustancialmente.", 
    projects: [{name: "Data Flow", year: "2023", task: "Analysis"}] 
  }
];

// Llenado de los 26 talentos con bios extensas automáticas
for(let i=6; i<=26; i++) {
  if(!TALENTS_DATA[i-1]) {
    TALENTS_DATA.push({
      id: i, name: `Talento Experto ${i}`, role: "Senior Specialist", tags: ["Expertise", "Innovation"], img: `https://i.pravatar.cc/150?u=${i}`,
      bio: "Este especialista senior cuenta con una trayectoria impecable en la ejecución de proyectos de transformación digital de alto impacto. Su enfoque combina una sólida base técnica con una visión estratégica orientada a resultados, permitiendo escalar soluciones complejas de manera eficiente. Ha trabajado en entornos globales liderando células de innovación y garantizando que cada entregable cumpla con los más altos estándares de excelencia operativa y diseño vanguardista. Es reconocido por su capacidad de mentoría y liderazgo en equipos de alto rendimiento."
    });
  }
}

const SKILLS_DATA = [
  { id: 1, name: "Estratégico", role: "Consultoría Senior", icon: <Globe size={26}/>, projects: [{ title: "Digital Roadmap 2030", desc: "Transformación digital maestra.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400" }] },
  { id: 2, name: "Desarrollo", role: "Arquitectura Cloud", icon: <Cpu size={26}/>, projects: [{ title: "Microservices", desc: "Ecosistema AWS escalable.", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400" }] },
  { id: 3, name: "Creativo", role: "Branding & Design", icon: <Palette size={26}/>, projects: [{ title: "Visual System", desc: "Diseño de identidad modular.", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400" }] }
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
        text: "He diseñado un ecosistema de 4 soluciones clave para tu requerimiento:",
        suggestions: [
          { id: 101, title: "Fintech Core v2", type: "Asset", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400", desc: "Infraestructura transaccional distribuida con cumplimiento regulatorio integrado." },
          { id: 102, title: "Global Marketplace", type: "Asset", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400", desc: "Motor de comercio con gestión multi-país y pasarelas de pago universales." },
          { id: 103, title: "Zero-Trust Security", type: "Security", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?w=400", desc: "Malla de seguridad perimetral para protección de datos sensibles en tiempo real." },
          { id: 104, title: "AI Analytics Hub", type: "AI", img: "https://images.unsplash.com/photo-1551288049-bbbda536339a?w=400", desc: "Dashboard predictivo basado en comportamiento real." }
        ] 
      }]);
      setShowResults(true);
    }, 1200);
  };

  const visibleMessages = chatHistory.slice(-2);

  return (
    <div className="flex min-h-screen w-full flex-col items-center text-white relative pb-40 px-6 overflow-x-hidden" 
         style={{ background: `radial-gradient(circle at 50% 0%, #1a0b3d 0%, #0A0A0A 60%)` }}>
      
      {/* HEADER */}
      <header className="w-full max-w-5xl text-center pt-16 mb-12 z-10 flex flex-col items-center">
        <h1 className="text-[100px] leading-none tracking-[-0.05em] mrm-bold uppercase">MRM</h1>
        <p className="text-[10px] mrm-bold uppercase tracking-[0.8em] text-[#7D68F6] mt-2 ml-[0.8em]">BOGOTA CREATIVE CREDENTIALS</p>
      </header>

      {/* 1. CHAT AREA (2 BURBUJAS) */}
      <div className="w-full max-w-2xl flex flex-col space-y-6 mb-16 z-20 min-h-[140px] justify-end">
        <AnimatePresence mode="popLayout">
          {visibleMessages.map((msg, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] p-6 rounded-3xl text-[13px] ${msg.type === 'user' ? 'bg-[#7D68F6] mrm-bold rounded-tr-none' : 'bg-white/5 border border-white/10 rounded-tl-none inter-light'}`}>
                {msg.text}
                {msg.suggestions && (
                  <div className="mt-6 flex flex-col gap-3">
                    {msg.suggestions.map(p => (
                      <div key={p.id} className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#7D68F6]/40 transition-all group">
                        <img src={p.img} className="w-20 h-20 rounded-xl object-cover grayscale group-hover:grayscale-0" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-[10px] mrm-bold uppercase">{p.title}</h4>
                            <ArrowRight size={12} className="text-[#7D68F6] opacity-0 group-hover:opacity-100" />
                          </div>
                          <p className="text-[10px] text-gray-400 mt-2 leading-snug">{p.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isTyping && <div className="self-start bg-white/5 p-4 rounded-2xl animate-pulse">...</div>}
        </AnimatePresence>

        <div className="flex items-center bg-white/[0.04] border border-white/10 rounded-full px-6 py-4 backdrop-blur-md">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Describe tu proyecto" className="bg-transparent flex-1 outline-none text-[13px] text-white/70" />
          <button onClick={handleSendMessage} className="ml-3 w-10 h-10 rounded-full flex items-center justify-center bg-[#7D68F6]"><Send size={16}/></button>
        </div>
      </div>

      {/* 2. RESULTADOS: CARRUSEL + GRID */}
      {showResults && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center">
          
          <div className="flex flex-col items-center mb-28 w-full">
            <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 mb-8">Capabilities</p>
            <div className="flex items-center gap-8 mb-12">
              <ChevronLeft onClick={() => setCurrentIndex(prev => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length)} className="cursor-pointer opacity-20 hover:opacity-100" />
              <div className="w-72 p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center gap-5">
                <div className="text-[#7D68F6]">{SKILLS_DATA[currentIndex].icon}</div>
                <div className="text-left">
                  <p className="text-[14px] uppercase mrm-bold">{SKILLS_DATA[currentIndex].name}</p>
                  <p className="text-[9px] text-gray-500 uppercase">{SKILLS_DATA[currentIndex].role}</p>
                </div>
              </div>
              <ChevronRight onClick={() => setCurrentIndex(prev => (prev + 1) % SKILLS_DATA.length)} className="cursor-pointer opacity-20 hover:opacity-100" />
            </div>

            <div className="flex gap-4 h-10">
              {SKILLS_DATA[currentIndex].projects.map((proj, idx) => (
                <div key={idx} onMouseEnter={() => setHoveredProject(proj)} onMouseLeave={() => setHoveredProject(null)} 
                  className="relative px-5 py-2 rounded-full border border-white/5 bg-white/[0.03] flex items-center gap-2.5 cursor-help hover:bg-white/10 transition-all">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7D68F6]" />
                  <span className="text-[10px] uppercase mrm-bold text-gray-400">{proj.title}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[8px] uppercase tracking-[0.5em] opacity-30 mb-10">Recommended Talent</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 w-full max-w-7xl px-4">
            {TALENTS_DATA.map((talent) => {
              const isAdded = myTeam.find(m => m.id === talent.id);
              return (
                <motion.div key={talent.id} 
                  whileHover={{ y: -5, backgroundColor: "rgba(125, 104, 246, 0.15)", borderColor: "#7D68F6" }} 
                  onClick={() => setSelectedTalent(talent)} 
                  className={`p-6 rounded-[2.5rem] border transition-all duration-300 cursor-pointer flex flex-col items-center ${isAdded ? 'bg-[#7D68F6]/20 border-[#7D68F6]' : 'bg-white/[0.03] border-white/5'}`}>
                  <img src={talent.img} className={`w-14 h-14 rounded-full border-2 mb-4 transition-all ${isAdded ? 'grayscale-0 border-[#7D68F6]' : 'grayscale border-white/10'}`} />
                  <h3 className="text-[11px] mrm-bold uppercase text-center">{talent.name}</h3>
                  <p className="text-[9px] text-gray-500 uppercase mb-4 text-center">{talent.role}</p>
                  <div className="flex flex-wrap justify-center gap-1 mt-auto">
                    {talent.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[7px] mrm-bold text-gray-400 uppercase">{tag}</span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* 3. CHATLOG (ABAJO IZQUIERDA) */}
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

      {/* 4. TEAM BUTTON */}
      <AnimatePresence>
        {myTeam.length > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-10 right-10 z-[100] flex items-center gap-4 bg-black/80 border border-white/10 p-2 pl-5 rounded-full backdrop-blur-xl shadow-2xl">
            <div className="flex -space-x-2">
              {myTeam.map(m => <img key={m.id} src={m.img} className="w-8 h-8 rounded-full border border-black object-cover" />)}
            </div>
            <button className="px-6 py-2.5 rounded-full text-[10px] mrm-bold uppercase bg-[#7D68F6]">Team ({myTeam.length})</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. MODAL DE TALENTO (BIO EXTENSA) */}
      <AnimatePresence>
        {selectedTalent && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedTalent(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative w-full max-w-4xl bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-12 flex flex-col md:flex-row gap-12 overflow-hidden">
              <div className="w-full md:w-1/3 flex flex-col items-center border-r border-white/5 pr-0 md:pr-12">
                <img src={selectedTalent.img} className="w-32 h-32 rounded-full border-2 border-[#7D68F6]/40 mb-8 object-cover shadow-2xl" />
                <h2 className="text-2xl mrm-bold uppercase text-center leading-tight">{selectedTalent.name}</h2>
                <p className="text-[11px] text-[#7D68F6] uppercase mrm-bold mt-3">{selectedTalent.role}</p>
                <button onClick={() => toggleMember(selectedTalent)} className="mt-10 w-full py-5 rounded-2xl text-[11px] mrm-bold uppercase bg-[#7D68F6]">
                  {myTeam.find(m => m.id === selectedTalent.id) ? "Remove Member" : "Add to Team"}
                </button>
              </div>
              <div className="flex-1 flex flex-col justify-start py-2">
                <div className="mb-10">
                  <p className="text-[9px] uppercase tracking-[0.4em] text-gray-500 mb-5">Professional Trajectory</p>
                  <p className="text-[15px] text-gray-400 inter-light leading-relaxed text-justify">{selectedTalent.bio}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.4em] text-gray-500 mb-5">Technical Core</p>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedTalent.tags.map(tag => (
                      <span key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] mrm-bold text-gray-300 uppercase">{tag}</span>
                    ))}
                  </div>
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