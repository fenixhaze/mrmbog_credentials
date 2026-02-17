import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Globe, Cpu, Palette, ChevronLeft, ChevronRight, 
  Users, X, MessageSquare, ArrowRight, ExternalLink 
} from 'lucide-react';

const MAIN_LILA = "#7D68F6"; 

// --- DATA: 26 TALENTOS CON BIOS AMPLIADAS ---
const TALENTS_DATA = [
  { id: 1, name: "Alex Rivera", role: "Cloud Architect", tags: ["AWS", "Terraform", "Docker"], img: "https://i.pravatar.cc/150?u=1", bio: "Arquitecto de sistemas especializado en infraestructuras críticas y escalabilidad masiva. Con más de 10 años liderando migraciones hacia entornos híbridos, Alex domina la automatización mediante Infrastructure as Code (IaC) y la orquestación de microservicios, garantizando una disponibilidad del 99.9% en despliegues globales.", projects: [{name: "Cloud Core", year: "2024", task: "Infra"}] },
  { id: 2, name: "Elena Sanz", role: "UX Lead", tags: ["Figma", "Research", "Strategy"], img: "https://i.pravatar.cc/150?u=2", bio: "Elena fusiona la psicología conductual con el diseño de interfaces para crear experiencias digitales que no solo son estéticas, sino profundamente funcionales. Lidera procesos de investigación de usuarios, prototipado de alta fidelidad y pruebas de usabilidad, asegurando que cada punto de contacto con el cliente sea fluido y emocionalmente positivo.", projects: [{name: "UX Portal", year: "2024", task: "Design"}] },
  { id: 3, name: "Marcus Chen", role: "Fullstack Dev", tags: ["React", "Node.js", "GraphQL"], img: "https://i.pravatar.cc/150?u=3", bio: "Ingeniero de software versátil con una capacidad innata para resolver problemas complejos tanto en el frontend como en el backend. Experto en el ecosistema JavaScript moderno, Marcus se enfoca en escribir código limpio, mantenible y optimizado para el rendimiento, facilitando la integración de APIs robustas y experiencias de usuario dinámicas.", projects: [{name: "DevHub", year: "2023", task: "Code"}] },
  { id: 4, name: "Sofia Müller", role: "UI Designer", tags: ["Design Systems", "Visual"], img: "https://i.pravatar.cc/150?u=4", bio: "Diseñadora visual experta en la creación de sistemas de diseño escalables y consistentes. Su enfoque se basa en la modularidad y el orden atómico, permitiendo que las marcas crezcan digitalmente sin perder su identidad. Sofia tiene una precisión quirúrgica para el uso de la tipografía, el color y los espacios en blanco.", projects: [{name: "Brand Kit", year: "2024", task: "Visual"}] },
  { id: 5, name: "Lucas Petit", role: "Data Scientist", tags: ["Python", "ML", "SQL"], img: "https://i.pravatar.cc/150?u=5", bio: "Científico de datos orientado a la inteligencia de negocios. Lucas transforma grandes volúmenes de datos brutos en insights estratégicos mediante modelos de aprendizaje automático y análisis predictivo. Su trabajo permite a las empresas anticiparse a las tendencias del mercado y optimizar la toma de decisiones basada en evidencia estadística real.", projects: [{name: "Data Flow", year: "2023", task: "Analysis"}] },
  { id: 6, name: "Isabella Rossi", role: "Product Owner", tags: ["Agile", "Scrum"], img: "https://i.pravatar.cc/150?u=6", bio: "Estratega de producto con una visión clara para conectar las necesidades del negocio con las capacidades técnicas. Isabella gestiona roadmaps complejos, prioriza backlogs con precisión y facilita la comunicación entre stakeholders y equipos de desarrollo para garantizar entregas de alto valor en ciclos ágiles.", projects: [{name: "Product Roadmap", year: "2024", task: "Lead"}] },
  { id: 7, name: "David Kim", role: "Security Eng", tags: ["Cyber", "Pentest"], img: "https://i.pravatar.cc/150?u=7", bio: "Especialista en seguridad ofensiva y defensiva. David se dedica a proteger los activos digitales mediante auditorías de seguridad, pruebas de penetración y el diseño de arquitecturas de red resilientes. Su enfoque preventivo es fundamental para sectores financieros que manejan datos sensibles de alta confidencialidad.", projects: [{name: "Secure Shield", year: "2024", task: "Security"}] },
  { id: 8, name: "Ana Torres", role: "Mobile Dev", tags: ["Swift", "Kotlin"], img: "https://i.pravatar.cc/150?u=8", bio: "Desarrolladora apasionada por el ecosistema móvil. Ana construye aplicaciones nativas que aprovechan al máximo el hardware de iOS y Android, logrando interfaces rápidas y transiciones fluidas. Su experiencia abarca desde el consumo de APIs en tiempo real hasta la implementación de funciones de geolocalización avanzada.", projects: [{name: "MobApp 2.0", year: "2023", task: "Native"}] },
  { id: 9, name: "Julian Vance", role: "DevOps", tags: ["CI/CD", "K8s"], img: "https://i.pravatar.cc/150?u=9", bio: "Ingeniero DevOps enfocado en la cultura de entrega continua. Julian diseña flujos de integración y despliegue que minimizan el error humano y aceleran los lanzamientos al mercado. Experto en contenedores y monitorización, mantiene la salud operativa de los sistemas bajo cualquier carga de tráfico.", projects: [{name: "AutoCI", year: "2024", task: "DevOps"}] },
  { id: 10, name: "Clara Bloom", role: "Motion Designer", tags: ["AE", "Lottie"], img: "https://i.pravatar.cc/150?u=10", bio: "Artista del movimiento que da vida a las interfaces digitales. Clara utiliza la animación para guiar la atención del usuario y contar historias visuales impactantes. Sus microinteracciones lúdicas y videos explicativos elevan el valor percibido de cualquier producto digital moderno.", projects: [{name: "Motion UI", year: "2023", task: "Anim"}] },
  { id: 11, name: "Sami Ahmed", role: "Backend Architect", tags: ["Go", "Microservices"], img: "https://i.pravatar.cc/150?u=11", bio: "Arquitecto de backend con maestría en lenguajes de alto rendimiento como Go. Sami diseña el motor invisible que permite a miles de usuarios interactuar simultáneamente. Se especializa en bases de datos distribuidas y protocolos de comunicación de baja latencia.", projects: [{name: "BackEnd Pro", year: "2024", task: "Structure"}] },
  { id: 12, name: "Laura Mendez", role: "QA Engineer", tags: ["Cypress", "Jest"], img: "https://i.pravatar.cc/150?u=12", bio: "Guardiana de la calidad del software. Laura implementa estrategias de testing automatizado que cubren desde pruebas unitarias hasta flujos E2E (end-to-end). Su rigor analítico asegura que cada nueva funcionalidad llegue al usuario final libre de bugs críticos.", projects: [{name: "Quality Check", year: "2024", task: "QA"}] },
  { id: 13, name: "Oliver Grant", role: "AI Specialist", tags: ["PyTorch", "LLMs"], img: "https://i.pravatar.cc/150?u=13", bio: "Investigador en IA aplicado al desarrollo de productos. Oliver integra modelos de lenguaje extenso (LLM) y procesamiento de lenguaje natural en aplicaciones cotidianas, permitiendo interacciones humanas inteligentes y automatización de procesos mediante inteligencia generativa.", projects: [{name: "AI Vision", year: "2024", task: "ML"}] },
  { id: 14, name: "Maya Sterling", role: "Brand Strategist", tags: ["Branding"], img: "https://i.pravatar.cc/150?u=14", bio: "Consultora de marca con un enfoque narrativo. Maya ayuda a las empresas a definir su propósito y a comunicarlo de manera efectiva a través de todos sus canales. Su visión estratégica alinea la identidad visual con los objetivos comerciales a largo plazo.", projects: [{name: "Brand Voice", year: "2023", task: "Narrative"}] },
  { id: 15, name: "Tom Baker", role: "SEO Specialist", tags: ["Growth"], img: "https://i.pravatar.cc/150?u=15", bio: "Experto en crecimiento orgánico. Tom domina los algoritmos de búsqueda y las técnicas de optimización técnica de sitios web para maximizar la visibilidad sin inversión publicitaria directa. Analiza tendencias de búsqueda para conectar marcas con sus audiencias ideales.", projects: [{name: "SEO Boost", year: "2024", task: "Growth"}] },
  { id: 16, name: "Zoe Kravitz", role: "Frontend Lead", tags: ["Next.js", "TS"], img: "https://i.pravatar.cc/150?u=16", bio: "Líder técnica enfocada en la frontera del desarrollo web. Zoe implementa arquitecturas basadas en Server Side Rendering (SSR) para garantizar que las webs no solo sean rápidas, sino también amigables para el SEO y escalables en equipos de desarrollo grandes.", projects: [{name: "FrontX", year: "2024", task: "Lead"}] },
  { id: 17, name: "Hiroshi Tanaka", role: "Unity Dev", tags: ["C#", "3D"], img: "https://i.pravatar.cc/150?u=17", bio: "Desarrollador de realidades inmersivas. Hiroshi utiliza Unity para crear mundos 3D, simuladores y experiencias de realidad aumentada que rompen las barreras de lo físico. Su enfoque técnico permite una interacción natural en entornos virtuales de alta fidelidad.", projects: [{name: "Meta World", year: "2023", task: "VR"}] },
  { id: 18, name: "Emma Watson", role: "Copywriter", tags: ["Storytelling"], img: "https://i.pravatar.cc/150?u=18", bio: "Redactora creativa especializada en la psicología de la persuasión. Emma escribe textos que capturan la atención y guían al usuario hacia la acción. Su capacidad para adaptar el tono de voz de una marca la convierte en una pieza clave para cualquier campaña de marketing.", projects: [{name: "Copy Genius", year: "2024", task: "Content"}] },
  { id: 19, name: "Liam Neeson", role: "Sales Rep", tags: ["B2B"], img: "https://i.pravatar.cc/150?u=19", bio: "Estratega comercial con un historial impecable en la apertura de nuevos mercados. Liam se especializa en ventas corporativas de ciclo largo, construyendo relaciones de confianza mutua con directivos de alto nivel y diseñando soluciones que resuelven problemas de negocio reales.", projects: [{name: "Sales Force", year: "2024", task: "Sales"}] },
  { id: 20, name: "Nora Jones", role: "Illustrator", tags: ["Digital Art"], img: "https://i.pravatar.cc/150?u=20", bio: "Artista conceptual con un estilo visual distintivo. Nora traduce conceptos abstractos en imágenes potentes que enriquecen interfaces y campañas publicitarias. Su dominio del color y la composición aporta una capa de sofisticación artística a los productos digitales.", projects: [{name: "Art Studio", year: "2023", task: "Visuals"}] },
  { id: 21, name: "Finn Wolf", role: "Video Editor", tags: ["Premiere"], img: "https://i.pravatar.cc/150?u=21", bio: "Editor de video con un sentido rítmico excepcional. Finn transforma horas de material en historias compactas y dinámicas, optimizadas para redes sociales o cine publicitario. Maneja la corrección de color y el diseño sonoro para lograr una experiencia inmersiva.", projects: [{name: "Film Lab", year: "2024", task: "Video"}] },
  { id: 22, name: "Sara Connor", role: "Support Lead", tags: ["CRM"], img: "https://i.pravatar.cc/150?u=22", bio: "Especialista en éxito del cliente. Sara diseña procesos de soporte que no solo resuelven dudas, sino que fidelizan al usuario. Utiliza datos de CRM para identificar puntos de fricción y proponer mejoras proactivas en el servicio y el producto.", projects: [{name: "Support Core", year: "2024", task: "CS"}] },
  { id: 23, name: "Kevin Hart", role: "PR Manager", tags: ["Publicity"], img: "https://i.pravatar.cc/150?u=23", bio: "Gestor de relaciones públicas y comunicación institucional. Kevin se encarga de posicionar a las marcas en el ojo público, gestionando crisis y asegurando una cobertura mediática positiva que refuerce la reputación y autoridad en el sector.", projects: [{name: "PR Event", year: "2024", task: "Public"}] },
  { id: 24, name: "Rihanna F.", role: "Creative Dir", tags: ["Art Dir"], img: "https://i.pravatar.cc/150?u=24", bio: "Directora creativa con una visión global y disruptiva. Rihanna lidera equipos multidisciplinarios para ejecutar campañas integrales que definen la cultura. Su capacidad para predecir estéticas emergentes mantiene a las marcas a la vanguardia visual.", projects: [{name: "Global Art", year: "2024", task: "Direction"}] },
  { id: 25, name: "Elon M.", role: "Visionary", tags: ["Innovation"], img: "https://i.pravatar.cc/150?u=25", bio: "Pensador disruptivo enfocado en la resolución de problemas existenciales mediante la ingeniería. Elon propone arquitecturas conceptuales para el futuro de la logística, la energía y la IA, desafiando constantemente los límites de lo que se considera posible.", projects: [{name: "X-Project", year: "2025", task: "Vision"}] },
  { id: 26, name: "Ada Lovelace", role: "Algorithm Expert", tags: ["Math", "Logic"], img: "https://i.pravatar.cc/150?u=26", bio: "Pionera en la arquitectura lógica del software. Ada diseña algoritmos de alta complejidad matemática que optimizan el procesamiento de datos y la inteligencia de sistemas. Su enfoque se basa en la elegancia matemática y la eficiencia computacional pura.", projects: [{name: "Algo One", year: "2024", task: "Logic"}] }
];

const SKILLS_DATA = [
  { id: 1, name: "Estratégico", role: "Consultoría Senior", icon: <Globe size={26}/>, projects: [{ title: "Digital Roadmap 2030", desc: "Transformación digital maestra.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400" }, { title: "M&A Integration", desc: "Sinergia operativa corporativa.", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400" }] },
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
        text: "Análisis finalizado. He seleccionado 4 activos estratégicos para potenciar tu proyecto:",
        suggestions: [
          { id: 101, title: "Fintech Architecture", type: "Core", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400", desc: "Escalabilidad transaccional para banca digital." },
          { id: 102, title: "E-Commerce Engine", type: "Sales", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400", desc: "Optimización de conversión y pasarelas globales." },
          { id: 103, title: "Cloud Security Mesh", type: "Security", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?w=400", desc: "Protección perimetral y cifrado de datos críticos." },
          { id: 104, title: "AI Analytics Hub", type: "Data", img: "https://images.unsplash.com/photo-1551288049-bbbda536339a?w=400", desc: "Dashboard predictivo basado en comportamiento real." }
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
      <header className="w-full max-w-5xl text-center pt-16 mb-12 z-10">
        <h1 className="text-[100px] leading-none tracking-[-0.05em] mrm-bold uppercase">MRM</h1>
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
                        <img src={p.img} className="w-16 h-16 rounded-xl object-cover grayscale group-hover:grayscale-0" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-[10px] mrm-bold uppercase">{p.title}</h4>
                            <ArrowRight size={12} className="text-[#7D68F6] opacity-0 group-hover:opacity-100" />
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1 leading-snug">{p.desc}</p>
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
          
          {/* CARRUSEL DE HABILIDADES */}
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
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7D68F6]" style={{ boxShadow: '0 0 8px #7D68F6' }} />
                  <span className="text-[10px] uppercase mrm-bold text-gray-400">{proj.title}</span>
                  {hoveredProject === proj && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-52 bg-[#1A1A1A] border border-white/10 rounded-xl p-3 z-50 shadow-2xl">
                      <img src={proj.img} className="w-full h-24 object-cover rounded-lg mb-2" />
                      <h4 className="text-[10px] mrm-bold uppercase">{proj.title}</h4>
                      <p className="text-[9px] text-gray-500 leading-snug">{proj.desc}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* GRID DE 26 TALENTOS CON TAGS & HOVER LILA */}
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

      {/* 4. TEAM BUTTON (ABAJO DERECHA) */}
      <AnimatePresence>
        {myTeam.length > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-10 right-10 z-[100] flex items-center gap-4 bg-black/80 border border-white/10 p-2 pl-5 rounded-full backdrop-blur-xl shadow-2xl">
            <div className="flex -space-x-2">
              {myTeam.map(m => <img key={m.id} src={m.img} className="w-8 h-8 rounded-full border border-black object-cover" />)}
            </div>
            <button className="px-6 py-2.5 rounded-full text-[10px] mrm-bold uppercase bg-[#7D68F6] shadow-lg">Team ({myTeam.length})</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. MODAL DE TALENTO (BIO AMPLIADA) */}
      <AnimatePresence>
        {selectedTalent && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedTalent(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative w-full max-w-3xl bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-12 flex flex-col md:flex-row gap-10">
              <div className="w-full md:w-1/3 flex flex-col items-center border-r border-white/5 pr-0 md:pr-10">
                <img src={selectedTalent.img} className="w-28 h-28 rounded-full border-2 border-[#7D68F6]/30 mb-6 object-cover" />
                <h2 className="text-xl mrm-bold uppercase text-center">{selectedTalent.name}</h2>
                <p className="text-[10px] text-[#7D68F6] uppercase mrm-bold mt-2">{selectedTalent.role}</p>
                <button onClick={() => toggleMember(selectedTalent)} className="mt-8 w-full py-4 rounded-2xl text-[10px] mrm-bold uppercase bg-[#7D68F6]">
                  {myTeam.find(m => m.id === selectedTalent.id) ? "Remove Member" : "Add to Team"}
                </button>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-[8px] uppercase tracking-widest text-gray-500 mb-3">Professional Biography</p>
                <p className="text-[14px] text-gray-400 inter-light leading-relaxed mb-8">{selectedTalent.bio}</p>
                <p className="text-[8px] uppercase tracking-widest text-gray-500 mb-3">Core Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTalent.tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[9px] mrm-bold text-gray-300 uppercase">{tag}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => setSelectedTalent(null)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X size={24}/></button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;